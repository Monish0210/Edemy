import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const FeedbackSection = () => {

    const { userData, backendUrl, getToken } = useContext(AppContext)
    const [rating, setRating] = useState(0)
    const [feedbackText, setFeedbackText] = useState('')

    const submitFeedback = async () => {
        try {
            if (rating === 0) {
                return toast.warn('Please select a rating')
            }
            if (feedbackText.trim() === '') {
                return toast.warn('Please write some feedback')
            }

            const token = await getToken()
            const { data } = await axios.post(backendUrl + '/api/user/add-feedback', { rating, feedbackText }, { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                toast.success('Feedback Submitted Successfully')
                setRating(0)
                setFeedbackText('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    if (!userData || userData.role === 'admin') return null

    return (
        <div className='pb-24 px-8 md:px-0 w-full flex flex-col items-center'>
            <h1 className='text-3xl font-bold text-gray-800 mb-6'>We Value Your Feedback</h1>
            <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-2xl border border-gray-200'>
                <p className='text-gray-600 mb-4 text-center'>Tell us about your experience with Edemy. Your feedback helps us improve.</p>

                <div className='flex justify-center items-center gap-3 mb-6'>
                    {[...Array(5)].map((_, i) => (
                        <img
                            key={i}
                            src={i < rating ? assets.star : assets.star_blank}
                            alt="star"
                            className='w-10 h-10 cursor-pointer transition-transform hover:scale-110'
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>

                <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder='Share your thoughts...'
                    rows='5'
                    className='w-full p-4 border rounded-md resize-none mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500'
                ></textarea>

                <div className='flex justify-center'>
                    <button onClick={submitFeedback} className='bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors'>Submit Feedback</button>
                </div>
            </div>
        </div>
    )
}

export default FeedbackSection
