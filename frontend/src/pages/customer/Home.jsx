
import { Form, Link, useLoaderData } from 'react-router-dom'

import styles from './Customer.module.css'
import Reveal from '../../components/Reveal'

function Home() {
    const { shops, error, city } = useLoaderData()

    return (
        <main className={styles.homePage}>
            {/* Hero section */}
            <section className={styles.homeHero}>
                <Reveal animation="drop">
                    <div className={styles.homeHeroContent}>
                        <span className={styles.heroLabel}>GOOD FOOD, GOOD MOOD</span>

                        <h1>
                            Discover Delicious Food <br />
                            Around You
                        </h1>

                        <p>
                            Find your favourite meals from shops around you.
                            Explore different cuisines and order something delicious.
                        </p>

                        <a href="#explore-shops" className={styles.heroButton}>
                            Explore Shops
                        </a>
                    </div>
                </Reveal>
            </section>

            {/* Shops section */}
            <section className={styles.shopsSection} id="explore-shops">
                <Reveal animation="slideLeft">
                    <div className={styles.shopsHeading}>
                        <div>
                            <span className={styles.sectionLabel}>EXPLORE</span>
                            <h2>Find Your Favourite Shop</h2>
                            <p>Discover food shops in your city.</p>
                        </div>
                    </div>
                </Reveal>

                {/* City filter */}
                <Reveal animation="slideRight">
                    <Form method="get" className={styles.cityFilter}>
                        <input
                            type="search"
                            name="city"
                            placeholder="Enter a city, e.g. Lagos"
                            defaultValue={city}
                        />

                        <button type="submit">Search</button>

                        {city && (
                            <Link to="/" className={styles.clearFilter}>
                                Clear
                            </Link>
                        )}
                    </Form>
                </Reveal>

                {/* Shops results */}
                {error ? (
                    <p className={styles.homeError} role="alert">{error}</p>
                ) : shops.length === 0 ? (
                    <p className={styles.emptyShops}>
                        {city
                            ? `No shops found in ${city}.`
                            : 'No shops are currently available.'}
                    </p>
                ) : (
                    <div className={styles.shopsGrid}>
                        {shops.map(shop => (
                            <Reveal
                                key={shop._id}
                                animation="scale"
                                className={styles.shopCardReveal}
                            >
                                <Link
                                    to={`/shops/${shop._id}`}
                                    className={styles.shopCard}
                                >
                                    <img src={shop.image} alt={shop.name} />

                                    <div className={styles.shopCardInfo}>
                                        <h3>{shop.name}</h3>
                                        <p>{shop.city}, {shop.state}</p>
                                        <span>View Shop →</span>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

export default Home
