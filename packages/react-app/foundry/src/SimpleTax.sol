// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleTax is ERC20 {
    address public immutable fund;

    constructor() ERC20("SimpleTax", "STX") {
        _mint(msg.sender, 1000 * 10 ** decimals());
        fund = address(this);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal {
        if (from != address(0) && to != address(0)) {
            uint256 tax = (amount * 5) / 100; // 5% tax
            uint256 netAmount = amount - tax;

            super._transfer(from, to, netAmount);
            super._transfer(from, fund, tax);
        } else {
            super._transfer(from, to, amount);
        }
    }
}
