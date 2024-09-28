/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Contract, BrowserProvider, ethers } from 'ethers';
import { BigNumber } from 'alchemy-sdk';
import { contractAddress, abi } from '@/utils/abi';
import { toast } from 'react-toastify';
import { Ride } from "./index";
import { Framework } from "@superfluid-finance/sdk-core";
import {  celoAlfajores } from "viem/chains";

interface MyRidesProps {
    ride: Ride;
}

const MyRides: React.FC<MyRidesProps> = ({ ride }) => {
    const router = useRouter();
    const [address, setAddress] = useState("");

    const user = async () => {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
    };

    const isDriver = ride?.[1]?.toLowerCase() === address.toLowerCase();
    const isRider = ride?.[2]?.toLowerCase() === address.toLowerCase();

    useEffect(() => {
        user();
    }, []);

    const handleAcceptRide = async (rideId: number) => {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(contractAddress, abi, signer);

                const tx = await contract.acceptRide(rideId);
                await tx.wait();
                toast.success('Ride accepted successfully!');
            } catch (error) {
                console.error("Error accepting ride:", error);
                toast.error('Failed to accept ride.');
            }
        } else {
            toast.error('Ethereum object not found');
        }
    };

    const handleStartRide = async (rideId: number) => {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const contract = new Contract(contractAddress, abi, signer);


                // Retrieve ride details
                const rideDetails = await contract.rides(rideId);
                const driverAddress = rideDetails[1];
                const amount = 0.01 as unknown as BigNumber;

                // Calculate the flow rate
                const flowRate = calculateFlowRate(amount);

                // Start the payment stream
                await createNewFlow(driverAddress, flowRate);

                toast.success('Ride started and payment stream initiated successfully!');
            } catch (error) {
                console.error("Error starting ride:", error);
                toast.error('Failed to start ride.');
            }
        } else {
            toast.error('Ethereum object not found');
        }
    };

    const createNewFlow = async (recipient: string, flowRate: string) => {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const chainId = celoAlfajores.id;
        const sf = await Framework.create({
            chainId,
            provider,
        });
        const superSigner = sf.createSigner({ signer: signer });

        // Load the Super Token you are using
        const superToken = await sf.loadSuperToken("cUSDx");

        try {
            const createFlowOperation = superToken.createFlow({
                sender: await superSigner.getAddress(),
                receiver: recipient,
                flowRate: flowRate,
            });

            console.log("Creating your stream...");
            await createFlowOperation.exec(superSigner);
            console.log("Stream created successfully!");
        } catch (error) {
            console.error("Error creating stream:", error);
            toast.error('Failed to initiate payment stream.');
        }
    };

    const calculateFlowRate = (amount: BigNumber) => {
        // Estimated ride duration in seconds (e.g., 30 minutes = 1800 seconds)
        const estimatedRideDurationInSeconds = 1800;

        const flowRate = amount.div(estimatedRideDurationInSeconds).toString();
        return flowRate;
    };

    return (
        <div className="flex justify-between items-center gap-2 py-4 px-6 rounded-lg shadow-md m-2 bg-black text-white">
            <div className="flex flex-col items-start">
                <div className="font-bold">Ride #{ride?.[0]}</div>
                <div className="text-sm">From: {ride?.[3]}, {ride?.[4]}</div>
                <div className="text-sm">To: {ride?.[5]}, {ride?.[6]}</div>
                <div className="text-sm">Status: {ride?.[7]}</div>
            </div>
            <div className="flex flex-col items-start mt-6">
                <div className="text-sm">Driver: {ride?.[1]}</div>
                <div className="text-sm">Rider: {ride?.[2]}</div>
            </div>
            <div className="flex flex-col items-start">
                {!isRider && ride?.[7] === 'requested' && (
                    <button
                        onClick={() => handleAcceptRide(ride?.[0])}
                        className="mt-8 ml-4 py-1 px-3 bg-prosperity text-black text-sm font-light rounded"
                    >
                        Accept Ride
                    </button>
                )}
                {isRider && ride?.[7] === 'accepted' && (
                    <button
                        onClick={() => handleStartRide(ride?.[0])}
                        className="mt-8 ml-4 py-1 px-3 bg-prosperity text-black text-sm font-light rounded"
                    >
                        Start Ride
                    </button>
                )}
            </div>
        </div>
    );
};

export default MyRides;
