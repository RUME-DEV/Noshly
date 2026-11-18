
import api from '../services/api'

async function riderDashboardLoader() {
    // 1. Fetch both delivery lists independently.
    const results = await Promise.allSettled([
        api.get('/delivery-rider/available-deliveries'),
        api.get('/delivery-rider/my-deliveries'),
    ])

    // 2. Extract each successful response without depending on the other.
    const [ availableResult, myDeliveriesResult ] = results

    return {
        availableDeliveries:
            availableResult.status === 'fulfilled'
                ? availableResult.value.data.deliveries
                : [],

        myDeliveries:
            myDeliveriesResult.status === 'fulfilled'
                ? myDeliveriesResult.value.data.deliveries
                : [],

        errors: {
            available:
                availableResult.status === 'rejected'
                    ? availableResult.reason.response?.data?.message ||
                        'Unable to load available deliveries.'
                    : '',

            myDeliveries:
                myDeliveriesResult.status === 'rejected'
                    ? myDeliveriesResult.reason.response?.data?.message ||
                        'Unable to load your assigned deliveries.'
                    : '',
        },
    }
}

export default riderDashboardLoader
