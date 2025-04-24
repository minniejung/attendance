import { useEffect } from 'react'

import { ethers } from 'ethers'
import { useAtom } from 'jotai'

import { userBalanceAtom } from '@/stores/atoms'
import { tokenContract } from '@/utils/consts'

export const useTokenBalance = (address?: string) => {
	const [balance, setBalance] = useAtom(userBalanceAtom)

	useEffect(() => {
		if (!address) return

		const fetchBalance = async () => {
			try {
				const raw = await tokenContract.balanceOf(address)
				setBalance(ethers.formatUnits(raw, 18))
			} catch (err) {
				console.error('Balance fetch error:', err)
			}
		}

		fetchBalance()
	}, [address, balance])

	return balance
}
