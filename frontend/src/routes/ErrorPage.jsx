import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

import styles from './ErrorPage.module.css'

function ErrorPage() {
    const error = useRouteError()

    let message = 'Something went wrong. Please try again.'

    // Check if the error is a route error response
    if (isRouteErrorResponse(error)) {

        message = error.data || error.statusText || `Error ${error.status}`
    } else if (error?.response?.data?.message) {

        // Handle Axios errors returned by the backend
        message = error.response.data.message
    } else if (error instanceof Error) {

        // Handle ordinary JavaScript errors
        message = error.message
    }

    return (
        <main className={styles.errorPage}>
            <h1>Oops!</h1>
            <p role="alert">{message}</p>
            <Link to="/">Go back home</Link>
        </main>
    )
}

export default ErrorPage
