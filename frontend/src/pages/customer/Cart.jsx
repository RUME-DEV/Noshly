
import { Link } from 'react-router-dom'

import { useCart } from '../../context/CartContext'
import styles from './Customer.module.css'
import Reveal from '../../components/Reveal'

function Cart() {
    const {
        cart,
        cartCount,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart()

    // Calculate the subtotal of all cart items
    const subtotal = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    )

    // Display an empty cart state
    if (cart.items.length === 0) {
        return (
            <main className={styles.cartPage}>
                <Reveal animation="scale">
                    <div className={styles.emptyCart}>
                        <h1>Your Cart is Empty</h1>

                        <p>You haven't added any food items yet.</p>

                        <Link to="/" className={styles.continueShopping}>
                            Explore Shops
                        </Link>
                    </div>
                </Reveal>
            </main>
        )
    }

    return (
        <main className={styles.cartPage}>
            <Reveal animation="drop">
                <div className={styles.cartHeading}>
                    <div>
                        <h1>Your Cart</h1>
                        <p>{cartCount} item(s) in your cart</p>
                    </div>

                    <button
                        type="button"
                        className={styles.clearCartButton}
                        onClick={clearCart}
                    >
                        Clear Cart
                    </button>
                </div>
            </Reveal>

            {/* Shop information */}
            <Reveal animation="slideLeft">
                <div className={styles.cartShop}>
                    <h2>{cart.shop.name}</h2>
                    <p>Ordering from this shop</p>
                </div>
            </Reveal>

            {/* Cart items */}
            <div className={styles.cartItems}>
                {cart.items.map(item => (
                    <Reveal
                        key={item._id}
                        animation="scale"
                    >
                        <article className={styles.cartItem}>
                            <img
                                src={item.image}
                                alt={item.name}
                                className={styles.cartItemImage}
                            />

                            <div className={styles.cartItemInfo}>
                                <h3>{item.name}</h3>

                                <p>
                                    ₦{item.price.toLocaleString('en-NG')}
                                </p>

                                <button
                                    type="button"
                                    className={styles.removeItemButton}
                                    onClick={() => removeFromCart(item._id)}
                                >
                                    Remove
                                </button>
                            </div>

                            {/* Quantity controls */}
                            <div className={styles.quantityControls}>
                                <button
                                    type="button"
                                    onClick={() => updateQuantity(
                                        item._id,
                                        item.quantity - 1
                                    )}
                                    disabled={item.quantity === 1}
                                    aria-label={`Decrease ${item.name} quantity`}
                                >
                                    −
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    type="button"
                                    onClick={() => updateQuantity(
                                        item._id,
                                        item.quantity + 1
                                    )}
                                    aria-label={`Increase ${item.name} quantity`}
                                >
                                    +
                                </button>
                            </div>

                            <strong className={styles.cartItemTotal}>
                                ₦{(item.price * item.quantity).toLocaleString('en-NG')}
                            </strong>
                        </article>
                    </Reveal>
                ))}
            </div>

            {/* Cart summary */}
            <Reveal animation="slideRight">
                <section className={styles.cartSummary}>
                    <div className={styles.subtotalRow}>
                        <span>Subtotal</span>

                        <strong>
                            ₦{subtotal.toLocaleString('en-NG')}
                        </strong>
                    </div>

                    <p>
                        Delivery fee will be calculated at checkout.
                    </p>

                    <Link to="/checkout" className={styles.checkoutButton}>
                        Proceed to Checkout
                    </Link>

                    <Link to="/" className={styles.continueShoppingLink}>
                        Continue Shopping
                    </Link>
                </section>
            </Reveal>
        </main>
    )
}

export default Cart
