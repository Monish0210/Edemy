import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const Feedbacks = () => {
    const { backendUrl, getToken } = useContext(AppContext)
    const [feedbacks, setFeedbacks] = useState([])

    const fetchFeedbacks = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/admin/feedbacks', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) setFeedbacks(data.feedbacks)
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    useEffect(() => {
        fetchFeedbacks()
    }, [])

    return (
        <div className='min-h-screen p-8 bg-gray-50'>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>Platform Feedback</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {feedbacks.map((item) => (
                    <div key={item._id} className='bg-white p-5 rounded-lg shadow border border-gray-100'>
                        <div className='flex items-center mb-3'>
                            <img className='w-10 h-10 rounded-full mr-3' src={item.userId?.imageUrl || assets.user_icon} alt="User" />
                            <div>
                                <h4 className='font-bold text-gray-800'>{item.userId?.name || 'Unknown User'}</h4>
                                <div className='flex text-yellow-500 text-sm'>
                                    {[...Array(item.rating)].map((_, i) => <span key={i}>★</span>)}
                                </div>
                            </div>
                            <span className='ml-auto text-xs text-gray-400'>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className='text-gray-600 italic'>"{item.feedbackText}"</p>
                    </div>
                ))}
                {feedbacks.length === 0 && <p className='text-gray-500'>No feedback yet.</p>}
            </div>
        </div>
    )
}

export default Feedbacks
