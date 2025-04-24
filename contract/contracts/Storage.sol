// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract Storage is Context, ERC2771Context {
    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

    struct Comment {
        uint256 id;
        address author;
        uint256 timestamp;
        string content;
        bool isUpdated;
        bool isDeleted;
    }

    Comment[] public allComments;
    mapping(address => uint256[]) public userComments;
    uint256 public commentCount;

    function setComment(string memory _content) public {
        commentCount++;
        Comment memory newComment = Comment({
            id: commentCount,
            author: _msgSender(),
            timestamp: block.timestamp,
            content: _content,
            isUpdated: false,
            isDeleted: false
        });

        allComments.push(newComment);
        userComments[_msgSender()].push(allComments.length - 1);
    }

    function updateComment(uint256 _index, string memory _content) public {
        require(_index < allComments.length, "Invalid comment index");
        Comment storage comment = allComments[_index];
        require(comment.author == _msgSender(), "Not the author");
        require(!comment.isDeleted, "Comment is deleted");

        comment.content = _content;
        comment.timestamp = block.timestamp;
        comment.isUpdated = true;
    }

    function deleteComment(uint256 _index) public {
        require(_index < allComments.length, "Invalid comment index");
        Comment storage comment = allComments[_index];
        require(comment.author == _msgSender(), "Not the author");
        require(!comment.isDeleted, "Already deleted");

        comment.isDeleted = true;
    }

    function getComment(
        uint256 _index
    )
        public
        view
        returns (
            uint256 id,
            address author,
            uint256 timestamp,
            string memory content,
            bool isUpdated,
            bool isDeleted
        )
    {
        require(_index < allComments.length, "Invalid index");
        Comment memory c = allComments[_index];
        return (
            c.id,
            c.author,
            c.timestamp,
            c.content,
            c.isUpdated,
            c.isDeleted
        );
    }

    function getCommentsByUser(
        address user
    ) public view returns (Comment[] memory) {
        uint256[] memory indexes = userComments[user];
        Comment[] memory result = new Comment[](indexes.length);
        for (uint256 i = 0; i < indexes.length; i++) {
            result[i] = allComments[indexes[i]];
        }
        return result;
    }

    function getAllActiveComments() public view returns (Comment[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allComments.length; i++) {
            if (!allComments[i].isDeleted) count++;
        }

        Comment[] memory result = new Comment[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < allComments.length; i++) {
            if (!allComments[i].isDeleted) {
                result[j] = allComments[i];
                j++;
            }
        }
        return result;
    }

    // ========== Required overrides for ERC2771Context ==========

    function _msgSender()
        internal
        view
        override(Context, ERC2771Context)
        returns (address sender)
    {
        return ERC2771Context._msgSender();
    }

    function _msgData()
        internal
        view
        override(Context, ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }

    function _contextSuffixLength()
        internal
        view
        override(Context, ERC2771Context)
        returns (uint256)
    {
        return super._contextSuffixLength();
    }
}
