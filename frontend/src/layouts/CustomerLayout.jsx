
import {
    Link,
    NavLink,
    Outlet,
    useNavigate,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useAccount } from '../context/AccountContext'
import { useCart } from '../context/CartContext'

import { UserRound } from 'lucide-react'

import styles from './Layout.module.css'

function CustomerLayout() {

    const { user, loading, logout } = useAuth()

    const {
        hasShops,
        riderStatus,
        loading: accountLoading,
    } = useAccount()

    const { cartCount } = useCart()

    const navigate = useNavigate()

    // 1. Log out the current user
    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            navigate('/login')
        }
    }

    // 2. Apply an active class to the current navigation link
    const getNavLinkClass = ({ isActive }) =>
        `${styles.navbarLink} ${isActive ? styles.activeLink : ''}`

    return (
        <div className={styles.customerLayout}>
            <header className={styles.navbar}>
                {/* App name */}
                <Link to="/" className={styles.navbarBrand}>
                    Food App
                </Link>

                {/* Main navigation */}
                <nav className={styles.navbarLinks}>
                    <NavLink to="/" end className={getNavLinkClass}>
                        Home
                    </NavLink>

                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            `${styles.navbarLink} ${styles.navbarCart} ${
                                isActive ? styles.activeLink : ''
                            }`
                        }
                    >
                        Cart
                        <span className={styles.cartBadge}>
                            {cartCount}
                        </span>
                    </NavLink>

                    {/* 3. Customer links only require authentication */}
                    {!loading && user && (
                        <NavLink to="/my-orders" className={getNavLinkClass}>
                            My Orders
                        </NavLink>
                    )}

                    {/* 4. Show business links after account status loads */}
                    {!loading && user && !accountLoading && (
                        <>
                            {hasShops === true && (
                                <NavLink
                                    to="/owner/shops"
                                    className={getNavLinkClass}
                                >
                                    My Shops
                                </NavLink>
                            )}

                            {riderStatus === 'approved' && (
                                <NavLink
                                    to="/rider/dashboard"
                                    className={getNavLinkClass}
                                >
                                    Rider Dashboard
                                </NavLink>
                            )}

                            {(riderStatus === 'pending' ||
                                riderStatus === 'rejected') && (
                                <NavLink
                                    to="/rider/application"
                                    className={getNavLinkClass}
                                >
                                    Rider Application
                                </NavLink>
                            )}
                        </>
                    )}
                </nav>

                {/* User actions */}
                {!loading && (
                    user ? (
                        <div className={styles.navbarActions}>
                            <Link
                                to="/account"
                                className={styles.profileLink}
                                aria-label="My Account"
                                title="My Account"
                            >
                                <UserRound size={20} />
                            </Link>
                            
                            <span className={styles.navbarGreeting}>
                                Hi, {user.name}
                            </span>

                            <button
                                type="button"
                                className={styles.logoutButton}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className={styles.navbarActions}>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>
                    )
                )}
            </header>

            <main>
                <Outlet />
            </main>

            <footer className={styles.customerFooter}>
                <p>Food App &copy; 2026. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default CustomerLayout
