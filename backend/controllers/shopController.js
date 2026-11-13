import Shop from "../models/shopModel.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import Item from "../models/itemModels.js"
import deleteTempFile from "../utils/deleteTempFile.js"




// Create a new shop
const createShop = async (req, res) => {
    try {

        // Get shop details from the request body
        const { name, city, state, address } = req.body

        // Check that all required fields are provided
        if (!name || !city || !state || !address) {

            return res.status(400).json({
                message: "Name, city, state, and address are required"
            })
        }

        // Ensure a shop image was uploaded
        if (!req.file) {

            return res.status(400).json({
                message: "Shop image is required"
            })
        }

        // Upload the image to Cloudinary
        const upload = await uploadOnCloudinary(req.file.path)

        // Check whether the image upload was successful
        if (!upload?.secure_url) {

            return res.status(502).json({
                message: "Shop image upload failed"
            })
        }

        // Create the shop and assign it to the logged-in user
        const shop = await Shop.create({
            name,
            city,
            state,
            address,
            image: upload.secure_url,
            owner: req.user.id
        })

        // Return the newly created shop
        return res.status(201).json({
            message: "Shop created successfully",
            shop
        })

    } catch (error) {
        console.error("Create Shop Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while creating the shop"
        })
    } finally {
        // Always clean up the temporary image
        await deleteTempFile(req.file?.path)
    }
}




// Get all shops or filter shops by city
const getShops = async (req, res) => {
    try {
        const { city } = req.query

        // Escape special regex characters in the city name ("." becomes "\.")
        const escapeRegex = (value) => {
            return value.replace(/[.*+?^${}()|\[\]\\]/g, "\\$&")
        }

        // Filter by city if provided; otherwise, fetch all shops
        const query = city
            ? {
                isActive: true,
                city: { $regex: new RegExp(`^${escapeRegex(city)}$`, "i") }
            }
            : { isActive: true }

        const shops = await Shop.find(query).sort({ createdAt: -1 })

        // If no shops are found, return a 404 response
        if (shops.length === 0) {
            return res.status(404).json({
                message: "No Shops Found"
            })
        }

        return res.status(200).json(shops)

    } catch (error) {
        console.error("Get Shops Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while fetching shops"
        })
    }
}




// Get a single shop and its food items
const getShopAndItemsById = async (req, res) => {
    try {
        // Get the shop ID from the request parameters
        const { shopId } = req.params

        // Find the shop using its ID
        const shop = await Shop.findOne({
            _id: shopId,
            isActive: true
        })

        // Check whether the shop exists
        if (!shop) {
            return res.status(404).json({
                message: "Shop not found"
            })
        }

        // Find all food items belonging to this shop
        const items = await Item.find({ shop: shopId })

        // Return the shop details and its items
        return res.status(200).json({
            shop,
            items
        })

    } catch (error) {
        console.error("Get Shop by ID Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while fetching the shop"
        })
    }
}




// Update a shop owned by the logged-in user
const updateShop = async (req, res) => {
    try {
        // Get the shop ID and updated details
        const { shopId } = req.params
        const { name, city, state, address } = req.body

        // Find the shop and verify ownership
        const shop = await Shop.findOne({
            _id: shopId,
            owner: req.user.id
        })

        if (!shop) {
            return res.status(404).json({
                message: "Shop Not Found"
            })
        }

        // Prepare the fields to update
        const updateData = {
            ...(name && { name }),
            ...(city && { city }),
            ...(state && { state }),
            ...(address && { address })
        }

        // Upload a new image if one was provided
        if (req.file) {
            const upload = await uploadOnCloudinary(req.file.path)

            if (!upload?.secure_url) {
                return res.status(502).json({
                    message: "Shop Image Upload Failed"
                })
            }

            updateData.image = upload.secure_url
        }

        // Ensure at least one field was provided
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No Updates Provided"
            })
        }

        // Update the shop
        const updatedShop = await Shop.findOneAndUpdate(
            { _id: shopId, owner: req.user.id },
            updateData,
            { returnDocument: "after", runValidators: true }
        )

        return res.status(200).json({
            message: "Shop Updated Successfully",
            shop: updatedShop
        })

    } catch (error) {
        console.error("Update Shop Error:", error)
        return res.status(500).json({
            message: "An unexpected error occurred while updating the shop"
        })
    } finally {
        // Always clean up the temporary image
        await deleteTempFile(req.file?.path)
    }
}




// Close or reopen a shop
const updateShopStatus = async (req, res) => {
    try {
        // 1. Get shop ID and requested status
        const { shopId } = req.params
        const { isActive } = req.body

        // 2. Validate the requested status
        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                message: "isActive must be true or false"
            })
        }

        // 3. Find the shop and verify ownership
        const shop = await Shop.findOne({
            _id: shopId,
            owner: req.user.id
        })

        if (!shop) {
            return res.status(404).json({
                message: "Shop not found"
            })
        }

        // 4. Update the shop status
        shop.isActive = isActive
        await shop.save()

        return res.status(200).json({
            message: isActive
                ? "Shop reopened successfully"
                : "Shop closed successfully",
            shop
        })

    } catch (error) {
        console.error("Update Shop Status Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while updating shop status"
        })
    }
}




// Get all shops owned by the logged-in user
const getMyShops = async (req, res) => {
    try {
        // Find every shop belonging to this user
        const shops = await Shop.find({
            owner: req.user.id
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            shops
        })

    } catch (error) {
        console.error("Get My Shops Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while fetching your shops"
        })
    }
}





// Get one shop owned by the logged-in user and its food items
const getMyShopById = async (req, res) => {
    try {
        // 1. Get the shop ID from the URL.
        const { shopId } = req.params

        // 2. Find the shop and verify ownership.
        const shop = await Shop.findOne({
            _id: shopId,
            owner: req.user.id
        })

        if (!shop) {
            return res.status(404).json({
                message: "Shop not found"
            })
        }

        // 3. Get all food items belonging to this shop.
        const items = await Item.find({ shop: shopId })
            .sort({ createdAt: -1 })

        // 4. Return the shop and its items.
        return res.status(200).json({
            shop,
            items
        })

    } catch (error) {
        console.error("Get My Shop Error:", error)

        return res.status(500).json({
            message: "An unexpected error occurred while fetching your shop"
        })
    }
}








export {
    createShop,
    getShops,
    getShopAndItemsById,
    updateShop,
    updateShopStatus,
    getMyShops,
    getMyShopById
}