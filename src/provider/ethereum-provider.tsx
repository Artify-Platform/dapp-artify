'use client'

import { configChains } from '@/contants'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { Chain, WagmiConfig } from 'wagmi'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PROJECT_ID || 'eb143c7b40000cfa942a68941df0babc'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const chains = configChains as Chain[]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
    '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
  ],
})

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}
