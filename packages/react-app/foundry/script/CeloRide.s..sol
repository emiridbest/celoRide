// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {CeloRide} from "../src/CeloRide.sol";

contract CounterScript is Script {
    CeloRide public celoRide;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        celoRide = new CeloRide();

        vm.stopBroadcast();
    }
}