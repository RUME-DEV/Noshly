import express from "express"
import auth from "../middlewares/auth.js"

import {
    getDashboardStats,
    getAllUsers,
    getAllShops,
    getAllOrders,
    makeAdmin,
    removeAdmin,
    updateUserStatus,
    updateShopStatus
} from "../controllers/adminController.js"


const adminRouter = express.Router()

// Middleware to protect admin routes
adminRouter.use(auth)


// Dashboard statistics
adminRouter.get("/dashboard-stats", getDashboardStats)

// User management
adminRouter.get("/users", getAllUsers)
adminRouter.patch("/users/:userId/status", updateUserStatus) // Suspend or unsuspend a user

// Shop management
adminRouter.get("/shops", getAllShops)
adminRouter.patch("/shops/:shopId/status", updateShopStatus) // Suspend or reactivate a shop

// Order management
adminRouter.get("/orders", getAllOrders)

// Admin management (superAdmin only)
adminRouter.patch("/make-admin/:userId", makeAdmin)
adminRouter.patch("/remove-admin/:userId", removeAdmin)


export default adminRouter