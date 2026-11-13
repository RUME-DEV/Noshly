
import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'

import api from '../../services/api'
import styles from './Customer.module.css'
import Reveal from '../../components/Reveal'

function OrderDetails() {
    const { order, error: loaderError } = useLoaderData()

    const [currentOrder, setCurrentOrder] = useState(order)
    const [cancelling, setCancelling] = useState(false)
    const [cancelError, setCancelError] = useState('')

    // Format status and payment method values for display
    const formatStatus = (value) => {
        return value.replace(/([A-Z])/g, ' $1')
    }

    // Cancel an order that is still pending
    const handleCancelOrder = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to cancel this order?'
        )

        if (!confirmed) return

        setCancelling(true)
        setCancelError('')

        try {
            await api.patch(`/order/${currentOrder._id}/cancel`)

            // Update the displayed order status after successful cancellation
            setCurrentOrder(currentOrder => ({
                ...currentOrder,
                status: 'cancelled',
            }))
        } catch (error) {
            setCancelError(
                error.response?.data?.message ||
                'Unable to cancel your order. Please try again.'
            )
        } finally {
            setCancelling(false)
        }
    }

    // Display an error if the order could not be retrieved
    if (loaderError || !currentOrder) {
        return (
            <main className={styles.orderDetailsPage}>
                <Reveal animation="drop">
                    <h1>Order Details</h1>
                </Reveal>

                <Reveal animation="moveUp">
                    <p className={styles.ordersError} role="alert">
                        {loaderError || 'Order not found.'}
                    </p>
                </Reveal>

                <Reveal animation="slideLeft">
                    <Link to="/my-orders" className={styles.backToOrders}>
                        Back to My Orders
                    </Link>
                </Reveal>
            </main>
        )
    }

    return (
        <main className={styles.orderDetailsPage}>
            <Reveal animation="slideRight">
                <Link to="/my-orders" className={styles.backToOrders}>
                    ← Back to My Orders
                </Link>
            </Reveal>

            <Reveal animation="drop">
                <h1>Order Details</h1>
            </Reveal>

            {/* Order status and basic information */}
            <Reveal animation="scale">
                <section className={styles.orderDetailsCard}>
                    <div className={styles.detailsHeader}>
                        <div>
                            <h2>{currentOrder.shop?.name || 'Shop'}</h2>
                            <p>
                                Placed on{' '}
                                {new Date(currentOrder.createdAt).toLocaleDateString(
                                    'en-NG',
                                    {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    }
                                )}
                            </p>
                        </div>

                        <span className={styles.orderStatus}>
                            {formatStatus(currentOrder.status)}
                        </span>
                    </div>

                    <div className={styles.detailsInfo}>
                        <div>
                            <h3>Payment</h3>
                            <p>
                                Method: {formatStatus(currentOrder.paymentMethod)}
                            </p>
                            <p className={styles.paymentStatus}>
                                {formatStatus(currentOrder.paymentStatus)}
                            </p>
                        </div>

                        <div>
                            <h3>Delivery Address</h3>
                            <p>{currentOrder.deliveryAddress.street}</p>
                            <p>
                                {currentOrder.deliveryAddress.city},{' '}
                                {currentOrder.deliveryAddress.state}
                            </p>
                        </div>
                    </div>

                    {/* Cancellation controls */}
                    {currentOrder.status === 'pending' && (
                        <div className={styles.cancelOrderSection}>
                            {cancelError && (
                                <p className={styles.ordersError} role="alert">
                                    {cancelError}
                                </p>
                            )}

                            <button
                                type="button"
                                className={styles.cancelOrderButton}
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                            >
                                {cancelling ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                        </div>
                    )}
                </section>
            </Reveal>

            {/* Ordered food items */}
            <Reveal animation="slideLeft">
                <section className={styles.orderDetailsCard}>
                    <h2>Ordered Items</h2>

                    <div className={styles.detailsItems}>
                        {currentOrder.items.map((item, index) => (
                            <div
                                className={styles.orderItem}
                                key={`${currentOrder._id}-${index}`}
                            >
                                <span>
                                    {item.name} × {item.quantity}
                                </span>

                                <strong>
                                    ₦{(
                                        item.price * item.quantity
                                    ).toLocaleString('en-NG')}
                                </strong>
                            </div>
                        ))}
                    </div>
                </section>
            </Reveal>

            {/* Price breakdown */}
            <Reveal animation="slideRight">
                <section className={styles.orderDetailsCard}>
                    <h2>Order Summary</h2>

                    <div className={styles.priceBreakdown}>
                        <p>
                            <span>Subtotal</span>
                            <strong>
                                ₦{currentOrder.subtotal.toLocaleString('en-NG')}
                            </strong>
                        </p>

                        <p>
                            <span>Delivery Fee</span>
                            <strong>
                                ₦{currentOrder.deliveryFee.toLocaleString('en-NG')}
                            </strong>
                        </p>

                        <p className={styles.detailsTotal}>
                            <span>Total</span>
                            <strong>
                                ₦{currentOrder.totalAmount.toLocaleString('en-NG')}
                            </strong>
                        </p>
                    </div>
                </section>
            </Reveal>

            {/* Delivery rider information, when assigned */}
            {currentOrder.deliveryRider?.user && (
                <Reveal animation="scale">
                    <section className={styles.orderDetailsCard}>
                        <h2>Delivery Rider</h2>
                        <p>{currentOrder.deliveryRider.user.fullName}</p>

                        {currentOrder.deliveryRider.user.mobile && (
                            <p>{currentOrder.deliveryRider.user.mobile}</p>
                        )}
                    </section>
                </Reveal>
            )}
        </main>
    )
}

export default OrderDetails
