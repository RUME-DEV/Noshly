import mongoose from "mongoose"

import User from "../models/userModel.js"
import Shop from "../models/shopModel.js"
import Order from "../models/orderModel.js"





// Check whether the logged-in user is an admin or superAdmin
const isAdmin = (role) => {
    return ["admin", "superAdmin"].includes(role)
}

const isSuperAdmin = (role) => {
    return role === "superAdmin"
}




// Get all registered users
const getAllUsers = async (req, res) => {
    try {
        // 1. Check admin permission
        if (!isAdmin(req.user.role)) {
            return res.status(403).json({
                message: "You are not authorized to view users"
            })
        }

        // 2. Fetch users
        const users = await User.find()
            .select("fullName email mobile role isSuspended suspensionReason suspendedAt suspendedBy createdAt")
            .populate("suspendedBy", "fullName email")
            .sort({ createdAt: -1 })

        // 3. Return users
        return res.status(200).json({
            count: users.length,
            users
        })

    } catch (error) {
        console.error("Get all users error:", error)

        return res.status(500).json({
            message: "Failed to fetch users"
        })
    }
}




// Get all shops on the platform
const getAllShops = async (req, res) => {
    try {
        // 1. Check admin permission
        if (!isAdmin(req.user.role)) {
            return res.status(403).json({
                message: "You are not authorized to view shops"
            })
        }

        // 2. Fetch shops
        const shops = await Shop.find()
            .populate("owner", "fullName email mobile")
            .sort({ createdAt: -1 })

        // 3. Return shops
        return res.status(200).json({
            count: shops.length,
            shops
        })

    } catch (error) {
        console.error("Get all shops error:", error)

        return res.status(500).json({
            message: "Failed to fetch shops"
        })
    }
}




// Get all orders on the platform
const getAllOrders = async (req, res) => {
    try {
        // 1. Check admin permission
        if (!await isAdmin(req.user.role)) {
            return res.status(403).json({
                message: "You are not authorized to view orders"
            })
        }

        // 2. Fetch orders
        const orders = await Order.find()
            .populate("customer", "fullName email mobile")
            .populate("shop", "name city state")
            .populate({
                path: "deliveryRider",
                populate: {
                    path: "user",
                    select: "fullName email mobile"
                }
            })
            .sort({ createdAt: -1 })

        // 3. Return orders
        return res.status(200).json({
            count: orders.length,
            orders
        })

    } catch (error) {
        console.error("Get all orders error:", error)

        return res.status(500).json({
            message: "Failed to fetch orders"
        })
    }
}




// Get platform dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // 1. Check admin permission
        if (!isAdmin(req.user.role)) {
            return res.status(403).json({
                message: "You are not authorized to view dashboard statistics"
            })
        }

        // 2. Count platform records
        const totalUsers = await User.countDocuments()
        const totalShops = await Shop.countDocuments()
        const totalOrders = await Order.countDocuments()

       // 3. Calculate statistics from delivered orders
        const orderStats = await Order.aggregate([
            // Only include delivered orders
            {
                $match: {
                    status: "delivered"
                }
            },

            // Calculate the totals
            {
                $group: {
                    _id: null,

                    totalCommission: {
                        $sum: "$applicationFee"
                    },

                    totalSales: {
                        $sum: "$subtotal"
                    },

                    completedOrders: {
                        $sum: 1
                    }
                }
            }
        ])

        // 4. Provide default values if there are no delivered orders
        const stats = orderStats[0] || {
            totalCommission: 0,
            totalSales: 0,
            completedOrders: 0
        }
        
        // 5. Return dashboard statistics
        return res.status(200).json({
            totalUsers,
            totalShops,
            totalOrders,
            completedOrders: stats.completedOrders,
            totalCommission: stats.totalCommission,
            totalSales: stats.totalSales
        })

    } catch (error) {
        console.error("Get dashboard stats error:", error)

        return res.status(500).json({
            message: "Failed to fetch dashboard statistics"
        })
    }
}





