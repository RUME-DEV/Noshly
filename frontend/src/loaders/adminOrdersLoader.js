
import api from '../services/api'

async function adminOrdersLoader() {
    try {
        // 1. Fetch all platform orders
        const response = await api.get('/admin/orders')

        // 2. Return orders and count
        return {
            orders: response.data.orders,
            count: response.data.count,
            error: '',
        }
    } catch (error) {
        // 3. Return a readable error if the request fails
        return {
            orders: [],
            count: 0,
            error:
                error.response?.data?.message ||
                'Unable to load orders. Please try again.',
        }
    }
}

export default adminOrdersLoader
