
import { redirect } from 'react-router-dom'
import api from '../services/api'

async function editItemAction({ request, params }) {
    // 1. Retrieve the submitted form data.
    const formData = await request.formData()

    // 2. Retrieve the optional image and price.
    const image = formData.get('image')
    const priceValue = formData.get('price')

    // 3. Validate the price only if the user provided one.
    if (priceValue !== null && priceValue.trim() !== '') {
        const price = Number(priceValue)

        if (!Number.isFinite(price) || price < 0.01) {
            return { error: 'Price must be at least ₦0.01.' }
        }
    } else {
        // Remove an empty price so the backend leaves it unchanged.
        formData.delete('price')
    }

    // 4. Validate the image only if a new image was selected.
    if (image && image.size > 0) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

        if (!allowedTypes.includes(image.type)) {
            return {
                error: 'Only JPEG, PNG and WebP images are allowed.',
            }
        }

        if (image.size > 2 * 1024 * 1024) {
            return { error: 'Image size must not exceed 2MB.' }
        }
    } else {
        // Keep the existing image if no new image was selected.
        formData.delete('image')
    }

    try {
        // 5. Send the updated item details to the backend.
        await api.patch(`/item/${params.itemId}`, formData)

        // 6. Return to the shop management page.
        return redirect(`/owner/shops/${params.shopId}`)
    } catch (error) {
        return {
            error: error.response?.data?.message ||
                'Unable to update food item. Please try again.',
        }
    }
}

export default editItemAction
