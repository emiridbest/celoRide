/* eslint-disable unhandledRejection TypeError */ 
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { AppProps } from "next/app";
import { celo } from "viem/chains";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";
import { supportedNetworks } from "@superfluid-finance/widget";
import Layout from "@/components/Layout";
export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [celo],
  [publicProvider()]
);


const connectors = [
  new InjectedConnector({
    chains,
  })
];


export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const appInfo = {
  appName: "CeloRide",
};
function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;