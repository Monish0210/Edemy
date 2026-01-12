import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CoursesList from './pages/student/CoursesList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Navbar from './components/student/Navbar'
import "quill/dist/quill.snow.css";
import { ToastContainer } from 'react-toastify';
import AdminDashboard from './pages/admin/Dashboard'
import Feedbacks from './pages/admin/Feedbacks'
import Educators from './pages/admin/Educators'
import Students from './pages/admin/Students'
import Requests from './pages/admin/Requests'
import AdminLayout from './components/admin/AdminLayout'
import FeedbackModal from './components/student/FeedbackModal'
import AllCourses from './pages/admin/AllCourses'

const App = () => {

  const isEducatorRoute = useMatch('/educator/*')
  const isAdminRoute = useMatch('/admin/*')

  return (
    <div className='text-default min-h-screen bg-white'>

      <ToastContainer />
      <FeedbackModal />
      {!isEducatorRoute && !isAdminRoute && <Navbar />}


      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CoursesList />} />
        <Route path='/course-list/:input' element={<CoursesList />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/my-enrollments' element={<MyEnrollments />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/loading/:path' element={<Loading />} />

        {/* Educator Routes */}
        <Route path='/educator' element={<Educator />}>
          <Route path='/educator' element={<Dashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='students-enrolled' element={<StudentsEnrolled />} />
        </Route>

        {/* Admin Routes */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='educators' element={<Educators />} />
          <Route path='students' element={<Students />} />
          <Route path='courses' element={<AllCourses />} />
          <Route path='requests' element={<Requests />} />
          <Route path='feedbacks' element={<Feedbacks />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App
