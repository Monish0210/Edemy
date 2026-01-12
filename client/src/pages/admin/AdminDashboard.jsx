import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'

const AdminDashboard = () => {

    const { backendUrl, getToken, navigate } = useContext(AppContext)

    const [dashboardData, setDashboardData] = useState(null)
    const [educators, setEducators] = useState([])
    const [students, setStudents] = useState([])
    const [feedbacks, setFeedbacks] = useState([]) // Was missing?
    const [requests, setRequests] = useState([])
    const [activeTab, setActiveTab] = useState('dashboard')
    const [loading, setLoading] = useState(false)

    const fetchDashboardData = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) setDashboardData(data.dashboardData)
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    const fetchEducators = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/admin/educators', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) setEducators(data.educators)
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    const fetchStudents = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/admin/students', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) setStudents(data.students)
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    const fetchFeedbacks = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/admin/feedbacks', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) setFeedbacks(data.feedbacks)
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

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
                fetchEducators()
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

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user? Irreversible action.")) return;
        try {
            const token = await getToken()
            const { data } = await axios.post(backendUrl + '/api/admin/delete-user', { id }, { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                toast.success(data.message)
                fetchEducators();
                fetchStudents();
                fetchDashboardData();
            } else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    useEffect(() => {
        setLoading(true)
        Promise.all([fetchDashboardData()]).finally(() => setLoading(false))
    }, [])

    // Fetch tab specific data when tab changes
    useEffect(() => {
        if (activeTab === 'educators') fetchEducators()
        if (activeTab === 'students') fetchStudents()
        if (activeTab === 'feedbacks') fetchFeedbacks()
        if (activeTab === 'requests') fetchRequests()
    }, [activeTab])


    if (loading || !dashboardData) return <div className='min-h-screen flex items-center justify-center'><div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div></div>

    return (
        <div className='min-h-screen bg-gray-50 flex'>

            {/* Sidebar - Simple implementation for now */}
            <div className='w-64 bg-slate-900 min-h-screen text-white p-5 fixed'>
                <h1 className='text-2xl font-bold mb-10'>Admin Panel</h1>
                <nav className='space-y-4'>
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left py-2 px-4 rounded ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>Dashboard</button>
                    <button onClick={() => setActiveTab('educators')} className={`w-full text-left py-2 px-4 rounded ${activeTab === 'educators' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>Educators List</button>
                    <button onClick={() => setActiveTab('students')} className={`w-full text-left py-2 px-4 rounded ${activeTab === 'students' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>Students List</button>
                    <button onClick={() => setActiveTab('requests')} className={`w-full text-left py-2 px-4 rounded ${activeTab === 'requests' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>Requests</button>
                    <button onClick={() => setActiveTab('feedbacks')} className={`w-full text-left py-2 px-4 rounded ${activeTab === 'feedbacks' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>Platform Feedback</button>
                    <button onClick={() => navigate('/')} className={`w-full text-left py-2 px-4 rounded hover:bg-slate-800 text-red-400 mt-10`}>Exit to Home</button>
                </nav>
            </div>

            <div className='flex-1 ml-64 p-8'>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className='space-y-8'>
                        <h2 className='text-3xl font-bold text-gray-800'>Platform Overview</h2>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500'>
                                <p className='text-gray-500'>Total Users</p>
                                <p className='text-3xl font-bold'>{dashboardData.totalUsers}</p>
                            </div>
                            <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500'>
                                <p className='text-gray-500'>Total Educators</p>
                                <p className='text-3xl font-bold'>{dashboardData.totalEducators}</p>
                            </div>
                            <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500'>
                                <p className='text-gray-500'>Total Students</p>
                                <p className='text-3xl font-bold'>{dashboardData.totalStudents}</p>
                            </div>
                            <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500'>
                                <p className='text-gray-500'>Total Courses</p>
                                <p className='text-3xl font-bold'>{dashboardData.totalCourses}</p>
                            </div>
                            <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500'>
                                <p className='text-gray-500'>Total Purchases</p>
                                <p className='text-3xl font-bold'>{dashboardData.totalPurchases}</p>
                            </div>
                            <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500'>
                                <p className='text-gray-500'>Total Revenue</p>
                                <p className='text-3xl font-bold'>${dashboardData.totalRevenue}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Educators Tab */}
                {activeTab === 'educators' && (
                    <div className='space-y-6'>
                        <h2 className='text-3xl font-bold text-gray-800'>All Educators</h2>
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
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div className='space-y-6'>
                        <h2 className='text-3xl font-bold text-gray-800'>All Students</h2>
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
                )}

                {/* Requests Tab */}
                {activeTab === 'requests' && (
                    <div className='space-y-6'>
                        <h2 className='text-3xl font-bold text-gray-800'>Educator Requests</h2>
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
                )}

                {/* Feedbacks Tab */}
                {activeTab === 'feedbacks' && (
                    <div className='space-y-6'>
                        <h2 className='text-3xl font-bold text-gray-800'>Platform Feedback</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {feedbacks.map((item) => (
                                <div key={item._id} className='bg-white p-5 rounded-lg shadow border border-gray-100'>
                                    <div className='flex items-center mb-3'>
                                        <img className='w-10 h-10 rounded-full mr-3' src={item.userId?.imageUrl} alt="User" />
                                        <div>
                                            <h4 className='font-bold text-gray-800'>{item.userId?.name}</h4>
                                            <div className='flex text-yellow-500 text-sm'>
                                                {[...Array(item.rating)].map((_, i) => <span key={i}>★</span>)}
                                            </div>
                                        </div>
                                        <span className='ml-auto text-xs text-gray-400'>{new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className='text-gray-600 italic'>"{item.feedbackText}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default AdminDashboard
