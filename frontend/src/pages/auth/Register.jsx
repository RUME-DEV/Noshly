import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import usePasswordVisibility from '../../hooks/usePasswordVisibility'

import styles from './Auth.module.css'
import Reveal from '../../components/Reveal'

function Register() {
    const { register } = useAuth()

    const { visible: passwordVisible, toggleVisibility: togglePassword } =
        usePasswordVisibility()

    const { visible: confirmPasswordVisible, toggleVisibility: toggleConfirmPassword } =
        usePasswordVisibility()

    const navigate = useNavigate()
    const location = useLocation()

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
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


    // Submit registration details to the backend
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)

        try {
            // Only send fields expected by the backend.
            const { confirmPassword, ...userDetails } = formData

            await register(userDetails)

            // Return to the originally requested page, or home
            const redirectTo = location.state?.from?.pathname || '/'
            
            navigate(redirectTo, { replace: true })
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to create your account. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Reveal animation='scale'>
        <main className={styles.authPage}>
            <section className={styles.authCard}>
                <h1>Create Account</h1>
                <p>Register to get started.</p>

                {error && (
                    <p className={styles.authError} role="alert">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>

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
                        <label htmlFor="mobile">Mobile Number (Optional)</label>
                        <input
                            id="mobile"
                            type="tel"
                            name="mobile"
                            placeholder="Enter your mobile number"
                            value={formData.mobile}
                            onChange={handleChange}
                            autoComplete="tel"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>

                        <div className={styles.passwordInput}>
                            <input
                                id="password"
                                type={passwordVisible ? 'text' : 'password'}
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />

                            <button
                                type="button"
                                onClick={togglePassword}
                                aria-label={
                                    passwordVisible
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >
                                {passwordVisible
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm Password</label>

                        <div className={styles.passwordInput}>
                            <input
                                id="confirmPassword"
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />

                            <button
                                type="button"
                                onClick={toggleConfirmPassword}
                                aria-label={
                                    confirmPasswordVisible
                                        ? 'Hide confirm password'
                                        : 'Show confirm password'
                                }
                            >
                                {confirmPasswordVisible
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p>
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </section>
        </main>
        </Reveal>
    )
}

export default Register