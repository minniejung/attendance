'use client'

import { useEffect, useState } from 'react'

import { FaEdit, FaSpinner, FaTrash } from 'react-icons/fa'

import Button from '@/components/buttons/Button'
import { useComment } from '@/hooks/useComments'
import { useGetAllComments } from '@/hooks/useGetAllComments'

const CommentsPage = () => {
	const [value, setValue] = useState('')
	const [editingIndex, setEditingIndex] = useState<number | null>(null)
	const [comments, setComments] = useState<
		{
			id: number
			index: number
			author: string
			timestamp: number
			content: string
			isUpdated: boolean
			isDeleted: boolean
		}[]
	>([])

	const { setComment, updateComment, deleteComment, fetchUserComments, loading } = useComment()

	const loadComments = async () => {
		const list = await fetchUserComments()
		setComments(list)
	}

	useEffect(() => {
		loadComments()
	}, [])

	const handleSubmit = async () => {
		if (!value.trim()) return

		if (editingIndex !== null) {
			await updateComment(editingIndex, value)
			setEditingIndex(null)
		} else {
			await setComment(value)
		}
		setValue('')
		await loadComments()
	}

	const handleEdit = (index: number, content: string) => {
		setEditingIndex(index)
		setValue(content)
	}

	const handleDelete = async (index: number) => {
		await deleteComment(index)
		await loadComments()
	}

	console.log('comments', comments)
	const { comments: allComments, loading: isLoadingAll, refetch } = useGetAllComments()

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-row gap-4'>
				<input
					value={value}
					onChange={e => setValue(e.target.value)}
					placeholder='Write something...'
					className='w-full rounded-lg border border-gray-300 p-3'
				/>
				<Button
					onClick={handleSubmit}
					disabled={loading}
					className='h-[40px] w-full max-w-[300px] self-center border border-purple-500 bg-white text-sm text-purple-500 hover:bg-purple-500 hover:text-white disabled:opacity-50'>
					{loading ? (
						<FaSpinner className='animate-spin text-xl text-gray-500' />
					) : editingIndex !== null ? (
						'Update'
					) : (
						'Comment'
					)}
				</Button>
			</div>

			<div className='mt-6'>
				<h2 className='mb-2 text-lg font-semibold'>📝 All Comments</h2>
				{isLoadingAll ? (
					<p>Loading comments...</p>
				) : (
					<div className='flex flex-col gap-4'>
						{allComments.map(comment => (
							<div
								key={comment.id}
								className='flex flex-col gap-1 rounded border border-gray-200 p-4 text-sm text-gray-800 shadow-sm'>
								<p>{comment.content}</p>
								<p className='text-xs text-gray-500'>
									From {comment.author.slice(0, 6)} • {new Date(comment.timestamp * 1000).toLocaleString()}
								</p>
								{comment.isUpdated && <p className='text-xs text-blue-500'>* Edited</p>}
								<div className='mt-2 flex gap-3'>
									<Button
										onClick={() => {
											setValue(comment.content)
											setEditingIndex(comment.id)
										}}>
										<FaEdit className='mr-1' /> Edit
									</Button>
									<Button
										onClick={() => {
											deleteComment(comment.id)
											refetch()
										}}>
										<FaTrash className='mr-1' /> Delete
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default CommentsPage
