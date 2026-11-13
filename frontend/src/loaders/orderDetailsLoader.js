import api from '../services/api'

async function orderDetailsLoader({ params }) {

    const { orderId } = params
    try {
        const response = await api.get(`/order/${orderId}`)

        return {
            order: response.data.order,
            error: '',
        }
    } catch (error) {
        return {
            order: null,
            error: error.response?.data?.message ||
                'Unable to load order details. Please try again.',
        }
    }
}

export default orderDetailsLoader