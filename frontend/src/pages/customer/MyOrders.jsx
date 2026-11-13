
import { Link, useLoaderData } from 'react-router-dom'

import styles from './Customer.module.css'
import Reveal from '../../components/Reveal'

function MyOrders() {
    const { orders, error } = useLoaderData()

    // Format status for display
    const formatStatus = (status) => {
        return status
            .replace(/([A-Z])/g, ' $1')
    }

    // Display an error if the orders could not be retrieved
    if (error) {
        return (
            <main className={styles.myOrdersPage}>
                <Reveal animation="drop">
                    <h1>My Orders</h1>
                </Reveal>

                <Reveal animation="moveUp">
                    <p className={styles.ordersError} role="alert">
                        {error}
                    </p>
                </Reveal>
            </main>
        )
    }

    // Display an empty state when the customer has no orders
    if (orders.length === 0) {
        return (
            <main className={styles.myOrdersPage}>
                <Reveal animation="drop">
                    <h1>My Orders</h1>
                </Reveal>

                <Reveal animation="scale">
                    <section className={styles.emptyOrders}>
                        <h2>No Orders Yet</h2>
                        <p>Your orders will appear here once you place one.</p>

                        <Link to="/" className={styles.continueShopping}>
                            Explore Shops
                        </Link>
                    </section>
                </Reveal>
            </main>
        )
    }

    return (
        <main className={styles.myOrdersPage}>
            <Reveal animation="drop">
                <h1>My Orders</h1>
            </Reveal>

            <div className={styles.ordersList}>
                {orders.map(order => (
                    <Reveal
                        key={order._id}
                        animation="scale"
                        duration="0.8s"
                    >
                        <article className={styles.orderCard}>
                            {/* Shop and order information */}
                            <div className={styles.orderCardHeader}>
                                <div className={styles.orderShop}>
                                    {order.shop?.image && (
                                        <img
                                            src={order.shop.image}
                                            alt={order.shop.name}
                                        />
                                    )}

                                    <div>
                                        <h2>{order.shop?.name || 'Shop'}</h2>
                                        <p>{order.shop?.city}</p>
                                    </div>
                                </div>

                                <span className={styles.orderStatus}>
                                    {formatStatus(order.status)}
                                </span>
                            </div>

                            {/* Food items */}
                            <div className={styles.orderItems}>
                                {order.items.map((item, index) => (
                                    <div
                                        className={styles.orderItem}
                                        key={`${order._id}-${index}`}
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

                            {/* Order totals and payment information */}
                            <div className={styles.orderCardFooter}>
                                <div>
                                    <p>
                                        {new Date(order.createdAt).toLocaleDateString(
                                            'en-NG',
                                            {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            }
                                        )}
                                    </p>

                                    <span className={styles.paymentStatus}>
                                        Payment: {formatStatus(order.paymentStatus)}
                                    </span>
                                </div>

                                <strong>
                                    ₦{order.totalAmount.toLocaleString('en-NG')}
                                </strong>
                            </div>

                            <Link
                                to={`/orders/${order._id}`}
                                className={styles.viewOrderLink}
                            >
                                View Order Details
                            </Link>
                        </article>
                    </Reveal>
                ))}
            </div>
        </main>
    )
}

export default MyOrders
