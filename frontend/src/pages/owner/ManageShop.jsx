import { Link, useLoaderData } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import styles from './Owner.module.css'

function ManageShop() {
    const { shop, items, error } = useLoaderData()

    if (error) {
        return (
            <main className={styles.ownerPage}>
                <Reveal animation="moveUp">
                    <p className={styles.ownerError} role="alert">
                        {error}
                    </p>
                </Reveal>

                <Reveal animation="slideRight">
                    <Link to="/owner/shops">
                        Back to My Shops
                    </Link>
                </Reveal>
            </main>
        )
    }

    return (
        <main className={styles.ownerPage}>
            <Reveal animation="slideRight">
                <Link to="/owner/shops" className={styles.ownerBackLink}>
                    ← Back to My Shops
                </Link>
            </Reveal>

            <header className={styles.manageShopHeader}>
                <Reveal
                    animation="slideLeft"
                    className={styles.manageShopInfo}
                >
                    <div>
                        <Reveal animation="drop">
                            <h1>{shop.name}</h1>
                        </Reveal>

                        <Reveal animation="moveUp">
                            <p>{shop.address}, {shop.city}, {shop.state}</p>
                        </Reveal>

                        <Reveal animation="scale">
                            <span
                                className={
                                    shop.isActive
                                        ? styles.shopOpen
                                        : styles.shopClosed
                                }
                            >
                                {shop.isActive ? 'Open' : 'Closed'}
                            </span>
                        </Reveal>
                    </div>

                    <Reveal animation="moveUp">
                        <div className={styles.manageShopActions}>
                            <Link
                                to={`/owner/shops/${shop._id}/edit`}
                                className={styles.ownerPrimaryLink}
                            >
                                Edit Shop
                            </Link>
                        </div>
                    </Reveal>
                </Reveal>

                <Reveal animation="slideRight">
                    <img
                        src={shop.image}
                        alt={shop.name}
                        className={styles.manageShopImage}
                    />
                </Reveal>
            </header>

            <section className={styles.manageShopSection}>
                <Reveal animation="slideLeft">
                    <div className={styles.ownerPageHeader}>
                        <div>
                            <h2>Food Menu</h2>
                            <p>Manage the food items available in your shop.</p>
                        </div>

                        <span>{items.length} items</span>
                    </div>
                </Reveal>

                {items.length === 0 ? (
                    <Reveal animation="scale">
                        <div className={styles.ownerEmptyState}>
                            <h3>Your menu is empty</h3>
                            <p>
                                You haven't added any food items to this shop yet.
                            </p>
                        </div>
                    </Reveal>
                ) : (
                    <div className={styles.ownerItemsGrid}>
                        {items.map((item) => (
                            <Reveal key={item._id} animation="scale">
                                <article className={styles.ownerItemCard}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                    />

                                    <div>
                                        <h3>{item.name}</h3>
                                        <p>{item.category}</p>
                                        <p>{item.foodType}</p>
                                        <strong>
                                            ₦{Number(item.price).toLocaleString()}
                                        </strong>
                                    </div>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

export default ManageShop