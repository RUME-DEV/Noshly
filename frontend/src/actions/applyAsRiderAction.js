
import api from '../services/api'

async function applyAsRiderAction() {
    try {
        // 1. Submit the application; the backend identifies the user from their auth cookie.
        const response = await api.post('/delivery-rider/apply')

        // 2. Return the success message to the component.
        return {
            success: response.data.message,
        }
    } catch (error) {
        // 3. Return the backend error or a fallback message.
        return {
            error: error.response?.data?.message ||
                'Unable to submit your application. Please try again.',
        }
    }
}

export default applyAsRiderAction
