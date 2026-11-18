
import { Link } from 'react-router-dom'
import { Store, Bike, ArrowRight } from 'lucide-react'
import Reveal from '../../components/Reveal'
import { useAccount } from '../../context/AccountContext'
import styles from './Account.module.css'

function Account() {
    const {
        hasShops,
        riderStatus,
        loading,
        errors,
        refreshAccountStatus,
    } = useAccount()

    return (
        <main className={styles.accountPage}>
            <Reveal animation="drop">
                <header className={styles.accountHeader}>
                    <h1>My Account</h1>
                    <p>Manage your account and explore more opportunities.</p>
                </header>
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
