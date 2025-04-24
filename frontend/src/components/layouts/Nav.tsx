'use client'

import { redirect, usePathname } from 'next/navigation'

import { cn } from '@/utils/helpers/cn'

import { ButtonConnectWallet } from '../buttons/ButtonConnectWallet'

export const Nav = () => {
	const path = usePathname()

	return (
		<div className='flex flex-row items-center gap-8'>
			{links.map((link, i) => (
				<div
					key={i}
					onClick={() => redirect(`/${link.toLowerCase()}`)}
					className={cn(
						'relative cursor-pointer hover:text-black hover:underline',
						path.slice(1) === link.toLowerCase() && 'font-bold text-[#777] text-purple-500 hover:text-purple-500',
					)}>
					{link}
				</div>
			))}

			<ButtonConnectWallet />
		</div>
	)
}

const links = ['Home', 'Comments']
