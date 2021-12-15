import hardhat, {ethers} from "hardhat";
import {parseBalanceMap} from "../src/parse-balance-map";

async function main() {

    await hardhat.run("compile:compile");

    console.log('generating merkle');
    const merkle = await generateMerkleWithAccounts([
        "0x715Beae184768766C65D8Ed4AA6D1f6893efb542",
        "0x7291C3a8479CE009e0fE923b700cff1b1c207720",
        "0xce754Ae8713A60F1580a349b8C7C32723ddB68D8"
    ])

    const HumanDAOERC20 = await ethers.getContractFactory("HumanDaoERC20")
    const humanDaoERC20 = await HumanDAOERC20.deploy();
    console.log('deploying genesis NFT');
    const GenesisNFT = await ethers.getContractFactory("HumanDaoGenesisNFT")
    const genesisNFT = await GenesisNFT.deploy();

    const DistributorContract = await ethers.getContractFactory("HumanDaoDistributor");

    const distributorArguments = [
        humanDaoERC20.address,
        merkle.merkleRoot,
        genesisNFT.address
    ]

    console.log('deploying distributor')
    const distributor = await DistributorContract.deploy(
        ...distributorArguments
    );

    console.log('transferring nft ownership to distributor');
    await genesisNFT.transferOwnership(distributor.address);

    console.log('transferring 100k tokens to distributor');
    await humanDaoERC20.transfer(distributor.address, ethers.utils.parseEther("100000"));

    console.log('nft: ', genesisNFT.address);
    console.log('distributor: ', distributor.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });


async function generateMerkleWithAccounts(accounts: Array<string>) {
    const balanceMap = accounts.map(s => {
        return {
            address: s,
            earnings:  ethers.utils.parseEther('100').toHexString()
        }
    })

    return parseBalanceMap(balanceMap);
}