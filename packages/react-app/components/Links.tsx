import React from 'react';
import { useRouter } from 'next/router';
import { ArrowDownOnSquareIcon, CogIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Links: React.FC = () => {
    const router = useRouter();
    return (
        <div className="sm:hidden flex flex-wrap justify-around p-4 bg-gypsum rounded-lg shadow-md">
            <div className="flex flex-col items-center p-4 m-1 bg-gypsum shadow rounded-lg cursor-pointer" onClick={() => router.push('/map')}>
                <ArrowDownOnSquareIcon
                />
                <h3 className="text-xs  text-black">Order</h3>
            </div>
            <div className="flex flex-col items-center p-4 m-1 bg-gypsum shadow rounded-lg cursor-pointer" onClick={() => router.push('/map')}>
                <LockClosedIcon className='h-16'
                />
                <h3 className="text-xs  text-black">Waybill</h3>
            </div>
            <div className="flex flex-col items-center p-4 m-1 bg-gypsum shadow rounded-lg cursor-pointer" onClick={() => router.push('/map')}>
                <CogIcon
                />
                <h3 className="text-xs mt-2 text-black">CeloRide</h3>
            </div>
        </div>
    );
};

export default Links;
