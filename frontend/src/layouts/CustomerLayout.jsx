
import {
    Link,
    NavLink,
    Outlet,
    useNavigate,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useAccount } from '../context/AccountContext'
import { useCart } from '../context/CartContext'

import {
    UserRound,
    House,
    ShoppingCart,
    ClipboardList,
    Store,
    Bike,
    LayoutDashboard,
    FileUser,
    Package,
} from 'lucide-react'

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
                {/* 3. Food App logo */}
                <Link to="/" className={styles.navbarBrand}>
                    <img
                        src="/foodAppLogo.png"
                        alt="Food App"
                    />

                    <span>Noshly</span>
                </Link>

                {/* 4. Main navigation */}
                <nav className={styles.navbarLinks}>

                    {/* 5. Home */}
                    <NavLink
                        to="/"
                        end
                        className={getNavLinkClass}
                        data-label="Home"
                        aria-label="Home"
                    >
                        <House size={20} />
                    </NavLink>

                    {/* 6. Cart with item count */}
                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            `${styles.navbarLink} ${styles.navbarCart} ${
                                isActive ? styles.activeLink : ''
                            }`
                        }
                        data-label="Cart"
                        aria-label={`Cart, ${cartCount} items`}
                    >
                        <ShoppingCart size={20} />
                        <span className={styles.cartBadge}>
                            {cartCount}
                        </span>
                    </NavLink>

                    {/* 7. Customer links only require authentication */}
                    {!loading && user && (
                        <>
                        <NavLink
                            to="/my-orders"
                            className={getNavLinkClass}
                            data-label="My Orders"
                            aria-label="My Orders"
                            >
                            <ClipboardList size={20} />
                        </NavLink>

                        {
                            ["admin", "superAdmin"].includes(user.role) && (
                                <NavLink
                                    to="/admin/dashboard"
                                    className={getNavLinkClass}
                                    data-label="Admin Dashboard"
                                    aria-label='Admin Dashboard'
                                >
                                    <LayoutDashboard size={20} />
                                </NavLink>
                            )
                        }

                        </>
                    )}

                    {/* 8. Show business links after account status loads */}
                    {!loading && user && !accountLoading && (
                        <>
                            {hasShops === true && (
                                <>
                                    <NavLink
                                        to="/owner/shops"
                                        className={getNavLinkClass}
                                        data-label="My Shops"
                                        aria-label="My Shops"
                                    >
                                        <Store size={20} />
                                    </NavLink>

                                    <NavLink
                                        to="/owner/orders"
                                        className={getNavLinkClass}
                                        data-label="Shop Orders"
                                        aria-label="Shop Orders"
                                    >
                                        <Package size={20} />
                                    </NavLink>
                                </>
                            )}

                            {riderStatus === 'approved' && (
                                <NavLink
                                    to="/rider/dashboard"
                                    className={getNavLinkClass}
                                    data-label="Rider Dashboard"
                                    aria-label="Rider Dashboard"
                                >
                                    <Bike size={20} />
                                </NavLink>
                            )}

                            {(riderStatus === 'pending' ||
                                riderStatus === 'rejected') && (
                                <NavLink
                                    to="/rider/application"
                                    className={getNavLinkClass}
                                    data-label="Rider Application"
                                    aria-label="Rider Application"
                                >
                                    <FileUser size={20} />
                                </NavLink>
                            )}
                        </>
                    )}
                </nav>

                {/* 9. User actions */}
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

                            <span 
                                className={styles.navbarGreeting}
                                title={`Hi, ${user.name}`}
                            >
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
                <p>Noshly &copy; 2026. All rights reserved.</p>

                <div className={styles.footerLinks}>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                </div>
            </footer>
        </div>
    )
}

export default CustomerLayout
