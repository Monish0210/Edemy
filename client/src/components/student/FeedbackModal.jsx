import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const FeedbackModal = () => {
    const { backendUrl, getToken, user } = useContext(AppContext);
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const { data } = await axios.post(backendUrl + '/api/user/add-feedback', { rating, feedbackText: feedback }, { headers: { Authorization: `Bearer ${token}` } });

            if (data.success) {
                toast.success('Thank you for your feedback!');
                document.getElementById('feedback-modal').close();
                setFeedback('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <dialog id="feedback-modal" className="modal p-0 rounded-lg shadow-xl backdrop:bg-black/50">
            <div className="bg-white p-8 w-96 rounded-lg relative">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-xl font-bold hover:bg-gray-100 w-8 h-8 rounded-full">✕</button>
                </form>
                <h3 className="font-bold text-lg mb-4 text-center">Rate your Experience</h3>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <div className='flex justify-center gap-2 mb-2'>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button type="button" key={star} onClick={() => setRating(star)} className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                        ))}
                    </div>
                    <textarea
                        className='border border-gray-300 rounded p-3 text-sm min-h-[100px] outline-blue-500'
                        placeholder='Tell us what you like or how we can improve...'
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                    />
                    <button type='submit' className='bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors'>Submit Feedback</button>
                </form>
            </div>
        </dialog>
    )
}

export default FeedbackModal
