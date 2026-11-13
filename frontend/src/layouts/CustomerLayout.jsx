import {
    Link,
    NavLink,
    Outlet,
    useNavigate,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import styles from './Layout.module.css'

function CustomerLayout() {
    const { user, loading, logout } = useAuth()
    const { cartCount } = useCart()
    const navigate = useNavigate()

    // Log out the current user.
    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            navigate('/login')
        }
    }

    // Apply an active class to the current navigation link.
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

                    {!loading && user && (
                        <NavLink
                            to="/my-orders"
                            className={getNavLinkClass}
                        >
                            My Orders
                        </NavLink>
                    )}
                </nav>

                {/* User actions */}
                {!loading && (
                    user ? (
                        <div className={styles.navbarActions}>
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
