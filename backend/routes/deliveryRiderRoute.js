import express from "express"
import auth from "../middlewares/auth.js"

import {
    applyAsRider,
    getMyRiderProfile,
    getAllRiderApplications,
    reviewRiderApplication,
    getAvailableDeliveries,
    assignRiderToOrder,
    getMyDeliveries
} from "../controllers/deliveryRiderController.js"



const deliveryRiderRouter = express.Router()


// Require authentication for all routes
deliveryRiderRouter.use(auth)

// Rider application
deliveryRiderRouter.post("/apply", applyAsRider)
deliveryRiderRouter.get("/my-profile", getMyRiderProfile)

// Admin rider application management
deliveryRiderRouter.get("/applications", getAllRiderApplications)
deliveryRiderRouter.patch("/applications/:riderId", reviewRiderApplication)

// Rider deliveries
deliveryRiderRouter.get("/available-deliveries", getAvailableDeliveries)
deliveryRiderRouter.get("/my-deliveries", getMyDeliveries)
deliveryRiderRouter.patch("/assign/:orderId", assignRiderToOrder)



export default deliveryRiderRouter