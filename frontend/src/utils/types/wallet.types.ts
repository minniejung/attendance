import { ethers } from 'ethers'

export type MetaMaskAccountType = {
	address: string
	provider: ethers.Provider
	signer: ethers.Signer | undefined
	isMetaMask?: true
}
