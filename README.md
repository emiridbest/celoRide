# CeloRide

A decentralized ride-sharing application where payments are handled via Superfluid's streams. CeloRide offers a seamless, blockchain-based platform that allows users to book rides and pay drivers in real-time using cryptocurrency.
Contract Information

    TAX Verified Contract Address: 0xE6A922613992b9118034b4832cDdb483e41AD353
    CeloRide Contract Address: 0x90589d46Ced1b0FF0CF38cE3565fa056a91c9c74 although not yet integrated to the frontend 


Current frontend deployment contract address: 0x58bc7932bC31c5D0E3390F13E31F5897528D0385

Smart contract verification https://alfajores.celoscan.io/address/0x90589d46Ced1b0FF0CF38cE3565fa056a91c9c74

Features

    Real-time Payments: Leveraging Superfluid's streaming technology, CeloRide ensures that payments to drivers are made per second as the ride progresses.
    Decentralized Platform: Built on the Celo blockchain, ensuring transparent, tamper-proof transactions.
    User-Friendly Interface: Simplified ride booking with a focus on usability.
    Driver-User Matching: Smart contract-based matching of riders with nearby drivers.

How It Works

    1. Drivers get added to the site when they are available, setting their names and realtime location automatically
    2. The users can then see these drivers and their locations on the map and the request a ride from partcular drivers who can either accept or reject
    3. At the beginning of the riser, the user making use of the services then begins to stream funds directly to the waallet of the driver
    
![celoRide](https://github.com/user-attachments/assets/9a349272-0090-4d52-b7d8-1d2d8ddfe297)

    
Technologies Used

    Celo Blockchain: The underlying decentralized platform that enables fast, low-cost transactions in CELO, the native cryptocurrency.
    Minipay: Minipay integration mandated to use of a mobile first design approach.
    Superfluid: For streaming payments, enabling per-second transfer of funds between rider and driver during the ride.
    Solidity: Smart contracts are written in Solidity to manage ride bookings, driver matching, and payments.
    React: Frontend is built with React for a responsive and dynamic user interface.
    Wagmi + Viem: For blockchain integration and hooks to interact with Celo smart contracts.
 

How It Was Built

CeloRide was designed to provide a decentralized alternative to traditional ride-sharing applications by leveraging blockchain technology for real-time payments and smart contract-driven automation. Here’s how it was developed:

    Smart Contracts: The core functionality, such as ride booking, driver assignment, and real-time payments, is managed through smart contracts deployed on the Celo blockchain.
    Superfluid Integration: The Superfluid protocol was integrated into the contract, allowing payments to flow directly from riders to drivers as services are rendered, providing trustless and secure payments.
    Frontend with React: The user interface was built using React, with seamless integration to the Celo blockchain through wagmi and viem libraries to enable interaction with smart contracts.
    Testing and Deployment: The platform was tested and deployed using Foundry, a robust framework for Solidity development that enables quick testing and deployment on various networks.

Getting Started
Prerequisites

    Node.js and npm installed on your system.
    Minipay: Minipay integration mandated to use of a mobile first design approach.
    cUSD tokens for gas fees.
    Foundry installed for smart contract development.

Installation

    Clone the repository:

    bash
    git clone https://github.com/your-username/celoride.git
    cd celoride

    Install dependencies:

    bash
    npm install

    Start the development server:

    bash
    npm start

Setting Up Foundry

    Install Foundry:

    bash
    curl -L https://foundry.paradigm.xyz | bash
    foundryup

    Initialize Foundry Project: Navigate to your smart contracts directory and initialize a Foundry project:

    bash
    forge init

    Compile Contracts: Compile your Solidity contracts using Foundry:

    bash
    forge build

    Run Tests: Write tests in the /test directory, then run the tests:

    bash
    forge test

    Deploy Contracts: Use Foundry's forge tool to deploy your contracts:

    bash
    forge create --rpc-url <RPC_URL> --private-key <YOUR_PRIVATE_KEY> src/YourContract.sol:YourContract

    Verify Contracts (if necessary): To verify your contracts on Etherscan or Celo Explorer:

    bash
    forge verify-contract --compiler-version <VERSION> --chain-id <CHAIN_ID> --etherscan-api-key <API_KEY> <CONTRACT_ADDRESS> <CONTRACT_NAME>

Running Locally

    Open your browser and navigate to http://localhost:3000.
    Connect your wallet, book a ride, and experience real-time crypto payments as the ride progresses.

Contributions

Contributions are welcome! Please feel free to open an issue or submit a pull request for bug fixes, feature enhancements, or general improvements.


