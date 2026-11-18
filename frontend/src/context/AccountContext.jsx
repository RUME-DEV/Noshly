
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'

// 1. Create the account context
const AccountContext = createContext(null)

// 2. Provide shop ownership and rider application status
export function AccountProvider({ children }) {
    const { user, loading: authLoading } = useAuth()

    const [hasShops, setHasShops] = useState(null)
    const [riderStatus, setRiderStatus] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState({
        shops: '',
        rider: '',
    })

    // Prevent older requests from overwriting newer account data (keeps track of api requests)
    const requestId = useRef(0)

    // 3. Fetch the user's shop and rider status
    const refreshAccountStatus = useCallback(async () => {
        // Give each request it's number (like an id)
        const currentRequest = ++requestId.current

        // Clear account data when nobody is logged in
        if (!user || authLoading) {
            setHasShops(null)
            setRiderStatus(undefined)
            setErrors({ shops: '', rider: '' })
            setLoading(authLoading)
            return
        }

        setLoading(true)
        setErrors({ shops: '', rider: '' })

        // Fetch both statuses independently
        const results = await Promise.allSettled([
            api.get('/shop/my-shops'),
            api.get('/delivery-rider/my-profile'),
        ])

        // Ignore results from an outdated request
        if (currentRequest !== requestId.current) return

        const [shopsResult, riderResult] = results

        // 4. Update shop ownership status
        if (shopsResult.status === 'fulfilled') {
            const shops = shopsResult.value.data.shops
            setHasShops(Array.isArray(shops) && shops.length > 0)
        } else {
            setHasShops(null)
            setErrors((previous) => ({
                ...previous,
                shops: 'Could not load your shops.',
            }))
        }

        // 5. Update rider application status
        if (riderResult.status === 'fulfilled') {
            setRiderStatus(riderResult.value.data.riderProfile.status)
        } else if (riderResult.reason?.response?.status === 404) {
            // A 404 means the user has not applied to become a rider
            setRiderStatus(null)
        } else {
            setRiderStatus(undefined)
            setErrors((previous) => ({
                ...previous,
                rider: 'Could not load your rider application.',
            }))
        }

        setLoading(false)
    }, [user, authLoading])

    // 6. Refresh account status when authentication changes
    useEffect(() => {
        refreshAccountStatus()

        return () => {
            // Invalidate requests when the provider unmounts or dependencies change
            requestId.current += 1
        }
    }, [refreshAccountStatus])

    const value = {
        hasShops,
        riderStatus,
        loading,
        errors,
        refreshAccountStatus,
    }

    return (
        <AccountContext.Provider value={value}>
            {children}
        </AccountContext.Provider>
    )
}

// 7. Custom hook for accessing account status
export function useAccount() {
    return useContext(AccountContext)
}
