// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error BeanToken__Insufficient__Funds();
error BeanToken__Withdrawal__Failed();

contract BeanToken is ERC20, Ownable {
    uint public constant beanTokenPriceInEth = 0.01 ether;

    //  events
    event BeanTokenPurchased(address indexed buyer, uint indexed amount);

    constructor(string memory coinName, string memory coinSymbol)
        ERC20(coinName, coinSymbol)
    {
        _mint(msg.sender, 10000 * 10**18);
    }

    function buyBeanToken(uint amount) public payable {
        uint expectedAmount = amount * beanTokenPriceInEth;

        if (msg.value < expectedAmount) {
            revert BeanToken__Insufficient__Funds();
        }
        _mint(msg.sender, amount * 10**18);
        emit BeanTokenPurchased(msg.sender, amount);
    }

    function withdraw() public onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!success) revert BeanToken__Withdrawal__Failed();
    }
}
