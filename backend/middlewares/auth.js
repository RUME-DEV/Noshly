import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const auth = async (req, res, next) => {
    // 1. Get token from cookie
    const token = req.cookies?.token

    if (!token) {
        return res.status(401).json({
            message: "Token Not Found"
        })
    }

    let decoded

    // 2. Verify token
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }

    try {
        // 3. Find user
        const user = await User.findById(decoded.user.id)
            .select("_id role isSuspended")

        if (!user) {
            return res.status(401).json({
                message: "User account not found"
            })
        }

        // 4. Check suspension
        if (user.isSuspended) {
            return res.status(403).json({
                message: "Your account has been suspended"
            })
        }

        // 5. Attach user information
        req.user = {
            id: user._id.toString(),
            role: user.role
        }

        // 6. Continue
        return next()

    } catch (error) {
        console.error("Authentication Database Error:", error)

        return res.status(500).json({
            message: "Authentication service unavailable"
        })
    }
}

export default auth