
import api from '../services/api'

async function adminUsersLoader() {
    try {
        // 1. Fetch all registered users
        const response = await api.get('/admin/users')

        // 2. Return the users and total count
        return {
            users: response.data.users,
            count: response.data.count,
            error: '',
        }
    } catch (error) {
        // 3. Return an error if the request fails
        return {
            users: [],
            count: 0,
            error:
                error.response?.data?.message ||
                'Unable to load users. Please try again.',
        }
    }
}

export default adminUsersLoader
