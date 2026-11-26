
import styles from './Legal.module.css'

function TermsOfService() {
    return (
        <article className={styles.legalPage}>
            <header className={styles.legalHeader}>
                <h1>Terms of Service</h1>
                <p>Last updated: November 26, 2026</p>
            </header>

            <div className={styles.legalContent}>
                <p>
                    Welcome to Noshly. By accessing or using our platform,
                    you agree to these Terms of Service. Please read them
                    carefully.
                </p>

                <section>
                    <h2>1. About Noshly</h2>
                    <p>
                        Noshly is a food ordering platform that connects
                        customers with shops and supports order delivery
                        through delivery riders.
                    </p>
                </section>

                <section>
                    <h2>2. User Accounts</h2>
                    <p>
                        You are responsible for providing accurate account
                        information and keeping your login credentials secure.
                        You must not use another person's account without
                        authorization.
                    </p>
                    <p>
                        You are responsible for activities carried out
                        through your account.
                    </p>
                </section>

                <section>
                    <h2>3. Customers and Orders</h2>
                    <p>
                        Customers must provide accurate order and delivery
                        information. Orders are subject to shop availability
                        and confirmation.
                    </p>
                    <p>
                        Customers should review their order details and
                        delivery address before submitting an order.
                    </p>
                </section>

                <section>
                    <h2>4. Shop Owners</h2>
                    <p>
                        Shop owners are responsible for the accuracy of
                        their shop information, food descriptions, images
                        and listed prices.
                    </p>
                    <p>
                        Shop owners must manage orders responsibly and
                        comply with applicable food safety and business
                        requirements.
                    </p>
                </section>

                <section>
                    <h2>5. Delivery Riders</h2>
                    <p>
                        Users who apply to become delivery riders must
                        provide accurate information. Rider applications
                        are subject to review and approval.
                    </p>
                    <p>
                        Approved riders are expected to handle assigned
                        deliveries responsibly and communicate appropriately
                        with customers and shops.
                    </p>
                </section>

                <section>
                    <h2>6. Payments and Delivery Fees</h2>
                    <p>
                        Noshly currently supports Cash on Delivery.
                        Customers are responsible for paying the order
                        amount and applicable delivery fee when the order
                        is delivered.
                    </p>
                    <p>
                        Delivery fees and order totals are displayed during
                        checkout and may be updated by Noshly.
                    </p>
                </section>

                <section>
                    <h2>7. Cancellations</h2>
                    <p>
                        Order cancellations are subject to the cancellation
                        options and restrictions available in the platform.
                        A cancellation may not be available once an order
                        has progressed to certain stages.
                    </p>
                </section>

                <section>
                    <h2>8. Acceptable Use</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Use Noshly for unlawful activities.</li>
                        <li>Submit false or misleading information.</li>
                        <li>Attempt to access another user's account.</li>
                        <li>Interfere with the security or operation of Noshly.</li>
                        <li>Abuse other users, shops or delivery riders.</li>
                    </ul>
                </section>

                <section>
                    <h2>9. Account Suspension</h2>
                    <p>
                        Noshly may restrict or suspend accounts that violate
                        these terms, misuse the platform or threaten its
                        security and proper operation.
                    </p>
                </section>

                <section>
                    <h2>10. Service Availability</h2>
                    <p>
                        We aim to keep Noshly available and functioning
                        properly, but we do not guarantee uninterrupted
                        access. Features may be updated, changed or
                        temporarily unavailable.
                    </p>
                </section>

                <section>
                    <h2>11. Changes to These Terms</h2>
                    <p>
                        We may update these Terms of Service as the platform
                        evolves. Continued use of Noshly after updated terms
                        are published means you accept the revised terms.
                    </p>
                </section>

                <section>
                    <h2>12. Contact</h2>
                    <p>
                        For questions about these terms, contact us at:
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

export default TermsOfService
