
import api from '../services/api'

async function shopOrdersAction({ request }) {
    // 1. Read the submitted form data
    const formData = await request.formData()
    const intent = formData.get('intent')
    const orderId = formData.get('orderId')

    try {
        let response

        // 2. Update the order status
        if (intent === 'updateStatus') {
            const status = formData.get('status')

            response = await api.patch(
                `/order/${orderId}/status`,
                { status }
            )
        }

        // 3. Cancel a pending order
        else if (intent === 'cancelOrder') {

            const reason = formData.get("reason")

            response = await api.patch(
                `/order/${orderId}/cancel`, {
                    reason,
                    cancelledBy: "shopOwner"
                }
            )
        }

        // 4. Reject unsupported actions
        else {
            return {
                error: 'Invalid order action.',
            }
        }

        // 5. Return the success message
        return {
            success: response.data.message,
        }
    } catch (error) {
        // 6. Return the backend error message
        return {
            error: error.response?.data?.message ||
                'Unable to process the order. Please try again.',
        }
    }
}

export default shopOrdersAction
