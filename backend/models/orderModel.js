import mongoose from "mongoose"


// OrderItem schema is defined as a subdocument schema to be used within the Order schema. 
// It represents an individual item in an order

const orderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0.01
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    }

}, { _id: false })


const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },

    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            // Custom validator to ensure that the items array is not empty
            validator: function (items) {
                return items.length > 0
            },
            message: "An order must contain at least one item"
        }
    },

    deliveryAddress: {
        street: {
            type: String,
            required: true,
            trim: true
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
        }
    },

    applicationFee: { 
        type: Number, 
        required: true, min: 0 
    },

    deliveryRider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryRider"
    },

    subtotal: {
        type: Number,
        required: true,
        min: 0
    },

    deliveryFee: {
        type: Number,
        required: true,
        min: 0
    },

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    shopEarnings: { 
        type: Number,
        required: true, 
        min: 0 
    },

    status: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "preparing",
            "readyForPickup",
            "pickedUp",
            "delivered",
            "cancelled"
        ],
        default: "pending"
    },

    // Store the reason an order was cancelled
    cancellationReason: {
        type: String,
        trim: true
    },

    // Track who cancelled the order
    cancelledBy: {
        type: String,
        enum: ['customer', 'shopOwner']
    },

    paymentMethod: {
        type: String,
        enum: ["cash", "online"],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending"
    },

    cashCollectedAt: {
        type: Date
    },

}, { timestamps: true })


const Order = mongoose.model("Order", orderSchema)

export default Order