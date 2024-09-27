/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Contract, BrowserProvider } from 'ethers';
import { contractAddress, abi } from '@/utils/abi';
import { toast } from 'react-toastify';
import { Ride } from "./index";

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
    }

  const isDriver = ride?.[1].toLowerCase() === address.toLowerCase();
    const isRider = ride?.[2].toLowerCase() === address.toLowerCase();
    useEffect(() => {
        user();
    }, [user]);

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
                toast.error('Failed to accept ride?.');
            }
        } else {
            toast.error('Ethereum object not found');
        }
    };

    const handleStartRide = async (rideId: number) => {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(contractAddress, abi, signer);

                const tx = await contract.startRide(rideId);
                await tx.wait();
                toast.success('Ride started successfully!');
            } catch (error) {
                console.error("Error starting ride:", error);
                toast.error('Failed to start ride?.');
            }
        } else {
            toast.error('Ethereum object not found');
        }
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
                {!isRider && ride?.status === 'requested' && (
                    <button
                        onClick={() => handleAcceptRide(ride?.[0])}
                        className="mt-8 ml-4 py-1 px-3 bg-prosperity text-black text-sm font-light rounded"
                    >
                        Accept Ride
                    </button>
                )}
                {isRider && ride?.status === 'accepted' && (
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
