import { v2 as cloudinary } from 'cloudinary'

const uploadOnCloudinary = async (filePath) => {
    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    try {
        // Check whether a file path was provided
        if (!filePath) return null

        // Upload the image to Cloudinary
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })

        return response

    } catch (error) {
        console.error("Cloudinary Upload Error:", error)
        return null
    }
}

export default uploadOnCloudinary
