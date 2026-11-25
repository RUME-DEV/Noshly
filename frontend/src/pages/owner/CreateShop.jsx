import { Form, Link, useActionData, useNavigation } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import styles from './Owner.module.css'

import ImageUploadPreview from '../../components/ImageUploadPreview'

function CreateShop() {
    // 1. Get any error returned by the action.
    const actionData = useActionData()

    // 2. Track the router's form submission state.
    const navigation = useNavigation()
    const isSubmitting = navigation.state === 'submitting'

    return (
        <main className={styles.ownerFormPage}>
            <Reveal animation="slideRight">
                <Link to="/owner/shops" className={styles.ownerBackLink}>
                    ← Back to My Shops
                </Link>
            </Reveal>

            <Reveal animation="scale">
                <div className={styles.ownerFormCard}>
                    <Reveal animation="drop">
                        <h1>Create a Shop</h1>
                    </Reveal>

                    <Reveal animation="moveUp">
                        <p className={styles.ownerFormDescription}>
                            Add your shop details to start managing your food menu.
                        </p>
                    </Reveal>

                    {actionData?.error && (
                        <Reveal animation="moveUp">
                            <p className={styles.ownerError} role="alert">
                                {actionData.error}
                            </p>
                        </Reveal>
                    )}

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
                                    placeholder="Enter shop name"
                                    required
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
                                    placeholder="Enter city"
                                    required
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
                                    placeholder="Enter state"
                                    required
                                />
                            </div>
                        </Reveal>

                        <Reveal animation="slideRight">
                            <div className={styles.ownerFormGroup}>
                                <label htmlFor="address">Shop Address</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    placeholder="Enter shop address"
                                    rows="3"
                                    required
                                />
                            </div>
                        </Reveal>

                        <Reveal animation="slideLeft">
                            <ImageUploadPreview
                                label="Shop Image"
                                imageAlt="Shop image preview"
                                required
                            />
                        </Reveal>

                        <Reveal animation="moveUp">
                            <button
                                type="submit"
                                className={styles.ownerSubmitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Shop...' : 'Create Shop'}
                            </button>
                        </Reveal>
                    </Form>
                </div>
            </Reveal>
        </main>
    )
}

export default CreateShop