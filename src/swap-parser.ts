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
            user: key,
            amount: value / 5,
            investedAmount: value
        }
    }).sort((a: Investment, b: Investment) => {
        return b.amount - a.amount;
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
    user: string;
    investedAmount: number;
    amount: number;
}