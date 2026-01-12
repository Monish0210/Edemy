import User from "../models/User.js";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import Feedback from "../models/Feedback.js";

// Get Admin Dashboard Data
export const getAdminDashboardData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEducators = await User.countDocuments({ role: 'educator' });
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCourses = await Course.countDocuments();
        const totalPurchases = await Purchase.countDocuments({ status: 'completed' });

        const purchases = await Purchase.find({ status: 'completed' });
        const totalRevenue = purchases.reduce((sum, item) => sum + (item.adminEarnings || 0), 0);

        res.json({
            success: true,
            dashboardData: {
                totalUsers,
                totalEducators,
                totalStudents,
                totalCourses,
                totalPurchases,
                totalRevenue
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get List of Educators with Course Counts
export const getEducatorsList = async (req, res) => {
    try {
        const educators = await User.find({ role: 'educator' });

        // Enrich with course count
        const educatorsData = await Promise.all(educators.map(async (educator) => {
            const courseCount = await Course.countDocuments({ educator: educator._id });
            return {
                ...educator.toObject(),
                courseCount
            }
        }));

        res.json({ success: true, educators: educatorsData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get List of Students with Enrollment Counts
export const getStudentsList = async (req, res) => {
    try {
        const students = await User.find({
            $or: [
                { role: 'student' },
                { role: { $exists: false } }
            ]
        });

        // Enrich with enrollment count
        const studentsData = students.map((student) => {
            return {
                ...student.toObject(),
                enrolledCoursesCount: student.enrolledCourses.length
            }
        });

        res.json({ success: true, students: studentsData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Delete User (Educator or Student)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        // Optionally: Check if user has active courses/purchases and block delete? 
        // For now, we perform a hard delete as requested.

        await User.findByIdAndDelete(id);

        // If educator, maybe delete their courses? 
        // Keeping it simple for now based on request.

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get All Feedbacks
export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('userId', 'name imageUrl');
        res.json({ success: true, feedbacks });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Educator Requests
export const getEducatorRequests = async (req, res) => {
    try {
        const requests = await User.find({ educatorStatus: 'pending' });
        res.json({ success: true, requests });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Approve Educator
export const approveEducator = async (req, res) => {
    try {
        const { userId } = req.body;

        await User.findByIdAndUpdate(userId, { role: 'educator', educatorStatus: 'approved' });

        // Optionally update Clerk metadata here if you have the clerkClient setup 
        // (Assuming you do, similar to educatorController, but I'll skip importing it here for simplicity unless requested)

        res.json({ success: true, message: 'Educator Approved' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Reject Educator
export const rejectEducator = async (req, res) => {
    try {
        const { userId } = req.body;
        await User.findByIdAndUpdate(userId, { educatorStatus: 'rejected' });
        res.json({ success: true, message: 'Educator Rejected' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get All Courses (Admin)
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('educator', 'name');
        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Delete Course (Admin)
export const deleteCourseAdmin = async (req, res) => {
    try {
        const { courseId } = req.body;
        await Course.findByIdAndDelete(courseId);
        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
