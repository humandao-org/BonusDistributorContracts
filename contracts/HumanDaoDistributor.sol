// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./merkle/MerkleDistributor.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract HumanDaoDistributor is MerkleDistributor {

    constructor(address token_, bytes32 merkleRoot_) MerkleDistributor(token_, merkleRoot_) {
        //intentionally left empty
    }

    function transferRemainingTokens(address _token) public onlyOwner {
        IERC20 erc20 = IERC20(_token);
        uint256 balance = erc20.balanceOf(address(this));
        erc20.transfer(owner(), balance);
    }
}