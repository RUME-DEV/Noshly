import express from 'express'
import { registerUser, loginUser, googleAuth, getUser, logOut, sendOTP, verifyOTP, resetPassword } from '../controllers/userController.js'
import auth from "../middlewares/auth.js"

const userRouter = express.Router()

// User Routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/google-auth', googleAuth)
userRouter.post('/logout', logOut)
userRouter.post('/send-otp', sendOTP)
userRouter.post('/verify-otp', verifyOTP)
userRouter.post('/reset-password', resetPassword)

userRouter.get('/me', auth, getUser)



export default userRouter