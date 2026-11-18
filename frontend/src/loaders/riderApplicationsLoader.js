
import api from '../services/api'

async function riderApplicationsLoader({ request }) {
    // 1. Read the selected status; default to all applications.
    const url = new URL(request.url)
    const status = url.searchParams.get('status') || 'all'

    try {
        // 2. Only send a status filter when a specific status is selected.
        const response = await api.get('/delivery-rider/applications', {
            params: status === 'all' ? {} : { status },
        })

        return {
            applications: response.data.applications,
            status,
            error: '',
        }
    } catch (error) {
        // 3. Return an error instead of allowing the route to crash.
        return {
            applications: [],
            status,
            error: error.response?.data?.message ||
                'Unable to retrieve rider applications.',
        }
    }
}

export default riderApplicationsLoader
