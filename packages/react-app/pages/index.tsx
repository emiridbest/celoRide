import React from 'react';
import TransactionList from '../components/TransactionList';
import Showcase from '@/components/Showcase';
import Hero from '@/components/Hero';
import Links from '@/components/Links';
import Balance from '@/components/Balance';

const CeloRide: React.FC = () => {

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 ">
      <Balance />
      <Hero />
      <Showcase />
      <Links />
      <TransactionList />
    </div>
  );
};

export default CeloRide;
