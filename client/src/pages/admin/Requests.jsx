import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Requests = () => {
    const { backendUrl, getToken } = useContext(AppContext)
    const [requests, setRequests] = useState([])

    const fetchRequests = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/admin/requests', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) setRequests(data.requests)
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    const approveEducator = async (userId) => {
        try {
            const token = await getToken()
            const { data } = await axios.post(backendUrl + '/api/admin/approve', { userId }, { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                toast.success(data.message)
                fetchRequests()
            } else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    const rejectEducator = async (userId) => {
        try {
            const token = await getToken()
            const { data } = await axios.post(backendUrl + '/api/admin/reject', { userId }, { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                toast.success(data.message)
                fetchRequests()
            } else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    return (
        <div className='min-h-screen p-8 bg-gray-50'>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>Educator Requests</h2>
            <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>User</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {requests.map((user) => (
                            <tr key={user._id}>
                                <td className='px-6 py-4 whitespace-nowrap flex items-center'>
                                    <img className='h-10 w-10 rounded-full mr-3' src={user.imageUrl} alt="" />
                                    <span className='font-medium'>{user.name}</span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-gray-500'>{user.email}</td>
                                <td className='px-6 py-4 whitespace-nowrap space-x-2'>
                                    <button onClick={() => approveEducator(user._id)} className='bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700'>Approve</button>
                                    <button onClick={() => rejectEducator(user._id)} className='bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700'>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {requests.length === 0 && <p className='p-6 text-gray-500 text-center'>No pending requests.</p>}
            </div>
        </div>
    )
}

export default Requests
