
import { redirect } from 'react-router-dom'
import api from '../services/api'

async function editShopAction({ request, params }) {
    // 1. Retrieve all submitted form data.
    const formData = await request.formData()

    // 2. Retrieve the image (it is optional when editing).
    const image = formData.get('image')

    // 3. Validate the image only if a new one was selected.
    if (image && image.size > 0) {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ]

        if (!allowedTypes.includes(image.type)) {
            return {
                error: 'Only JPEG, PNG and WebP images are allowed.',
            }
        }

        if (image.size > 2 * 1024 * 1024) {
            return {
                error: 'Image size must not exceed 2MB.',
            }
        }
    }

    try {
        // 4. Send the updated fields to the backend.
        await api.patch(`/shop/${params.shopId}`, formData)

        // 5. Return to the shop management page.
        return redirect(`/owner/shops/${params.shopId}`)
    } catch (error) {
        return {
            error: error.response?.data?.message ||
                'Unable to update shop. Please try again.',
        }
    }
}

export default editShopAction
