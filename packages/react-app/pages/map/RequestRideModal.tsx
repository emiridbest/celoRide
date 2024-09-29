import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap'; // Assuming you're using bootstrap for modals
import { useRouter } from 'next/router';
import { contractAddress, abi } from '@/utils/abi';
import { BrowserProvider, Contract } from 'ethers';
import { toast } from 'react-toastify';

interface RequestRideModalProps {
    show: boolean;
    onClose: () => void;
    driverAddress: string;
}

const RequestRideModal: React.FC<RequestRideModalProps> = ({ show, onClose, driverAddress }) => {

    const router = useRouter();
    const [currentLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const [startLat, setStartLat] = useState<number>(0);
    const [startLng, setStartLng] = useState<number>(0);
    const [destLat, setDestLat] = useState<number>(0);
    const [destLng, setDestLng] = useState<number>(0);

    const handleRequestRide = async () => {
        if (window.ethereum) {
            if (currentLocation)
                try {
                    const provider = new BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const contract = new Contract(contractAddress, abi, signer);

                    const startLat = Math.floor(currentLocation.lat * 1e6); // Convert to int for smart contract
                    const startLng = Math.floor(currentLocation.lng * 1e6);
                    const destLat = startLat + 10000; // Example destination offset
                    const destLng = startLng + 10000;

                    await contract.requestRide(driverAddress, startLat, startLng, destLat, destLng);
                    alert(`Ride requested with driver ${driverAddress}`);
                    onClose();
                    router.push('/');
                } catch (error) {
                    console.error("Error requesting ride:", error);
                }
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Request Ride</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="block text-sm">Driver Address</label>
                    <input
                        type="text"
                        value={driverAddress}
                        readOnly // This input is now read-only
                        className="border border-gray-300 bg-white text-black rounded-lg p-2 w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm">Start Latitude</label>
                    <input
                        type="number"
                        value={startLat}
                        onChange={(e) => setStartLat(Number(e.target.value))}
                        className="border border-gray-300 bg-white text-black rounded-lg p-2 w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm">Start Longitude</label>
                    <input
                        type="number"
                        value={startLng}
                        onChange={(e) => setStartLng(Number(e.target.value))}
                        className="border border-gray-300 bg-white text-black rounded-lg p-2 w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm">Destination Latitude</label>
                    <input
                        type="number"
                        value={destLat}
                        onChange={(e) => setDestLat(Number(e.target.value))}
                        className="border border-gray-300 bg-white text-black rounded-lg p-2 w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm">Destination Longitude</label>
                    <input
                        type="number"
                        value={destLng}
                        onChange={(e) => setDestLng(Number(e.target.value))}
                        className="border border-gray-300 bg-white text-black rounded-lg p-2 w-full"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    onClick={onClose}
                    className="py-2 px-3 bg-gray-500 text-white rounded-lg"
                >
                    Cancel
                </button>
                <button
                    onClick={handleRequestRide}
                    className="py-2 px-3 bg-blue-500 text-white rounded-lg"
                >
                    Request Ride
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default RequestRideModal;
