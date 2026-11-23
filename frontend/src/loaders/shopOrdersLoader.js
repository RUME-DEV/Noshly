
import api from '../services/api'

async function shopOrdersLoader() {
    try {
        // 1. Retrieve all orders belonging to the owner's shops
        const response = await api.get('/order/shop-orders')

        // 2. Return the orders and their total count
        return {
            orders: response.data.orders,
            count: response.data.count,
            error: '',
        }
    } catch (error) {
        // 3. Return an empty result if the request fails
        return {
            orders: [],
            count: 0,
            error: error.response?.data?.message ||
                'Unable to load shop orders. Please try again.',
        }
    }
}

export default shopOrdersLoader
