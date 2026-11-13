import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'

import connectDB from './config/db.js'
import userRouter from './routes/userRoute.js'
import shopRouter from './routes/shopRoute.js'
import itemRouter from './routes/itemRoute.js'
import orderRouter from "./routes/orderRoute.js"
import deliveryRiderRouter from "./routes/deliveryRiderRoute.js"
import adminRouter from "./routes/adminRoute.js"


// Load environment variables
dotenv.config()

const app = express()

// Parse incoming JSON requests
app.use(express.json())

// Allow requests from the frontend and enable cookies
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))

// Read cookies from incoming requests
app.use(cookieParser())

// Register application routes
app.use('/user', userRouter)
app.use('/shop', shopRouter)
app.use('/item', itemRouter)
app.use("/order", orderRouter)
app.use("/delivery-rider", deliveryRiderRouter)
app.use("/admin", adminRouter)


// Handle requests to routes that don't exist
app.use((req, res) => {
    return res.status(404).json({
        message: "Route not found"
    })
})

// Handle errors from middleware and routes
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message)

    // Check if the error is a Multer error (file upload error)
    const statusCode = err instanceof multer.MulterError
        ? 400
        : err.status || 500

    return res.status(statusCode).json({
        message: statusCode === 500
            ? "An unexpected server error occurred"
            : err.message
    })
})


// Set the server port
const port = process.env.PORT || 3000



// Connect to MongoDB before starting the server
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server Is Running On Port: ${port}`)
        })
    })
    .catch((error) => {
        console.error("Server startup failed:", error.message)
        process.exit(1)
    })