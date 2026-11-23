
import { useState } from 'react'
import {
    Form,
    Link,
    useActionData,
    useLoaderData,
    useNavigation,
} from 'react-router-dom'
import { Package, MapPin, UserRound, ShoppingBag } from 'lucide-react'

import Reveal from '../../components/Reveal'
import styles from './Owner.module.css'

function ShopOrders() {
    // 1. Retrieve orders and errors from the loader
    const { orders, count, error } = useLoaderData()

    // 2. Retrieve action feedback and submission state
    const actionData = useActionData()
    const navigation = useNavigation()
    const isSubmitting = navigation.state === 'submitting'

    // 3. Maintain the selected filters
    const [statusFilter, setStatusFilter] = useState('all')
    const [shopFilter, setShopFilter] = useState('all')

    // 4. Get unique shops represented in the retrieved orders
    const shops = [
        ...new Map(
            orders
                .filter(order => order.shop)
                .map(order => [order.shop._id, order.shop])
        ).values(),
    ]

    // 5. Filter orders by status and shop
    const filteredOrders = orders.filter(order => {
        const matchesStatus =
            statusFilter === 'all' || order.status === statusFilter

        const matchesShop =
            shopFilter === 'all' || order.shop?._id === shopFilter

        return matchesStatus && matchesShop
    })

    // 6. Format order status for display
    const formatStatus = status =>
        status
            .replace(/([A-Z])/g, ' $1')

    // 7. Format currency values
    const formatCurrency = amount =>
        `₦${Number(amount ?? 0).toLocaleString('en-NG')}`

    // 8. Determine the next action available to the shop owner
    const getNextStatus = status => {
        const nextStatuses = {
            pending: {
                value: 'confirmed',
                label: 'Confirm Order',
            },
            confirmed: {
                value: 'preparing',
                label: 'Start Preparing',
            },
            preparing: {
                value: 'readyForPickup',
                label: 'Mark Ready for Pickup',
            },
        }

        return nextStatuses[status] || null
    }

    // 9. Show an error if the orders could not be loaded
    if (error) {
        return (
            <main className={styles.ownerPage}>
                <div className={styles.ownerEmptyState}>
                    <Package size={38} />

                    <h2>Unable to Load Orders</h2>

                    <p>{error}</p>

                    <Link
                        to="/owner/shops"
                        className={styles.ownerPrimaryLink}
                    >
                        Back to My Shops
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className={styles.ownerPage}>
            {/* 10. Page heading */}
            <Reveal animation="slideRight">
                <header className={styles.ownerPageHeader}>
                    <div>
                        <h1>Shop Orders</h1>
                        <p>Manage orders placed at your shops.</p>
                        <span className={styles.orderCount}>
                            {count} {count === 1 ? 'Order' : 'Orders'}
                        </span>
                    </div>

                    <Link
                        to="/owner/shops"
                        className={styles.ownerPrimaryLink}
                    >
                        My Shops
                    </Link>
                </header>
            </Reveal>

            {/* 11. Display action feedback */}
            {actionData?.error && (
                <p className={styles.ownerError} role="alert">
                    {actionData.error}
                </p>
            )}

            {actionData?.success && (
                <p className={styles.orderActionSuccess} role="status">
                    {actionData.success}
                </p>
            )}

            {/* 12. Order filters */}
            <Reveal animation="moveUp">
                <section className={styles.orderFilters}>
                    <label>
                        Order Status
                        <select
                            value={statusFilter}
                            onChange={event =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="readyForPickup">Ready for Pickup</option>
                            <option value="pickedUp">Picked Up</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </label>

                    <label>
                        Shop
                        <select
                            value={shopFilter}
                            onChange={event =>
                                setShopFilter(event.target.value)
                            }
                        >
                            <option value="all">All Shops</option>

                            {shops.map(shop => (
                                <option key={shop._id} value={shop._id}>
                                    {shop.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </section>
            </Reveal>

            {/* 13. Display the filtered orders */}
            {filteredOrders.length === 0 ? (
                <Reveal animation="scale">
                    <div className={styles.ownerEmptyState}>
                        <Package size={38} />
                        <h2>No orders found</h2>
                        <p>
                            {orders.length === 0
                                ? 'You have not received any orders yet.'
                                : 'No orders match your selected filters.'}
                        </p>
                    </div>
                </Reveal>
            ) : (
                <section className={styles.shopOrdersGrid}>
                    {filteredOrders.map(order => {
                        const nextStatus = getNextStatus(order.status)

                        return (
                            <Reveal key={order._id} animation="moveUp" duration="0.6s">
                                <article className={styles.shopOrderCard}>
                                    {/* 14. Order heading */}
                                    <header className={styles.shopOrderHeader}>
                                        <div>
                                            <h2>
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </h2>

                                            <span>
                                                {order.shop?.name || 'Shop unavailable'}
                                            </span>
                                        </div>

                                        <span className={styles.orderStatusBadge}>
                                            {formatStatus(order.status)}
                                        </span>
                                    </header>

                                    {/* Display cancellation information */}
                                    {order.status === 'cancelled' && (
                                        <div className={styles.orderCancellationInfo}>
                                            <h3>Order Cancelled</h3>

                                            <p>
                                                Cancelled by: {
                                                    order.cancelledBy === 'shopOwner'
                                                        ? 'Shop Owner'
                                                        : 'Customer'
                                                }
                                            </p>

                                            {order.cancellationReason && (
                                                <p>
                                                    **Reason:** {order.cancellationReason}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* 15. Customer and delivery information */}
                                    <div className={styles.shopOrderDetails}>
                                        <p>
                                            <UserRound size={16} />
                                            {order.customer?.fullName || 'Customer unavailable'}
                                        </p>

                                        <p>
                                            <MapPin size={16} />
                                            {[
                                                order.deliveryAddress?.street,
                                                order.deliveryAddress?.city,
                                                order.deliveryAddress?.state,
                                            ].filter(Boolean).join(', ') || 'Address unavailable'}
                                        </p>

                                        <p>
                                            <ShoppingBag size={16} />
                                            {order.shop?.city}, {order.shop?.state}
                                        </p>
                                    </div>

                                    {/* 16. Display ordered items */}
                                    <div className={styles.shopOrderItems}>
                                        <h3>Order Items</h3>

                                        {order.items.map((item, index) => (
                                            <div
                                                key={`${order._id}-${index}`}
                                                className={styles.shopOrderItem}
                                            >
                                                <span>
                                                    {item.quantity} × {item.name}
                                                </span>

                                                <strong>
                                                    {formatCurrency(
                                                        item.price * item.quantity
                                                    )}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 17. Display payment summary */}
                                    <div className={styles.shopOrderSummary}>
                                        <p>
                                            Subtotal
                                            <strong>{formatCurrency(order.subtotal)}</strong>
                                        </p>

                                        <p>
                                            Delivery Fee
                                            <strong>{formatCurrency(order.deliveryFee)}</strong>
                                        </p>

                                        <p>
                                            Total
                                            <strong>{formatCurrency(order.totalAmount)}</strong>
                                        </p>

                                        <p>
                                            Payment
                                            <strong>
                                                {formatStatus(order.paymentMethod)} · {formatStatus(order.paymentStatus)}
                                            </strong>
                                        </p>
                                    </div>

                                    {/* 18. Allow owners to update preparation status */}
                                    {nextStatus && (
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
                                                value={nextStatus.value}
                                            />

                                            <button
                                                type="submit"
                                                className={styles.orderActionButton}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting
                                                    ? 'Updating...'
                                                    : nextStatus.label}
                                            </button>
                                        </Form>
                                    )}


                                    {/* 19. Allow owners to cancel pending orders with a reason */}
                                    {order.status === 'pending' && (
                                        <Form
                                            method="post"
                                            onSubmit={event => {
                                                // 1. Confirm before cancelling the order
                                                const confirmed = window.confirm(
                                                    'Are you sure you want to cancel this order?'
                                                )

                                                // 2. Stop submission if the owner changes their mind
                                                if (!confirmed) event.preventDefault()
                                            }}
                                            className={styles.orderCancelForm}
                                        >
                                            <input type="hidden" name="intent" value="cancelOrder" />
                                            <input type="hidden" name="orderId" value={order._id} />

                                            {/* 3. Require a cancellation reason */}
                                            <textarea
                                                name="reason"
                                                placeholder="Explain why this order is being cancelled..."
                                                required
                                                rows={3}
                                                maxLength={500}
                                            />

                                            {/* 4. Submit the cancellation */}
                                            <button
                                                type="submit"
                                                className={styles.orderCancelButton}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Processing...' : 'Cancel Order'}
                                            </button>
                                        </Form>
                                    )}


                                    {/* 20. Explain when the rider takes over */}
                                    {order.status === 'readyForPickup' && (
                                        <p className={styles.orderWaitingMessage}>
                                            Ready for the delivery rider to pick up.
                                        </p>
                                    )}

                                    {order.status === 'pickedUp' && (
                                        <p className={styles.orderWaitingMessage}>
                                            This order has been picked up by the rider.
                                        </p>
                                    )}

                                    {order.status === 'delivered' && (
                                        <p className={styles.orderWaitingMessage}>
                                            This order has been delivered.
                                        </p>
                                    )}
                                </article>
                            </Reveal>
                        )
                    })}
                </section>
            )}
        </main>
    )
}

export default ShopOrders
