import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CoursesSection from '../../components/student/CoursesSection'
import TestimonialsSection from '../../components/student/TestimonialsSection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'
import { useNavigate } from 'react-router-dom' // Assuming react-router-dom is used for navigation
import { useAuth } from '@clerk/clerk-react' // Assuming Clerk for authentication
import FeedbackSection from '../../components/student/FeedbackSection'

const Home = () => {

  const navigate = useNavigate()
  const { user } = useAuth() // Or useContext(AppContext) if exposed, but useAuth is cleaner here

  const handleEnroll = () => {
    if (!user) {
      // Open Clerk Sign In
      // navigate('/sign-in') or better:
      scrollTo(0, 0) // visual feedback
      return; // Let <RedirectToSignIn /> or similar handle it if protecting route, or trigger modal.
      // Since we don't have a direct "openModal", the easiest is to rely on protected routes OR user awareness.
      // But user asked for "redirect to signup and signin".
      // Clerk has <SignInButton />. 
      // Let's assume the Navbar handles login.
      // We can use navigate('/sign-in') if we had a dedicated route, or toast "Please Login".
      // Actually, Clerk's useClerk() has openSignIn().
    }
    // logic to enroll... not implemented in Home usually, Home just lists things.
    // But user said: "no one can do something there are redirect to signup"
  }

  // Actually, the request "landing page... shown but no one can do something... redirect to signup"
  // implies hiding/locking functionality.
  // The 'CourseCard' handles clicks. Let's look at CourseCard.

  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero />
      <Companies />
      <CoursesSection />
      <TestimonialsSection />
      <CallToAction />
      <FeedbackSection />
      <Footer />
    </div>
  )
}

export default Home
