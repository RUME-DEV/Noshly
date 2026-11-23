
import {
    Form,
    Link,
    useActionData,
    useLoaderData,
    useNavigation,
} from 'react-router-dom'
import { Phone } from 'lucide-react'

import styles from './Customer.module.css'
import Reveal from '../../components/Reveal'

function OrderDetails() {
    const { order, error: loaderError } = useLoaderData()
    const actionData = useActionData()
    const navigation = useNavigation()

    const currentOrder = order
    const cancelling = navigation.state === 'submitting'

    // Format status and payment method values for display
    const formatStatus = (value) => {
        return value.replace(/([A-Z])/g, ' $1')
    }

    // Confirm cancellation before submitting the form
    const handleCancelSubmit = (event) => {
        const confirmed = window.confirm(
            'Are you sure you want to cancel this order?'
        )

        if (!confirmed) {
            event.preventDefault()
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

                    {/* Display why the order was cancelled */}
                    {currentOrder.status === 'cancelled' &&
                        currentOrder.cancellationReason && (
                            <div className={styles.cancellationReason}>
                                <h3>Cancellation Reason</h3>
                                <p>{currentOrder.cancellationReason}</p>
                            </div>
                    )}

                    {/* Action Success Message */}
                    {actionData?.success && (
                        <p role="status">{actionData.success}</p>
                    )}

                    {/* Cancellation controls */}
                    {currentOrder.status === 'pending' && (
                        <div className={styles.cancelOrderSection}>
                            {actionData?.error && (
                                <p className={styles.ordersError} role="alert">
                                    {actionData.error}
                                </p>
                            )}

                            <Form
                                method="post"
                                onSubmit={handleCancelSubmit}
                                className={styles.cancelOrderForm}
                            >
                                <input
                                    type="hidden"
                                    name="intent"
                                    value="cancelOrder"
                                />

                                <input
                                    type="hidden"
                                    name="orderId"
                                    value={currentOrder._id}
                                />

                                <label htmlFor="cancellationReason">
                                    Reason for cancellation (optional)
                                </label>

                                <textarea
                                    id="cancellationReason"
                                    name="reason"
                                    rows="3"
                                    maxLength="500"
                                    placeholder="Tell us why you want to cancel..."
                                />

                                <button
                                    type="submit"
                                    className={styles.cancelOrderButton}
                                    disabled={cancelling}
                                >
                                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            </Form>
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
                    <section className={`${styles.orderDetailsCard} ${styles.riderDetailsCard}`}>
                        <h2>Delivery Rider</h2>

                        <div className={styles.riderContact}>
                            <div className={styles.riderInfo}>
                                <h3>
                                    {currentOrder.deliveryRider.user.fullName}
                                </h3>

                                {currentOrder.deliveryRider.user.mobile ? (
                                    <p>
                                        {currentOrder.deliveryRider.user.mobile}
                                    </p>
                                ) : (
                                    <p>Phone number unavailable</p>
                                )}
                            </div>

                            {currentOrder.deliveryRider.user.mobile && (
                                <a
                                    href={`tel:${currentOrder.deliveryRider.user.mobile}`}
                                    className={styles.callRiderButton}
                                >
                                    <Phone size={17} />
                                    <span>Call Rider</span>
                                </a>
                            )}
                        </div>
                    </section>
                </Reveal>
            )}
        </main>
    )
}

export default OrderDetails
