import Order from "../models/orderModel.js"
import Item from "../models/itemModels.js"
import Shop from "../models/shopModel.js"
import DeliveryRider from "../models/deliveryRiderModel.js"
import mongoose from "mongoose"

const DELIVERY_FEE = 1000


// Create Order
const createOrder = async (req, res) => {
    try {
        const { shop, items, deliveryAddress, paymentMethod } = req.body

        // 1. Validate required order details
        if (
            !shop ||
            !Array.isArray(items) ||
            items.length === 0 ||
            !deliveryAddress?.street?.trim() ||
            !deliveryAddress?.city?.trim() ||
            !deliveryAddress?.state?.trim() ||
            !paymentMethod
        ) {
            return res.status(400).json({
                message: "Please provide all required order details"
            })
        }

        // 2. Validate shop ID and payment method
        if (!mongoose.Types.ObjectId.isValid(shop)) {
            return res.status(400).json({
                message: "Invalid Shop ID"
            })
        }

        if (paymentMethod !== "cash") {
            return res.status(400).json({
                message: "Invalid Payment Method"
            })
        }

        // 3. Find the shop and populate its owner only if the account isn't suspended
        const existingShop = await Shop.findById(shop).populate({
            path: 'owner',
            match: { isSuspended: false },
            select: '_id'
        })

        if (!existingShop) {
            return res.status(404).json({
                message: "Shop Not Found"
            })
        }

        // 4. Check whether the shop owner is suspended
        if (!existingShop.owner) {
            return res.status(409).json({
                message: "This shop's owner account is suspended and cannot accept orders"
            })
        }

        // 5. Check whether the shop is active
        if (existingShop.isActive === false) {
            return res.status(409).json({
                message: "Shop is currently inactive and cannot accept orders"
            })
        }

        // 6. Prevent orders from being placed with an admin-suspended shop
        if (existingShop.isSuspended) {
            return res.status(409).json({
                message: "This shop is currently suspended and cannot accept orders"
            })
        }

        // 7. Validate item IDs and quantities
        for (const orderItem of items) {
            if (
                !orderItem.item ||
                !mongoose.Types.ObjectId.isValid(orderItem.item) ||
                !Number.isInteger(orderItem.quantity) ||
                orderItem.quantity < 1
            ) {
                return res.status(400).json({
                    message: "Each item must have a valid ID and quantity"
                })
            }
        }

        // 8. Reject duplicate items
        const itemIds = items.map(orderItem => orderItem.item)
        const uniqueItemIds = new Set(itemIds.map(id => id.toString()))

        if (uniqueItemIds.size !== itemIds.length) {
            return res.status(400).json({
                message: "Each item should appear only once in an order"
            })
        }

        // 9. Retrieve requested items belonging to this shop
        const shopItems = await Item.find({
            _id: { $in: itemIds },
            shop
        })

        if (shopItems.length !== items.length) {
            return res.status(400).json({
                message: "One or more items do not belong to this shop or no longer exist"
            })
        }

        // 10. Build order items using database prices
        const orderItems = items.map(orderItem => {
            const databaseItem = shopItems.find(
                item => item._id.toString() === orderItem.item.toString()
            )

            return {
                item: databaseItem._id,
                name: databaseItem.name,
                price: databaseItem.price,
                quantity: orderItem.quantity
            }
        })

        // 11. Calculate subtotal, application fee, delivery fee, total amount, and shop earnings
        const subtotal = orderItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )

        const applicationFee = Math.round(subtotal * 0.10)
        const deliveryFee = DELIVERY_FEE
        const totalAmount = subtotal + deliveryFee
        const shopEarnings = subtotal - applicationFee

        // 12. Save the order
        const order = await Order.create({
            customer: req.user.id,
            shop,
            items: orderItems,
            deliveryAddress: {
                street: deliveryAddress.street.trim(),
                city: deliveryAddress.city.trim(),
                state: deliveryAddress.state.trim()
            },
            subtotal,
            applicationFee,
            deliveryFee,
            totalAmount,
            shopEarnings,
            paymentMethod
        })

        return res.status(201).json({
            message: "Order placed successfully",
            order
        })
    } catch (error) {
        console.error("Create Order Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while placing the order"
        })
    }
}




