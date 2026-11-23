import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import validator from 'validator'
import generateToken from "../utils/createToken.js"
import { sendEmail } from "../utils/mail.js"
import { createHash, randomInt } from 'node:crypto'
import { OAuth2Client } from 'google-auth-library'


// Create a client for verifying Google ID tokens
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)



// Authentication controllers


// Register
const registerUser = async(req, res) => {
    try {

        const {fullName, email, password, mobile} = req.body

        // Check required fields
        if (!fullName || !email || !password) {

            return res.status(400).json({
                message: "Name, Email And Password Are Required"
            })

        // Ensure password has at least 6 characters
        } else if (password.length < 6) {

            return res.status(400).json({
                message: "Password Should Be Minimum Of 6 Characters"
            })

        // Validate email format
        } else if (!validator.isEmail(email)) {

            return res.status(400).json({
                message: "Invalid Email"
            })
        }

        // Normalize email before saving
        const normalizedEmail = email.trim().toLowerCase()

        // Check if the email is already registered
        const userExist = await User.findOne({
            email: normalizedEmail
        })

        if (userExist) {

            return res.status(409).json({
                message: "An account with this email already exists"
            })
        }

        // Hash password before storing it
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create the user account
        const user = await User.create({
            fullName,
            email: normalizedEmail,
            password: hashedPassword,
            mobile,
        })

        // Prepare user details to send to the frontend
        const userData = {
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            mobile: user.mobile
        }

        // Generate JWT for authentication
        const token = await generateToken(user._id)

        // Store token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            userData,
            message: "User Created Successfully"
        })

    } catch (error) {
        console.error("Registration Error:", error)

        // Handle duplicate email errors
        if (error.code === 11000) {
            return res.status(409).json({
                message: "An account with this email already exists"
            })
        }

        return res.status(500).json({
            message: "An unexpected error occurred during registration"
        })
    }
}




// Login
const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body

        // Check required fields
        if(!email || !password) {

            return res.status(400).json({
                message: "All Fields Are Required"
            })

        // Validate email format
        } else if (!validator.isEmail(email)) {

            return res.status(400).json({
                message: "Invalid Email"
            })
        }

        // Normalize email before searching
        const normalizedEmail = email.trim().toLowerCase()

        // Find user and include the hidden password field
        const user = await User.findOne({
            email: normalizedEmail
        }).select("+password")

        if (!user) {

            return res.status(400).json({
                message: "User Does Not Exist"
            })
        }

        // Check if the user's account is suspended
        if (user.isSuspended) {
            return res.status(403).json({
                message: "Your account has been suspended"
            })
        }

        // Check if the user is a Google-authenticated user without a password
        if (!user.password) {
            return res.status(400).json({
                message: "This account uses Google login. Please sign in with Google."
            })
        }

        // Compare submitted password with stored hash
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            
            return res.status(400).json({
                message: "Password Does Not Match"
            })
        }

        // Prepare user details to send to the frontend
        const userData = {
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            mobile: user.mobile
        }

        // Generate JWT for authentication
        const token = await generateToken(user._id)

        // Store token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            userData,
            message: "Login Successful"
        })
    } catch (error) {
        console.error(`Login Error: ${error.message}`)

        return res.status(500).json({
            message: "An Error Occured While Logging In"
        })
    }
}




// Google Authentication
const googleAuth = async (req, res) => {
    try {

        // Get the ID token sent by the frontend
        const { idToken } = req.body

        // Ensure the token was provided
        if (!idToken) {
            return res.status(400).json({
                message: "Google ID token is required"
            })
        }

        // Verify the token with Google
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        // Get the verified information from the token
        const payload = ticket.getPayload()

        // Ensure Google verified the user's email
        if (!payload || !payload.email_verified) {

            return res.status(401).json({
                message: "Google account email could not be verified"
            })
        }

        // Ensure the required Google account details are present
        if (!payload.sub || !payload.email || !payload.name) {
            
            return res.status(401).json({
                message: "Required Google account information is missing"
            })
        }

        // Get the verified details from Google's payload
        const googleId = payload.sub
        const email = payload.email.trim().toLowerCase()
        const fullName = payload.name

        // Check whether this Google account already exists
        let user = await User.findOne({ googleId })

        // If the Google account does not exist, check the email
        if (!user) {

            const existingUser = await User.findOne({ email })

            // Do not automatically link Google to an existing account
            if (existingUser) {

                return res.status(409).json({
                    message: "An account with this email already exists. Please log in using your existing method."
                })
            }

            // Create a new account using Google's verified details
            user = await User.create({
                fullName,
                email,
                googleId,
                googleAuth: true
            })

        }

        // Check if the user's account is suspended
        if (user.isSuspended) {
            return res.status(403).json({
                message: "Your account has been suspended"
            })
        }

        // Prepare the user information to return to the frontend
        const userData = {
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            mobile: user.mobile
        }

        // Generate our application's JWT
        const token = await generateToken(user._id)

        // Store the JWT in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // Send the user information to the frontend
        return res.status(200).json({
            userData,
            message: "Google Authentication Successful"
        })

        
    } catch (error) {
        // Log the error for debugging
        console.error("Google Authentication Error:", error.message)

        return res.status(500).json({
            message: "Google authentication failed"
        })
    }
}




// Get the currently logged-in user
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            })
        }

        const userData = {
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            mobile: user.mobile
        }

        return res.status(200).json({ userData })

    } catch (error) {
        console.error("Get User Error:", error.message)

        return res.status(500).json({
            message: "An Error Occurred While Fetching User"
        })
    }
}




