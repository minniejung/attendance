'use client'

import { createContext, useContext, useEffect } from 'react'

import { BrowserProvider } from 'ethers'
import { useSetAtom } from 'jotai'
import { toast } from 'react-toastify'

import { defaultProvider, walletAtom } from '@/stores/atoms'

const WalletContext = createContext<{
	connect: () => Promise<void>
	disconnect: () => void
}>({
	connect: async () => {},
	disconnect: () => {},
})

export const useWallet = () => useContext(WalletContext)

export const EthersProvider = ({ children }: { children: React.ReactNode }) => {
	const setWallet = useSetAtom(walletAtom)

	const connect = async () => {
		if (!window.ethereum) {
			toast.error('MetaMask not found')
			return
		}

		try {
			const provider = new BrowserProvider(window.ethereum)
			const signer = await provider.getSigner()
			const address = await signer.getAddress()

			const wallet = {
				address,
				provider,
				signer,
				isMetaMask: true as const,
			}

			setWallet(wallet)
			localStorage.setItem('walletConnected', 'true')
			toast.success('Wallet connected!')
		} catch (err) {
			console.error('Connection failed:', err)
			toast.error('Wallet connection failed')
		}
	}

	const disconnect = () => {
		const wallet = {
			address: '',
			provider: defaultProvider,
			signer: undefined,
		}

		setWallet(wallet)

		localStorage.removeItem('walletConnected')
		// toast.info('Disconnected')
	}

	useEffect(() => {
		const reconnect = async () => {
			if (window.ethereum && localStorage.getItem('walletConnected')) {
				await connect()
			}
		}
		reconnect()
	}, [])

	return <WalletContext.Provider value={{ connect, disconnect }}>{children}</WalletContext.Provider>
}
