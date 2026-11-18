
import api from '../services/api'

async function riderDashboardAction({ request }) {
    // 1. Read the operation and its data from the submitted form.
    const formData = await request.formData()
    const intent = formData.get('intent')
    const orderId = formData.get('orderId')

    try {
        let response

        // 2. Accept an available delivery.
        if (intent === 'accept') {
            response = await api.patch(
                `/delivery-rider/assign/${orderId}`
            )
        }

        // 3. Update the status of an assigned delivery.
        else if (intent === 'updateStatus') {
            const status = formData.get('status')

            response = await api.patch(
                `/order/${orderId}/status`,
                { status }
            )
        }

        // 4. Confirm cash collection after delivery.
        else if (intent === 'confirmCash') {
            response = await api.patch(
                `/order/${orderId}/confirm-cash`
            )
        }

        // 5. Reject unsupported operations.
        else {
            return {
                error: 'Invalid delivery action.',
            }
        }

        // 6. Return the backend success message.
        return {
            success: response.data.message,
        }
    } catch (error) {
        // 7. Return the backend error message.
        return {
            error: error.response?.data?.message ||
                'Unable to complete this delivery action. Please try again.',
        }
    }
}

export default riderDashboardAction
