import express from 'express'
import { deleteUser, getAdminDashboardData, getEducatorsList, getAllFeedbacks, getStudentsList, getEducatorRequests, approveEducator, rejectEducator, getAllCourses, deleteCourseAdmin } from '../controllers/adminController.js'
import { protectAdmin } from '../middlewares/authMiddleware.js'

const adminRouter = express.Router()

adminRouter.get('/dashboard', protectAdmin, getAdminDashboardData)
adminRouter.get('/educators', protectAdmin, getEducatorsList)
adminRouter.get('/students', protectAdmin, getStudentsList)
adminRouter.get('/feedbacks', protectAdmin, getAllFeedbacks)
adminRouter.get('/requests', protectAdmin, getEducatorRequests)
adminRouter.post('/approve', protectAdmin, approveEducator)
adminRouter.post('/reject', protectAdmin, rejectEducator)
adminRouter.post('/delete-user', protectAdmin, deleteUser)
adminRouter.get('/courses', protectAdmin, getAllCourses)
adminRouter.post('/delete-course', protectAdmin, deleteCourseAdmin)

export default adminRouter
