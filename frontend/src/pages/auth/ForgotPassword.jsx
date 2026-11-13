import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

import styles from './Auth.module.css'
import Reveal from '../../components/Reveal'

function ForgotPassword() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Submit email to the backend to send OTP
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await api.post('/user/send-otp', { email })

            navigate('/verify-otp', {
                state: { email },
            })
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to send OTP. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Reveal animation='scale'>
        <main className={styles.authPage}>
            <section className={styles.authCard}>
                <h1>Forgot Password?</h1>
                <p>
                    Enter your registered email address and
                    we'll send you an OTP to reset your password.
                </p>

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
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                </form>

                <p>
                    Remember your password? <Link to="/login">Log In</Link>
                </p>
            </section>
        </main>
        </Reveal>
    )
}

export default ForgotPassword