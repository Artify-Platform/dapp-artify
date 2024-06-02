'use client'
import { WalletProvider, useWallet } from '@suiet/wallet-kit'
import React from 'react'

import '@suiet/wallet-kit/style.css'

const SuiProvider = ({ children }: { children: React.ReactNode }) => {
  return <WalletProvider>{children}</WalletProvider>
}

export const useSuiWallet = useWallet

export default SuiProvider
