
import {
    Form,
    useLoaderData,
    useActionData,
    useNavigation,
} from 'react-router-dom'

import {
    Bike,
    MapPin,
    Package,
    Store,
    UserRound,
    CheckCircle,
    Clock,
} from 'lucide-react'

import Reveal from '../../components/Reveal'
import styles from './Rider.module.css'

// 1. Format order amounts as Nigerian Naira.
const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2,
    }).format(amount)

// 2. Make backend status values easier to read.
const formatStatus = (status) =>
    status.replace(/([A-Z])/g, ' $1')

function RiderDashboard() {
    const {
        availableDeliveries,
        myDeliveries,
        errors,
    } = useLoaderData()

    const actionData = useActionData()
    const navigation = useNavigation()

    // 3. Disable delivery buttons while an action is being processed.
    const isSubmitting = navigation.state === 'submitting'

    return (
        <main className={styles.riderPage}>
            <Reveal animation="up">
                <header className={styles.dashboardHeader}>
                    <div>
                        <h1>Rider Dashboard</h1>
                        <p>Manage your deliveries and update their progress.</p>
                    </div>

                    <Bike size={34} />
                </header>
            </Reveal>

            {/* 4. Show feedback returned by the dashboard action. */}
            {actionData?.success && (
                <p className={styles.riderSuccess}>
                    {actionData.success}
                </p>
            )}

            {actionData?.error && (
                <p className={styles.riderError}>
                    {actionData.error}
                </p>
            )}

            {isSubmitting && (
                <p className={styles.loadingMessage}>
                    <Clock size={15} />
                    Processing delivery action...
                </p>
            )}

            {/* 5. Display deliveries that have not been accepted yet. */}
            <Reveal animation="up">
                <section className={styles.deliverySection}>
                    <div className={styles.sectionHeader}>
                        <h2>Available Deliveries</h2>
                        <span>{availableDeliveries.length}</span>
                    </div>

                    {errors.available && (
                        <p className={styles.riderError}>
                            {errors.available}
                        </p>
                    )}

                    {!errors.available && availableDeliveries.length === 0 && (
                        <p className={styles.emptyMessage}>
                            No deliveries are currently available.
                        </p>
                    )}

                    <div className={styles.deliveryGrid}>
                        {availableDeliveries.map((order) => (
                            <article
                                key={order._id}
                                className={styles.deliveryCard}
                            >
                                <div className={styles.deliveryCardHeader}>
                                    <h3>
                                        <Store size={18} />
                                        {order.shop.name}
                                    </h3>

                                    <span className={styles.statusBadge}>
                                        Ready for pickup
                                    </span>
                                </div>

                                <div className={styles.deliveryDetails}>
                                    <p>
                                        <MapPin size={16} />
                                        {order.deliveryAddress.city},{' '}
                                        {order.deliveryAddress.state}
                                    </p>

                                    <p>
                                        <Package size={16} />
                                        {order.items.length} item types
                                    </p>
                                </div>

                                <div className={styles.orderItems}>
                                    {order.items.map((item, index) => (
                                        <p key={`${order._id}-${index}`}>
                                            {item.name} × {item.quantity}
                                        </p>
                                    ))}
                                </div>

                                <div className={styles.deliveryTotal}>
                                    <span>Order total</span>
                                    <strong>
                                        {formatCurrency(order.totalAmount)}
                                    </strong>
                                </div>

                                <Form method="post">
                                    <input
                                        type="hidden"
                                        name="intent"
                                        value="accept"
                                    />

                                    <input
                                        type="hidden"
                                        name="orderId"
                                        value={order._id}
                                    />

                                    <button
                                        type="submit"
                                        className={styles.riderButton}
                                        disabled={isSubmitting}
                                    >
                                        <Bike size={17} />
                                        Accept Delivery
                                    </button>
                                </Form>
                            </article>
                        ))}
                    </div>
                </section>
            </Reveal>

            {/* 6. Display deliveries already assigned to this rider. */}
            <Reveal animation="up">
                <section className={styles.deliverySection}>
                    <div className={styles.sectionHeader}>
                        <h2>My Deliveries</h2>
                        <span>{myDeliveries.length}</span>
                    </div>

                    {errors.myDeliveries && (
                        <p className={styles.riderError}>
                            {errors.myDeliveries}
                        </p>
                    )}

                    {!errors.myDeliveries && myDeliveries.length === 0 && (
                        <p className={styles.emptyMessage}>
                            You haven't accepted any deliveries yet.
                        </p>
                    )}

                    <div className={styles.deliveryGrid}>
                        {myDeliveries.map((order) => (
                            <article
                                key={order._id}
                                className={styles.deliveryCard}
                            >
                                <div className={styles.deliveryCardHeader}>
                                    <h3>
                                        <Store size={18} />
                                        {order.shop.name}
                                    </h3>

                                    <span className={styles.statusBadge}>
                                        {formatStatus(order.status)}
                                    </span>
                                </div>

                                <div className={styles.deliveryDetails}>
                                    <p>
                                        <UserRound size={16} />
                                        {order.customer.fullName}
                                    </p>

                                    <p>
                                        <MapPin size={16} />
                                        {order.deliveryAddress.street},{' '}
                                        {order.deliveryAddress.city},{' '}
                                        {order.deliveryAddress.state}
                                    </p>
                                </div>

                                <div className={styles.orderItems}>
                                    {order.items.map((item, index) => (
                                        <p key={`${order._id}-${index}`}>
                                            {item.name} × {item.quantity}
                                        </p>
                                    ))}
                                </div>

                                <div className={styles.deliveryTotal}>
                                    <span>Order total</span>
                                    <strong>
                                        {formatCurrency(order.totalAmount)}
                                    </strong>
                                </div>

                                {/* 7. Allow the rider to progress the delivery. */}
                                {order.status === 'readyForPickup' && (
                                    <Form method="post">
                                        <input
                                            type="hidden"
                                            name="intent"
                                            value="updateStatus"
                                        />

                                        <input
                                            type="hidden"
                                            name="orderId"
                                            value={order._id}
                                        />

                                        <input
                                            type="hidden"
                                            name="status"
                                            value="pickedUp"
                                        />

                                        <button
                                            type="submit"
                                            className={styles.riderButton}
                                            disabled={isSubmitting}
                                        >
                                            <Bike size={17} />
                                            Mark as Picked Up
                                        </button>
                                    </Form>
                                )}

                                {order.status === 'pickedUp' && (
                                    <Form method="post">
                                        <input
                                            type="hidden"
                                            name="intent"
                                            value="updateStatus"
                                        />

                                        <input
                                            type="hidden"
                                            name="orderId"
                                            value={order._id}
                                        />

                                        <input
                                            type="hidden"
                                            name="status"
                                            value="delivered"
                                        />

                                        <button
                                            type="submit"
                                            className={styles.riderButton}
                                            disabled={isSubmitting}
                                        >
                                            <CheckCircle size={17} />
                                            Mark as Delivered
                                        </button>
                                    </Form>
                                )}

                                {/* 8. Only show cash confirmation when it is actually required. */}
                                {order.status === 'delivered' &&
                                    order.paymentMethod === 'cash' &&
                                    order.paymentStatus === 'pending' && (
                                        <Form method="post">
                                            <input
                                                type="hidden"
                                                name="intent"
                                                value="confirmCash"
                                            />

                                            <input
                                                type="hidden"
                                                name="orderId"
                                                value={order._id}
                                            />

                                            <button
                                                type="submit"
                                                className={styles.riderButton}
                                                disabled={isSubmitting}
                                            >
                                                <CheckCircle size={17} />
                                                Confirm Cash Collected
                                            </button>
                                        </Form>
                                    )}

                                {order.status === 'delivered' &&
                                    order.paymentStatus === 'paid' && (
                                        <p className={styles.paymentSuccess}>
                                            <CheckCircle size={16} />
                                            Payment confirmed
                                        </p>
                                    )}

                                {order.status === 'delivered' &&
                                    order.paymentMethod === 'online' && (
                                        <p className={styles.paymentInfo}>
                                            Online payment
                                        </p>
                                    )}
                            </article>
                        ))}
                    </div>
                </section>
            </Reveal>
        </main>
    )
}

export default RiderDashboard
