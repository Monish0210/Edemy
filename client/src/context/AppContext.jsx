import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { data, useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from "@clerk/clerk-react"
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const { getToken } = useAuth()
    const { user } = useUser()

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([])

    const [userData, setUserData] = useState(null)

    //Fecth All Courses
    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all');

            if (data.success) {
                setAllCourses(data.courses)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Fetch User Data
    const fetchUserData = async () => {

        try {
            const token = await getToken();

            const { data } = await axios.get(backendUrl + '/api/user/data', { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setUserData(data.user)
                if (data.user.role === 'educator') setIsEducator(true);
                if (data.user.role === 'admin') setIsAdmin(true);
            } else {
                // If User Not Found (likely Webhook failed), try to Sync
                if (user) {
                    const { data: syncData } = await axios.post(backendUrl + '/api/user/sync-user', {
                        name: (user.fullName && user.fullName !== 'null null') ? user.fullName : "User",
                        email: user.primaryEmailAddress.emailAddress,
                        imageUrl: user.imageUrl
                    }, { headers: { Authorization: `Bearer ${token}` } });

                    if (syncData.success) {
                        // Retry fetch after sync
                        const { data: retryData } = await axios.get(backendUrl + '/api/user/data', { headers: { Authorization: `Bearer ${token}` } });
                        if (retryData.success) {
                            setUserData(retryData.user)
                            if (retryData.user.role === 'educator') setIsEducator(true);
                            if (retryData.user.role === 'admin') setIsAdmin(true);
                        }
                    } else {
                        toast.error(data.message)
                    }
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Function to calculate average rating of course
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })

        return Math.floor(totalRating / course.courseRatings.length)
    }

    // Function to calculate course chapter time

    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    // Function to calculate coursr duration
    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration))

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    //Function to calculate no. of lectures in the course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    // Fetch user enrolled courses
    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {
        fetchAllCourses()
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserEnrolledCourses()
        }
    }, [user])

    const value = {
        currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, isAdmin, setIsAdmin, calculateNoOfLectures, calculateCourseDuration, calculateChapterTime, enrolledCourses, fetchUserEnrolledCourses, backendUrl, userData, setUserData, getToken, fetchAllCourses
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}