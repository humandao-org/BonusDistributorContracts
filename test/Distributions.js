const {expect} = require("chai");

const {BigNumber} = require("ethers");
const {generateMerkleWithSigners} = require("./generate-test-merkle");

async function deployContracts() {
    const signers = await ethers.getSigners()
    const merkle = await generateMerkleWithSigners(signers);

    const ERC20 = await ethers.getContractFactory("HumanDaoERC20");
    const erc20 = await ERC20.deploy();

    const GenesisNFT = await ethers.getContractFactory("HumanDaoGenesisNFT")
    const genesisNFT = await GenesisNFT.deploy();

    const DistributorContract = await ethers.getContractFactory("HumanDaoDistributor");
    const distributor = await DistributorContract.deploy(
        erc20.address,
        merkle.merkleRoot,
        genesisNFT.address
    );

    await genesisNFT.transferOwnership(distributor.address);

    return {
        erc20, genesisNFT, distributor, merkle, signers
    }
}

describe('Distribution Contract', function () {

    it('should not distribute anything if you don\'t currently hold tokens', async () => {
        const {
            distributor,
            signers
        } = await deployContracts();

        //address signers[1] currently holds 0 tokens
        expect(await distributor.calculateMaxDistribution(signers[1].address, ethers.utils.parseEther('100'))).to.equal(BigNumber.from(0));
    });

    it('should only give 20% of what people are currently holding if it is lower than the bonus', async () => {
        const {
            erc20,
            distributor,
            signers
        } = await deployContracts();

        await erc20.transfer(signers[1].address, ethers.utils.parseEther('100'))
        //address signers[1] currently holds 100 tokens, but has the right to claim 100, so he actually sold 400 tokens.
        //give him only 20 tokens -> 20% of 100
        expect(await distributor.calculateMaxDistribution(signers[1].address, ethers.utils.parseEther('100'))).to.equal(ethers.utils.parseEther('20'));
    });

    it('should not be possible to grief', async () => {
        const {
            erc20,
            distributor,
            merkle,
            signers
        } = await deployContracts();

        //send hdao to the contract
        await erc20.transfer(distributor.address, ethers.utils.parseEther('1000000'))

        //take the second claim
        let account = signers[1].address;
        const claim = merkle.claims[account]

        //make sure he has enough tokens in his wallet
        let atleastRequiredAmount = BigNumber.from(claim.amount).mul(10);

        await erc20.transfer(
            account,
            atleastRequiredAmount
        );

        expect(distributor.claim(
            claim.index,
            account,
            claim.amount,
            claim.proof
        )).to.be.revertedWith('the caller needs to be the user beneficiary of the bonus')
    });

    it('should be possible to verify a proof', async () => {
        const {
            erc20,
            genesisNFT,
            distributor,
            merkle,
            signers
        } = await deployContracts();

        //send hdao to the contract
        await erc20.transfer(distributor.address, ethers.utils.parseEther('1000000'))

        //take the first claim
        let account = signers[0].address;
        const claim = merkle.claims[account]

        //make sure he has enough tokens in his wallet
        let atleastRequiredAmount = BigNumber.from(claim.amount).mul(10);

        await erc20.transfer(
            account,
            atleastRequiredAmount
        );

        const originalBalance = await erc20.balanceOf(account)

        await distributor.claim(
            claim.index,
            account,
            claim.amount,
            claim.proof
        )

        const addressBalance = await erc20.balanceOf(account)
        expect(addressBalance).to.equal(BigNumber.from(claim.amount).add(originalBalance))
    });

    it('should give an NFT either way', async function () {
        const {
            erc20,
            genesisNFT,
            distributor,
            merkle,
            signers
        } = await deployContracts();

        //send hdao to the contract
        await erc20.transfer(distributor.address, ethers.utils.parseEther('1000000'))

        //take the first claim
        let account = signers[0].address;
        const claim = merkle.claims[account]

        await distributor.claim(
            claim.index,
            account,
            claim.amount,
            claim.proof
        )

        expect(await genesisNFT.balanceOf(account)).to.equal(BigNumber.from(1))
        expect(await genesisNFT.ownerOf(claim.index)).to.equal(account);
    });

    it('should not be possible to claim twice', async () => {
        const {
            erc20,
            genesisNFT,
            distributor,
            merkle,
            signers
        } = await deployContracts();

        //send hdao to the contract
        await erc20.transfer(distributor.address, ethers.utils.parseEther('1000000'))

        //take the first claim
        let account = signers[0].address;
        const claim = merkle.claims[account]

        await distributor.claim(
            claim.index,
            account,
            claim.amount,
            claim.proof
        )
        expect(distributor.claim(
            claim.index,
            account,
            claim.amount,
            claim.proof
        )).to.be.revertedWith("MerkleDistributor: Drop already claimed.")
    })

    it('should be possible to reclaim tokens as an owner', async () => {
        const {
            erc20,
            distributor,
        } = await deployContracts();

        //send hdao to the contract
        await erc20.transfer(distributor.address, ethers.utils.parseEther('1000000'));

        expect(await erc20.balanceOf(distributor.address)).to.equal(ethers.utils.parseEther('1000000'))

        await distributor.transferRemainingTokens(erc20.address);
        expect(await erc20.balanceOf(distributor.address)).to.equal(ethers.utils.parseEther('0'))
    })

    it('should be possible to transfer nft ownership back to someone else', async () => {
        const {
            genesisNFT,
            distributor,
            signers
        } = await deployContracts();

        expect(await genesisNFT.owner()).to.equal(distributor.address);
        await distributor.transferNftOwnership(signers[0].address);
        expect(await genesisNFT.owner()).to.equal(signers[0].address);
    });

    it('should be possible to transfer ownership', async() => {

    });

    it('should not work if paused', async() => {
        const {
            distributor,
            merkle,
            signers
        } = await deployContracts();

        await distributor.pause();


        //take the first claim
        let account = signers[0].address;
        const claim = merkle.claims[account]

        expect(distributor.claim(
            claim.index,
            account,
            claim.amount,
            claim.proof
        )).to.be.revertedWith("Pausable: paused")
    });
});