
import api from '../services/api'

const adminShopsAction = async ({ request }) => {
    // 1. Read the submitted form data
    const formData = await request.formData()

    const shopId = formData.get('shopId')
    const intent = formData.get('intent')
    const suspensionReason = formData.get('suspensionReason')?.trim()

    // 2. Validate the submitted shop ID and action
    if (!shopId || !['suspend', 'reactivate'].includes(intent)) {
        return {
            success: false,
            message: 'Invalid shop action.'
        }
    }

    // 3. Require a reason when suspending a shop
    if (intent === 'suspend' && !suspensionReason) {
        return {
            success: false,
            message: 'Please provide a reason for suspending this shop.'
        }
    }

    // 4. Prepare the request body
    const payload = intent === 'suspend'
        ? { isSuspended: true, suspensionReason }
        : { isSuspended: false }

    try {
        // 5. Send the suspension or reactivation request
        const response = await api.patch(
            `/admin/shops/${shopId}/status`,
            payload
        )

        // 6. Return the server response
        return {
            success: true,
            message: response.data.message
        }
    } catch (error) {
        // 7. Return the API error message
        return {
            success: false,
            message:
                error.response?.data?.message ||
                'Failed to update shop status. Please try again.'
        }
    }
}

export default adminShopsAction
