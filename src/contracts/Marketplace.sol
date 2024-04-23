//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

// note - might need to make a separate contract for users to implement IERC1155Receiver; we cannot transfer to an address that does not implement

contract Marketplace is ERC1155, IERC1155Receiver {
    // using Counters for Counters.Counter;

    // tokenIds are assigned sequntially
    uint256 private _tokenIds;
    // keeps track of saleCount
    uint256 private _itemsSold;

    address payable owner;
    uint256 publishPrice = 0.001 ether;

    event MediaListedSuccess(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        uint256 amount,
        bool currentlyListed
    );

    struct Media {
        uint256 tokenID;
        address payable owner;
        address payable seller;
        uint256 price;
        uint256 amountListed;
    }

    // map tokenId to Media structure
    mapping(uint256 => Media) private idToMedia;
    // map tokenId to URI for retrieval
    mapping(uint256 => string) private _tokenURIs;

    // return URI
    function uri(uint256 tokenId) public view override returns (string memory) {
        return (_tokenURIs[tokenId]);
    }

    // set Token URI
    function _setTokenURI(uint256 tokenId, string memory tokenURI) private {
        _tokenURIs[tokenId] = tokenURI;
    }

    // constructor sets owner of marketplace
    constructor() ERC1155("Unused") {
        owner = payable(msg.sender);
        _tokenIds = 0;
        _itemsSold = 0;
    }

    // updates publishing price for media
    function updateListedPrice(uint256 _publishPrice) public payable {
        require(owner == msg.sender, "only owner can update price");
        publishPrice = _publishPrice;
    }

    // returns publishing price
    function getPublishPrice() public view returns (uint256) {
        return publishPrice;
    }

    // public returns media map from most recently uploaded media
    function getLatestIdToMedia() public view returns (Media memory) {
        uint256 currentTokenId = _tokenIds;
        return idToMedia[currentTokenId];
    }

    // return media from token ID
    function getListedForTokenId(
        uint256 tokenId
    ) public view returns (Media memory) {
        return idToMedia[tokenId];
    }

    // return tokenId of current token
    function getCurrentToken() public view returns (uint256) {
        return _tokenIds;
    }

    // create new Media; mints and updates token counters
    function createMedia(
        string memory tokenURI,
        uint256 price,
        uint256 amount
    ) public payable returns (uint) {
        require(msg.value == publishPrice, "Not enough paid to list");
        require(price > 0, "price must be positive");
        require(amount > 0, "cannot create 0 instances");

        _tokenIds++;
        uint256 currentTokenId = _tokenIds;
        _mint(msg.sender, currentTokenId, 1, "");
        _setTokenURI(currentTokenId, tokenURI);

        _createMedia(currentTokenId, price, amount);

        return currentTokenId;
    }

    // probably won't use but is required function to transfer
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external pure override returns (bytes4) {
        // Handle the received tokens here
        // You can perform actions based on the received parameters
        return this.onERC1155Received.selector;
    }

    // same - probably won't use but is required function to transfer
    function onERC1155BatchReceived(
        address _operator,
        address _from,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        bytes calldata _data
    ) external override returns (bytes4) {}

    // creates media struct and  transfers ownership to marketplace
    function _createMedia(
        uint256 tokenId,
        uint256 price,
        uint256 amount
    ) private {
        idToMedia[tokenId] = Media(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            amount
        );

        transfer(msg.sender, address(this), tokenId, amount);

        emit MediaListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            amount,
            price,
            true
        );
    }

    // safe transfer by check for approval
    function transfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) public {
        // require(
        //     msg.sender == from || isApprovedForAll(from, msg.sender),
        //     "Transfer caller is not approved"
        // );

        _safeTransferFrom(from, to, tokenId, amount, "");
    }

    // batch transfer as property of ERC1155; may be unused
    function transferBatch(
        address from,
        address to,
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) public {
        // require(
        //     msg.sender == from || isApprovedForAll(from, msg.sender),
        //     "Transfer caller is not approved"
        // );
        _safeBatchTransferFrom(from, to, tokenIds, amounts, "");
    }

    // return all tokens as array of Media struct
    function getAllTokens() public view returns (Media[] memory) {
        uint nftCount = _tokenIds;
        Media[] memory tokens = new Media[](nftCount);

        uint currentIndex = 0;

        for (uint i = 0; i < nftCount; i++) {
            uint currentId = i + 1;
            Media storage currentItem = idToMedia[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }

        return tokens;
    }

    // return tokens owned by message sender
    function getMyTokens() public view returns (Media[] memory) {
        uint totalItemCount = _tokenIds;
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToMedia[i + 1].owner == msg.sender ||
                idToMedia[i + 1].seller == msg.sender
            ) {
                itemCount += 1;
            }
        }

        Media[] memory items = new Media[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToMedia[i + 1].owner == msg.sender ||
                idToMedia[i + 1].seller == msg.sender
            ) {
                uint currentId = i + 1;
                Media storage currentItem = idToMedia[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    // return tokens owned by message sender
    function getAvailableTokens() public view returns (Media[] memory) {
        uint totalItemCount = _tokenIds;
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMedia[i + 1].amountListed > 0) {
                itemCount += 1;
            }
        }

        Media[] memory items = new Media[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMedia[i + 1].amountListed > 0) {
                uint currentId = i + 1;
                Media storage currentItem = idToMedia[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    // sell token from one user to the other
    function executeSale(uint256 tokenId, uint256 amount) public payable {
        uint price = idToMedia[tokenId].price;
        address seller = idToMedia[tokenId].seller;
        require(
            idToMedia[tokenId].amountListed >= amount,
            "the requested quantity of this item is no longer available"
        );

        require(
            msg.value == price * amount,
            "Please submit the asking price for the token"
        );

        idToMedia[tokenId].amountListed =
            idToMedia[tokenId].amountListed -
            amount; // = true;
        idToMedia[tokenId].seller = payable(msg.sender);
        for (uint256 i = 0; i < amount; i++) {
            _itemsSold++;
        }

        transfer(address(this), msg.sender, tokenId, amount);
        setApprovalForAll(seller, true);

        payable(owner).transfer(publishPrice);
        payable(seller).transfer(msg.value);
    }
}
