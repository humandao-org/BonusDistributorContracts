import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";

import {HardhatUserConfig} from "hardhat/src/types/config";
import {HardhatUserConfig as WithEtherscanConfig} from "hardhat/config";
import {buildHardhatNetworkAccounts, getPKs} from "../utils/configInit";

type DeploymentConfig = HardhatUserConfig & WithEtherscanConfig;

const accounts = getPKs();
const hardhatNetworkAccounts = buildHardhatNetworkAccounts(accounts);

const config: DeploymentConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            // accounts visible to hardhat network used by `hardhat node --fork` (yarn net <chainName>)
            accounts: hardhatNetworkAccounts,
        },
        polygon: {
            url: "https://polygon-rpc.com/",
            chainId: 137,
            forking: {
                url: process.env.POLYGON_MORALIS,
            },
            accounts,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            timeout: 300000,
            accounts: "remote",
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: process.env.ETHERSCAN_API_KEY_POLYGON,
    },
    solidity: {
        compilers: [
            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    paths: {
        sources: "./contracts",
    },
};

export default config;