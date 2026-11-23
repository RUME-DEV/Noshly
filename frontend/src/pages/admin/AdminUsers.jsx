
import {
    Form,
    useLoaderData,
    useActionData,
    useNavigation,
} from 'react-router-dom'

import {
    ShieldCheck,
    ShieldAlert,
    ShieldPlus,
    ShieldMinus,
    UserRound,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import Reveal from '../../components/Reveal'
import styles from './Admin.module.css'

function AdminUsers() {
    const { users, count, error } = useLoaderData()
    const actionData = useActionData()
    const navigation = useNavigation()
    const { user: currentUser } = useAuth()

    // 1. Check the current user's privileges and submission state
    const isSubmitting = navigation.state === 'submitting'
    const isSuperAdmin = currentUser?.role === 'superAdmin'

    // 2. Identify which user's action is currently being submitted
const submittingUserId = navigation.formData?.get('userId')

    return (
        <div className={styles.adminPage}>
            <Reveal animation="moveUp">
                <div className={styles.pageHeader}>
                    <h1>User Management</h1>
                    <p>
                        View registered users and manage their account status.
                    </p>
                    <p className={styles.userCount}>
                        Total registered users: {count}
                    </p>
                </div>
            </Reveal>

            {/* 2. Display action feedback and loader errors */}
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

            {/* 3. Display all registered users */}
            {!error && users.length === 0 ? (
                <p className={styles.emptyMessage}>
                    No registered users found.
                </p>
            ) : (
                <div className={styles.userList}>
                    {users.map((user, index) => {
                        const isAdmin = user.role === 'admin'
                        const isTargetSuperAdmin =
                            user.role === 'superAdmin'

                        return (
                            <Reveal
                                key={user._id}
                                animation="moveUp"
                                duration={`${1 + index * 0.1}s`}
                            >
                                <article className={styles.userCard}>
                                    <div className={styles.userDetails}>
                                        <div className={styles.userHeading}>
                                            <div className={styles.userIcon}>
                                                <UserRound size={22} />
                                            </div>

                                            <div>
                                                <h3>{user.fullName} {" "} {user.email === currentUser.email && <span>(You)</span>}</h3>
                                                <p>{user.email}</p>
                                            </div>
                                        </div>

                                        <p>
                                            <strong>Phone:</strong>{' '}
                                            {user.mobile || 'Not provided'}
                                        </p>

                                        <p>
                                            <strong>Role:</strong>{' '}
                                            <span className={styles.roleBadge}>
                                                {user.role}
                                            </span>
                                        </p>

                                        <p>
                                            <strong>Joined:</strong>{' '}
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString()}
                                        </p>

                                        <p className={styles.accountStatus}>
                                            <strong>Status:</strong>{' '}
                                            <span
                                                className={
                                                    user.isSuspended
                                                        ? styles.suspendedBadge
                                                        : styles.activeBadge
                                                }
                                            >
                                                {user.isSuspended
                                                    ? 'Suspended'
                                                    : 'Active'}
                                            </span>
                                        </p>

                                        {user.isSuspended && (
                                            <div className={styles.suspensionInfo}>
                                                <p>
                                                    <strong>Reason:</strong>{' '}
                                                    {user.suspensionReason}
                                                </p>

                                                <p>
                                                    <strong>Suspended on:</strong>{' '}
                                                    {user.suspendedAt
                                                        ? new Date(
                                                            user.suspendedAt
                                                        ).toLocaleDateString()
                                                        : 'Not available'}
                                                </p>

                                                <p>
                                                    <strong>Suspended by:</strong>{' '}
                                                    {user.suspendedBy?.fullName ||
                                                        'Not available'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                                                    
                                    {/* 4. Display role management controls */}
                                    <div className={styles.userActions}>
                                        {/*
                                            4a. Protect SuperAdmin accounts.
                                            No admin or SuperAdmin can change another SuperAdmin's role here.
                                        */}
                                        {user.isSuspended ? (
                                            <p className={styles.restrictedMessage}>
                                                <ShieldAlert size={17} />
                                                Role management unavailable for suspended accounts
                                            </p>
                                        ): isTargetSuperAdmin ? (
                                            <p className={styles.restrictedMessage}>
                                                <ShieldCheck size={17} />
                                                SuperAdmin account protected
                                            </p>
                                        ) : (
                                            /*
                                                4b. Check whether the account belongs to an admin.
                                                If it does, only the logged-in SuperAdmin can remove its admin privileges.
                                            */
                                            isAdmin ? (
                                                isSuperAdmin ? (
                                                    <Form method="post">
                                                        <input
                                                            type="hidden"
                                                            name="userId"
                                                            value={user._id}
                                                        />

                                                        <button
                                                            type="submit"
                                                            name="intent"
                                                            value="removeAdmin"
                                                            className={styles.suspendButton}
                                                            disabled={isSubmitting && user._id === submittingUserId}
                                                        >
                                                            <ShieldMinus size={17} />
                                                            {isSubmitting && user._id === submittingUserId
                                                                ? 'Processing...'
                                                                : 'Remove Admin Privileges'}
                                                        </button>
                                                    </Form>
                                                ) : (
                                                    <p className={styles.restrictedMessage}>
                                                        <ShieldCheck size={17} />
                                                        Admin account protected
                                                    </p>
                                                )
                                            ) : (
                                                /*
                                                    4c. The account belongs to an ordinary user.
                                                    Only a SuperAdmin gets the option to promote this user.
                                                */
                                                isSuperAdmin && (
                                                    <Form method="post">
                                                        <input
                                                            type="hidden"
                                                            name="userId"
                                                            value={user._id}
                                                        />

                                                        <button
                                                            type="submit"
                                                            name="intent"
                                                            value="makeAdmin"
                                                            className={styles.reactivateButton}
                                                            disabled={isSubmitting && user._id === submittingUserId}
                                                        >
                                                            <ShieldPlus size={17} />
                                                            {isSubmitting && user._id === submittingUserId
                                                                ? 'Processing...'
                                                                : 'Promote to Admin'}
                                                        </button>
                                                    </Form>
                                                )
                                            )
                                        )}

                                        {/*
                                            5. Manage account status separately from role management.
                                            Only ordinary users can be suspended or reactivated.
                                            This prevents admin and SuperAdmin accounts.
                                        */}
                                        {!isAdmin && !isTargetSuperAdmin && (
                                            user.isSuspended ? (
                                                <Form method="post">
                                                    <input
                                                        type="hidden"
                                                        name="userId"
                                                        value={user._id}
                                                    />

                                                    <button
                                                        type="submit"
                                                        name="intent"
                                                        value="reactivate"
                                                        className={styles.reactivateButton}
                                                        disabled={isSubmitting && user._id === submittingUserId}
                                                    >
                                                        <ShieldCheck size={17} />
                                                        {isSubmitting && user._id === submittingUserId
                                                            ? 'Processing...'
                                                            : 'Reactivate Account'}
                                                    </button>
                                                </Form>
                                            ) : (
                                                <Form
                                                    method="post"
                                                    className={styles.suspendForm}
                                                >
                                                    <input
                                                        type="hidden"
                                                        name="userId"
                                                        value={user._id}
                                                    />

                                                    <label>
                                                        Suspension reason
                                                        <textarea
                                                            name="suspensionReason"
                                                            placeholder="Explain why this account should be suspended"
                                                            required
                                                            rows={3}
                                                        />
                                                    </label>

                                                    <button
                                                        type="submit"
                                                        name="intent"
                                                        value="suspend"
                                                        className={styles.suspendButton}
                                                        disabled={isSubmitting && user._id === submittingUserId}
                                                    >
                                                        <ShieldAlert size={17} />
                                                        {isSubmitting && user._id === submittingUserId
                                                            ? 'Processing...'
                                                            : 'Suspend Account'}
                                                    </button>
                                                </Form>
                                            )
                                        )}
                                    </div>

                                </article>
                            </Reveal>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default AdminUsers
