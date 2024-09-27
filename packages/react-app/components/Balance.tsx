import React, { useState, useCallback, useEffect } from 'react';
import { EyeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { getContract, formatEther, createPublicClient, http } from "viem";
import { celo, celoAlfajores } from "viem/chains";
import { BrowserProvider} from 'ethers';
import { stableTokenABI } from "@celo/abis";
const STABLE_TOKEN_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

const Balance: React.FC = () => {
    const [cUSDBalance, setCUSDBalance] = useState<string>('0');
    const [showBalanceDetails, setShowBalanceDetails] = useState<boolean>(true);

    // Fetch user's cUSD balance
    const getCUSDBalance = useCallback(async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
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
                const balanceInBigNumber = await StableTokenContract.read.balanceOf([`0x${address.substring(2)}`]);
                const balanceInEthers = formatEther(balanceInBigNumber);

                setCUSDBalance(balanceInEthers);
            } catch (error) {
                console.error('Error fetching cUSD balance:', error);
            }
        }
    }, []);


    useEffect(() => {
        getCUSDBalance();
    }, [getCUSDBalance]);

    const toggleBalanceDetails = () => {
        setShowBalanceDetails(!showBalanceDetails);
    };
    function formatBalance(cUSDBalance: any, decimals = 2) {
        const balanceNumber = parseFloat(cUSDBalance);
        if (isNaN(balanceNumber)) {
            return "0.00";
        }
        return balanceNumber.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }



    return (
            <div className="sm:hidden my-4 p-4 bg-gypsum shadow rounded-lg">
                <div className="flex justify-between items-center">
                    <button
                        onClick={toggleBalanceDetails}
                        className="text-green-900 hover:underline"
                    >
                        {showBalanceDetails ? <LockClosedIcon
                            className="h-5 text-black" /> : <EyeIcon className="text-green-900 text-lg h-4" />}
                    </button>
                </div>
                {showBalanceDetails && (
                    <div className="mt-2 text-black text-4xl font-bold text-overflow-hidden">
                        {formatBalance(cUSDBalance)}cUSD
                    </div>
                )}
                <p className="text-sm">Your wallet balance</p>
                <div className="flex justify-between">
                    <p className="text-sm">{new Date().toLocaleTimeString()}</p>
                    <p className="text-sm">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

    )


}
export default Balance;