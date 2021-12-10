pragma Solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HumanDaoGenesisNFT is ERC721, Ownable {

constructor() ERC721(HumanDAOGenesis, HDAOGEN) {}



}