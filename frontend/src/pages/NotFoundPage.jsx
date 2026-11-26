
import { Link } from 'react-router-dom';
import { Home, UtensilsCrossed } from 'lucide-react';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
    return (
        <main className={styles.notFound}>
            <div className={styles.content}>
                <UtensilsCrossed
                    size={52}
                    className={styles.icon}
                />

                <h1>404</h1>
                <h2>Oops! This page is off the menu.</h2>

                <p>
                    We couldn't find the page you're looking for.
                    It may have moved or the link may be incorrect.
                </p>

                <Link to="/" className={styles.homeButton}>
                    <Home size={18} />
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
