// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";

contract CeloRide is ERC20, ReentrancyGuard, Ownable {
    error AttestationWrongAttester();
    error ReleaseUnsuccessful();
    ISP public spInstance;
    uint64 public schemaId;
    ERC20 private CUSD;

    struct Driver {
        address driverAddress;
        string name;
        uint256 lat; // Latitude in integer format (e.g., multiply by 1e6)
        uint256 lng; // Longitude in integer format (e.g., multiply by 1e6)
        bool isAvailable;
    }

    struct Ride {
        uint256 id;
        address rider;
        address driver;
        uint256 startLat;
        uint256 startLng;
        uint256 destLat;
        uint256 destLng;
        string status; // "requested", "accepted", "completed"
    }
    mapping(uint256 => Ride) public rides;
    mapping(address => Driver) public drivers;
    mapping(address => Ride) public ride;
    address[] public availableDrivers;

    // Events for frontend to listen to
    event DriverRegistered(address indexed driver, uint256 lat, uint256 lng);
    event DriverLocationUpdated(
        address indexed driver,
        uint256 lat,
        uint256 lng
    );
    event RideRequested(address indexed rider, address indexed driver);
    event RideAccepted(address indexed driver, address indexed rider);
    event RideCompleted(address indexed driver, address indexed rider);

    constructor() ERC20("CeloP2P", "CPT") Ownable(_msgSender()) {
        _mint(address(this), 21000000 * 1e18);
        CUSD = ERC20(0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1); // Celo Dollar address on Mainnet
    }

    function setSPInstance(address instance) external onlyOwner {
        spInstance = ISP(instance);
    }

    function setSchemaID(uint64 schemaId_) external onlyOwner {
        schemaId = schemaId_;
    }

    function attest(uint256 _id) external onlyOwner returns (uint64) {
        Ride storage rideX = rides[_id];
    if (keccak256(bytes(rideX.status)) == keccak256(bytes("completed"))) {
                    bytes[] memory recipients = new bytes[](2);
            recipients[0] = abi.encode(rideX.driver);
            recipients[1] = abi.encode(rideX.rider);
            Attestation memory a = Attestation({
                schemaId: schemaId,
                linkedAttestationId: 0,
                attestTimestamp: 0,
                revokeTimestamp: 0,
                attester: address(this),
                validUntil: 0,
                dataLocation: DataLocation.ONCHAIN,
                revoked: false,
                recipients: recipients,
                data: ""
            });
            uint64 attestationId = spInstance.attest(a, "", "", "");
            return attestationId;
        } else {
            revert AttestationWrongAttester();
        }
    }

    // Register a driver
    function registerDriver(
        string memory _name,
        uint256 _lat,
        uint256 _lng
    ) public {
        require(
            drivers[msg.sender].driverAddress == address(0),
            "Driver already registered"
        );
        drivers[msg.sender] = Driver(msg.sender, _name, _lat, _lng, true);
        availableDrivers.push(msg.sender);
        emit DriverRegistered(msg.sender, _lat, _lng);
    }

    // Update driver location
    function updateDriverLocation(uint256 _lat, uint256 _lng) public {
        require(
            drivers[msg.sender].driverAddress != address(0),
            "Driver not registered"
        );
        drivers[msg.sender].lat = _lat;
        drivers[msg.sender].lng = _lng;
        emit DriverLocationUpdated(msg.sender, _lat, _lng);
    }

    // Request a ride
    function requestRide(
        address _driver,
        uint256 _startLat,
        uint256 _startLng,
        uint256 _destLat,
        uint256 _destLng
    ) public {
        require(drivers[_driver].isAvailable, "Driver not available");
        ride[msg.sender] = Ride(
            block.timestamp, // Add unique ride ID using timestamp
            msg.sender,
            _driver,
            _startLat,
            _startLng,
            _destLat,
            _destLng,
            "requested"
        );
        emit RideRequested(msg.sender, _driver);
    }

    // Accept a ride
    function acceptRide(address _rider) public {
        require(ride[_rider].driver == msg.sender, "Not the assigned driver");
        ride[_rider].status = "accepted";
        emit RideAccepted(msg.sender, _rider);
    }

    // Complete a ride
    function completeRide(address _rider) public {
        require(ride[_rider].driver == msg.sender, "Not the assigned driver");
        ride[_rider].status = "completed";
        drivers[msg.sender].isAvailable = true;
        emit RideCompleted(msg.sender, _rider);
    }

    // Get available drivers
    function getAvailableDrivers() public view returns (address[] memory) {
        return availableDrivers;
    }
}



//0x90589d46Ced1b0FF0CF38cE3565fa056a91c9c74 verified