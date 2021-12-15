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

        await nft.mint(signers[0].address);

    });

    it('should be possible to update the base uri', async function () {
        const {
            nft, signers
        } = await deploy();

        await nft.mint(signers[0].address);

        expect(await nft.tokenURI(1)).to.equal("ipfs://QmSg4aZRUwCVNRk59Jj9cFsfUThyiCArjszjeaCj4SSfiK");

        const metaURI = 'https://static.defitrack.io/humandao/';
        await nft.updateMetaURI(metaURI);
        expect(await nft.tokenURI(1)).to.equal(metaURI);
    });
});