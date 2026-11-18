
import api from '../services/api'

async function reviewRiderApplicationAction({ request }) {
    // 1. Get the application ID and review decision from the form.
    const formData = await request.formData()
    const riderId = formData.get('riderId')
    const status = formData.get('status')

    try {
        // 2. Send the approval or rejection decision to the backend.
        const response = await api.patch(
            `/delivery-rider/applications/${riderId}`,
            { status }
        )

        // 3. Return the backend success message.
        return {
            success: response.data.message,
        }
    } catch (error) {
        // 4. Return the backend error message.
        return {
            error: error.response?.data?.message ||
                'Unable to review this application. Please try again.',
        }
    }
}

export default reviewRiderApplicationAction
