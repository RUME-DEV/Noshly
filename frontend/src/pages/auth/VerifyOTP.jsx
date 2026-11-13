import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../../services/api'

import styles from './Auth.module.css'
import Reveal from '../../components/Reveal'

function VerifyOTP() {
    const navigate = useNavigate()
    const location = useLocation()

    // Get the email from the location state passed from the ForgotPassword page
    const email = location.state?.email

    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Submit OTP to the backend for verification
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (otp.length !== 6) {
            setError('Please enter the complete 6-digit OTP.')
            return
        }

        setLoading(true)

        try {
            await api.post('/user/verify-otp', {
                email,
                otp,
            })

            navigate('/reset-password', {
                state: { email },
            })
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Invalid OTP. Please try again.'
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
                    <p>Please enter your email address first.</p>
                    <Link to="/forgot-password">Go Back</Link>
                </section>
            </main>
        )
    }

    return (
        <Reveal animation='scale'>
        <main className={styles.authPage}>
            <section className={styles.authCard}>
                <h1>Verify Your Email</h1>

                <p>
                    We've sent a 6-digit OTP to <strong>{email}</strong>.
                    Enter it below to continue.
                </p>

                {error && (
                    <p className={styles.authError} role="alert">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="otp">Enter OTP</label>

                        <input
                            id="otp"
                            type="text"
                            name="otp"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value

                                if (/^\d{0,6}$/.test(value)) {
                                    setOtp(value)
                                }
                            }}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>

                <p>
                    <Link to="/forgot-password">Try another email</Link>
                </p>
            </section>
        </main>
        </Reveal>
    )
}

export default VerifyOTP
