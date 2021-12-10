const { expect } = require("chai");

const {BigNumber} = require("ethers");
const {generateMerkleWithSigners} = require("./generate-test-merkle");

async function deployContracts() {
    const signers =  await ethers.getSigners()
    const merkle = await generateMerkleWithSigners(signers);

    const ERC20 = await ethers.getContractFactory("HumanDaoERC20");
    const erc20 = await ERC20.deploy();

    const GenesisNFT = await ethers.getContractFactory("HumanDaoGenesisNFT")
    const genesisNFT = await GenesisNFT.deploy();

    const DistributorContract = await ethers.getContractFactory("HumanDaoDistributor");
    const distributor =  await DistributorContract.deploy(
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

        const originalBalance =  await erc20.balanceOf(account)

        await distributor.claim(
            claim.index,
            account,
            claim.amount,
            claim.proof
        )

        const addressBalance = await erc20.balanceOf(account)
        expect(addressBalance).to.equal(BigNumber.from(claim.amount).add(originalBalance))
    });

});