
import { redirect } from 'react-router-dom'
import api from '../services/api'

async function deleteItemAction({ request, params }) {
    // 1. Retrieve the item ID submitted from the shop management page.
    const formData = await request.formData()
    const itemId = formData.get('itemId')

    const { shopId } = params

    // 2. Make sure an item ID was provided.
    if (!itemId) {
        return { error: 'Unable to identify the food item.' }
    }

    try {
        // 3. Send the delete request to the backend.
        await api.delete(`/item/${itemId}`)

        // 4. Return to the shop management page after deletion.
        return redirect(`/owner/shops/${shopId}`)
    } catch (error) {
        // 5. Return the backend error or a fallback message.
        return {
            error: error.response?.data?.message ||
                'Unable to delete food item. Please try again.',
        }
    }
}

export default deleteItemAction
