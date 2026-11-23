
import {
    Form,
    useLoaderData,
    useActionData,
    useNavigation,
} from 'react-router-dom'

import { CheckCircle, XCircle } from 'lucide-react'

import Reveal from '../../components/Reveal'
import styles from './Admin.module.css'

function RiderApplications() {
    const { applications, status, error } = useLoaderData()
    const actionData = useActionData()
    const navigation = useNavigation()

    // 1. Check whether a review action is currently being submitted.
    const isSubmitting = navigation.state === 'submitting'

    // 2. Display the applications and their available review actions.
    return (
        <main className={styles.adminPage}>
            <Reveal animation="moveUp">
                <div className={styles.pageHeader}>
                    <h1>Rider Applications</h1>
                    <p>Review and manage delivery rider applications.</p>
                </div>
            </Reveal>

            <Reveal animation="moveUp">
                <Form method="get" className={styles.filterForm}>
                    <label htmlFor="status">Filter applications</label>

                    <select
                        id="status"
                        name="status"
                        defaultValue={status}
                    >
                        <option value="all">All Applications</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <button type="submit">Apply Filter</button>
                </Form>
            </Reveal>

            {/* 3. Display feedback from the review action. */}
            {actionData?.success && (
                <p className={styles.successMessage}>
                    {actionData.success}
                </p>
            )}

            {actionData?.error && (
                <p className={styles.errorMessage}>
                    {actionData.error}
                </p>
            )}

            {error && (
                <p className={styles.errorMessage}>{error}</p>
            )}

            <Reveal animation="moveUp">
                <div className={styles.applicationList}>
                    <h2>
                        {status}
                        {' '}Applications ({applications.length})
                    </h2>

                    {applications.length === 0 && !error ? (
                        <p className={styles.emptyMessage}>
                            No {status} applications found.
                        </p>
                    ) : (
                        applications.map((application) => (
                            <article
                                key={application._id}
                                className={styles.applicationCard}
                            >
                                <div className={styles.applicantDetails}>
                                    <h3>
                                        {application.user?.fullName}
                                    </h3>

                                    <p>{application.user?.email}</p>
                                    <p>{application.user?.mobile}</p>

                                    <p>
                                        Applied:{' '}
                                        {new Date(
                                            application.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                    <span
                                        className={`${styles.statusBadge} ${
                                            styles[application.status]
                                        }`}
                                    >
                                        {application.status}
                                    </span>
                                </div>

                                {/* 4. Only pending applications can be reviewed. */}
                                {application.status === 'pending' && (
                                    <div className={styles.reviewActions}>
                                        <Form method="post">
                                            <input
                                                type="hidden"
                                                name="riderId"
                                                value={application._id}
                                            />

                                            <button
                                                type="submit"
                                                name="status"
                                                value="approved"
                                                disabled={isSubmitting}
                                            >
                                                <CheckCircle size={16} />
                                                Approve
                                            </button>

                                            <button
                                                type="submit"
                                                name="status"
                                                value="rejected"
                                                disabled={isSubmitting}
                                            >
                                                <XCircle size={16} />
                                                Reject
                                            </button>
                                        </Form>
                                    </div>
                                )}

                                {/* 5. Show reviewer information for approved applications. */}
                                {application.status === 'approved' && (
                                    <p className={styles.reviewInfo}>
                                        Reviewed by:{' '}
                                        {application.approvedBy?.fullName ||
                                            'Admin'}
                                    </p>
                                )}
                            </article>
                        ))
                    )}
                </div>
            </Reveal>

            {isSubmitting && (
                <p className={styles.loadingMessage}>
                    Processing application...
                </p>
            )}
        </main>
    )
}

export default RiderApplications
