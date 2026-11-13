import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import usePasswordVisibility from '../../hooks/usePasswordVisibility'

import styles from './Auth.module.css'
import Reveal from '../../components/Reveal'

function Login() {
    const { login } = useAuth()
    const { visible, toggleVisibility } = usePasswordVisibility()

    const navigate = useNavigate()
    const location = useLocation()

    // Get the success message from the location state passed from ResetPassword, if it exists
    const successMessage = location.state?.message

    useEffect(() => {
        if (location.state?.message) {
            navigate(location.pathname, {
                replace: true,
                state: null,
            })
        }
    }, [location, navigate])

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Update the field that the user is typing in
    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    // Submit login details to the backend
    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setLoading(true)

        try {
            await login(formData)

            // Return to the originally requested page, or home
            const redirectTo = location.state?.from?.pathname || '/'

            navigate(redirectTo, { replace: true })
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to log in. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Reveal animation='scale'>
        <main className={styles.authPage}>
            <section className={styles.authCard}>
                <h1>Welcome Back</h1>
                <p>Log in to continue to your account.</p>

                {successMessage && (
                    <p className={styles.authSuccess} role="status">
                        {successMessage}
                    </p>
                )}

                {error && (
                    <p className={styles.authError} role="alert">
                        {error}
                    </p>
                )}


                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>

                        <div className={styles.passwordInput}>
                            <input
                                id="password"
                                type={visible ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                onClick={toggleVisibility}
                                aria-label={visible ? 'Hide password' : 'Show password'}
                            >
                                {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.authLinks}>
                        <Link to="/forgot-password">
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </section>
        </main>
        </Reveal>
    )
}

export default Login