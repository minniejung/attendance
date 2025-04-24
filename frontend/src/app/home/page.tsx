'use client'

import React from 'react'

import { useAtomValue } from 'jotai'

import { ButtonConnectWallet } from '@/components/buttons/ButtonConnectWallet'
import { ButtonMint } from '@/components/buttons/ButtonMint'
import { walletAtom } from '@/stores/atoms'

const HomePage = () => {
	const wallet = useAtomValue(walletAtom)

	return <div className='flex flex-col items-center gap-2'>{!wallet ? <ButtonConnectWallet /> : <ButtonMint />}</div>
}

export default HomePage
