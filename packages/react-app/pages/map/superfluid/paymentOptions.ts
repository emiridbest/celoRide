const paymentOptions = [
  {
    chainId: 42220 as any,
    receiverAddress: "0x0000000000000000000000000000000000000000",
    superToken: {
      address: "0x3acb9a08697b6db4cd977e8ab42b6f24722e6d6e",
    },
    flowRate: {
      amountEther: "0.001",
      period: "month" as any,
    },
  },
];

export default paymentOptions;
