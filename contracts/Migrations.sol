// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Migrations {
    address public owner;    // owner var of type address 
    uint public last_completed_migration;

    modifier restricted() {  // Modifiers can be used to change the behavior of functions in a declarative way
        if (msg.sender == owner) _; // check the sender of msg is the owner
    }

    constructor() {
        owner = msg.sender; // make the address is the address of the contract's creator (the one who is deploying the contract).
    }

    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    function upgrade(address new_address) public restricted {   //only the contract's owner can call this function
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}