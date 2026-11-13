import { Link, useLoaderData } from 'react-router-dom'
import Reveal from '../../components/Reveal'

import styles from './Owner.module.css'

function MyShops() {
    const { shops, error } = useLoaderData()

    // Display an error if the shops could not be retrieved
    if (error) {
        return (
            <main className={styles.ownerPage}>
                <Reveal animation="drop">
                    <div className={styles.ownerPageHeader}>
                        <h1>My Shops</h1>
                    </div>
                </Reveal>

                <Reveal animation="moveUp">
                    <p className={styles.ownerError} role="alert">
                        {error}
                    </p>
                </Reveal>
            </main>
        )
    }

    return (
        <main className={styles.ownerPage}>
            <Reveal animation="drop">
                <div className={styles.ownerPageHeader}>
                    <div>
                        <h1>My Shops</h1>
                        <p>Manage your shops and their menus.</p>
                    </div>

                    <Link
                        to="/owner/shops/new"
                        className={styles.ownerPrimaryLink}
                    >
                        Create Shop
                    </Link>
                </div>
            </Reveal>

            {/* Display an empty state when the user has no shops */}
            {shops.length === 0 ? (
                <Reveal animation="scale">
                    <section className={styles.ownerEmptyState}>
                        <h2>You haven't created a shop yet</h2>
                        <p>Create your first shop to start adding food items.</p>

                        <Link
                            to="/owner/shops/new"
                            className={styles.ownerPrimaryLink}
                        >
                            Create Your First Shop
                        </Link>
                    </section>
                </Reveal>
            ) : (
                <section className={styles.ownerShopsGrid}>
                    {shops.map(shop => (
                        <Reveal key={shop._id} animation="scale">
                            <article className={styles.ownerShopCard}>
                                <img
                                    src={shop.image}
                                    alt={shop.name}
                                />

                                <div className={styles.ownerShopInfo}>
                                    <div className={styles.ownerShopHeading}>
                                        <h2>{shop.name}</h2>

                                        <span
                                            className={
                                                shop.isActive
                                                    ? styles.shopOpen
                                                    : styles.shopClosed
                                            }
                                        >
                                            {shop.isActive ? 'Open' : 'Closed'}
                                        </span>
                                    </div>

                                    <p>{shop.city}, {shop.state}</p>
                                    <p>{shop.address}</p>

                                    <Link
                                        to={`/owner/shops/${shop._id}`}
                                        className={styles.manageShopLink}
                                    >
                                        Manage Shop
                                    </Link>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </section>
            )}
        </main>
    )
}

export default MyShops