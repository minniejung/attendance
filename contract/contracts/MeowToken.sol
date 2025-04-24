// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract MeowToken is ERC20, ERC2771Context {
    address public owner;

    mapping(address => uint256) public lastMintedAt;
    uint256 public cooldown = 5 minutes;

    constructor(
        string memory _name,
        string memory _symbol,
        address _trustedForwarder
    ) ERC20(_name, _symbol) ERC2771Context(_trustedForwarder) {
        owner = msg.sender;

        // Optional: Give the deployer some initial tokens
        _mint(msg.sender, 10 * 10 ** decimals());
    }

    /// @notice Mint `amount` tokens to sender if cooldown has passed
    function mint(uint256 amount) public {
        address sender = _msgSender();
        require(
            block.timestamp >= lastMintedAt[sender] + cooldown,
            "Wait 5 minutes between mints"
        );

        lastMintedAt[sender] = block.timestamp;
        _mint(sender, amount);
    }

    /// @notice Returns how many seconds left until the user can mint again
    function timeUntilNextMint(address user) public view returns (uint256) {
        uint256 nextTime = lastMintedAt[user] + cooldown;
        if (block.timestamp >= nextTime) {
            return 0;
        }
        return nextTime - block.timestamp;
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
