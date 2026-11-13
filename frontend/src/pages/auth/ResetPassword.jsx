import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import api from '../../services/api'
import usePasswordVisibility from '../../hooks/usePasswordVisibility'

import styles from './Auth.module.css'
import Reveal from '../../components/Reveal'

function ResetPassword() {
    const navigate = useNavigate()
    const location = useLocation()


    // Get the email from the location state passed from the VerifyOTP page
    const email = location.state?.email

    // Password visibility toggles for new password and confirm password fields
    const {
        visible: passwordVisible,
        toggleVisibility: togglePassword,
    } = usePasswordVisibility()

    const {
        visible: confirmPasswordVisible,
        toggleVisibility: toggleConfirmPassword,
    } = usePasswordVisibility()

    const [formData, setFormData] = useState({
        newPassword: '',
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


    // Submit new password to the backend for resetting
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)

        try {
            await api.post('/user/reset-password', {
                email,
                newPassword: formData.newPassword,
            })

            navigate('/login', {
                replace: true,
                state: { message: 'Password reset successful. Please log in.' },
            })
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to reset your password. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    if (!email) {
        return (
            <main className={styles.authPage}>
                <section className={styles.authCard}>
                    <h1>Email Required</h1>
                    <p>Please complete the password reset process first.</p>
                    <Link to="/forgot-password">Request a new OTP</Link>
                </section>
            </main>
        )
    }

    return (
        <Reveal animation='scale'>
        <main className={styles.authPage}>
            <section className={styles.authCard}>
                <h1>Reset Password</h1>

                <p>
                    Create a new password for <strong>{email}</strong>.
                </p>

                {error && (
                    <p className={styles.authError} role="alert">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="newPassword">New Password</label>

                        <div className={styles.passwordInput}>
                            <input
                                id="newPassword"
                                type={passwordVisible ? 'text' : 'password'}
                                name="newPassword"
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />

                            <button
                                type="button"
                                onClick={togglePassword}
                                aria-label={
                                    passwordVisible ? 'Hide password' : 'Show password'
                                }
                            >
                                {passwordVisible
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm New Password</label>

                        <div className={styles.passwordInput}>
                            <input
                                id="confirmPassword"
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm new password"
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
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >
                                {confirmPasswordVisible
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>
            </section>
        </main>
        </Reveal>
    )
}

export default ResetPassword
