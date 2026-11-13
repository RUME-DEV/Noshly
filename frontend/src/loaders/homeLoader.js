import api from '../services/api'

async function homeLoader({ request }) {
    // Read the city query parameter from the current URL
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')?.trim() || ''

    try {
        const response = await api.get('/shop', {
            params: city ? { city } : {},
        })

        return {
            shops: response.data,
            error: '',
            city,
        }
    } catch (error) {
        // No matching shops should display the empty state
        if (error.response?.status === 404) {
            return {
                shops: [],
                error: '',
                city,
            }
        }

        return {
            shops: [],
            error:
                error.response?.data?.message ||
                'Unable to load shops. Please try again.',
            city,
        }
    }
}

export default homeLoader