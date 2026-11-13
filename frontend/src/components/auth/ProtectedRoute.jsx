import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ allowedRoles }) {
    const { user, loading } = useAuth()
    const location = useLocation()

    // Wait until the initial authentication check is complete
    if (loading) {
        return <p>Checking authentication...</p>
    }

    // Redirect users who are not logged in
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Restrict access if specific roles are required
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default ProtectedRoute