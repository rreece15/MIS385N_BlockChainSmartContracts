//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
// import "@openzeppelin/contracts/token/ERC1155/ERC1155Holder.sol";
// import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

// payable keyword for getting eth from function
// function sendViaSend(address payable _to) public payable {
//     // Send returns a boolean value indicating success or failure.
//     // This function is not recommended for sending Ether.
//     bool sent = _to.send(msg.value);
//     require(sent, "Failed to send Ether");
// }

contract MarketPlace is ERC1155 {
    using Counters for Counter.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint256 listPrice = 0.001 ether; // for list price if wanted

    event TokenListedSuccess(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    struct ListedToken {
        uint256 tokenID;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    struct User {
        address wallet;
        Media[] owned;
        Media[] selling;
    }

    mapping(uint256 => ListedToken) private idToListedToken;
    mapping(address => User) private addressToUser;
    mapping(uint256 => string) private _tokenURIs;

    function uri(uint256 tokenId) public view override returns (string memory) {
        return (_tokenURIs[tokenId]);
    }

    function _setTokenUri(uint256 tokenId, string memory tokenURI) private {
        _tokenURIs[tokenId] = tokenURI;
    }

    constructor() ERC1155("Unused") {
        owner = payable(msg.sender);
    }

    function updateListedPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "only owner can update price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdToListedToken()
        public
        view
        returns (ListedToken memory)
    {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken(currentTokenIds);
    }

    function getListedForTokenId(
        uint256 tokenId
    ) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    function createToken(
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint) {
        require(msg.value == listPrice, "Not enough paid to list");
        require(price > 0, "price must be positive");

        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();
        _mint(msg.sender, currentTokenId, 1, "");
        _setTokenURI(currentTokenId, tokenURI);

        createListedToken(currentTokenId, price);

        return currentTokenId;
    }

    function createListedToken(uint256 tokenId, uint256 price) private {
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );

        transfer(msg.sender, address(this), tokenId, price, "");

        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            price,
            true
        );
    }

    function transfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) public {
        require(
            msg.sender == from || isApprovedForAll(from, msg.sender),
            "Transfer caller is not approved"
        );
        _safeTransferFrom(from, to, tokenId, amount, "");
    }

    function transferBatch(
        address from,
        address to,
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) public {
        require(
            msg.sender == from || isApprovedForAll(from, msg.sender),
            "Transfer caller is not approved"
        );
        _safeBatchTransferFrom(from, to, tokenIds, amounts, "");
    }

    function getAllTokens() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        listedToken[] memory tokens = ListedToken[](nftCount);

        uint currentIndex = 0;

        for (uint i = 0; i < nftCount; i++) {
            uint currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }

        return tokens;
    }

    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                itemCount += 1;
            }
        }

        ListedToken[] memory items = new ListedToken[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                uint currentId = i + 1;
                ListedToken storage currentItem = idToLitedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function executeSale(uint256 tokenId, uint256 amount) public payable {
        uint price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;

        require(
            msg.value == price * amount,
            "Please submit the asking price for the token"
        );

        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold.increment();

        transfer(address(this), msg.sender, tokenId, amount);
        setApprovalForAll(seller, true);

        payable(owner).transfer(listPrice);
        payable(seller).transfer(msg.value);
    }
}
