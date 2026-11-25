
import { Form, Link, useActionData, useLoaderData, useNavigation } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import styles from './Owner.module.css'

import ImageUploadPreview from '../../components/ImageUploadPreview'

const categories = [
    'snacks',
    'main course',
    'dessert',
    'beverages',
    'appetizer',
    'pizza',
    'burger',
    'fast food',
    'others',
]

function CreateItem() {
    const { shop, error } = useLoaderData()
    const actionData = useActionData()

    const navigation = useNavigation()
    const isSubmitting = navigation.state === 'submitting'

    if (error) {
        return (
            <main className={styles.ownerFormPage}>
                <Reveal animation="moveUp">
                    <p className={styles.ownerError} role="alert">
                        {error}
                    </p>
                </Reveal>

                <Link to="/owner/shops">
                    Back to My Shops
                </Link>
            </main>
        )
    }

    return (
        <main className={styles.ownerFormPage}>
            <Reveal animation="slideRight">
                <Link
                    to={`/owner/shops/${shop._id}`}
                    className={styles.ownerBackLink}
                >
                    ← Back to Manage Shop
                </Link>
            </Reveal>

            <Reveal animation="scale">
                <div className={styles.ownerFormCard}>
                    <Reveal animation="drop">
                        <h1>Add Food Item</h1>
                    </Reveal>

                    <Reveal animation="moveUp">
                        <p className={styles.ownerFormDescription}>
                            Add a new item to {shop.name}'s food menu.
                        </p>
                    </Reveal>

                    {actionData?.error && (
                        <Reveal animation="moveUp">
                            <p className={styles.ownerError} role="alert">
                                {actionData.error}
                            </p>
                        </Reveal>
                    )}

                    <Form method="post" encType="multipart/form-data">
                        <Reveal animation="slideLeft">
                            <div className={styles.ownerFormGroup}>
                                <label htmlFor="name">Food Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter food name"
                                    required
                                />
                            </div>
                        </Reveal>

                        <Reveal animation="slideRight">
                            <div className={styles.ownerFormGroup}>
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>
                                        Select a category
                                    </option>

                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Reveal>

                        <Reveal animation="slideLeft">
                            <div className={styles.ownerFormGroup}>
                                <label htmlFor="foodType">Food Type</label>
                                <select
                                    id="foodType"
                                    name="foodType"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>
                                        Select food type
                                    </option>
                                    <option value="Vegetarian">
                                        Vegetarian
                                    </option>
                                    <option value="Non-Vegetarian">
                                        Non-Vegetarian
                                    </option>
                                </select>
                            </div>
                        </Reveal>

                        <Reveal animation="slideRight">
                            <div className={styles.ownerFormGroup}>
                                <label htmlFor="price">Price (₦)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="Enter price"
                                    required
                                />
                            </div>
                        </Reveal>

                        <Reveal animation="slideLeft">
                            <ImageUploadPreview
                                label="Food Image"
                                imageAlt="Food item preview"
                                required
                            />
                        </Reveal>

                        <Reveal animation="moveUp">
                            <button
                                type="submit"
                                className={styles.ownerSubmitButton}
                                disabled={isSubmitting || !shop.isActive}
                            >
                                {isSubmitting
                                    ? 'Adding Item...'
                                    : 'Add Food Item'}
                            </button>
                        </Reveal>

                        {!shop.isActive && (
                            <p className={styles.ownerFormDescription}>
                                Reopen your shop before adding food items.
                            </p>
                        )}
                    </Form>
                </div>
            </Reveal>
        </main>
    )
}

export default CreateItem
