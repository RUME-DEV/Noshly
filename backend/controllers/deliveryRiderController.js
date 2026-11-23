import mongoose from 'mongoose'
import DeliveryRider from "../models/deliveryRiderModel.js"
import Order from "../models/orderModel.js"
import User from "../models/userModel.js"




// Apply To Be A Rider
const applyAsRider = async (req, res) => {
    try {
        
        // Get mobile number from the request body
        const mobile = req.body.mobile?.trim()

        if (!mobile) {
            return res.status(400).json({
                message: "Mobile number is required"
            })
        }

        // 1. Check for an existing rider profile
        const existingApplication = await DeliveryRider.findOne({
            user: req.user.id
        })

        // 2. Handle existing applications
        if (existingApplication) {

            if (existingApplication.status === "pending") {
                return res.status(409).json({
                    message: "Your application is already pending"
                })
            }

            if (existingApplication.status === "approved") {
                return res.status(409).json({
                    message: "You are already an approved rider"
                })
            }

            // Update the user's existing mobile number
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { mobile }
            )

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }

            // 3. Allow rejected applicants to reapply
            existingApplication.status = "pending"
            existingApplication.approvedBy = undefined
            existingApplication.approvedAt = undefined

            await existingApplication.save()

            return res.status(200).json({
                message: "Rider application resubmitted successfully",
                application: existingApplication
            })
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { mobile }
        )

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // 4. Create a new application if none exists
        const riderApplication = await DeliveryRider.create({
            user: req.user.id
        })

        return res.status(201).json({
            message: "Rider application submitted successfully",
            application: riderApplication
        })

    } catch (error) {
        console.error("Apply as rider error:", error)

        return res.status(500).json({
            message: "Failed to submit rider application"
        })
    }
}




// Retrieve the logged-in user's rider profile
const getMyRiderProfile = async (req, res) => {
    try {
        // 1. Find the rider profile belonging to the logged-in user
        const riderProfile = await DeliveryRider.findOne({
            user: req.user.id
        })
            .populate("user", "fullName email mobile")
            .populate("approvedBy", "fullName email")

        // 2. Check whether the user has a rider profile
        if (!riderProfile) {
            return res.status(404).json({
                message: "Rider profile not found. Please apply first."
            })
        }

        return res.status(200).json({
            message: "Rider profile retrieved successfully",
            riderProfile
        })
    } catch (error) {
        console.error("Get My Rider Profile Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while retrieving your rider profile"
        })
    }
}





// Retrieve all rider applications (Admin only)
const getAllRiderApplications = async (req, res) => {
    try {
        // 1. Check whether the logged-in user is an administrator
        const isAdmin = ["admin", "superAdmin"].includes(req.user.role)

        if (!isAdmin) {
            return res.status(403).json({
                message: "You are not authorized to view rider applications"
            })
        }

        // 2. Get the optional status filter
        const { status } = req.query

        const filter = {}

        if (status) {
            // Only allow valid application statuses
            if (!["pending", "approved", "rejected"].includes(status)) {
                return res.status(400).json({
                    message: "Invalid application status"
                })
            }

            filter.status = status
        }

        // 3. Retrieve rider applications with applicant and reviewer details
        const applications = await DeliveryRider.find(filter)
            .populate("user", "fullName email mobile")
            .populate("approvedBy", "fullName email")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            message: "Rider applications retrieved successfully",
            count: applications.length,
            applications
        })
    } catch (error) {
        console.error("Get All Rider Applications Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while retrieving rider applications"
        })
    }
}




// Approve or reject a rider application (Admin only)
const reviewRiderApplication = async (req, res) => {
    try {
        // 1. Check whether the logged-in user is an administrator
        const isAdmin = ["admin", "superAdmin"].includes(req.user.role)

        if (!isAdmin) {
            return res.status(403).json({
                message: "You are not authorized to review rider applications"
            })
        }

        // 2. Get the application ID and requested decision
        const { riderId } = req.params
        const { status } = req.body

        // 3. Validate the application ID
        if (!mongoose.Types.ObjectId.isValid(riderId)) {
            return res.status(400).json({
                message: "Invalid Rider Application ID"
            })
        }

        // 4. Validate the requested decision
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be approved or rejected"
            })
        }

        // 5. Retrieve the rider application
        const riderApplication = await DeliveryRider.findById(riderId)

        if (!riderApplication) {
            return res.status(404).json({
                message: "Rider application not found"
            })
        }

        // 6. Prevent an already reviewed application from being reviewed again
        if (riderApplication.status !== "pending") {
            return res.status(400).json({
                message: "This rider application has already been reviewed"
            })
        }

        // 7. Update the application
        riderApplication.status = status

        if (status === "approved") {
            riderApplication.approvedBy = req.user.id
            riderApplication.approvedAt = new Date()
        } else {
            riderApplication.approvedBy = undefined
            riderApplication.approvedAt = undefined
        }

        await riderApplication.save()

        return res.status(200).json({
            message: `Rider application ${status} successfully`,
            riderApplication
        })
    } catch (error) {
        console.error("Review Rider Application Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while reviewing the application"
        })
    }
}





