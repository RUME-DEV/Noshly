
import { redirect } from 'react-router-dom'
import api from '../services/api'

async function createItemAction({ request, params }) {
    // 1. Retrieve the submitted form data.
    const formData = await request.formData()

    // 2. Validate the image.
    const image = formData.get('image')

    if (!image || image.size === 0) {
        return { error: 'Please select a food image.' }
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(image.type)) {
        return { error: 'Only JPEG, PNG and WebP images are allowed.' }
    }

    if (image.size > 2 * 1024 * 1024) {
        return { error: 'Image size must not exceed 2MB.' }
    }

    // 3. Validate the price.
    const price = Number(formData.get('price'))

    if (!Number.isFinite(price) || price < 0.01) {
        return { error: 'Price must be at least ₦0.01.' }
    }

    try {
        // 4. Send the item details and image to the backend.
        await api.post(`/item/add/${params.shopId}`, formData)

        // 5. Return to the shop management page.
        return redirect(`/owner/shops/${params.shopId}`)
    } catch (error) {
        return {
            error: error.response?.data?.message ||
                'Unable to add food item. Please try again.',
        }
    }
}

export default createItemAction
