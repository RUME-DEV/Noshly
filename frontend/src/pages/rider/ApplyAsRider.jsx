
import { useEffect } from 'react'
import { Form, useActionData, useNavigation } from 'react-router-dom'
import { Bike } from 'lucide-react'
import Reveal from '../../components/Reveal'
import { useAccount } from '../../context/AccountContext'
import styles from './Rider.module.css'

function ApplyAsRider() {
    // 1. Get the result returned by the application action.
    const actionData = useActionData()

    // 2. Track whether the application is being submitted.
    const navigation = useNavigation()
    const isSubmitting = navigation.state === 'submitting'

    const { refreshAccountStatus } = useAccount()

    // 3. Refresh account information after a successful application.
    useEffect(() => {
        if (actionData?.success) {
            refreshAccountStatus()
        }
    }, [actionData, refreshAccountStatus])

    return (
        <main className={styles.riderPage}>
            <Reveal animation="scale">
                <section className={styles.applicationCard}>
                    <Bike size={48} className={styles.applicationIcon} />

                    <h1>Become a Delivery Rider</h1>

                    <p className={styles.applicationDescription}>
                        Join our delivery team and help customers receive
                        their food orders.
                    </p>

                    <div className={styles.applicationInfo}>
                        <h2>Before you apply</h2>

                        <ul>
                            <li>You must have an active account.</li>
                            <li>You must be available to handle deliveries.</li>
                            <li>Your application will be reviewed by an admin.</li>
                        </ul>
                    </div>

                    {actionData?.error && (
                        <p className={styles.riderError} role="alert">
                            {actionData.error}
                        </p>
                    )}

                    {actionData?.success && (
                        <p className={styles.riderSuccess} role="status">
                            {actionData.success}
                        </p>
                    )}

                    {!actionData?.success && (
                        <Form method="post">
                            <button
                                type="submit"
                                className={styles.riderSubmitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Submitting Application...'
                                    : 'Submit Application'}
                            </button>
                        </Form>
                    )}
                </section>
            </Reveal>
        </main>
    )
}

export default ApplyAsRider
