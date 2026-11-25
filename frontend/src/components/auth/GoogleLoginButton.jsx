import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

import styles from '../../pages/auth/Auth.module.css'

function GoogleLoginButton() {
    const { googleLogin } = useAuth()

    const navigate = useNavigate()
    const location = useLocation()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSuccess = async (credentialResponse) => {
        setError('')
        setLoading(true)

        try {
            await googleLogin(credentialResponse.credential)

            const redirectTo = location.state?.from?.pathname || '/'

            navigate(redirectTo, { replace: true })
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Google login failed. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {error && (
                <p role="alert" className={styles.authError}>
                    {error}
                </p>
            )}

            {loading ? (
                <p className={styles.googleLoading} > Signing in with Google... </p>
            ) : (
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => setError('Google authentication failed.')}
                    text="continue_with"
                />
            )}
        </div>
    )
}

export default GoogleLoginButton