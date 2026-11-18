
import api from '../services/api'

async function riderApplicationLoader() {
    try {
        // 1. Retrieve the logged-in user's rider application.
        const response = await api.get('/delivery-rider/my-profile')

        return {
            riderProfile: response.data.riderProfile,
            error: '',
        }
    } catch (error) {
        // 2. Return an error message instead of crashing the route.
        return {
            riderProfile: null,
            error: error.response?.data?.message ||
                'Unable to load your rider application.',
        }
    }
}

export default riderApplicationLoader
