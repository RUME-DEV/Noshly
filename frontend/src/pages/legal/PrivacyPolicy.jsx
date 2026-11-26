
import styles from './Legal.module.css'

function PrivacyPolicy() {
    return (
        <article className={styles.legalPage}>
            <header className={styles.legalHeader}>
                <h1>Privacy Policy</h1>
                <p>Last updated: November 26, 2026</p>
            </header>

            <div className={styles.legalContent}>
                <p>
                    Noshly respects your privacy. This Privacy Policy explains
                    what information we collect, how we use it, and how it is
                    handled when you use our food ordering and delivery platform.
                </p>

                <section>
                    <h2>1. Information We Collect</h2>
                    <p>Depending on how you use Noshly, we may collect:</p>
                    <ul>
                        <li>
                            Account information, including your name, email
                            address and password.
                        </li>
                        <li>
                            Your mobile number when provided, including when
                            applying to become a delivery rider.
                        </li>
                        <li>
                            Google account identification information when
                            you sign in using Google.
                        </li>
                        <li>
                            Order information, including ordered items,
                            quantities, prices and order history.
                        </li>
                        <li>
                            Delivery information, including your street,
                            city and state.
                        </li>
                        <li>
                            Shop information and images uploaded by shop owners.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>2. How We Use Your Information</h2>
                    <p>We use collected information to:</p>
                    <ul>
                        <li>Create and manage user accounts.</li>
                        <li>Authenticate users and protect accounts.</li>
                        <li>Process and manage food orders.</li>
                        <li>Coordinate deliveries between customers, shops and riders.</li>
                        <li>Send password-reset verification codes.</li>
                        <li>Manage shops, food listings and rider applications.</li>
                        <li>Maintain platform security and prevent misuse.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Passwords and Authentication</h2>
                    <p>
                        Account passwords are hashed before being stored.
                        Authentication uses secure cookies. When you choose
                        Google sign-in, Google provides authentication
                        information needed to identify your account.
                    </p>
                </section>

                <section>
                    <h2>4. Cookies and Local Storage</h2>
                    <p>
                        Noshly uses an HTTP-only authentication cookie to
                        maintain your signed-in session. The application also
                        uses your browser's local storage to retain your
                        shopping cart.
                    </p>
                </section>

                <section>
                    <h2>5. Third-Party Services</h2>
                    <p>
                        Noshly relies on third-party services to operate.
                        These include:
                    </p>
                    <ul>
                        <li>Google for Google account authentication.</li>
                        <li>MongoDB Atlas for database hosting.</li>
                        <li>Cloudinary for uploaded shop and food images.</li>
                        <li>Render for backend hosting.</li>
                        <li>Vercel for frontend hosting.</li>
                        <li>Gmail for sending password-reset emails.</li>
                    </ul>
                    <p>
                        These services may process information as necessary
                        to provide their respective services and are subject
                        to their own privacy policies.
                    </p>
                </section>

                <section>
                    <h2>6. Sharing of Information</h2>
                    <p>
                        We do not sell your personal information. Information
                        may be shared where necessary to operate Noshly. For
                        example, relevant order and delivery information is
                        made available to the shop and delivery rider handling
                        an order. Authorized administrators may also access
                        information when managing the platform.
                    </p>
                </section>

                <section>
                    <h2>7. Data Security</h2>
                    <p>
                        We use measures such as password hashing,
                        authenticated access and protected authentication
                        cookies to help safeguard information. However, no
                        internet-based service can guarantee absolute security.
                    </p>
                </section>

                <section>
                    <h2>8. Data Retention</h2>
                    <p>
                        We retain information for as long as reasonably
                        necessary to provide the service, manage accounts,
                        maintain order records and meet applicable obligations.
                        You may contact us to ask about your personal information.
                    </p>
                </section>

                <section>
                    <h2>9. Your Privacy Choices</h2>
                    <p>
                        You can review and update certain account information
                        through your account. You may also contact us with
                        questions or requests concerning your personal data.
                    </p>
                </section>

                <section>
                    <h2>10. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy when our services
                        or data practices change. Updated versions will be
                        published on this page with a revised update date.
                    </p>
                </section>

                <section>
                    <h2>11. Contact Us</h2>
                    <p>
                        For privacy questions or requests, contact us at:
                        {' '}
                        <a href="mailto:appservices.notify@gmail.com">
                            appservices.notify@gmail.com
                        </a>
                    </p>
                </section>
            </div>
        </article>
    )
}

export default PrivacyPolicy
