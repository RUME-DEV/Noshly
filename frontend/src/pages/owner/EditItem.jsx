
import {
    Form,
    Link,
    useActionData,
    useLoaderData,
    useNavigation,
    useParams,
} from 'react-router-dom'
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

function EditItem() {
    // 1. Get the shop data, food items, route parameters and form state
    const { shop, items, error } = useLoaderData()
    const { itemId } = useParams()
    const actionData = useActionData()
    const navigation = useNavigation()

    // 2. Find the specific food item using its ID from the URL
    const item = items?.find((foodItem) => foodItem._id === itemId)

    // Check whether the edit form is currently being submitted
    const isSubmitting = navigation.state === 'submitting'

    // 3. Handle cases where the shop or requested food item cannot be found
    if (error || !item) {
        return (
            <main className={styles.ownerFormPage}>
                <Reveal animation="moveUp">
                    <p className={styles.ownerError} role="alert">
                        {error || 'Food item not found.'}
                    </p>
                </Reveal>

                <Link to={`/owner/shops/${shop?._id || ''}`}>
                    Back to Manage Shop
                </Link>
            </main>
        )
    }

    return (
        <main className={styles.ownerFormPage}>
            {/* 4. Provide navigation back to the shop management page */}
            <Reveal animation="slideRight">
                <Link
                    to={`/owner/shops/${shop._id}`}
                    className={styles.ownerBackLink}
                >
                    ← Back to Manage Shop
                </Link>
            </Reveal>

            {/* 5. Display the edit form and the current item details */}
            <Reveal animation="scale">
                <div className={styles.ownerFormCard}>
                    <Reveal animation="drop">
                        <h1>Edit Food Item</h1>
                    </Reveal>

                    <Reveal animation="moveUp">
                        <p className={styles.ownerFormDescription}>
                            Update {item.name} in {shop.name}'s menu.
                        </p>
                    </Reveal>

                    {/* Display any error returned by the edit action */}
                    {actionData?.error && (
                        <Reveal animation="moveUp">
                            <p className={styles.ownerError} role="alert">
                                {actionData.error}
                            </p>
                        </Reveal>
                    )}

                    {/* Show the current image before the owner replaces it */}
                    <Reveal animation="scale">
                        <div className={styles.editItemImage}>
                            <img src={item.image} alt={item.name} />
                        </div>
                    </Reveal>

                    {/* 6. Submit the updated item details as multipart form data */}
                    <Form method="post" encType="multipart/form-data">
                        <Reveal animation="slideLeft">
                            <div className={styles.ownerFormGroup}>
                                <label htmlFor="name">Food Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    defaultValue={item.name}
                                />
                            </div>
                        </Reveal>

                        <Reveal animation="slideRight">
                            <div className={styles.ownerFormGroup}>
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    defaultValue={item.category}
                                >
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
                                    defaultValue={item.foodType}
                                >
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
                                    defaultValue={item.price}
                                />
                            </div>
                        </Reveal>

                        <Reveal animation="slideLeft">
                            <ImageUploadPreview
                                label="Replace Food Image (Optional)"
                                existingImage={item.image}
                                imageAlt={item.name}
                                helpText="Leave empty to keep the current image. JPEG, PNG or WebP. Maximum size: 2MB."
                            />
                        </Reveal>

                        {/* 7. Submit the form and show the loading state */}
                        <Reveal animation="moveUp">
                            <button
                                type="submit"
                                className={styles.ownerSubmitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Saving Changes...'
                                    : 'Save Changes'}
                            </button>
                        </Reveal>
                    </Form>
                </div>
            </Reveal>
        </main>
    )
}

export default EditItem
