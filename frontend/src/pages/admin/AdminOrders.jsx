
import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'

import {
    Search,
    ShoppingBag,
    MapPin,
    UserRound,
    Store,
    Bike,
    ChevronDown,
} from 'lucide-react'

import Reveal from '../../components/Reveal'
import styles from './Admin.module.css'

// 1. Format amounts in Nigerian Naira
const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2,
    }).format(amount ?? 0)

// 2. Format status values into readable text
const formatStatus = (status) =>
    status.replace(/([A-Z])/g, ' $1')

// 3. Map order statuses to CSS classes
const statusClasses = {
    pending: styles.orderPending,
    confirmed: styles.orderConfirmed,
    preparing: styles.orderPreparing,
    readyForPickup: styles.orderReady,
    pickedUp: styles.orderPickedUp,
    delivered: styles.orderDelivered,
    cancelled: styles.orderCancelled,
}

// 4. Map payment statuses to CSS classes
const paymentClasses = {
    pending: styles.paymentPending,
    paid: styles.paymentPaid,
    failed: styles.paymentFailed,
    refunded: styles.paymentRefunded,
}

function AdminOrders() {
    const { orders, count, error } = useLoaderData()

    // 5. Track search and filter values
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [paymentFilter, setPaymentFilter] = useState('all')

    // 6. Filter orders by search text, order status and payment status
    const filteredOrders = orders.filter((order) => {
        const search = searchTerm.toLowerCase().trim()

        const searchableValues = [
            order._id,
            order.customer?.fullName,
            order.customer?.email,
            order.customer?.mobile,
            order.shop?.name,
            order.shop?.city,
        ]

        const matchesSearch = searchableValues.some((value) =>
            value?.toString().toLowerCase().includes(search)
        )

        const matchesStatus =
            statusFilter === 'all' || order.status === statusFilter

        const matchesPayment =
            paymentFilter === 'all' ||
            order.paymentStatus === paymentFilter

        return matchesSearch && matchesStatus && matchesPayment
    })

    return (
        <div className={styles.adminPage}>
            {/* 7. Page heading and order count */}
            <Reveal animation="moveUp">
                <div className={styles.pageHeader}>
                    <h1>Order Management</h1>
                    <p>
                        Monitor orders placed across the food delivery platform.
                    </p>
                    <p className={styles.userCount}>
                        Total orders: {count}
                    </p>
                </div>
            </Reveal>

            {/* 8. Display loading errors */}
            {error && (
                <p className={styles.errorMessage} role="alert">
                    {error}
                </p>
            )}

            {!error && (
                <>
                    {/* 9. Search and filters */}
                    <div className={styles.orderFilters}>
                        <div className={styles.orderSearch}>
                            <Search size={18} />

                            <input
                                type="search"
                                placeholder="Search order, customer, shop..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            aria-label="Filter by order status"
                        >
                            <option value="all">All Order Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="readyForPickup">Ready for Pickup</option>
                            <option value="pickedUp">Picked Up</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={paymentFilter}
                            onChange={(event) =>
                                setPaymentFilter(event.target.value)
                            }
                            aria-label="Filter by payment status"
                        >
                            <option value="all">All Payments</option>
                            <option value="pending">Payment Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>

                    {/* 10. Show empty states or filtered orders */}
                    {filteredOrders.length === 0 ? (
                        <p className={styles.emptyMessage}>
                            {orders.length === 0
                                ? 'No orders have been placed yet.'
                                : 'No orders match your search or filters.'}
                        </p>
                    ) : (
                        <div className={styles.ordersList}>
                            {filteredOrders.map((order, index) => {
                                const rider = order.deliveryRider?.user

                                return (
                                    <Reveal
                                        key={order._id}
                                        animation="moveUp"
                                        duration={`${1 + index * 0.1}s`}
                                    >
                                        <article className={styles.adminOrderCard}>
                                            {/* 11. Order header */}
                                            <div className={styles.adminOrderHeader}>
                                                <div>
                                                    <span className={styles.orderNumber}>
                                                        Order #{order._id.slice(-8).toUpperCase()}
                                                    </span>

                                                    <p className={styles.orderDate}>
                                                        {new Date(
                                                            order.createdAt
                                                        ).toLocaleString('en-NG', {
                                                            dateStyle: 'medium',
                                                            timeStyle: 'short',
                                                        })}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`${styles.orderStatus} ${
                                                        statusClasses[order.status] || ''
                                                    }`}
                                                >
                                                    {formatStatus(order.status)}
                                                </span>
                                            </div>

                                            {/* 12. Customer and shop details */}
                                            <div className={styles.orderParties}>
                                                <div className={styles.orderParty}>
                                                    <UserRound size={18} />

                                                    <div>
                                                        <span className={styles.orderLabel}>
                                                            Customer
                                                        </span>
                                                        <strong>
                                                            {order.customer?.fullName ||
                                                                'Customer unavailable'}
                                                        </strong>
                                                        <span>
                                                            {order.customer?.email ||
                                                                'No email available'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className={styles.orderParty}>
                                                    <Store size={18} />

                                                    <div>
                                                        <span className={styles.orderLabel}>
                                                            Shop
                                                        </span>
                                                        <strong>
                                                            {order.shop?.name ||
                                                                'Shop unavailable'}
                                                        </strong>
                                                        <span>
                                                            {[order.shop?.city, order.shop?.state]
                                                                .filter(Boolean)
                                                                .join(', ') ||
                                                                'Location unavailable'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 13. Order total and payment status */}
                                            <div className={styles.orderSummary}>
                                                <div>
                                                    <span className={styles.orderLabel}>
                                                        Total Amount
                                                    </span>
                                                    <strong className={styles.orderTotal}>
                                                        {formatCurrency(order.totalAmount)}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span className={styles.orderLabel}>
                                                        Payment
                                                    </span>

                                                    <span
                                                        className={`${styles.paymentStatus} ${
                                                            paymentClasses[order.paymentStatus] || ''
                                                        }`}
                                                    >
                                                        {formatStatus(
                                                            order.paymentStatus
                                                        )}
                                                    </span>

                                                    <span className={styles.paymentMethod}>
                                                        {formatStatus(
                                                            order.paymentMethod
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* 14. Expandable order information */}
                                            <details className={styles.orderDetails}>
                                                <summary>
                                                    <span>
                                                        View Order Details
                                                    </span>
                                                    <ChevronDown size={18} />
                                                </summary>

                                                <div className={styles.orderDetailsContent}>
                                                    {/* Items */}
                                                    <section>
                                                        <h4>
                                                            <ShoppingBag size={17} />
                                                            Ordered Items
                                                        </h4>

                                                        <div className={styles.adminOrderItems}>
                                                            {order.items.map((item, itemIndex) => (
                                                                <div
                                                                    key={`${order._id}-${itemIndex}`}
                                                                    className={styles.adminOrderItem}
                                                                >
                                                                    <span>
                                                                        {item.name} × {item.quantity}
                                                                    </span>

                                                                    <strong>
                                                                        {formatCurrency(
                                                                            item.price * item.quantity
                                                                        )}
                                                                    </strong>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </section>

                                                    {/* Delivery address */}
                                                    <section>
                                                        <h4>
                                                            <MapPin size={17} />
                                                            Delivery Address
                                                        </h4>

                                                        <p>
                                                            {order.deliveryAddress?.street}
                                                        </p>

                                                        <p>
                                                            {[
                                                                order.deliveryAddress?.city,
                                                                order.deliveryAddress?.state,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(', ')}
                                                        </p>
                                                    </section>

                                                    {/* Cancellation information */}
                                                    {order.status === 'cancelled' && (
                                                        <section>
                                                            <h4>Cancellation Information</h4>

                                                            <p>
                                                                <strong>Cancelled by:</strong>{' '}
                                                                {order.cancelledBy === 'shopOwner'
                                                                    ? 'Shop Owner'
                                                                    : 'Customer'}
                                                            </p>

                                                            <p>
                                                                <strong>Reason:</strong>{' '}
                                                                {order.cancellationReason || 'No reason provided'}
                                                            </p>
                                                        </section>
                                                    )}

                                                    {/* Rider */}
                                                    <section>
                                                        <h4>
                                                            <Bike size={17} />
                                                            Delivery Rider
                                                        </h4>

                                                        {rider ? (
                                                            <>
                                                                <p>
                                                                    {rider.fullName}
                                                                </p>
                                                                <p>
                                                                    {rider.email}
                                                                </p>
                                                                <p>
                                                                    {rider.mobile ||
                                                                        'No phone available'}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <p>
                                                                No rider assigned yet.
                                                            </p>
                                                        )}
                                                    </section>

                                                    {/* Full price breakdown */}
                                                    <section>
                                                        <h4>Price Breakdown</h4>

                                                        <div className={styles.adminOrderPrice}>
                                                            <span>Subtotal</span>
                                                            <span>
                                                                {formatCurrency(order.subtotal)}
                                                            </span>
                                                        </div>

                                                        <div className={styles.adminOrderPrice}>
                                                            <span>Delivery Fee</span>
                                                            <span>
                                                                {formatCurrency(order.deliveryFee)}
                                                            </span>
                                                        </div>

                                                        <div className={styles.adminOrderPrice}>
                                                            <span>Application Fee</span>
                                                            <span>
                                                                {formatCurrency(order.applicationFee)}
                                                            </span>
                                                        </div>

                                                        <div className={`${styles.adminOrderPrice} ${styles.adminOrderGrandTotal}`}>
                                                            <strong>Total</strong>
                                                            <strong>
                                                                {formatCurrency(order.totalAmount)}
                                                            </strong>
                                                        </div>

                                                        <div className={styles.adminOrderPrice}>
                                                            <span>Shop Earnings</span>
                                                            <span>
                                                                {formatCurrency(order.shopEarnings)}
                                                            </span>
                                                        </div>
                                                    </section>

                                                    {/* Payment confirmation date */}
                                                    {order.cashCollectedAt && (
                                                        <section>
                                                            <h4>Payment Collected</h4>
                                                            <p>
                                                                {new Date(
                                                                    order.cashCollectedAt
                                                                ).toLocaleString('en-NG')}
                                                            </p>
                                                        </section>
                                                    )}
                                                </div>
                                            </details>
                                        </article>
                                    </Reveal>
                                )
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default AdminOrders
