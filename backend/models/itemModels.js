import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    image: {
        type: String,
        required: true
    },

    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },

    category: {
        type: String,
        enum: [
            "snacks",
            "main course",
            "dessert",
            "beverages",
            "appetizer",
            "pizza",
            "burger",
            "fast food",
            "others"
        ],
        required: true
    },

    price: {
        type: Number,
        min: 0.01,
        required: true
    },

    foodType: {
        type: String,
        enum: ["Vegetarian", "Non-Vegetarian"],
        required: true
    }

}, { timestamps: true })


const Item = mongoose.model("Item", itemSchema)

export default Item