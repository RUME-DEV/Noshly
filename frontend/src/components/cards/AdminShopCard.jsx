import { useFetcher } from "react-router-dom"
import styles from './Cards.module.css'
import { Store, MapPin, UserRound } from 'lucide-react'



// 1. Give each shop card its own independent fetcher
function AdminShopCard({ shop }) {
    const fetcher = useFetcher()

    // 2. Track this card's submission and revalidation state
    const isSubmitting = fetcher.state !== 'idle'

    return (
        <article className={styles.adminShopCard}>
            <div className={styles.adminShopHeader}>
                <div className={styles.adminShopIcon}>
                    <Store size={22} />
                </div>

                <div className={styles.adminShopTitle}>
                    <h3>{shop.name}</h3>

                    {/* 3. Show admin suspension separately from owner availability */}
                    <span
                        className={
                            shop.isSuspended
                                ? styles.suspendedBadge
                                : shop.isActive
                                    ? styles.activeBadge
                                    : styles.suspendedBadge
                        }
                    >
                        {shop.isSuspended
                            ? 'Suspended'
                            : shop.isActive
                                ? 'Active'
                                : 'Inactive'}
                    </span>
                </div>
            </div>

            <div className={styles.adminShopDetails}>
                <p>
                    <MapPin size={16} />
                    {shop.address}, {shop.city}, {shop.state}
                </p>

                <p>
                    <UserRound size={16} />
                    <strong>Owner:</strong>{' '}
                    {shop.owner?.fullName || 'Unavailable'}
                </p>

                <p>
                    <strong>Email:</strong>{' '}
                    {shop.owner?.email || 'Unavailable'}
                </p>

                <p>
                    <strong>Phone:</strong>{' '}
                    {shop.owner?.mobile || 'Not provided'}
                </p>

                <p>
                    <strong>Registered:</strong>{' '}
                    {new Date(shop.createdAt).toLocaleDateString()}
                </p>

                {/* 4. Show suspension information when applicable */}
                {shop.isSuspended && (
                    <>
                        <p>
                            <strong>Suspension reason:</strong>{' '}
                            {shop.suspensionReason || 'Not provided'}
                        </p>

                        <p>
                            <strong>Suspended on:</strong>{' '}
                            {shop.suspendedAt
                                ? new Date(shop.suspendedAt).toLocaleDateString()
                                : 'Unavailable'}
                        </p>

                        <p>
                            <strong>Suspended by:</strong>{' '}
                            {shop.suspendedBy?.fullName || 'Unavailable'}
                        </p>
                    </>
                )}

                <p>
                    <strong>Owner availability:</strong>{' '}
                    {shop.isActive ? 'Active' : 'Inactive'}
                </p>
            </div>

            {/* 5. Show feedback returned by this card's fetcher */}
            {fetcher.data?.message && (
                <p
                    className={
                        fetcher.data.success
                            ? styles.successMessage
                            : styles.errorMessage
                    }
                >
                    {fetcher.data.message}
                </p>
            )}

            <div className={styles.adminShopActions}>
                {shop.isSuspended ? (
                    // 6. Allow admin to remove the suspension
                    <fetcher.Form method="post">
                        <input
                            type="hidden"
                            name="shopId"
                            value={shop._id}
                        />

                        <button
                            type="submit"
                            name="intent"
                            value="reactivate"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Reactivating...'
                                : 'Reactivate Shop'}
                        </button>
                    </fetcher.Form>
                ) : (
                    // 7. Require a reason before suspending the shop
                    <fetcher.Form method="post">
                        <input
                            type="hidden"
                            name="shopId"
                            value={shop._id}
                        />

                        <textarea
                            name="suspensionReason"
                            placeholder="Enter reason for suspending this shop..."
                            required
                            rows={2}
                            disabled={isSubmitting}
                        />

                        <button
                            type="submit"
                            name="intent"
                            value="suspend"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Suspending...'
                                : 'Suspend Shop'}
                        </button>
                    </fetcher.Form>
                )}
            </div>
        </article>
    )
}


export default AdminShopCard