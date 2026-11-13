import api from '../services/api'

async function shopDetailsLoader({ params }) {
    const { shopId } = params

    try {
        const response = await api.get(`/shop/${shopId}`)

        return {
            shop: response.data.shop,
            items: response.data.items,
            error: '',
        }
    } catch (error) {
        // A missing or inactive shop should display a not-found message
        if (error.response?.status === 404) {
            return {
                shop: null,
                items: [],
                error: 'This shop could not be found or is currently unavailable.',
            }
        }

        return {
            shop: null,
            items: [],
            error:
                error.response?.data?.message ||
                'Unable to load this shop. Please try again.',
        }
    }
}

export default shopDetailsLoader