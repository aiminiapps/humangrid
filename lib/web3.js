import { createConfig, http } from 'wagmi'
import { bsc } from 'viem/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// WalletConnect Project ID
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

// Metadata for Web3Modal
const metadata = {
    name: 'SYNTHOS',
    description: 'Web3 AI Training & Reward Platform on BNB Chain',
    url: 'https://synthos.ai',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// BSC Mainnet only — plain wagmi createConfig (no social connectors)
export const wagmiConfig = createConfig({
    chains: [bsc],
    transports: {
        [bsc.id]: http(),
    },
    connectors: [
        injected(),
        walletConnect({ projectId, metadata, showQrModal: false }),
    ],
})


// Web3Modal features configuration
export const web3ModalConfig = {
    wagmiConfig,
    projectId,

    // Theme
    themeMode: 'dark',
    themeVariables: {
        '--w3m-accent': '#C6FF1A',
        '--w3m-color-mix': '#0B0F0C',
        '--w3m-color-mix-strength': 20,
        '--w3m-border-radius-master': '8px',
    },

    // ✅ Disable ALL social / email logins — show Web3 wallets only
    features: {
        email: false,          // removes email input
        socials: false,        // removes Google, X, Discord, GitHub, Farcaster, Apple
        onramp: false,         // removes buy-crypto
        swaps: false,          // removes swap UI
        analytics: false,
    },

    // Customize wallet display
    featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
        '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
        '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
        '163d2cf19babf05eb8962e9748f9ebe613ed52ebf9c8107c9a0f104bfcf161b3', // Binance Web3 Wallet
    ],
}


// ERC-20 Token ABI (minimal for transfers)
export const tokenABI = [
    {
        "constant": false,
        "inputs": [
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "", "type": "bool" }],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "name": "", "type": "string" }],
        "type": "function"
    }
]

// BNB Chain specific constants
export const BNB_MAINNET_ID = 56
export const DEFAULT_CHAIN = bsc // BSC Mainnet (production)
