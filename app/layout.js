import { Web3Provider } from '@/components/Web3Provider'
import './globals.css'

const DOMAIN = 'https://www.humangrid.ai'
const TITLE = 'HumanGrid AI — Decentralized AI Training Data Platform'
const DESCRIPTION = 'Community-powered AI data labeling, verification, and reward ecosystem. Participate in the Label-to-Earn AI Data Network and earn HGAI tokens.'

export const metadata = {
    metadataBase: new URL(DOMAIN),
    title: {
        default: TITLE,
        template: '%s | HumanGrid',
    },
    description: DESCRIPTION,
    keywords: [
        'AI training', 'earn crypto', 'Web3', 'BNB Chain', 'HGAI',
        'data labeling', 'crypto rewards', 'non-custodial', 'earn tokens',
        'AI tasks', 'blockchain', 'DeFi', 'earn online',
    ],
    authors: [{ name: 'HumanGrid', url: DOMAIN }],
    creator: 'HumanGrid',
    publisher: 'HumanGrid',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    // ── Open Graph (Facebook, LinkedIn, Discord, WhatsApp, iMessage, etc.)
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: DOMAIN,
        siteName: 'HumanGrid',
        title: TITLE,
        description: DESCRIPTION,
        images: [
            {
                url: `${DOMAIN}/og.png`,
                width: 1200,
                height: 630,
                alt: 'HumanGrid — Train AI. Earn Crypto.',
                type: 'image/png',
            },
        ],
    },
    // ── Twitter / X Card
    twitter: {
        card: 'summary_large_image',
        site: '@humangrid_world',
        creator: '@humangrid_world',
        title: TITLE,
        description: DESCRIPTION,
        images: [`${DOMAIN}/og.png`],
    },
    // ── Tab icon & Apple touch icon
    icons: {
        icon: [
            { url: '/icon.png', type: 'image/png' },
        ],
        apple: '/icon.png',
        shortcut: '/icon.png',
    },
    // ── Canonical & manifest
    alternates: {
        canonical: DOMAIN,
    },
}

export const viewport = {
    themeColor: '#FAFAFC',
    colorScheme: 'light',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased bg-industrial-black text-gray-text">
                <Web3Provider>
                    {children}
                </Web3Provider>
            </body>
        </html>
    )
}
