import {
    Form,
    Link,
    useLoaderData,
    useActionData,
    useNavigation,
} from 'react-router-dom'

import Reveal from '../../components/Reveal'
import styles from './Owner.module.css'

function EditShop() {
    // 1. Get the existing shop details from the loader.
    const { shop, error: loaderError } = useLoaderData()

    // 2. Get any submission error returned by the action.
    const actionData = useActionData()

    // 3. Track the form submission state.
    const navigation = useNavigation()
    const isSubmitting = navigation.state === 'submitting'

    if (loaderError || !shop) {
        return (
            <main className={styles.ownerPage}>
                <Reveal animation="moveUp">
                    <p className={styles.ownerError} role="alert">
                        {loaderError || 'Shop not found.'}
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
        <main className={styles.ownerFormPage}>
            <Reveal animation="slideRight">
                <Link
                    to={`/owner/shops/${shop._id}`}
                    className={styles.ownerBackLink}
                >
                    &larr; Back to Manage Shop
                </Link>
            </Reveal>

            <div className={styles.ownerFormCard}>
                <Reveal animation="drop">
                    <h1>Edit Shop</h1>
                </Reveal>

                <Reveal animation="moveUp">
                    <p className={styles.ownerFormDescription}>
                        Update your shop information.
                    </p>
                </Reveal>

                {actionData?.error && (
                    <Reveal animation="moveUp">
                        <p className={styles.ownerError} role="alert">
                            {actionData.error}
                        </p>
                    </Reveal>
                )}

                <Reveal animation="scale">
                    <div className={styles.selectedImage}>
                        <p>Current Shop Image</p>

                        <img
                            src={shop.image}
                            alt={shop.name}
                        />
                    </div>
                </Reveal>

                <Form
                    method="post"
                    encType="multipart/form-data"
                >
                    <Reveal animation="slideLeft">
                        <div className={styles.ownerFormGroup}>
                            <label htmlFor="name">Shop Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                defaultValue={shop.name}
                            />
                        </div>
                    </Reveal>

                    <Reveal animation="slideRight">
                        <div className={styles.ownerFormGroup}>
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                defaultValue={shop.city}
                            />
                        </div>
                    </Reveal>

                    <Reveal animation="slideLeft">
                        <div className={styles.ownerFormGroup}>
                            <label htmlFor="state">State</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                defaultValue={shop.state}
                            />
                        </div>
                    </Reveal>

                    <Reveal animation="slideRight">
                        <div className={styles.ownerFormGroup}>
                            <label htmlFor="address">Shop Address</label>
                            <textarea
                                id="address"
                                name="address"
                                defaultValue={shop.address}
                                rows="3"
                            />
                        </div>
                    </Reveal>

                    <Reveal animation="slideLeft">
                        <div className={styles.ownerFormGroup}>
                            <label htmlFor="image">
                                Replace Shop Image (Optional)
                            </label>

                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/jpeg,image/png,image/webp"
                            />

                            <small>
                                Leave empty to keep the current image.
                                JPEG, PNG or WebP. Maximum size: 2MB.
                            </small>
                        </div>
                    </Reveal>

                    <Reveal animation="moveUp">
                        <button
                            type="submit"
                            className={styles.ownerSubmitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </Reveal>
                </Form>
            </div>
        </main>
    )
}

export default EditShop