import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    // required is set to true or false depending on the value of googleId
    password: {
        type: String,
        required: function () {
            return !this.googleId
        },
        select: false
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true
    },

    googleAuth: {
        type: Boolean,
        default: false
    },

    mobile: {
        type: String,
        trim: true
    },

    role: {
        type: String,
        enum: ['user', 'admin', 'superAdmin'],
        default: 'user',
        required: true
    },

    resetOTP: {
        type: String,
        select: false
    },

    isOTPVerified: {
        type: Boolean,
        default: false,
        select: false
    },

    OTPExpires: {
        type: Date,
        select: false
    },

    resetVerificationExpires: {
        type: Date,
        select: false
    },
    
    isSuspended: {
        type: Boolean,
        default: false
    },

    suspensionReason: {
        type: String,
        trim: true
    },

    suspendedAt: {
        type: Date
    },
    
    suspendedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true })


const User = mongoose.model("User", userSchema)

export default User