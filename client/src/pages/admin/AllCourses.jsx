import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const AllCourses = () => {
    const { backendUrl, getToken, currency } = useContext(AppContext)
    const [courses, setCourses] = useState([])

    const fetchCourses = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/admin/courses', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) setCourses(data.courses)
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    const deleteCourse = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            const token = await getToken()
            const { data } = await axios.post(backendUrl + '/api/admin/delete-course', { courseId: id }, { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                toast.success(data.message)
                fetchCourses();
            } else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    return (
        <div className='min-h-screen p-8 bg-gray-50'>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>All Courses</h2>
            <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Course Title</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Educator</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Price</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {courses.map((course) => (
                            <tr key={course._id}>
                                <td className='px-6 py-4 whitespace-nowrap flex items-center'>
                                    <img className='h-10 w-16 mr-3 object-cover rounded' src={course.courseThumbnail} alt="" />
                                    <span className='font-medium truncate max-w-xs block' title={course.courseTitle}>{course.courseTitle}</span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-gray-500'>{course.educator?.name || 'Unknown'}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-gray-900 font-bold'>{currency}{course.coursePrice}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button onClick={() => deleteCourse(course._id)} className='text-red-600 hover:text-red-900 cursor-pointer'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {courses.length === 0 && <p className='p-6 text-gray-500 text-center'>No courses found.</p>}
            </div>
        </div>
    )
}

export default AllCourses
