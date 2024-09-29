/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Contract, BrowserProvider, ethers } from 'ethers';
import { contractAddress, abi } from '@/utils/abi';
import { toast } from 'react-toastify';
import { Ride } from "./index";
import productDetails from "./superfluid/productDetails";
import paymentDetails from "./superfluid/paymentDetails";
import SuperfluidWidget from "@superfluid-finance/widget";
import superTokenList from "@superfluid-finance/tokenlist";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { celo } from 'viem/chains';
interface MyRidesProps {
  ride: Ride;
}

const MyRides: React.FC<MyRidesProps> = ({ ride }) => {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [startRide, setStartRide] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const customPaymentDetails = paymentDetails.paymentOptions.map((option) => {
    return {
      ...option,
      receiverAddress: ride?.[1] as string,
    };
  });
  const handleStartRide = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, abi, signer);

        setIsModalOpen(true);

        // Retrieve ride details


        toast.success('Ride started and payment stream initiated successfully!');
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
            onClick={() => handleStartRide()}
            className="mt-8 ml-4 py-1 px-3 bg-prosperity text-black text-sm font-light rounded"
          >
            Start Ride
          </button>
        )}
      </div>
      <section className="h-20 flex justify-center items-center mt-6 mx-10">
          <RainbowKitProvider >
            <ConnectButton.Custom>
              {({ openConnectModal, connectModalOpen }) => {
                const walletManager = {
                  open: async () => openConnectModal(),
                  isOpen: connectModalOpen,
                };
                return (
                  <section>
                    <SuperfluidWidget
                      productDetails={productDetails}
                      paymentDetails={{
                        paymentOptions: customPaymentDetails,
                      }}
                      tokenList={superTokenList}
                      type="dialog"
                      walletManager={walletManager}
                      eventListeners={{
                        onSuccess: () => {
                          setStartRide(true);
                        },
                      }}
                    >
                      {({ openModal }) => (
                        <button
                          onClick={() => {
                            openModal();
                          }}
                          className="bg-red-600 hover:bg-red-500 h-16 px-12 font-medium outline-none border-none rounded-full cursor-pointer"
                        >
                          Start Stream
                        </button>
                      )}
                    </SuperfluidWidget>
                  </section>
                );
              }}
            </ConnectButton.Custom>
          </RainbowKitProvider>
      </section>
    </div>
  );
};

export default MyRides;
