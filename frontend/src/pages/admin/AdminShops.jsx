
import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { Search } from 'lucide-react'

import Reveal from '../../components/Reveal'
import styles from './Admin.module.css'

import AdminShopCard from '../../components/cards/AdminShopCard'



function AdminShops() {
    const { shops, count, error } = useLoaderData()

    // 1. Track the search text and selected status filter
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    // 2. Filter shops by name, location, owner, and status
    const filteredShops = shops.filter((shop) => {
        const search = searchTerm.toLowerCase()

        const matchesSearch = [
            shop.name,
            shop.city,
            shop.state,
            shop.owner?.fullName,
            shop.owner?.email,
        ].some((value) => value?.toLowerCase().includes(search))

        // 3. Treat admin suspension as a separate status
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' &&
                shop.isActive &&
                !shop.isSuspended) ||
            (statusFilter === 'inactive' &&
                !shop.isActive &&
                !shop.isSuspended) ||
            (statusFilter === 'suspended' && shop.isSuspended)

        return matchesSearch && matchesStatus
    })

    return (
        <div className={styles.adminPage}>
            <Reveal animation="moveUp">
                <div className={styles.pageHeader}>
                    <h1>Shop Management</h1>
                    <p>
                        View and monitor shops registered on the platform.
                    </p>
                    <p className={styles.userCount}>
                        Total registered shops: {count}
                    </p>
                </div>
            </Reveal>

            {/* 4. Display loader errors */}
            {error && (
                <p className={styles.errorMessage}>{error}</p>
            )}

            {!error && (
                <>
                    {/* 5. Search and status filters */}
                    <div className={styles.shopFilters}>
                        <div className={styles.shopSearch}>
                            <Search size={18} />

                            <input
                                type="search"
                                placeholder="Search shop, owner, or location..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            aria-label="Filter shops by status"
                        >
                            <option value="all">All Shops</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>

                    {/* 6. Display the filtered shop list */}
                    {filteredShops.length === 0 ? (
                        <p className={styles.emptyMessage}>
                            {shops.length === 0
                                ? 'No shops have been registered yet.'
                                : 'No shops match your search.'}
                        </p>
                    ) : (
                        <div className={styles.shopList}>
                            {filteredShops.map((shop, index) => (
                                <Reveal
                                    key={shop._id}
                                    animation="moveUp"
                                    duration={`${1 + index * 0.1}s`}
                                >
                                    <AdminShopCard shop={shop} />
                                </Reveal>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default AdminShops
