import { useEffect, useState } from 'react'

import { tokenContract } from '@/utils/consts'

export const useMintCooldown = (address?: string) => {
	const [cooldownLeft, setCooldownLeft] = useState<number>(0)

	useEffect(() => {
		if (!address) return

		const fetchCooldown = async () => {
			try {
				const wait = await tokenContract.timeUntilNextMint(address)
				setCooldownLeft(Number(wait))
			} catch (err) {
				console.warn('Cooldown fetch failed:', err)
			}
		}

		fetchCooldown()
		const interval = setInterval(() => {
			setCooldownLeft(prev => Math.max(0, prev - 1))
		}, 1000)

		return () => clearInterval(interval)
	}, [address])

	return cooldownLeft
}
