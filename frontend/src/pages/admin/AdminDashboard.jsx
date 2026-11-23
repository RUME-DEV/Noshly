
import { useLoaderData } from 'react-router-dom'
import {
    Users,
    Store,
    ShoppingBag,
    CheckCircle,
    TrendingUp,
    Wallet,
} from 'lucide-react'

import Reveal from '../../components/Reveal'
import styles from './Admin.module.css'

// 1. Format amounts as Nigerian Naira
const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2,
    }).format(amount)

function AdminDashboard() {
    const { stats, error } = useLoaderData()

    // 2. Define the dashboard cards using the backend statistics
    const dashboardCards = stats
        ? [
            {
                title: 'Total Users',
                value: stats.totalUsers,
                icon: Users,
            },
            {
                title: 'Total Shops',
                value: stats.totalShops,
                icon: Store,
            },
            {
                title: 'Total Orders',
                value: stats.totalOrders,
                icon: ShoppingBag,
            },
            {
                title: 'Completed Orders',
                value: stats.completedOrders,
                icon: CheckCircle,
            },
            {
                title: 'Total Sales',
                value: formatCurrency(stats.totalSales),
                icon: TrendingUp,
            },
            {
                title: 'Total Commission',
                value: formatCurrency(stats.totalCommission),
                icon: Wallet,
            },
        ]
        : []

    return (
        <div className={styles.dashboardPage}>
            <Reveal animation="moveUp">
                <div className={styles.pageHeader}>
                    <h1>Dashboard</h1>
                    <p>
                        Overview of activity across the food delivery platform.
                    </p>
                </div>
            </Reveal>

            {/* 3. Display an error if the statistics could not be loaded */}
            {error && (
                <p className={styles.errorMessage}>{error}</p>
            )}

            {/* 4. Display the statistics */}
            {stats && (
                <div className={styles.statsGrid}>
                    {dashboardCards.map((card, index) => {
                        const Icon = card.icon

                        return (
                            <Reveal
                                key={card.title}
                                animation="moveUp"
                                duration={`${1 + index * 0.1}s`}
                            >
                                <article className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <Icon size={22} />
                                    </div>

                                    <div className={styles.statInfo}>
                                        <p className={styles.statTitle}>
                                            {card.title}
                                        </p>

                                        <h2 className={styles.statValue}>
                                            {card.value}
                                        </h2>
                                    </div>
                                </article>
                            </Reveal>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
