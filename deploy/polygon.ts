import merkle from "../data/polygon/merkle.json"
import hardhat, {ethers} from "hardhat";

async function main() {

    await hardhat.run("compile");

    const humandaoAddress = "0x72928d5436ff65e57f72d5566dcd3baedc649a88"

    console.log('deploying genesis NFT');
    const GenesisNFT = await ethers.getContractFactory("HumanDaoGenesisNFT")
    const genesisNFT = await GenesisNFT.deploy();

    await genesisNFT.deployed();


    const DistributorContract = await ethers.getContractFactory("HumanDaoDistributor");

    const distributorArguments = [
        humandaoAddress,
        merkle.merkleRoot,
        genesisNFT.address
    ]

    console.log('deploying distributor')
    const distributor = await DistributorContract.deploy(
        ...distributorArguments
    );

    console.log('nft: ', genesisNFT.address);
    console.log('distributor: ', distributor.address);

    await distributor.deployed();

    await genesisNFT.transferOwnership(distributor.address);


    await hardhat.run("verify:verify", {
        address: genesisNFT.address,
        constructorArguments: [],
    });


    await hardhat.run("verify:verify", {
        address: distributor.address,
        constructorArguments: distributorArguments,
    });
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });