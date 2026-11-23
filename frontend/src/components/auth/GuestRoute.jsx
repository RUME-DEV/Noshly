import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loading from '../Loading'

function GuestRoute() {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <Loading />
    }

    if (user) {
        const redirectTo = location.state?.from?.pathname || '/'

        return <Navigate to={redirectTo} replace />
    }

    return <Outlet />
}

export default GuestRoute