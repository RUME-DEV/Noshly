
import {
    Link,
    NavLink,
    Outlet,
    useNavigate,
    useNavigation,
} from 'react-router-dom'

import {
    LayoutDashboard,
    Users,
    ExternalLink,
    LogOut,
    Store,
    ShoppingBag,
    ChevronDown,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'
import ScrollToTop from '../components/ScrollToTop'

import styles from './Layout.module.css'

function AdminLayout() {

    const { user, logout } = useAuth()

    const navigation = useNavigation()
    const navigate = useNavigate()

    // 1. Handle admin logout
    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            navigate('/login')
        }
    }

    // 2. Apply active styling to the selected sidebar link
    const getNavLinkClass = ({ isActive }) =>
        `${styles.adminNavLink} ${isActive ? styles.adminActiveLink : ''}`

    // 3. Reuse the same navigation links for desktop and mobile
    const adminNavLinks = (
        <>
            <NavLink to="/admin/dashboard" className={getNavLinkClass}>
                <LayoutDashboard size={19} />
                <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/rider-applications" className={getNavLinkClass}>
                <Users size={19} />
                <span>Rider Applications</span>
            </NavLink>

            <NavLink to="/admin/users" className={getNavLinkClass}>
                <Users size={19} />
                <span>User Management</span>
            </NavLink>

            <NavLink to="/admin/shops" className={getNavLinkClass}>
                <Store size={19} />
                <span>Shop Management</span>
            </NavLink>

            <NavLink to="/admin/orders" className={getNavLinkClass}>
                <ShoppingBag size={19} />
                <span>Order Management</span>
            </NavLink>
        </>
    )

    return (
        <div className={styles.adminLayout}>
            {navigation.state === 'loading' && <Loading />}
            <ScrollToTop />

            {/* 4. Sidebar navigation */}
            <aside className={styles.adminSidebar}>
                {/* Admin sidebar branding */}
                <Link to="/admin/dashboard" className={styles.adminBrand}>
                    <img src="/foodAppLogo.png" alt="Food App" />
                    <span>Noshly</span>
                    <span>Admin Panel</span>
                </Link>

                <nav className={styles.adminNav}>
                    {adminNavLinks}
                </nav>

                

                {/* Sidebar footer actions */}
                <div className={styles.adminSidebarFooter}>
                    <Link to="/" className={styles.adminFooterLink}>
                        <ExternalLink size={18} />
                        <span>Back to Food App</span>
                    </Link>

                    <button
                        type="button"
                        className={styles.adminLogout}
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            
            
            {/* 5. Mobile collapsible navigation */}
            <details className={styles.mobileAdminNav}>
                <summary>
                    <span>Admin Navigation</span>
                    <ChevronDown size={20} />
                </summary>

                <nav className={styles.mobileAdminLinks}>
                    {adminNavLinks}

                    <Link to="/" className={styles.adminFooterLink}>
                        <ExternalLink size={18} />
                        <span>Back to Food App</span>
                    </Link>

                    <button
                        type="button"
                        className={styles.adminLogout}
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </nav>
            </details>

            {/* 6. Admin page content */}
            <div className={styles.adminMain}>
                <header className={styles.adminHeader}>
                    <h2>Admin Panel</h2>
                    <span>Welcome, {user?.name}</span>
                </header>

                <main className={styles.adminContent}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
