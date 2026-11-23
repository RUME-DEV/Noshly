import express from "express"

import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    confirmCashPayment,
    getShopOrders
} from "../controllers/orderController.js"

import auth from "../middlewares/auth.js"

const orderRouter = express.Router()


orderRouter.use(auth)

// Create a new order
orderRouter.post("/", createOrder)

// Retrieve all orders belonging to the logged-in customer
orderRouter.get("/my-orders", getMyOrders)

// Update an order's status
orderRouter.patch("/:orderId/status", updateOrderStatus)

// Cancel an order
orderRouter.patch("/:orderId/cancel", cancelOrder)

// Retrieve orders belonging to the logged-in shop owner
orderRouter.get("/shop-orders", getShopOrders)

// Retrieve a specific order
orderRouter.get("/:orderId", getOrderById)

// Confirm Cash on Delivery payment
orderRouter.patch("/:orderId/confirm-cash", confirmCashPayment)



export default orderRouter