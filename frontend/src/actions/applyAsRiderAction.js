
import api from '../services/api'

async function applyAsRiderAction({ request }) {
    try {
        // 1. Read the submitted mobile number
        const formData = await request.formData()
        const mobile = formData.get('mobile')

        if (mobile.length !== 11) {
            return {
                error: "Mobile Number Must Be 11 Characters"
            }
        }

        // 2. Submit the application with the mobile number
        const response = await api.post('/delivery-rider/apply', {
            mobile
        })

        // 3. Return the success message
        return {
            success: response.data.message,
        }
    } catch (error) {
        // 4. Return the backend error or a fallback message
        return {
            error: error.response?.data?.message ||
                'Unable to submit your application. Please try again.',
        }
    }
}

export default applyAsRiderAction
