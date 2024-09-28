import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { contractAddress, abi } from '@/utils/abi';
import { BrowserProvider, Contract } from 'ethers';
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { toast } from 'react-toastify';

const AddDriver: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const router = useRouter();

    // Use Geolocation API to get current latitude and longitude
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude);
                    setLng(position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast.error("Unable to retrieve your location.");
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
        }
    }, []);

    const handleRegisterDriver = async () => {
        if (!name || lat === null || lng === null) {
            toast.error('Please provide your name and allow location access.');
            return;
        }

        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(contractAddress, abi, signer);

                const gasLimit = parseInt("600000");
                const tx = await contract.registerDriver(name, Math.floor(lat), Math.floor(lng), { gasLimit });
                await tx.wait();
                toast.success('Driver registered successfully!');
                router.push('/drivers');
            } catch (error) {
                console.error("Error registering driver:", error);
                toast.error('Failed to register driver.');
            }
        } else {
            toast.error('Ethereum object not found');
        }
    };
    const handleUpdateLocation = async () => {
        if (!name || lat === null || lng === null) {
            toast.error('Please provide your name and allow location access.');
            return;
        }

        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(contractAddress, abi, signer);

                const gasLimit = parseInt("600000");
                const tx = await contract.updateDriverLocation(Math.floor(lat), Math.floor(lng), { gasLimit });
                await tx.wait();
                toast.success('Driver registered successfully!');
                router.push('/map');
            } catch (error) {
                console.error("Error registering driver:", error);
                toast.error('Failed to register driver.');
            }
        } else {
            toast.error('Ethereum object not found');
        }
    };

    const handleReturnHome = () => {
        router.push('/map');
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 font-light text-1xl">
            <ArrowLeftCircleIcon
                onClick={handleReturnHome}
                className="h-6 cursor-pointer"
            />
            <div className="flex justify-center mt-2">
                <h2 className="text-2xl font-semi-bold">Register as a Driver</h2>
            </div>
            <div className="mt-2">
                <label className="block text-sm">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-black bg-gray-150 text-black rounded-lg p-2 w-full"
                />
            </div>
            <div className="mt-2">
                <label className="block text-sm">Latitude</label>
                <input
                    type="number"
                    value={lat || ''}
                    disabled
                    className="border border-black bg-gray-150 text-black rounded-lg p-2 w-full"
                />
            </div>
            <div className="mt-2">
                <label className="block text-sm">Longitude</label>
                <input
                    type="number"
                    value={lng || ''}
                    disabled
                    className="border border-black bg-gray-150 text-black rounded-lg p-2 w-full"
                />
            </div>
            <div className="mt-4 flex justify-center">
                <button
                    onClick={handleRegisterDriver}
                    className="py-2 px-3 bg-gray-150 text-prosperity bg-black rounded-lg"
                >
                    Register Driver
                </button>
            </div>
            <div className="mt-4 flex justify-center">
                <button
                    onClick={handleUpdateLocation}
                    className="py-2 px-3 bg-gray-150 text-prosperity bg-black rounded-lg"
                >
                    Update Location
                </button>
            </div>
        </div>
    );
};

export default AddDriver;
