import dotenv from "dotenv";
import {HardhatNetworkAccountsUserConfig, HardhatNetworkAccountUserConfig} from "hardhat/src/types/config";

dotenv.config();

export const getPKs: () => any[] = () => {
    let deployerAccount;

    // PKs without `0x` prefix
    if (process.env.DEPLOYER_PK) deployerAccount = process.env.DEPLOYER_PK;

    return [deployerAccount].filter(pk => !!pk);
};