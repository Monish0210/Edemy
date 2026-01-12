import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from '../educator/Footer'

const AdminLayout = () => {
    // Reusing Educator Footer for consistency or create a new one if needed.
    // Using Educator footer as imported above.
    return (
        <div className='text-default min-h-screen bg-white'>
            <Navbar />
            <div className='flex'>
                <Sidebar />
                <div className='flex-1'>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AdminLayout
