
import { useEffect } from 'react'
import {
    Form,
    Link,
    useActionData,
    useLoaderData,
    useNavigation,
} from 'react-router-dom'
import { Bike, Clock, CheckCircle, XCircle } from 'lucide-react'
import Reveal from '../../components/Reveal'
import { useAccount } from '../../context/AccountContext'
import styles from './Rider.module.css'

function RiderApplication() {
    // 1. Get the application retrieved by the route loader.
    const { riderProfile, error } = useLoaderData()

    // 2. Get the result of a possible reapplication.
    const actionData = useActionData()

    // 3. Track the reapplication submission state.
    const navigation = useNavigation()
    const isSubmitting = navigation.state === 'submitting'

    const { refreshAccountStatus } = useAccount()

    // 4. Refresh shared account information after a successful reapplication.
    useEffect(() => {
        if (actionData?.success) {
            refreshAccountStatus()
        }
    }, [actionData, refreshAccountStatus])

    // 5. Show a fallback if the application could not be retrieved.
    if (error || !riderProfile) {
        return (
            <main className={styles.riderPage}>
                <p className={styles.riderError} role="alert">
                    {error || 'Rider application not found.'}
                </p>

                <Link to="/account">Back to Account</Link>
            </main>
        )
    }

    const { status, createdAt, approvedAt, approvedBy } = riderProfile

    // 6. Choose the appropriate icon and description for the current status.
    const statusDetails = {
        pending: {
            icon: <Clock size={36} />,
            title: 'Application Under Review',
            description:
                'Your application has been received and is waiting for admin review.',
        },
        approved: {
            icon: <CheckCircle size={36} />,
            title: 'Application Approved',
            description:
                'Congratulations! You are now an approved delivery rider.',
        },
        rejected: {
            icon: <XCircle size={36} />,
            title: 'Application Rejected',
            description:
                'Unfortunately, your application was not approved. You can submit another application.',
        },
    }

    const currentStatus = statusDetails[status]

    return (
        <main className={styles.riderPage}>
            <Reveal animation="scale">
                <section className={styles.applicationCard}>
                    <Bike size={42} className={styles.applicationIcon} />

                    <h1>Rider Application</h1>

                    <div className={`${styles.statusIcon} ${styles[status]}`}>
                        {currentStatus.icon}
                    </div>

                    <span className={`${styles.statusBadge} ${styles[status]}`}>
                        {status}
                    </span>

                    <h2>{currentStatus.title}</h2>
                    <p className={styles.applicationDescription}>
                        {currentStatus.description}
                    </p>

                    <div className={styles.applicationInfo}>
                        <h2>Application Details</h2>

                        <p>
                            <strong>Submitted:</strong>{' '}
                            {new Date(createdAt).toLocaleDateString()}
                        </p>

                        {approvedAt && (
                            <p>
                                <strong>Reviewed:</strong>{' '}
                                {new Date(approvedAt).toLocaleDateString()}
                            </p>
                        )}

                        {approvedBy && (
                            <p>
                                <strong>Reviewed by:</strong>{' '}
                                {approvedBy.fullName}
                            </p>
                        )}
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

                    {status === 'rejected' && (
                        <Form method="post">
                            <button
                                type="submit"
                                className={styles.riderSubmitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Submitting...'
                                    : 'Apply Again'}
                            </button>
                        </Form>
                    )}

                    {status === 'approved' && (
                        <Link to="/rider/dashboard">
                            Go to Rider Dashboard
                        </Link>
                    )}
                </section>
            </Reveal>
        </main>
    )
}

export default RiderApplication
