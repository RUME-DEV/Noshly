
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import styles from './Customer.module.css'
import Reveal from '../../components/Reveal'

const DELIVERY_FEE = 1000

function Checkout() {
    const { cart, cartCount, clearCart } = useCart()
    const { user } = useAuth()

    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
    })

    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [placedOrder, setPlacedOrder] = useState(null)

    // Calculate the subtotal from the current cart
    const subtotal = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    )

    // Calculate the estimated total for display
    const estimatedTotal = subtotal + DELIVERY_FEE

    // Update the delivery address fields
    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData(currentData => ({
            ...currentData,
            [name]: value,
        }))
    }

    // Submit the order to the backend
    const handleSubmit = async (event) => {
        event.preventDefault()

        setError('')
        setSubmitting(true)

        try {
            const orderData = {
                shop: cart.shop._id,

                items: cart.items.map(item => ({
                    item: item._id,
                    quantity: item.quantity,
                })),

                deliveryAddress: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                },

                paymentMethod: 'cash',
            }

            const response = await api.post('/order', orderData)

            // Save the created order before clearing the cart
            setPlacedOrder(response.data.order)

            // Empty the cart only after successful order creation
            clearCart()

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to place your order. Please try again.'
            )
        } finally {
            setSubmitting(false)
        }
    }

    // Display the order confirmation after successful submission
    if (placedOrder) {
        return (
            <main className={styles.checkoutPage}>
                <Reveal animation="scale">
                    <section className={styles.orderSuccess}>
                        <h1>Order Placed Successfully!</h1>

                        <p>
                            Thank you, {user?.name}. Your order has been
                            submitted successfully.
                        </p>

                        <div className={styles.successOrderDetails}>
                            <p>
                                <strong>Order ID:</strong> {placedOrder._id}
                            </p>

                            <p>
                                <strong>Payment:</strong> Cash on Delivery
                            </p>

                            <p>
                                <strong>Total:</strong>{' '}
                                ₦{placedOrder.totalAmount.toLocaleString('en-NG')}
                            </p>

                            <p>
                                <strong>Status:</strong> {placedOrder.status}
                            </p>
                        </div>

                        <Link to="/" className={styles.checkoutButton}>
                            Continue Shopping
                        </Link>
                    </section>
                </Reveal>
            </main>
        )
    }

    // Prevent checkout when the cart is empty
    if (cart.items.length === 0) {
        return (
            <main className={styles.checkoutPage}>
                <Reveal animation="scale">
                    <section className={styles.emptyCart}>
                        <h1>Your Cart is Empty</h1>

                        <p>Add some food before proceeding to checkout.</p>

                        <Link to="/" className={styles.continueShopping}>
                            Explore Shops
                        </Link>
                    </section>
                </Reveal>
            </main>
        )
    }

    return (
        <main className={styles.checkoutPage}>
            <Reveal animation="slideRight">
                <Link to="/cart" className={styles.backLink}>
                    ← Back to Cart
                </Link>
            </Reveal>

            <Reveal animation="drop">
                <h1 className={styles.checkoutHeading}>Checkout</h1>
            </Reveal>

            <div className={styles.checkoutGrid}>
                {/* Delivery details form */}
                <Reveal animation="slideLeft">
                    <form
                        className={styles.checkoutForm}
                        onSubmit={handleSubmit}
                    >
                        <section className={styles.checkoutSection}>
                            <h2>Delivery Address</h2>

                            {error && (
                                <p
                                    className={styles.checkoutError}
                                    role="alert"
                                >
                                    {error}
                                </p>
                            )}

                            <div className={styles.checkoutFormGroup}>
                                <label htmlFor="street">
                                    Street Address
                                </label>

                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    placeholder="Enter your street address"
                                    required
                                />
                            </div>

                            <div className={styles.checkoutFormGroup}>
                                <label htmlFor="city">
                                    City
                                </label>

                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter your city"
                                    required
                                />
                            </div>

                            <div className={styles.checkoutFormGroup}>
                                <label htmlFor="state">
                                    State
                                </label>

                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="Enter your state"
                                    required
                                />
                            </div>
                        </section>

                        <section className={styles.checkoutSection}>
                            <h2>Payment Method</h2>

                            <div className={styles.paymentOption}>
                                <input
                                    type="radio"
                                    id="cash"
                                    name="paymentMethod"
                                    value="cash"
                                    checked
                                    readOnly
                                />

                                <label htmlFor="cash">
                                    Cash on Delivery
                                </label>
                            </div>

                            <p className={styles.paymentDescription}>
                                Pay the rider when your order is delivered.
                            </p>
                        </section>

                        <button
                            type="submit"
                            className={styles.placeOrderButton}
                            disabled={submitting}
                        >
                            {submitting ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </Reveal>

                {/* Order summary */}
                <Reveal animation="slideRight">
                    <aside className={styles.checkoutSummary}>
                        <h2>Order Summary</h2>

                        <p className={styles.checkoutShopName}>
                            {cart.shop.name}
                        </p>

                        <div className={styles.checkoutItems}>
                            {cart.items.map(item => (
                                <div
                                    className={styles.checkoutItem}
                                    key={item._id}
                                >
                                    <div>
                                        <p>{item.name}</p>
                                        <span>Quantity: {item.quantity}</span>
                                    </div>

                                    <strong>
                                        ₦{(
                                            item.price * item.quantity
                                        ).toLocaleString('en-NG')}
                                    </strong>
                                </div>
                            ))}
                        </div>

                        <div className={styles.checkoutTotalRow}>
                            <span>Items ({cartCount})</span>
                            <strong>
                                ₦{subtotal.toLocaleString('en-NG')}
                            </strong>
                        </div>

                        <div className={styles.checkoutTotalRow}>
                            <span>Delivery Fee</span>
                            <strong>
                                ₦{DELIVERY_FEE.toLocaleString('en-NG')}
                            </strong>
                        </div>

                        <div className={styles.checkoutGrandTotal}>
                            <span>Total</span>
                            <strong>
                                ₦{estimatedTotal.toLocaleString('en-NG')}
                            </strong>
                        </div>

                        <p className={styles.checkoutNotice}>
                            Final order total will be confirmed when you place your order.
                        </p>
                    </aside>
                </Reveal>
            </div>
        </main>
    )
}

export default Checkout