// Retrieve orders for the authenticated user
const getMyOrders = async (req, res) => {
    try {
        // Retrieve orders for the authenticated user, sorted by creation date (most recent first)
        const orders = await Order.find({
            customer: req.user.id
        })
            .populate("shop", "name image city")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            message: "Orders retrieved successfully",
            orders
        })
    } catch (error) {
        console.error("Get My Orders Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while retrieving orders"
        })
    }
}




// Retrieve a specific order by ID with authorization checks
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params

        // Validate the order ID
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Invalid Order ID"
            })
        }

        // Find the order and retrieve its shop and rider details
        const order = await Order.findById(orderId)
            .populate("shop", "name image city state address owner")
            .populate({
                path: "deliveryRider",
                populate: {
                    path: "user",
                    select: "fullName mobile"
                }
            })

        if (!order) {
            return res.status(404).json({
                message: "Order Not Found"
            })
        }

        // Check whether the logged-in user is the customer
        const isCustomer =
            order.customer.toString() === req.user.id

        // Check whether the logged-in user owns the shop
        const isShopOwner =
            order.shop?.owner?.toString() === req.user.id

        // Check whether the logged-in user is the assigned rider
        const isAssignedRider =
            order.deliveryRider?.user?._id.toString() === req.user.id

        // Check whether the logged-in user is an administrator
        const isAdmin = ["admin", "superAdmin"].includes(req.user.role)

        // Allow access only to authorized users
        if (
            !isCustomer &&
            !isShopOwner &&
            !isAssignedRider &&
            !isAdmin
        ) {
            return res.status(403).json({
                message: "You are not authorized to view this order"
            })
        }

        return res.status(200).json({
            message: "Order retrieved successfully",
            order
        })
    } catch (error) {
        console.error("Get Order By ID Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while retrieving the order"
        })
    }
}




// Update an order's status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body

        // Validate the order ID
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Invalid Order ID"
            })
        }

        // Validate the requested status
        const allowedStatuses = [
            "confirmed",
            "preparing",
            "readyForPickup",
            "pickedUp",
            "delivered"
        ]

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            })
        }

        // Retrieve the order and its shop
        const order = await Order.findById(orderId).populate("shop", "owner")

        if (!order) {
            return res.status(404).json({
                message: "Order Not Found"
            })
        }

        // Check whether the user owns the shop
        const isShopOwner =
            order.shop?.owner?.toString() === req.user.id

        // Find the user's rider profile
        const riderProfile = await DeliveryRider.findOne({
            user: req.user.id,
            status: "approved"
        })

        // Check whether the rider is assigned to this order
        const isAssignedRider =
            riderProfile &&
            order.deliveryRider?.toString() === riderProfile._id.toString()

        // Check whether the requested transition is allowed
        const shopTransitions = {
            pending: "confirmed",
            confirmed: "preparing",
            preparing: "readyForPickup"
        }

        const riderTransitions = {
            readyForPickup: "pickedUp",
            pickedUp: "delivered"
        }

        // Determine if the requested transition is valid for the shop or rider
        const isShopTransition =
            shopTransitions[order.status] === status

        const isRiderTransition =
            riderTransitions[order.status] === status

        // Authorize the shop owner or assigned rider
        if (isShopTransition && !isShopOwner) {
            return res.status(403).json({
                message: "Only the shop owner can perform this update"
            })
        }

        if (isRiderTransition && !isAssignedRider) {
            return res.status(403).json({
                message: "Only the assigned, approved rider can perform this update"
            })
        }

        // Reject transitions not permitted by the order flow
        if (!isShopTransition && !isRiderTransition) {
            return res.status(400).json({
                message: `Cannot change order status from ${order.status} to ${status}`
            })
        }

        // Save the new order status
        order.status = status
        await order.save()

        return res.status(200).json({
            message: "Order status updated successfully",
            order
        })
    } catch (error) {
        console.error("Update Order Status Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while updating the order"
        })
    }
}




