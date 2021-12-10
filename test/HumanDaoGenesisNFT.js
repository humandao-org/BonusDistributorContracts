const {expect} = require("chai");

async function deploy() {

    const NFT = await ethers.getContractFactory("HumanDaoGenesisNFT");
    const nft = await NFT.deploy();

    return {
        nft,
        signers: await ethers.getSigners()
    }
}

describe("NFT Contract", function () {
    it('should be possible to mint', async function () {
        const {
            nft, signers
        } = await deploy();

        await nft.mint(signers[0].address, 0);

    });

    it('should be possible to update the base uri', async function () {
        const {
            nft, signers
        } = await deploy();

        await nft.mint(signers[0].address, 0);

        expect(await nft.tokenURI(0)).to.equal('');

        const baseURI = 'https://static.defitrack.io/humandao/';
        await nft.setBaseURI(baseURI);
        expect(await nft.tokenURI(0)).to.equal(baseURI + '0');
    });
});