/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from 'react';
import { contractAddress, abi } from '@/utils/abi'; // Import contract details
import { BrowserProvider, Contract } from 'ethers';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useRouter } from 'next/router';
import { EyeIcon, LockClosedIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { getContract, formatEther, createPublicClient, http } from 'viem';
import { celo, celoAlfajores } from 'viem/chains';
import { stableTokenABI } from '@celo/abis';

const STABLE_TOKEN_ADDRESS = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'; // cUSD address on Celo mainnet

export interface Driver {
  address: string;
  lat: number;
  lng: number;
  name: string;
}

const containerStyle = {
  width: '100%',
  height: '500px',
};

const CeloRide: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [cUSDBalance, setCUSDBalance] = useState<string>('0');
  const [showBalanceDetails, setShowBalanceDetails] = useState<boolean>(true);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  const router = useRouter();

  // Detect user's current location
  useEffect(() => {
    if (navigator.geolocation) {
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

        const driverPromises = driverAddresses.map(async (address: string) => {
          const driver = await contract.drivers(address);
          return {
            address,
            lat: driver.lat / 1e6,
            lng: driver.lng / 1e6,
            name: driver.name,
          };
        });

        const driverList = await Promise.all(driverPromises);
        setDrivers(driverList);
      } catch (error) {
        console.error('Error loading drivers:', error);
      }
    }
  }, []);

  // Polling to update driver list every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadDrivers();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [loadDrivers]);

  // Fetch user's cUSD balance
  const getCUSDBalance = useCallback(async () => {
    if (window.ethereum) {
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const client = createPublicClient({
                chain: celoAlfajores,
                transport: http(),
            });

            const StableTokenContract = getContract({
                abi: stableTokenABI,
                address: STABLE_TOKEN_ADDRESS,
                client,
            });
            const address = await signer.getAddress();
            let cleanedAddress = address.substring(2);
            const balanceInBigNumber = await StableTokenContract.read.balanceOf([`0x${cleanedAddress}`]);
            const balanceInWei = balanceInBigNumber;
            const balanceInEthers = formatEther(balanceInWei);

            setCUSDBalance(balanceInEthers);
        } catch (error) {
            console.error('Error fetching cUSD balance:', error);
        }
    }
}, []);


  useEffect(() => {
    getCUSDBalance();
  }, [getCUSDBalance]);

  // Handle ride request
  const handleDriverClick = async (driver: Driver) => {
    if (currentLocation) {
      try {
        router.push('/map/RequestRideModal');
      } catch (error) {
        console.error('Error requesting ride:', error);
      }
    }
  };

  const toggleBalanceDetails = () => {
    setShowBalanceDetails((prev) => !prev);
  };

  const formatBalance = (balance: string) => parseFloat(balance).toFixed(2);

  const handleAddDriver = () => {
    router.push('/map/addDriver');
  };

  return (
    <div className="bg-white max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="flex justify-end">
        <PlusCircleIcon
          onClick={handleAddDriver}
          className="h-8 mb-4 text-black hover:bg-blue-700 duration-150 rounded-full cursor-pointer"
        />
      </div>

      {/* Map to show user's location and drivers */}
      <div className="my-8">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation || { lat: 37.7749, lng: -122.4194 }} // Default to SF
            zoom={12}
          >
            {/* Show current user location */}
            {currentLocation && <Marker position={currentLocation} label="You" />}

            {/* Show available drivers */}
            {drivers.map((driver) => (
              <Marker
                key={driver.address}
                position={{ lat: driver.lat, lng: driver.lng }}
                label={driver.name}
                onClick={() => handleDriverClick(driver)}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Balance display */}
      <div className="p-4 bg-gray-200 shadow rounded-lg">
        <div className="flex justify-between items-center">
          <button onClick={toggleBalanceDetails} className="text-blue-500 hover:underline">
            {showBalanceDetails ? <LockClosedIcon className="h-5 text-black" /> : <EyeIcon className="text-black text-lg h-4" />}
          </button>
        </div>
        {showBalanceDetails && (
          <div className="mt-2 text-black text-4xl font-bold">
            {formatBalance(cUSDBalance)} cUSD
          </div>
        )}
        <p className="text-sm">Your wallet balance</p>
      </div>
    </div>
  );
};

export default CeloRide;
