'use client'

import { useState } from 'react'

import { ethers } from 'ethers'
import { useAtomValue } from 'jotai'
import { FaSpinner } from 'react-icons/fa'
import { IoWalletOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'

import Button from '@/components/buttons/Button'
import { useMintCooldown } from '@/hooks/useMintCooldown'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { walletAtom } from '@/stores/atoms'
import { encodeCallData, sendMetaTransaction } from '@/utils/helpers/metaTx'

export const ButtonMint = () => {
	const wallet = useAtomValue(walletAtom)

	const [loading, setLoading] = useState<boolean>(false)

	const cooldownLeft = useMintCooldown(wallet?.address)
	const balance = useTokenBalance(wallet?.address)

	const handleMint = async () => {
		if (!wallet?.signer) return
		setLoading(true)

		try {
			const data = encodeCallData('mint', [ethers.parseUnits('10', 18)])
			toast.info('Attending...')

			await sendMetaTransaction(data, wallet.signer)

			toast.success('Successfully received 10 MEOW!')
		} catch (err) {
			console.error('Mint error:', err)
			toast.error('Mint failed')
		} finally {
			setLoading(false)
		}
	}

	if (!wallet?.address) return null

	return (
		<div className='flex flex-col items-center gap-8'>
			<div className='flex flex-row items-center justify-end gap-2 text-xs font-medium text-gray-500'>
				Your balance <IoWalletOutline /> <span className='font-bold'>{balance} MEOW</span>
			</div>

			<Button
				onClick={handleMint}
				disabled={loading || cooldownLeft > 0}
				className='flex w-[280px] flex-row items-center justify-center gap-2 hover:border-purple-300 hover:bg-purple-50'>
				{loading ? <FaSpinner className='animate-spin text-xl text-gray-500' /> : 'Attend & Get 10 MEOW 🐱'}
			</Button>

			<div>{cooldownLeft > 0 && `Wait ${cooldownLeft}s`}</div>
		</div>
	)
}
