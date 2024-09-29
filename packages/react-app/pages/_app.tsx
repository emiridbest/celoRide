import Layout from "@/components/Layout";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { AppProps } from "next/app";
import { celo } from "viem/chains";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";
import { supportedNetworks } from "@superfluid-finance/widget";
export const { chains, publicClient, webSocketPublicClient } = configureChains(
  supportedNetworks,
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
      <RainbowKitProvider chains={chains} appInfo={appInfo} coolMode={true}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;