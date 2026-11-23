import Item from "../models/itemModels.js";
import Shop from "../models/shopModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js"
import mongoose from "mongoose"
import deleteTempFile from "../utils/deleteTempFile.js"




// Add Item
const addItem = async (req, res) => {
    try {
        // Get the shop ID and item details
        const { shopId } = req.params
        const { name, category, foodType, price } = req.body

        // Validate the shop ID
        if (!mongoose.isValidObjectId(shopId)) {
            return res.status(400).json({
                message: "Invalid shop ID"
            })
        }

        // Validate the required item details
        if (!name || !category || !foodType || !price) {
            return res.status(400).json({
                message: "Name, category, foodType, and price are required"
            })
        }

        // Ensure an item image was uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Item Image is required"
            })
        }

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

        // Prevent adding items to a closed shop
        if (shop.isActive === false) {
            return res.status(409).json({
                message: "You cannot add items to a closed shop"
            })
        }

        // Upload the item image to Cloudinary
        const upload = await uploadOnCloudinary(req.file.path)

        if (!upload?.secure_url) {
            return res.status(502).json({
                message: "Item Image Upload Failed"
            })
        }

        // Create the item and associate it with the shop
        const item = await Item.create({
            name,
            category,
            foodType,
            price,
            image: upload.secure_url,
            shop: shop._id
        })

        // Return the newly created item
        return res.status(201).json({
            message: "Item added successfully",
            item
        })

    } catch (err) {
        console.error("Add Item Error:", err)

        return res.status(500).json({
            message: "An unexpected error occurred while adding the item"
        })
    } finally {
        // Always clean up the temporary image
        await deleteTempFile(req.file?.path)
    }
}




// Edit Item
const editItem = async (req, res) => {
    try {
        // Get the item ID and updated details
        const { itemId } = req.params
        const { name, category, foodType, price } = req.body

        // Validate the item ID
        if (!mongoose.isValidObjectId(itemId)) {
            return res.status(400).json({
                message: "Invalid item ID"
            })
        }

        // Find the item
        const item = await Item.findById(itemId)

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            })
        }

        // Check that the logged-in user owns the item's shop
        const shop = await Shop.findOne({
            _id: item.shop,
            owner: req.user.id
        })

        if (!shop) {
            return res.status(404).json({
                message: "Item not found"
            })
        }

        // Prepare the fields to update
        const updateData = {
            ...(name && { name }),
            ...(category && { category }),
            ...(foodType && { foodType }),
            ...(price && { price })
        }

        // Upload a new image if one was provided
        if (req.file) {
            const upload = await uploadOnCloudinary(req.file.path)

            if (!upload?.secure_url) {
                return res.status(502).json({
                    message: "Item image upload failed"
                })
            }

            updateData.image = upload.secure_url
        }

        // Ensure at least one field was provided
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Provide at least one field to update"
            })
        }

        // Update the item and return the updated document
        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            updateData,
            { returnDocument: "after", runValidators: true }
        )

        return res.status(200).json({
            message: "Item updated successfully",
            item: updatedItem
        })

    } catch (err) {
        console.error("Edit Item Error:", err)

        return res.status(500).json({
            message: "An unexpected error occurred while updating the item"
        })
    } finally {
        // Always clean up the temporary image
        await deleteTempFile(req.file?.path)
    }
}





// Delete Item
const deleteItem = async (req, res) => {
    try {
        // Get the item ID from the request parameters
        const { itemId } = req.params

        // Validate the item ID
        if (!mongoose.isValidObjectId(itemId)) {
            return res.status(400).json({
                message: "Invalid item ID"
            })
        }

        // Find the item
        const item = await Item.findById(itemId)

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            })
        }

        // Check that the logged-in user owns the item's shop
        const shop = await Shop.findOne({
            _id: item.shop,
            owner: req.user.id
        })

        if (!shop) {
            return res.status(404).json({
                message: "Item not found"
            })
        }

        // Delete the item
        await Item.findByIdAndDelete(itemId)

        // Return a success message
        return res.status(200).json({
            message: "Item deleted successfully"
        })

    } catch (err) {
        console.error("Delete Item Error:", err)

        return res.status(500).json({
            message: "An unexpected error occurred while deleting the item"
        })
    }
}





export { addItem, editItem, deleteItem }