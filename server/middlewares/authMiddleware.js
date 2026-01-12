import User from "../models/User.js";

// Middleware (Protect Educator Routes)
export const protectEducator = async (req, res, next) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)

        if (!user || user.role !== 'educator') {
            return res.json({ success: false, message: 'Unauthorized Access' })
        }

        next()

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Middleware (Protect Admin Routes)
export const protectAdmin = async (req, res, next) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)

        if (!user || user.role !== 'admin') {
            return res.json({ success: false, message: 'Unauthorized Access' })
        }

        next()

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}