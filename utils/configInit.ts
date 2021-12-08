import dotenv from "dotenv";

dotenv.config();

export const getPKs = () => {
    let deployerAccount;

    // PKs without `0x` prefix
    if (process.env.DEPLOYER_PK) deployerAccount = process.env.DEPLOYER_PK;

    return [deployerAccount].filter(pk => !!pk);
};
