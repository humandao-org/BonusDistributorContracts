import {BigNumber, ethers} from "ethers";

export const parseSwaps = function (swaps: Swap[]) : string {

    let total = 0;

    let investments  = swaps.reduce((map: { [address: string]: number }, currentValue: Swap) => {
        const originalValue = map[currentValue.userAddress.id] | 0;
        let sum = originalValue + Number(currentValue.tokenAmountOut);
        map[currentValue.userAddress.id] = sum
        total += sum;
        return map;
    }, {})


    const result = Object.entries(investments).map(([key, value]) => {
        return {
            address: key,
            earnings: ethers.utils.parseEther(value.toString()).div(BigNumber.from(5)).toHexString(),
            investedAmount: value,
            bonusAmount: value / 5
        }
    }).sort((a: Investment, b: Investment) => {
        return b.bonusAmount - a.bonusAmount;
    })

    return JSON.stringify(result);
};

type Swap = {
    tokenAmountIn: number;
    tokenAmountOut: number;
    tokenInSym: string;
    tokenOutSym: string;
    userAddress: UserAddress,
}

type UserAddress = {
    id: string;
}

type Investment = {
    address: string;
    investedAmount: number;
    earnings: string;
    bonusAmount: number;
}