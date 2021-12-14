Bonus Distributor based on Merkle Proofs
===

[![CircleCI](https://circleci.com/gh/humandao-org/BonusDistributorContracts/tree/master.svg?style=svg)](https://circleci.com/gh/humandao-org/BonusDistributorContracts/tree/master)

## Installing the dependencies

```sh
yarn
```

## Generating the merkle proofs

```sh
yarn generate -i scripts/examples/example.json
```

## Proving the validity of an output json

```sh
yarn verify -i scripts/examples/example-result.json
```