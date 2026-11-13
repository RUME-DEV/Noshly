import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function GuestRoute() {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <p>Checking authentication...</p>
    }

    if (user) {
        const redirectTo = location.state?.from?.pathname || '/'

        return <Navigate to={redirectTo} replace />
    }

    return <Outlet />
}

export default GuestRoute