// Retrieve available deliveries for approved riders
const getAvailableDeliveries = async (req, res) => {
    try {
        // 1. Check whether the user has an approved rider profile
        const riderProfile = await DeliveryRider.findOne({
            user: req.user.id,
            status: "approved"
        })

        if (!riderProfile) {
            return res.status(403).json({
                message: "Only approved riders can view available deliveries"
            })
        }

        // 2. Find orders ready for pickup that have no assigned rider
        const availableDeliveries = await Order.find({
            status: "readyForPickup",
            deliveryRider: null
        })
            .select(
                "shop items subtotal deliveryFee totalAmount createdAt deliveryAddress.city deliveryAddress.state"
            )
            .populate("shop", "name city state")
            .sort({ createdAt: 1 })

        return res.status(200).json({
            message: "Available deliveries retrieved successfully",
            count: availableDeliveries.length,
            deliveries: availableDeliveries
        })
    } catch (error) {
        console.error("Get Available Deliveries Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while retrieving available deliveries"
        })
    }
}




// Assign an available order to the logged-in rider
const assignRiderToOrder = async (req, res) => {
    try {
        // 1. Get the order ID
        const { orderId } = req.params

        // 2. Validate the order ID
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Invalid Order ID"
            })
        }

        // 3. Check whether the user has an approved rider profile
        const riderProfile = await DeliveryRider.findOne({
            user: req.user.id,
            status: "approved"
        })

        if (!riderProfile) {
            return res.status(403).json({
                message: "Only approved riders can accept deliveries"
            })
        }

        // 4. Check whether the order exists
        const existingOrder = await Order.findById(orderId)

        if (!existingOrder) {
            return res.status(404).json({
                message: "Order Not Found"
            })
        }

        // 5. Atomically assign the order if it is still available
        const order = await Order.findOneAndUpdate(
            {
                _id: orderId,
                status: "readyForPickup",
                deliveryRider: null
            },
            {
                $set: {
                    deliveryRider: riderProfile._id
                }
            },
            {
                returnDocument: "after"
            }
        )
            .populate("shop", "name city state address")
            .populate({
                path: "deliveryRider",
                populate: {
                    path: "user",
                    select: "fullName mobile"
                }
            })

        // 6. Check whether the assignment succeeded
        if (!order) {
            return res.status(409).json({
                message: "This order is no longer available for assignment"
            })
        }

        return res.status(200).json({
            message: "Delivery assigned successfully",
            order
        })
    } catch (error) {
        console.error("Assign Rider To Order Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while assigning the delivery"
        })
    }
}




// Get deliveries assigned to the logged-in rider
const getMyDeliveries = async (req, res) => {
    try {
        // 1. Find the rider's approved profile
        const riderProfile = await DeliveryRider.findOne({
            user: req.user.id,
            status: "approved"
        })

        if (!riderProfile) {
            return res.status(403).json({
                message: "You are not an approved delivery rider"
            })
        }

        // 2. Find orders assigned to this rider
        const deliveries = await Order.find({
            deliveryRider: riderProfile._id
        })
            .populate("shop", "name image city state address")
            .populate("customer", "fullName email mobile")
            .sort({ createdAt: -1 })

        // 3. Return the deliveries
        return res.status(200).json({
            count: deliveries.length,
            deliveries
        })

    } catch (error) {
        console.error("Get my deliveries error:", error)

        return res.status(500).json({
            message: "Failed to fetch your deliveries"
        })
    }
}





export {
    applyAsRider,
    getMyRiderProfile,
    getAllRiderApplications,
    reviewRiderApplication,
    getAvailableDeliveries,
    assignRiderToOrder,
    getMyDeliveries
}