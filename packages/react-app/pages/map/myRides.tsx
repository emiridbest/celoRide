/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react';
import { useRouter } from 'next/router';
import { Contract, BrowserProvider } from 'ethers';
import { contractAddress, abi } from '@/utils/abi';
import { toast } from 'react-toastify';

enum FiatCurrency {
    NGN = 0, // Nigerian Naira
    KSH = 1, // Kenyan Shilling
    UGX = 2, // Ugandan Shilling
    GHS = 3  // Ghanaian Cedi
}

interface Ride {
    id: number;
    driver: string;
    rider: string;
    startLat: number;
    startLng: number;
    destLat: number;
    destLng: number;
    status: string;
}

interface MyRidesProps {
    ride: Ride;
    userAddress: string;
}

const MyRides: React.FC<MyRidesProps> = ({ ride, userAddress }) => {
    const router = useRouter();
    const isDriver = ride.driver.toLowerCase() === userAddress.toLowerCase();
    const isRider = ride.rider.toLowerCase() === userAddress.toLowerCase();

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
                const signer = await provider.getSigner();
                const contract = new Contract(contractAddress, abi, signer);

                const tx = await contract.startRide(rideId);
                await tx.wait();
                toast.success('Ride started successfully!');
            } catch (error) {
                console.error("Error starting ride:", error);
                toast.error('Failed to start ride.');
            }
        } else {
            toast.error('Ethereum object not found');
        }
    };

    return (
        <div className="flex justify-between items-center gap-2 py-4 px-6 rounded-lg shadow-md m-2 bg-black text-white">
            <div className="flex flex-col items-start">
                <div className="font-bold">Ride #{ride.id}</div>
                <div className="text-sm">From: {ride.startLat}, {ride.startLng}</div>
                <div className="text-sm">To: {ride.destLat}, {ride.destLng}</div>
                <div className="text-sm">Status: {ride.status}</div>
            </div>
            <div className="flex flex-col items-start mt-6">
                <div className="text-sm">Driver: {ride.driver}</div>
                <div className="text-sm">Rider: {ride.rider}</div>
            </div>
            <div className="flex flex-col items-start">
                {isDriver && ride.status === 'requested' && (
                    <button
                        onClick={() => handleAcceptRide(ride.id)}
                        className="mt-8 ml-4 py-1 px-3 bg-prosperity text-black text-sm font-light rounded"
                    >
                        Accept Ride
                    </button>
                )}
                {isRider && ride.status === 'accepted' && (
                    <button
                        onClick={() => handleStartRide(ride.id)}
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
