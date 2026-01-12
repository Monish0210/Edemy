import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Educators = () => {
    const { backendUrl, getToken } = useContext(AppContext)
    const [educators, setEducators] = useState([])

    const fetchEducators = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/admin/educators', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) setEducators(data.educators)
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user? Irreversible action.")) return;
        try {
            const token = await getToken()
            const { data } = await axios.post(backendUrl + '/api/admin/delete-user', { id }, { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                toast.success(data.message)
                fetchEducators();
            } else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    useEffect(() => {
        fetchEducators()
    }, [])

    return (
        <div className='min-h-screen p-8 bg-gray-50'>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>All Educators</h2>
            <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Educator</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Courses Published</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {educators.map((edu) => (
                            <tr key={edu._id}>
                                <td className='px-6 py-4 whitespace-nowrap flex items-center'>
                                    <img className='h-10 w-10 rounded-full mr-3' src={edu.imageUrl} alt="" />
                                    <span className='font-medium'>{edu.name}</span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-gray-500'>{edu.email}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-gray-900 font-bold'>{edu.courseCount}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button onClick={() => deleteUser(edu._id)} className='text-red-600 hover:text-red-900'>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Educators
