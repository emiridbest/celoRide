import React, { useState, useCallback, useEffect } from 'react';
import { contractAddress, abi } from '@/utils/abi';
import { BrowserProvider, Contract } from 'ethers';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useRouter } from 'next/router';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import MyRides from './myRides';


const STABLE_TOKEN_ADDRESS = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'; // cUSD address on Celo mainnet

export interface Driver {
    [x:string]: any;
    address: string;
    lat: number;
    lng: number;
    name: string;
}

export interface Ride {
    [x:string]: any;
    id: number;
    driver: string;
    rider: string;
    startLat: number;
    startLng: number;
    destLat: number;
    destLng: number;
    status: string;
}

const containerStyle = {
    width: '100%',
    height: '500px',
};

const CeloRide: React.FC = () => {
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [rides, setRides] = useState<Ride[]>([]);

    const router = useRouter();

    // Ensure this runs only in the browser
    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error detecting location', error);
                }
            );
        }
    }, []);

    // Fetch available drivers from the smart contract
    const loadDrivers = useCallback(async () => {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(contractAddress, abi, signer);
                const driverAddresses = await contract.getAvailableDrivers();
                console.log(driverAddresses);

                const driverPromises = driverAddresses.map(async (address: string) => {
                    const driver = await contract.drivers(address);
                    return {
                        address,
                        lat: driver.lat / 1e6,
                        lng: driver.lng / 1e6,
                        name: driver.name,
                    };
                });
                console.log(driverPromises);

                const driverList = await Promise.all(driverPromises);
                console.log(driverList);
                setDrivers(driverList);
            } catch (error) {
                console.error('Error loading drivers:', error);
            }
        }
    }, []);

    // Fetch rides from the smart contract
    const loadRides = useCallback(async () => {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(contractAddress, abi, signer);
                const address = await signer.getAddress();
                const rides = await contract.rides(address);

                setRides(rides);
            } catch (error) {
                console.error('Error loading rides:', error);
            }
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            loadDrivers();
            loadRides(); // Load rides as well
        }, 10000);

        return () => clearInterval(intervalId);
    }, [loadDrivers, loadRides]);



    const handleDriverClick = async () => {
                router.push('/map/RequestRideModal');
        }

    return (
        <div className="bg-white max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="flex justify-end">
                <PlusCircleIcon
                    onClick={() => router.push('/map/addDriver')}
                    className="h-8 mb-4 text-black hover:bg-blue-700 duration-150 rounded-full cursor-pointer"
                />
            </div>

            <div className="my-8 w-64">
                {typeof window !== 'undefined' && (
                    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={currentLocation || { lat: 37.7749, lng: -122.4194 }} // Default to SF
                            zoom={12}
                        >
                            {currentLocation && <Marker position={currentLocation} label="You" />}
                            {drivers.map((driver) => (
                                <Marker
                                    key={driver.address}
                                    position={{ lat: driver.lat, lng: driver.lng }}
                                    label={driver.name}
                                    onClick={() => handleDriverClick()}
                                />
                            ))}
                        </GoogleMap>
                    </LoadScript>
                )}
            </div>


            <div className="my-8">
                <h2 className="text-lg font-bold">My Rides</h2>
                <MyRides ride={rides?.[0]} />
      { /**       {rides.map((ride) => (
                    <div key={ride.id} className="flex justify-between items-center gap-2 py-4 px-6 rounded-lg shadow-md m-2 bg-black text-white">
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
                        </div>
                    </div>
      ))} */}
            </div>
        </div>
    );
};

export default CeloRide;
