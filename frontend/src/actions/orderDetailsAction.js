
import api from '../services/api'

async function orderDetailsAction({ request }) {
    // 1. Read the submitted form data
    const formData = await request.formData()
    const intent = formData.get('intent')
    const orderId = formData.get('orderId')
    const reason = formData.get('reason')

    // 2. Reject unsupported actions
    if (intent !== 'cancelOrder') {
        return { error: 'Invalid order action.' }
    }

    try {
        // 3. Send the cancellation request
        const response = await api.patch(
            `/order/${orderId}/cancel`,
            { 
                reason,
                cancelledBy: "customer"
            }
        )

        // 4. Return the success message
        return {
            success: response.data.message,
        }
    } catch (error) {
        // 5. Return the backend error message
        return {
            error: error.response?.data?.message ||
                'Unable to cancel your order. Please try again.',
        }
    }
}

export default orderDetailsAction
