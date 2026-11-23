
import api from '../services/api'

async function adminUsersAction({ request }) {
    // 1. Read the submitted form data
    const formData = await request.formData()

    const intent = formData.get('intent')
    const userId = formData.get('userId')

    try {
        // 2. Suspend a user account
        if (intent === 'suspend') {
            const suspensionReason = formData.get('suspensionReason')

            const response = await api.patch(
                `/admin/users/${userId}/status`,
                {
                    isSuspended: true,
                    suspensionReason,
                }
            )

            return {
                success: response.data.message,
            }
        }

        // 3. Reactivate a suspended account
        if (intent === 'reactivate') {
            const response = await api.patch(
                `/admin/users/${userId}/status`,
                {
                    isSuspended: false,
                }
            )

            return {
                success: response.data.message,
            }
        }

        // 4. Promote a user to admin
        if (intent === 'makeAdmin') {
            const response = await api.patch(
                `/admin/make-admin/${userId}`
            )

            return {
                success: response.data.message,
            }
        }

        // 5. Remove admin privileges
        if (intent === 'removeAdmin') {
            const response = await api.patch(
                `/admin/remove-admin/${userId}`
            )

            return {
                success: response.data.message,
            }
        }

        // 6. Reject an unsupported form action
        return {
            error: 'Invalid user management action.',
        }

    } catch (error) {
        // 7. Return the backend error message
        return {
            error:
                error.response?.data?.message ||
                'Unable to update this user account.',
        }
    }
}

export default adminUsersAction
