
import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'

import { useCart } from '../../context/CartContext'
import styles from './Customer.module.css'
import Reveal from '../../components/Reveal'

function ShopDetails() {
    const { shop, items, error } = useLoaderData()

    const { addToCart } = useCart()

    const [cartMessage, setCartMessage] = useState({
        text: '',
        success: false,
    })

    // Handle adding a food item to the cart
    const handleAddToCart = (item) => {
        const result = addToCart(item, shop)

        setCartMessage({
            text: result.message,
            success: result.success,
        })
    }

    // Display an error if the shop could not be loaded
    if (error) {
        return (
            <main className={styles.shopDetailsPage}>
                <Reveal animation="moveUp">
                    <p className={styles.shopDetailsError} role="alert">
                        {error}
                    </p>
                </Reveal>

                <Reveal animation="slideRight">
                    <Link to="/" className={styles.backLink}>
                        Back to Shops
                    </Link>
                </Reveal>
            </main>
        )
    }

    return (
        <main className={styles.shopDetailsPage}>
            {/* Back navigation */}
            <Reveal animation="slideRight">
                <Link to="/" className={styles.backLink}>
                    ← Back to Shops
                </Link>
            </Reveal>

            {/* Shop information */}
            <Reveal animation="drop">
                <section className={styles.shopHeader}>
                    <img
                        src={shop.image}
                        alt={shop.name}
                        className={styles.shopImage}
                    />

                    <div className={styles.shopInfo}>
                        <span className={styles.sectionLabel}>OUR SHOP</span>

                        <h1>{shop.name}</h1>

                        <p>{shop.address}</p>
                        <p>{shop.city}, {shop.state}</p>
                    </div>
                </section>
            </Reveal>

            {/* Food items */}
            <section className={styles.itemsSection}>
                <Reveal animation="slideLeft">
                    <div className={styles.itemsHeading}>
                        <h2>Our Menu</h2>
                        <p>Explore the food available at this shop.</p>
                    </div>
                </Reveal>

                {items.length === 0 ? (
                    <Reveal animation="scale">
                        <p className={styles.emptyItems}>
                            This shop has no food items available yet.
                        </p>
                    </Reveal>
                ) : (
                    <div className={styles.itemsGrid}>
                        {items.map(item => (
                            <Reveal
                                key={item._id}
                                animation="scale"
                            >
                                <article className={styles.itemCard}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={styles.itemImage}
                                    />

                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemCategory}>
                                            {item.category}
                                        </span>

                                        <h3>{item.name}</h3>

                                        <p>{item.foodType}</p>

                                        <strong>
                                            ₦{item.price.toLocaleString('en-NG')}
                                        </strong>

                                        <button
                                            type="button"
                                            className={styles.addToCartButton}
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                )}

                {/* Cart feedback */}
                {cartMessage.text && (
                    <Reveal animation="moveUp">
                        <p
                            className={`${styles.cartMessage} ${
                                cartMessage.success
                                    ? styles.cartMessageSuccess
                                    : styles.cartMessageError
                            }`}
                            role="status"
                        >
                            {cartMessage.text}
                        </p>
                    </Reveal>
                )}
            </section>
        </main>
    )
}

export default ShopDetails
