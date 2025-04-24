import { ethers } from 'ethers'

import {
	forwarderContract,
	relayer,
	storageAddress,
	storageContract,
	tokenAddress,
	tokenContract,
} from '@/utils/consts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const encodeCallData = (functionName: string, args: any[]) => {
	return tokenContract.interface.encodeFunctionData(functionName, [...args])
}

export const sendMetaTransaction = async (encodedData: string, signer: ethers.Signer) => {
	try {
		const domainInfo = await forwarderContract.eip712Domain()
		const from = await signer.getAddress()
		const nonce = await forwarderContract.nonces(from)
		const deadline = Math.floor(Date.now() / 1000) + 60 * 60

		const domain = {
			name: domainInfo.name,
			version: domainInfo.version,
			chainId: domainInfo.chainId,
			verifyingContract: domainInfo.verifyingContract,
		}

		const types = {
			ForwardRequest: [
				{ name: 'from', type: 'address' },
				{ name: 'to', type: 'address' },
				{ name: 'value', type: 'uint256' },
				{ name: 'gas', type: 'uint256' },
				{ name: 'nonce', type: 'uint256' },
				{ name: 'deadline', type: 'uint48' },
				{ name: 'data', type: 'bytes' },
			],
		}

		const message = {
			from,
			to: tokenAddress,
			value: 0,
			gas: ethers.toBigInt(500_000),
			nonce,
			deadline,
			data: encodedData,
		}

		const signature = await signer.signTypedData(domain, types, message)
		const request = { ...message, signature }

		const connectedForwarder = forwarderContract.connect(relayer) as typeof forwarderContract
		const tx = await connectedForwarder.execute(request)
		return await tx.wait()
	} catch (error) {
		console.error('Meta-tx execution failed:', error)
		throw error
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const encodeCallDataStorage = (functionName: string, args: any[]) => {
	return storageContract.interface.encodeFunctionData(functionName, [...args])
}

export const sendMetaTransactionStorage = async (encodedData: string, signer: ethers.Signer) => {
	try {
		const domainInfo = await forwarderContract.eip712Domain()
		const from = await signer.getAddress()
		const nonce = await forwarderContract.nonces(from)
		const deadline = Math.floor(Date.now() / 1000) + 60 * 60

		const domain = {
			name: domainInfo.name,
			version: domainInfo.version,
			chainId: domainInfo.chainId,
			verifyingContract: domainInfo.verifyingContract,
		}

		const types = {
			ForwardRequest: [
				{ name: 'from', type: 'address' },
				{ name: 'to', type: 'address' },
				{ name: 'value', type: 'uint256' },
				{ name: 'gas', type: 'uint256' },
				{ name: 'nonce', type: 'uint256' },
				{ name: 'deadline', type: 'uint48' },
				{ name: 'data', type: 'bytes' },
			],
		}

		const message = {
			from,
			to: storageAddress,
			value: 0,
			gas: ethers.toBigInt(500_000),
			nonce,
			deadline,
			data: encodedData,
		}

		const signature = await signer.signTypedData(domain, types, message)
		const request = { ...message, signature }

		const connectedForwarder = forwarderContract.connect(relayer) as typeof forwarderContract
		const tx = await connectedForwarder.execute(request)
		return await tx.wait()
	} catch (error) {
		console.error('Meta-tx execution failed:', error)
		throw error
	}
}
