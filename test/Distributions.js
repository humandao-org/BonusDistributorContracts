const { expect } = require("chai");

const merkle = require('../data/polygon/merkle.json')
const {BigNumber} = require("ethers");



async function deployContracts() {
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
        erc20, genesisNFT, distributor
    }
}

describe('Distribution Contract', function () {

    it('should be possible to verify a proof', async () => {

        const [owner] = await ethers.getSigners();

        const {
            erc20,
            genesisNFT,
            distributor
        } = await deployContracts();

        //send hdao to the contract
        await erc20.transfer(distributor.address, ethers.utils.parseEther('1000000'))

        //take the first claim
        let account = Object.keys(merkle.claims)[0];
        const claim = merkle.claims[account]

        //make sure he has enough tokens in his wallet
        let originalBalance = BigNumber.from(claim.amount).mul(10);
        await erc20.transfer(
            account,
            originalBalance
        );

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