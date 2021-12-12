pragma solidity ^0.8.4;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "http://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
// import "http://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "http://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract HumanDaoGenesisNFT is ERC721URIStorage, Ownable  {

    uint256 private _totalSupply;
    string private _tokenURI = "ipfs://QmdMQdtA8Xju3eM9SXt9enPpNEgpQqZrta1WGYYerAVwXe";
    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    constructor() ERC721('HumanDAOGenesis', 'HDAOGEN') {}

    function mint(address beneficiary, uint256 tokenId) external onlyOwner {
        _mint(beneficiary, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        _totalSupply += 1;
    }

}
