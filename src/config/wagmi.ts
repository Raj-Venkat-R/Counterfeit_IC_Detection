import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, arbitrum, optimism } from 'wagmi/chains';
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';

// Read WalletConnect Cloud project ID from Vite env
// Create a .env file with: VITE_WALLETCONNECT_PROJECT_ID=your_project_id
const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined;

// Use a const tuple for stronger typing across wagmi/rainbowkit
const CHAINS = [mainnet, sepolia, polygon, arbitrum, optimism] as const;
export const chains = CHAINS;

let cfg;
if (WALLETCONNECT_PROJECT_ID && WALLETCONNECT_PROJECT_ID.trim().length > 0) {
  cfg = getDefaultConfig({
    appName: 'IC Trust Platform',
    projectId: WALLETCONNECT_PROJECT_ID, // https://cloud.walletconnect.com/
    chains: CHAINS,
    ssr: false,
  });
} else {
  // Fallback config to prevent crash (RainbowKit requires projectId).
  // This uses only the Injected connector (e.g., MetaMask) and default public RPCs.
  console.warn(
    '[config/wagmi] Missing VITE_WALLETCONNECT_PROJECT_ID. Falling back to injected-only wagmi config.\n' +
      'Create .env with: VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_cloud_project_id'
  );
  cfg = createConfig({
    chains: CHAINS,
    connectors: [injected()],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [polygon.id]: http(),
      [arbitrum.id]: http(),
      [optimism.id]: http(),
    },
  });
}

export const config = cfg;
