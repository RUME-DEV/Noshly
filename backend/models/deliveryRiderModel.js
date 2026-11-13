import mongoose from "mongoose"

const deliveryRiderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
        required: true
    },

    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    approvedAt: {
        type: Date
    }

}, { timestamps: true })

const DeliveryRider = mongoose.model("DeliveryRider", deliveryRiderSchema)

export default DeliveryRider