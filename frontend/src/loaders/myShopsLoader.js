
import api from '../services/api'

async function myShopsLoader() {
    try {
        const response = await api.get('/shop/my-shops')

        return {
            shops: response.data.shops,
            error: '',
        }
    } catch (error) {
        return {
            shops: [],
            error: error.response?.data?.message ||
                'Unable to load your shops. Please try again.',
        }
    }
}

export default myShopsLoader