// Cancel an order
const cancelOrder = async (req, res) => {
    try {
        // Extract the order ID from the request parameters
        const { orderId } = req.params

        const { reason, cancelledBy } = req.body

        // Validate the order ID
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Invalid Order ID"
            })
        }

        if (!["customer", "shopOwner"].includes(cancelledBy)) {
            return res.status(400).json({
                message: `Order can't be cancelled by ${cancelledBy}`
            })
        }

        // Retrieve the order and its shop owner
        const order = await Order.findById(orderId).populate("shop", "owner")

        if (!order) {
            return res.status(404).json({
                message: "Order Not Found"
            })
        }

        // Check whether the logged-in user is the customer or the shop owner
        const isCustomer =
            order.customer.toString() === req.user.id
        
        const isShopOwner =
            order.shop?.owner?.toString() === req.user.id

        // Authorize the customer or shop owner to cancel the order
        if (!isCustomer && !isShopOwner) {
            return res.status(403).json({
                message: "You are not authorized to cancel this order"
            })
        }

        // Authorize according to the cancellation context
        if (cancelledBy === "customer" && !isCustomer) {
            return res.status(403).json({
                message: "Only the customer can cancel this order as a customer"
            })
        }

        if (cancelledBy === "shopOwner" && !isShopOwner) {
            return res.status(403).json({
                message: "Only the shop owner can cancel this order as a shop owner"
            })
        }

        // Allow cancellation only if the order is still pending
        if (order.status !== "pending") {
            return res.status(400).json({
                message: "Order cannot be canceled at this stage"
            })
        }

        // Require a reason only when cancelling as the shop owner
        if (cancelledBy === "shopOwner" && !reason?.trim()) {
            return res.status(400).json({
                message: "A cancellation reason is required"
            })
        }

        // Cancel the order and record who cancelled it
        order.status = "cancelled"
        order.cancelledBy = cancelledBy
        order.cancellationReason = reason?.trim() || undefined

        await order.save()

        // Return the updated order
        return res.status(200).json({
            message: "Order cancelled successfully",
            order
        })
    } catch (error) {

        console.error("Cancel Order Error:", error)
        return res.status(500).json({
            message: "An unexpected error occurred while cancelling the order"
        })
    }
}




// Confirm cash collection for a delivered order
const confirmCashPayment = async (req, res) => {
    try {
        const { orderId } = req.params

        // 1. Validate the order ID
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Invalid Order ID"
            })
        }

        // 2. Find the logged-in rider's approved profile
        const riderProfile = await DeliveryRider.findOne({
            user: req.user.id,
            status: "approved"
        })

        if (!riderProfile) {
            return res.status(403).json({
                message: "Only approved riders can confirm cash collection"
            })
        }

        // 3. Find the order
        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({
                message: "Order Not Found"
            })
        }

        // 4. Verify that this rider is assigned to the order
        if (order.deliveryRider?.toString() !== riderProfile._id.toString()) {
            return res.status(403).json({
                message: "You are not assigned to this order"
            })
        }

        // 5. Ensure the order has been delivered
        if (order.status !== "delivered") {
            return res.status(400).json({
                message: "Cash can only be confirmed after delivery"
            })
        }

        // 6. Ensure the order uses Cash on Delivery
        if (order.paymentMethod !== "cash") {
            return res.status(400).json({
                message: "This order does not use Cash on Delivery"
            })
        }

        // 7. Prevent duplicate payment confirmation
        if (order.paymentStatus !== "pending") {
            return res.status(409).json({
                message: "This payment cannot be confirmed"
            })
        }

        // 8. Record the cash collection
        order.paymentStatus = "paid"
        order.cashCollectedAt = new Date()

        await order.save()

        return res.status(200).json({
            message: "Cash payment confirmed successfully",
            order
        })

    } catch (error) {
        console.error("Confirm Cash Payment Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while confirming cash payment"
        })
    }
}





// Retrieve orders belonging to all shops owned by the authenticated user
const getShopOrders = async (req, res) => {
    try {
        // 1. Find all shops belonging to the logged-in owner
        const shops = await Shop.find({
            owner: req.user.id
        }).select("_id")

        if (shops.length < 1) {
            return res.status(400).json({
                message: "No Shop Found"
            })
        }

        // 2. Extract the shop IDs
        const shopIds = shops.map(shop => shop._id)

        // 3. Retrieve orders belonging to those shops
        const orders = await Order.find({
            shop: { $in: shopIds }
        })
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

        // 4. Return the retrieved orders
        return res.status(200).json({
            message: "Shop orders retrieved successfully",
            count: orders.length,
            orders
        })

    } catch (error) {
        console.error("Get Shop Orders Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while retrieving shop orders"
        })
    }
}








export { createOrder, getMyOrders, getOrderById, updateOrderStatus, cancelOrder, confirmCashPayment, getShopOrders }