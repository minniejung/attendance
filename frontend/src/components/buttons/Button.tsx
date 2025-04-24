import React, { ReactNode } from 'react'

import { cn } from '@/utils/helpers/cn'

type ButtonTypes = {
	onClick: () => void
	children: ReactNode
	className?: string
	disabled?: boolean
}

const Button = ({ onClick, children, className, disabled }: ButtonTypes) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={cn(
				'z-10 flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-4 font-bold',
				className,
				disabled && 'cursor-not-allowed opacity-50',
			)}>
			{children}
		</button>
	)
}

export default Button
