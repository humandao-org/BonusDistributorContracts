import merkle from "../data/polygon/merkle.json"
import hardhat, {ethers} from "hardhat";

async function main() {

    const humandaoAddress = "0x72928d5436ff65e57f72d5566dcd3baedc649a88"

    const distributorArguments = [
        humandaoAddress,
        merkle.merkleRoot,
        '0xcf904295a097f38c6a10826c39723795265e8ad0'
    ]

    await hardhat.run("verify:verify", {
        address: "0xcf904295a097f38c6a10826c39723795265e8ad0",
        constructorArguments: [],
    });


    await hardhat.run("verify:verify", {
        address: "0xBDAb8B19F2D43780303c1CdE00c245AC62d4054b",
        constructorArguments: distributorArguments,
    });
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });