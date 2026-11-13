
import api from '../services/api'

async function myOrdersLoader() {
    try {
        const response = await api.get('/order/my-orders')

        return {
            orders: response.data.orders,
            error: '',
        }
    } catch (error) {
        return {
            orders: [],
            error:
                error.response?.data?.message ||
                'Unable to load your orders. Please try again.',
        }
    }
}

export default myOrdersLoader
