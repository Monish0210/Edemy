import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Students = () => {
    const { backendUrl, getToken } = useContext(AppContext)
    const [students, setStudents] = useState([])

    const fetchStudents = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/admin/students', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) setStudents(data.students)
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
                fetchStudents();
            } else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    return (
        <div className='min-h-screen p-8 bg-gray-50'>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>All Students</h2>
            <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Student</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Enrollments</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {students.map((stu) => (
                            <tr key={stu._id}>
                                <td className='px-6 py-4 whitespace-nowrap flex items-center'>
                                    <img className='h-10 w-10 rounded-full mr-3' src={stu.imageUrl} alt="" />
                                    <span className='font-medium'>{stu.name}</span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-gray-500'>{stu.email}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-gray-900 font-bold'>{stu.enrolledCoursesCount}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button onClick={() => deleteUser(stu._id)} className='text-red-600 hover:text-red-900'>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Students
