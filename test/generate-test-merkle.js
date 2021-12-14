const {parseBalanceMap} = require("../src/parse-balance-map");

async function generateMerkleWithSigners(signers) {
    const balanceMap = signers.map(s => {
        return {
            address: s.address,
            earnings:  ethers.utils.parseEther('100').toHexString()
        }
    })

    return parseBalanceMap(balanceMap);
}

module.exports = {
    generateMerkleWithSigners: generateMerkleWithSigners
}