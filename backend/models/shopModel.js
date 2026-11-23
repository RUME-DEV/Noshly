import mongoose from "mongoose"

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    image: {
        type: String,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    state: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isSuspended: {
        type: Boolean,
        default: false,
    },

    suspensionReason: {
        type: String,
        trim: true,
    },

    suspendedAt: {
        type: Date,
    },
    
    suspendedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

}, { timestamps: true })


const Shop = mongoose.model("Shop", shopSchema)

export default Shop