// Promote an existing user to admin
const makeAdmin = async (req, res) => {
    try {
        // 1. Check superAdmin permission
        if (!isSuperAdmin(req.user.role)) {
            return res.status(403).json({
                message: "Only a superAdmin can appoint admins"
            })
        }

        // 2. Get and validate user ID
        const { userId } = req.params

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            })
        }

        // 3. Find the user
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // 4. Prevent unnecessary role changes
        if (user.role === "admin") {
            return res.status(409).json({
                message: "User is already an admin"
            })
        }

        if (user.role === "superAdmin") {
            return res.status(400).json({
                message: "User is already a superAdmin"
            })
        }

        // 5. Update role
        user.role = "admin"
        await user.save()

        // 6. Return updated user
        return res.status(200).json({
            message: "User successfully appointed as admin",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.error("Make admin error:", error)

        return res.status(500).json({
            message: "Failed to appoint admin"
        })
    }
}




// Remove admin privileges from a user
const removeAdmin = async (req, res) => {
    try {
        // 1. Check superAdmin permission
        if (!isSuperAdmin(req.user.role)) {
            return res.status(403).json({
                message: "Only a superAdmin can remove admins"
            })
        }

        // 2. Get and validate user ID
        const { userId } = req.params

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            })
        }

        // 3. Find the user
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // 4. Prevent changing superAdmin privileges
        if (user.role === "superAdmin") {
            return res.status(403).json({
                message: "SuperAdmin privileges cannot be removed here"
            })
        }

        if (user.role !== "admin") {
            return res.status(400).json({
                message: "This user is not an admin"
            })
        }

        // 5. Restore normal user role
        user.role = "user"
        await user.save()

        // 6. Return updated user
        return res.status(200).json({
            message: "Admin privileges successfully removed",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.error("Remove admin error:", error)

        return res.status(500).json({
            message: "Failed to remove admin privileges"
        })
    }
}





const updateUserStatus = async (req, res) => {
    try {
        // 1. Check admin permission
        const allowed = isAdmin(req.user.role)

        if (!allowed) {
            return res.status(403).json({
                message: "Only admins can manage user accounts"
            })
        }

        // 2. Get the target user ID and requested status
        const { userId } = req.params
        const { isSuspended, suspensionReason } = req.body

        // 3. Validate the user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            })
        }

        // 4. Validate the requested status
        if (typeof isSuspended !== "boolean") {
            return res.status(400).json({
                message: "isSuspended must be true or false"
            })
        }

        // 5. Find the target user
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // 6. Protect admin accounts
        if (user.role === "admin" || user.role === "superAdmin") {
            return res.status(403).json({
                message: "Admin accounts cannot be suspended through this endpoint"
            })
        }

        // 7. Handle suspension
        if (isSuspended) {
            if (user.isSuspended) {
                return res.status(409).json({
                    message: "User is already suspended"
                })
            }

            if (!suspensionReason?.trim()) {
                return res.status(400).json({
                    message: "A suspension reason is required"
                })
            }

            user.isSuspended = true
            user.suspensionReason = suspensionReason.trim()
            user.suspendedAt = new Date()
            user.suspendedBy = req.user.id
        }

        // 8. Handle reactivation
        else {
            if (!user.isSuspended) {
                return res.status(409).json({
                    message: "User is not currently suspended"
                })
            }

            user.isSuspended = false
            user.suspensionReason = undefined
            user.suspendedAt = undefined
            user.suspendedBy = undefined
        }

        // 9. Save the changes
        await user.save()

        // 10. Return the updated account status
        return res.status(200).json({
            message: isSuspended
                ? "User suspended successfully"
                : "User reactivated successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                isSuspended: user.isSuspended,
                suspensionReason: user.suspensionReason,
                suspendedAt: user.suspendedAt
            }
        })

    } catch (error) {
        console.error("Update user status error:", error)

        return res.status(500).json({
            message: "Failed to update user status"
        })
    }
}





export {
    getDashboardStats,
    getAllUsers,
    getAllShops,
    getAllOrders,
    makeAdmin,
    removeAdmin,
    updateUserStatus
}