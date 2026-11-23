
import api from '../services/api'

async function adminShopsLoader() {
    try {
        // 1. Fetch all shops on the platform
        const response = await api.get('/admin/shops')

        // 2. Return the shops and total count
        return {
            shops: response.data.shops,
            count: response.data.count,
            error: '',
        }
    } catch (error) {
        // 3. Return a readable error if the request fails
        return {
            shops: [],
            count: 0,
            error:
                error.response?.data?.message ||
                'Unable to load shops. Please try again.',
        }
    }
}

export default adminShopsLoader
