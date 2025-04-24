import { ethers } from 'ethers'
import { atom } from 'jotai'

import { MetaMaskAccountType } from '@/utils/types/wallet.types'

export const defaultProvider = new ethers.JsonRpcProvider('https://public-en-kairos.node.kaia.io')

export const walletAtom = atom<MetaMaskAccountType | undefined>(undefined)
export const isConnectedAtom = atom(get => !!get(walletAtom))

export const userBalanceAtom = atom<string>('0')

// export const signerAtom = atom<ethers.Signer | undefined>(undefined)
// export const addressAtom = atom<string | undefined>(undefined)
// export const walletProviderAtom = atom<ethers.Provider>(defaultProvider)

// export const addressAtom = atom((get) => get(ethersWalletAtom)?.address)
// export const signerAtom = atom((get) => get(ethersWalletAtom)?.signer)
// export const providerAtom = atom((get) => get(ethersWalletAtom)?.provider)
