import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import Feedback from "../models/Feedback.js";


//Get User Data
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }

        res.json({ success: true, user })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Sync User (Fallback for Webhooks)
export const syncUser = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await User.findById(userId);

        if (user) {
            return res.json({ success: true, message: 'User already exists' });
        }

        // If user doesn't exist, create them using Clerk data (passed from simple body or fetched - for simplicity here we assume standard minimal data)
        // In a real 'sync', we might fetch from Clerk API. 
        // Here we can rely on what the frontend passes OR just create a placeholder until next webhook.
        // Actually, best practice: Let frontend pass basic details if needed, or fetch from Clerk.
        // Given we don't have Clerk Secret Key initialized in this file for SDK usage easily without import,
        // let's try to just create the user with ID and basic info.

        const { name, email, imageUrl } = req.body;

        await User.create({
            _id: userId,
            email,
            name: (name && name !== 'null null' && name !== 'undefined undefined') ? name : "User",
            imageUrl,
            role: 'student'
        });

        res.json({ success: true, message: 'User Synced' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//User Enrolled Courses with Lecture Links
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')

        res.json({ success: true, enrolledCourses: userData.enrolledCourses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


//Purchase Course
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const { origin } = req.headers
        const userId = req.auth.userId
        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if (!userData || !courseData) {
            return res.json({ success: false, message: 'Data Not Found' })
        }

        const amount = (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2);
        const adminEarnings = (amount * 0.02).toFixed(2); // 2% Admin Fee

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount,
            adminEarnings,
        }

        const newPurchase = await Purchase.create(purchaseData)

        // Stripe Gateway Initialize
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase()

        // Creating line items to for Stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId
        const { courseId, lectureId } =
            req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture Already Completed' })
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        } else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }

        res.json({ success: true, message: 'Progress Updated' })
    } catch (error) {
        res.json({
            success: false, message: error.message
        })
    }
}

// get User Course Progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId
        const { courseId } =
            req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })

        res.json({ success: true, progressData })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Add User Ratings to Course
export const addUserRating = async (req, res) => {
    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'Invalid Details' })
    }

    try {
        const course = await Course.findById(courseId);

        if (!courseId) {
            return res.json({ success: false, message: 'Course not found.' });
        }

        const user = await User.findById(userId);

        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User has not purchased this course' });
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r, userId === userId)

        if (existingRatingIndex > -1) {
            course.courseRatings[existingRatingIndex].rating = rating;
            course.courseRatings[existingRatingIndex].feedbackText = req.body.feedbackText || "";
        } else {
            course.courseRatings.push({ userId, rating, feedbackText: req.body.feedbackText || "" });
        }

        await course.save();

        return res.json({ success: true, message: 'Rating added' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// Add Platform Feedback
export const addPlatformFeedback = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { rating, feedbackText } = req.body;

        if (!rating || !feedbackText) {
            return res.json({ success: false, message: "Missing Details" });
        }

        await Feedback.create({ userId, rating, feedbackText });

        res.json({ success: true, message: "Feedback Submitted" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Platform Feedbacks (Public)
export const getPlatformFeedbacks = async (req, res) => {
    try {
        // Fetch latest 5 feedbacks
        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 })
            .limit(4)
            .populate('userId', 'name imageUrl');

        res.json({ success: true, feedbacks });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}