import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Dashboard = () => {
    const { backendUrl, getToken } = useContext(AppContext)
    const [dashboardData, setDashboardData] = useState(null)

    const fetchDashboardData = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) setDashboardData(data.dashboardData)
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (!dashboardData) return <div className='min-h-screen flex items-center justify-center'><div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div></div>

    return (
        <div className='min-h-screen p-8 bg-gray-50'>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>Platform Overview</h2>

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
    )
}

export default Dashboard
