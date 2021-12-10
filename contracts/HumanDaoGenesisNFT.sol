pragma solidity ^0.8.4;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HumanDaoGenesisNFT is ERC721, Ownable {

    string public baseUri = "https://static.defitrack.io/humandao/";

    constructor() ERC721('HumanDAOGenesis', 'HDAOGEN') {}

    function mint(address beneficiary, uint256 tokenId) external onlyOwner {
        _mint(beneficiary, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseUri;
    }

    function setBaseURI(string calldata baseUri_) external onlyOwner{
        baseUri = baseUri_;
    }
}