// LogOut
const logOut = async (req, res) => {
    try {

        // Clear token from cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        })

        return res.status(200).json({

            message: "Logout Successful"
        })
    } catch (error) {
        console.error("Logout Error:", error.message)

        return res.status(500).json({

            message: "An unexpected error occurred during logout"
        })
    }
}





// Password recovery controllers


// Send OTP
const sendOTP = async (req, res) => {
    try {

        const { email } = req.body

        // Check if a valid email was provided
        if (!email || !validator.isEmail(email)) {

            return res.status(400).json({
                message: "A valid email is required"
            })
        }

        // Normalize email to keep its format consistent
        const normalizedEmail = email.trim().toLowerCase()

        // Find the user who requested the OTP
        const user = await User.findOne({
            email: normalizedEmail
        })

        if (!user) {
            return res.status(400).json({

                message: "User Does Not Exist"
            })
        }

        // Generate a random six-digit OTP
        const OTP = randomInt(100000, 1000000).toString()

        // Hash the OTP before storing it in the database
        const hashedOTP = createHash('sha256').update(OTP).digest('hex')

        // Save the OTP and set its expiry to five minutes
        user.resetOTP = hashedOTP
        user.OTPExpires = new Date(Date.now() + 5 * 60 * 1000)
        user.isOTPVerified = false
        user.resetVerificationExpires = null

        await user.save()

        try {

            // Send the original OTP to the user's email
            await sendEmail(normalizedEmail, OTP)

        } catch (sendEmailErr) {

            // Clear the OTP if the email fails to send
            user.resetOTP = null
            user.OTPExpires = null
            user.isOTPVerified = false
            user.resetVerificationExpires = null

            await user.save()

            // Pass the error to the outer catch block
            throw sendEmailErr
        }

        return res.status(200).json({
            message: "OTP Sent Successfully"
        })

    } catch (error) {

        // Log the error for debugging
        console.error("Send OTP Error:", error.message)

        return res.status(500).json({
            message: "An unexpected error occurred while sending the OTP"
        })
    }
}




// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        // Validate the email
        if (!email || !validator.isEmail(email)) {

            return res.status(400).json({
                message: "A valid email is required"
            })
        }

        // Ensure the OTP contains exactly six digits
        if (!/^\d{6}$/.test(otp)) {

            return res.status(400).json({
                message: "A valid six-digit OTP is required"
            })
        }

        // Normalize email before searching
        const normalizedEmail = email.trim().toLowerCase()

        // Include OTP fields that are hidden by default
        const user = await User.findOne({
            email: normalizedEmail
        }).select("+resetOTP +OTPExpires +isOTPVerified +resetVerificationExpires")

        if (!user) {
            return res.status(400).json({

                message: "User Does Not Exist"
            })
        }

        // Hash the submitted OTP so it can be compared with the stored hash
        const hashedOTP = createHash('sha256').update(otp).digest('hex')

        // Check whether an OTP was requested
        if (!user.resetOTP) {

            return res.status(400).json({
                message: "OTP Not Requested"
            })
        }

        // Check whether the OTP has expired
        if (!user.OTPExpires ||Date.now() > user.OTPExpires.getTime()) {

            return res.status(400).json({
                message: "OTP Expired"
            })
        }

        // Check whether the submitted OTP matches
        if (user.resetOTP !== hashedOTP) {

            return res.status(400).json({
                message: "Invalid OTP"
            })
        }

        // Confirm verification and allow 30 minutes to reset the password
        user.isOTPVerified = true
        user.resetVerificationExpires = new Date(Date.now() + 30 * 60 * 1000)

        await user.save()

        return res.status(200).json({
            message: "OTP Verified Successfully"
        })

    } catch (error) {
        // Log the error for debugging
        console.error("Verify OTP Error:", error.message)

        return res.status(500).json({
            message: "An unexpected error occurred while verifying the OTP"
        })
    }
}




// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body

        // Validate the email
        if (!email || !validator.isEmail(email)) {

            return res.status(400).json({
                message: "A valid email is required"
            })
        }

        // Ensure the new password meets the minimum length
        if (!newPassword || newPassword.length < 6) {

            return res.status(400).json({
                message: "Password should be at least 6 characters"
            })
        }

        // Normalize email before searching
        const normalizedEmail = email.trim().toLowerCase()

        // Retrieve the OTP verification fields needed for the reset
        const user = await User.findOne({
            email: normalizedEmail
        }).select("+isOTPVerified +resetVerificationExpires")


        if (!user) {
            
            return res.status(400).json({
                message: "User Does Not Exist"
            })
        }

        // Ensure the OTP was verified
        if (!user.isOTPVerified) {

            return res.status(400).json({
                message: "OTP Not Verified"
            })
        }

        // Check whether the 30-minute verification window has expired
        if (!user.resetVerificationExpires ||Date.now() > user.resetVerificationExpires.getTime()) {

            return res.status(400).json({
                message: "Request a new OTP. Your password reset session has expired."
            })
        }

        // Hash the new password before saving it
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword

        // Clear the OTP data so it cannot be reused
        user.resetOTP = null
        user.isOTPVerified = false
        user.OTPExpires = null
        user.resetVerificationExpires = null

        await user.save()

        return res.status(200).json({
            message: "Password Reset Successful"
        })

    } catch (error) {
        // Log the error for debugging
        console.error("Reset Password Error:", error.message)

        return res.status(500).json({
            message: "An unexpected error occurred while resetting the password"
        })
    }
}





// Account linking controllers








export { registerUser, loginUser, googleAuth, getUser, logOut, sendOTP, verifyOTP, resetPassword }