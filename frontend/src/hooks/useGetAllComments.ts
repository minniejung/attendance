'use client'

import { useCallback, useEffect, useState } from 'react'

import { storageContract } from '@/utils/consts'

type CommentType = {
	id: number
	author: string
	timestamp: number
	content: string
	isUpdated: boolean
	isDeleted: boolean
}

export const useGetAllComments = () => {
	const [comments, setComments] = useState<CommentType[]>([])
	const [loading, setLoading] = useState(false)

	const fetchAllComments = useCallback(async () => {
		try {
			setLoading(true)
			const raw = await storageContract.getAllActiveComments()
			console.log('📦 Raw result from contract:', raw)

			const parsed = raw.map((c: any) => {
				const [id, author, timestamp, content, isUpdated, isDeleted] = c
				return {
					id: Number(id),
					author,
					timestamp: Number(timestamp),
					content,
					isUpdated,
					isDeleted,
				}
			})

			setComments(parsed)
		} catch (err) {
			console.error('Failed to fetch all comments:', err)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchAllComments()
	}, [fetchAllComments])

	return { comments, loading, refetch: fetchAllComments }
}
