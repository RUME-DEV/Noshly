
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import styles from './Loading.module.css'

function Loading() {
    const { user } = useAuth()

    // 1. Prevent background scrolling while the loading overlay is visible
    useEffect(() => {
        const previousOverflow = document.body.style.overflow

        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [])

    return (
        <div className={styles.loadingRoot}>
            {/* 2. Show the Home link only to authenticated users */}
            {user && (
                <Link to="/" className={styles.homeLink}>
                    <span>←</span> Go Home
                </Link>
            )}

            {/* 3. Main loading animation */}
            <div className={styles.loadingContent}>
                <div className={styles.loader}>
                    <div className={styles.loaderRing}></div>

                    <div className={styles.logoWrapper}>
                        <img
                            src="/foodAppLogo.png"
                            alt="Food App"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loading
