
import { redirect } from 'react-router-dom'
import api from '../services/api'

async function createShopAction({ request }) {
    // 1. Retrieve all submitted form data.
    const formData = await request.formData()

    console.log([...formData.entries()])

    // 2. Retrieve the image for validation.
    const image = formData.get('image')

    console.log(image)
    console.log(image.name)
    console.log(image.size)
    console.log(image.type)

    if (!image || image.size === 0) {
        return { error: 'Please select a shop image.' }
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(image.type)) {
        return { error: 'Only JPEG, PNG and WebP images are allowed.' }
    }

    if (image.size > 2 * 1024 * 1024) {
        return { error: 'Image size must not exceed 2MB.' }
    }

    try {
        // 3. Send all form fields and the image to the backend.
        await api.post('/shop/create', formData)

        // 4. Redirect after successful creation.
        return redirect('/owner/shops')
    } catch (error) {
        return {
            error: error.response?.data?.message ||
                'Unable to create shop. Please try again.',
        }
    }
}

export default createShopAction
