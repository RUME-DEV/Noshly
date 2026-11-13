
import multer from 'multer'

// Only allow supported image formats
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ]

    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true)
    }

    // Reject unsupported file types
    const error = new Error('Only JPG, PNG and WebP images are allowed')
    error.status = 400
    cb(error)
}


// Configure multer
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter
})

// Shared middleware for a single image upload
const uploadImage = upload.single('image')


export default uploadImage