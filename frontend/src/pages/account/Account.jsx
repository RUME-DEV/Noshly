
import { Link } from 'react-router-dom'
import { Store, Bike, ArrowRight } from 'lucide-react'
import Reveal from '../../components/Reveal'
import { useAccount } from '../../context/AccountContext'
import styles from './Account.module.css'

import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

import usePasswordVisibility from '../../hooks/usePasswordVisibility'

function Account() {

    const {
        hasShops,
        riderStatus,
        loading,
        errors,
        refreshAccountStatus,
    } = useAccount()

    const { user, linkGoogle, setPassword } = useAuth()

    const { visible, toggleVisibility } = usePasswordVisibility()
    const { visible: confirmVisible, toggleVisibility: confirmToggleVisibility } = usePasswordVisibility()

    const [password, setPasswordValue] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [accountLoading, setAccountLoading] = useState(false)
    const [accountMessage, setAccountMessage] = useState('')
    const [accountError, setAccountError] = useState('')

    const handleLinkGoogle = async (credentialResponse) => {
        setAccountLoading(true)
        setAccountError('')
        setAccountMessage('')

        try {
            await linkGoogle(credentialResponse.credential)
            setAccountMessage('Google account linked successfully.')
        } catch (error) {
            setAccountError(
                error.response?.data?.message || 'Failed to link Google account.'
            )
        } finally {
            setAccountLoading(false)
        }
    }

    const handleSetPassword = async (e) => {
        e.preventDefault()

        setAccountError('')
        setAccountMessage('')

        if (password.length < 6) {
            setAccountError('Password must be at least 6 characters.')
            return
        }

        if (password !== confirmPassword) {
            setAccountError('Passwords do not match.')
            return
        }

        setAccountLoading(true)

        try {
            await setPassword(password)
            
            setPasswordValue('')
            setConfirmPassword('')
            setAccountMessage('Password added successfully.')
        } catch (error) {
            setAccountError(
                error.response?.data?.message || 'Failed to add password.'
            )
        } finally {
            setAccountLoading(false)
        }
    }

    return (
        <main className={styles.accountPage}>
            <Reveal animation="drop">
                <header className={styles.accountHeader}>
                    <h1>My Account</h1>
                    <p>Manage your account and explore more opportunities.</p>
                </header>
            </Reveal>

            <Reveal animation="moveUp">
                <section className={styles.securitySection}>
                    <div className={styles.securityHeader}>
                        <ShieldCheck size={24} />
                        <div>
                            <h2>Account Security</h2>
                            <p>Manage how you sign in to Noshly.</p>
                        </div>
                    </div>

                    {(accountMessage || accountError) && (
                        <p
                            className={accountError ? styles.securityError : styles.securitySuccess}
                            role="alert"
                        >
                            {accountError || accountMessage}
                        </p>
                    )}

                    <div className={styles.securityMethods}>
                        <div className={styles.securityMethod}>
                            <div>
                                <h3>Google Account</h3>
                                <p>
                                    {user?.hasGoogle
                                        ? 'Your Google account is connected.'
                                        : 'Connect Google to sign in with your Google account.'}
                                </p>
                            </div>

                            {user?.hasGoogle ? (
                                <span className={styles.connectedStatus}>Connected</span>
                            ) : (
                                <GoogleLogin
                                    onSuccess={handleLinkGoogle}
                                    onError={() => setAccountError('Google authentication failed.')}
                                    text="continue_with"
                                    theme="outline"
                                    size="medium"
                                />
                            )}
                        </div>

                        <div className={styles.securityMethod}>
                            <div>
                                <h3>Password</h3>
                                <p>
                                    {user?.hasPassword
                                        ? 'You can sign in using your email and password.'
                                        : 'Add a password to also sign in with your email.'}
                                </p>
                            </div>

                            {user?.hasPassword ? (
                                <span className={styles.connectedStatus}>Enabled</span>
                            ) : (
                                <form
                                    className={styles.passwordForm}
                                    onSubmit={handleSetPassword}
                                >
                                    <div className={styles.passwordInputWrapper}>
                                        <input
                                            type={visible ? 'text' : 'password'}
                                            placeholder="New password"
                                            value={password}
                                            onChange={(e) => setPasswordValue(e.target.value)}
                                            minLength={6}
                                            required
                                        />
                                        <button type="button" onClick={toggleVisibility}>
                                            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <div className={styles.passwordInputWrapper}>
                                        <input
                                            type={confirmVisible ? 'text' : 'password'}
                                            placeholder="Confirm password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            minLength={6}
                                            required
                                        />
                                        <button type="button" onClick={confirmToggleVisibility}>
                                            {confirmVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <button type="submit" disabled={accountLoading}>
                                        {accountLoading ? 'Saving...' : 'Add Password'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </Reveal>

            {loading ? (
                <p className={styles.accountMessage}>
                    Loading your account information...
                </p>
            ) : (
                <>
                    {/* 1. Display account information errors */}
                    {(errors.shops || errors.rider) && (
                        <Reveal animation="moveUp">
                            <div className={styles.accountError} role="alert">
                                <p>
                                    Some account information could not be loaded.
                                </p>
                                <button
                                    type="button"
                                    onClick={refreshAccountStatus}
                                >
                                    Try Again
                                </button>
                            </div>
                        </Reveal>
                    )}

                    <section className={styles.accountOptions}>
                        {/* 2. Show the shop option only when its status is known */}
                        {hasShops === false && (
                            <Reveal animation="scale">
                                <article className={styles.accountCard}>
                                    <div className={styles.accountIcon}>
                                        <Store size={28} />
                                    </div>

                                    <h2>Become a Shop Owner</h2>
                                    <p>
                                        Create your own food shop, add menu
                                        items and start receiving orders.
                                    </p>

                                    <Link
                                        to="/owner/shops/new"
                                        className={styles.accountLink}
                                    >
                                        Get Started
                                        <ArrowRight size={17} />
                                    </Link>
                                </article>
                            </Reveal>
                        )}

                        {hasShops === true && (
                            <Reveal animation="scale">
                                <article className={styles.accountCard}>
                                    <div className={styles.accountIcon}>
                                        <Store size={28} />
                                    </div>

                                    <h2>My Shops</h2>
                                    <p>
                                        Manage your shops, update menus and
                                        keep track of your business.
                                    </p>

                                    <Link
                                        to="/owner/shops"
                                        className={styles.accountLink}
                                    >
                                        Manage Shops
                                        <ArrowRight size={17} />
                                    </Link>
                                </article>
                            </Reveal>
                        )}

                        {/* 3. Show the correct rider option based on application status */}
                        {riderStatus === null && (
                            <Reveal animation="scale">
                                <article className={styles.accountCard}>
                                    <div className={styles.accountIcon}>
                                        <Bike size={28} />
                                    </div>

                                    <h2>Become a Delivery Rider</h2>
                                    <p>
                                        Apply to deliver food orders and earn
                                        by providing delivery services.
                                    </p>

                                    <Link
                                        to="/rider/apply"
                                        className={styles.accountLink}
                                    >
                                        Apply Now
                                        <ArrowRight size={17} />
                                    </Link>
                                </article>
                            </Reveal>
                        )}

                        {riderStatus === 'pending' && (
                            <Reveal animation="scale">
                                <article className={styles.accountCard}>
                                    <div className={styles.accountIcon}>
                                        <Bike size={28} />
                                    </div>

                                    <h2>Rider Application</h2>
                                    <p>
                                        Your application is being reviewed.
                                        We'll update you when a decision is made.
                                    </p>

                                    <span className={styles.pendingStatus}>
                                        Pending review
                                    </span>
                                </article>
                            </Reveal>
                        )}

                        {riderStatus === 'rejected' && (
                            <Reveal animation="scale">
                                <article className={styles.accountCard}>
                                    <div className={styles.accountIcon}>
                                        <Bike size={28} />
                                    </div>

                                    <h2>Rider Application</h2>
                                    <p>
                                        Your previous application was rejected.
                                        You can submit another application.
                                    </p>

                                    <Link
                                        to="/rider/apply"
                                        className={styles.accountLink}
                                    >
                                        Apply Again
                                        <ArrowRight size={17} />
                                    </Link>
                                </article>
                            </Reveal>
                        )}

                        {riderStatus === 'approved' && (
                            <Reveal animation="scale">
                                <article className={styles.accountCard}>
                                    <div className={styles.accountIcon}>
                                        <Bike size={28} />
                                    </div>

                                    <h2>Rider Dashboard</h2>
                                    <p>
                                        Your rider application is approved.
                                        Manage your deliveries from your dashboard.
                                    </p>

                                    <Link
                                        to="/rider/dashboard"
                                        className={styles.accountLink}
                                    >
                                        Open Dashboard
                                        <ArrowRight size={17} />
                                    </Link>
                                </article>
                            </Reveal>
                        )}
                    </section>
                </>
            )}
        </main>
    )
}

export default Account
