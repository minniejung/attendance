import { useAtomValue } from 'jotai'
import { IoWalletOutline } from 'react-icons/io5'

import { useWallet } from '@/app/provider'
import Button from '@/components/buttons/Button'
import { walletAtom } from '@/stores/atoms'
import { cn } from '@/utils/helpers/cn'

export const ButtonConnectWallet = () => {
	const { connect, disconnect } = useWallet()

	const wallet = useAtomValue(walletAtom)
	const isConnected = wallet?.address

	return (
		<Button
			onClick={isConnected ? disconnect : connect}
			className={cn(
				'rounded-full border-transparent bg-purple-100 px-4 py-2 text-xs font-semibold text-[#555] text-purple-500 hover:bg-purple-500 hover:text-white',
				isConnected && 'bg-gray-300 font-medium text-black',
			)}>
			{isConnected ? (
				<div className='flex flex-row items-center gap-2'>
					Disconnect <IoWalletOutline />
					{wallet?.address?.slice(0, 6)}...{wallet?.address?.slice(-3)}
				</div>
			) : (
				'Connect Wallet'
			)}
		</Button>
	)
}
