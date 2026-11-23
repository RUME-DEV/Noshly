
import api from '../services/api'

async function adminDashboardLoader() {
    try {
        // 1. Fetch platform dashboard statistics
        const response = await api.get('/admin/dashboard-stats')

        // 2. Return the statistics to the dashboard page
        return {
            stats: response.data,
            error: '',
        }
    } catch (error) {
        // 3. Return a readable error if the request fails
        return {
            stats: null,
            error:
                error.response?.data?.message ||
                'Unable to load dashboard statistics. Please try again.',
        }
    }
}

export default adminDashboardLoader
