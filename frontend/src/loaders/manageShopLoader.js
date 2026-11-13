
import api from '../services/api'

async function manageShopLoader({ params }) {
    try {
        const response = await api.get(`/shop/manage/${params.shopId}`)

        return {
            shop: response.data.shop,
            items: response.data.items,
            error: '',
        }
    } catch (error) {
        return {
            shop: null,
            items: [],
            error: error.response?.data?.message ||
                'Unable to load your shop. Please try again.',
        }
    }
}

export default manageShopLoader
