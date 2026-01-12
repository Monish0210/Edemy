import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    // Note: Icons are not available in assets for sidebar, using Lucide or similar, or just text if assets missing.
    // For consistency with Educator, assuming we want similar style.
    // Let's use simple text or generic icons if we don't have SVG assets for all.
    // Actually, AdminDashboard used to have tabs. Now we are making it route-based or persistent sidebar.

    // To keep it simple but consistent:
    // Dashboard, Educators, Students, Requests, Feedbacks

    // We can use the same pattern as Educator Sidebar.

    return (
        <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col'>
            <NavLink
                to='/admin/dashboard'
                end
                className={({ isActive }) => `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90' : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`}
            >
                <img src={assets.home_icon} alt="" className='w-6 h-6' />
                <p className='md:block hidden text-center'>Dashboard</p>
            </NavLink>

            <NavLink
                to='/admin/courses'
                className={({ isActive }) => `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90' : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`}
            >
                <img src={assets.my_course_icon || assets.book_icon} alt="" className='w-6 h-6' />
                <p className='md:block hidden text-center'>Courses</p>
            </NavLink>

            <NavLink
                to='/admin/educators'
                className={({ isActive }) => `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90' : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`}
            >
                <img src={assets.person_tick_icon} alt="" className='w-6 h-6' />
                <p className='md:block hidden text-center'>Educators</p>
            </NavLink>

            <NavLink
                to='/admin/students'
                className={({ isActive }) => `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90' : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`}
            >
                <img src={assets.people_icon || assets.person_tick_icon} alt="" className='w-6 h-6' />
                <p className='md:block hidden text-center'>Students</p>
            </NavLink>

            <NavLink
                to='/admin/requests'
                className={({ isActive }) => `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90' : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`}
            >
                <img src={assets.file_icon || assets.add_icon} alt="" className='w-6 h-6' />
                <p className='md:block hidden text-center'>Requests</p>
            </NavLink>

            <NavLink
                to='/admin/feedbacks'
                className={({ isActive }) => `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90' : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`}
            >
                <img src={assets.lesson_icon} alt="" className='w-6 h-6' />
                <p className='md:block hidden text-center'>Feedbacks</p>
            </NavLink>

        </div>
    )
}

export default Sidebar
