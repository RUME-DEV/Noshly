
import { useState } from 'react'
import {
    Form,
    Link,
    useActionData,
    useLoaderData,
    useNavigation,
} from 'react-router-dom'

import api from '../../services/api'
import Reveal from '../../components/Reveal'
import styles from './Owner.module.css'

function ManageShop() {
    // Get Loader Result
    const { shop, items, error } = useLoaderData()

    // Get the result of a delete action and the current navigation state.
    const actionData = useActionData()
    const navigation = useNavigation()

    const [currentShop, setCurrentShop] = useState(shop)
    const [isUpdating, setIsUpdating] = useState(false)
    const [statusError, setStatusError] = useState('')

    // Close or reopen the shop
    const handleShopStatus = async () => {
        try {
            setIsUpdating(true)
            setStatusError('')

            const response = await api.patch(
                `/shop/${currentShop._id}/status`,
                {
                    isActive: !currentShop.isActive,
                }
            )

            // Update the shop with the backend response
            setCurrentShop(response.data.shop)

        } catch (error) {
            setStatusError(
                error.response?.data?.message ||
                'Failed to update shop status. Please try again.'
            )
        } finally {
            setIsUpdating(false)
        }
    }

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
                            <h1>{currentShop.name}</h1>
                        </Reveal>

                        <Reveal animation="moveUp">
                            <p>
                                {currentShop.address}, {currentShop.city},{' '}
                                {currentShop.state}
                            </p>
                        </Reveal>

                        <Reveal animation="scale">
                            <span
                                className={
                                    currentShop.isActive
                                        ? styles.shopOpen
                                        : styles.shopClosed
                                }
                            >
                                {currentShop.isActive ? 'Open' : 'Closed'}
                            </span>
                        </Reveal>

                        {statusError && (
                            <p className={styles.ownerError} role="alert">
                                {statusError}
                            </p>
                        )}
                    </div>

                    <Reveal animation="moveUp">
                        <div className={styles.manageShopActions}>
                            <Link
                                to={`/owner/shops/${currentShop._id}/edit`}
                                className={styles.ownerPrimaryLink}
                            >
                                Edit Shop
                            </Link>

                            <button
                                type="button"
                                className={`${styles.shopStatusButton} ${
                                    currentShop.isActive
                                        ? styles.shopStatusClose
                                        : styles.shopStatusOpen
                                }`}
                                onClick={handleShopStatus}
                                disabled={isUpdating}
                            >
                                {isUpdating
                                    ? 'Updating...'
                                    : currentShop.isActive
                                        ? 'Close Shop'
                                        : 'Reopen Shop'}
                            </button>
                        </div>
                    </Reveal>
                </Reveal>

                <Reveal animation="slideRight">
                    <img
                        src={currentShop.image}
                        alt={currentShop.name}
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

                        {currentShop.isActive && (
                            <Link
                                to={`/owner/shops/${currentShop._id}/items/new`}
                                className={styles.ownerPrimaryLink}
                            >
                                + Add Food Item
                            </Link>
                        )}
                    </div>
                </Reveal>

                {/* Display an error if the item could not be deleted */}
                {actionData?.error && (
                    <Reveal animation="moveUp">
                        <p className={styles.ownerError} role="alert">
                            {actionData.error}
                        </p>
                    </Reveal>
                )}

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

                                        {/* Keep food information separate from the action buttons. */}
                                        <div className={styles.ownerItemDetails}>
                                            <h3>{item.name}</h3>
                                            <p>{item.category}</p>
                                            <p>{item.foodType}</p>
                                            <strong>
                                                ₦{Number(item.price).toLocaleString()}
                                            </strong>
                                        </div>

                                    {/* 1. Provide the edit and delete actions for each food item */}
                                    <div className={styles.ownerItemActions}>
                                        <Link
                                            to={`/owner/shops/${currentShop._id}/items/${item._id}/edit`}
                                            className={styles.ownerPrimaryLink}
                                        >
                                            Edit Item
                                        </Link>

                                        {/* 2. Submit the selected item ID to the delete action */}
                                        <Form
                                            method="post"
                                            onSubmit={(event) => {
                                                // Ask for confirmation before permanently deleting the item.
                                                if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) {
                                                    event.preventDefault()
                                                }
                                            }}
                                        >
                                            <input
                                                type="hidden"
                                                name="itemId"
                                                value={item._id}
                                            />

                                            <button
                                                type="submit"
                                                className={styles.deleteItemButton}
                                                disabled={navigation.state === 'submitting'}
                                            >
                                                {navigation.state === 'submitting' &&
                                                navigation.formData?.get('itemId') === item._id
                                                    ? 'Deleting...'
                                                    : 'Delete Item'}
                                            </button>
                                        </Form>
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
