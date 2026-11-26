import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

// Create the authentication context
const AuthContext = createContext(null)

// Make authentication state available to the app
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check whether a user already has a valid login session
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/user/me')

                setUser(response.data.userData)
            } catch (error) {
                // No valid session, or the server could not be reached
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    // Log in an existing user
    const login = async (credentials) => {
        const response = await api.post('/user/login', credentials)

        setUser(response.data.userData)

        return response.data
    }

    // Register a new user
    const register = async (userDetails) => {
        const response = await api.post('/user/register', userDetails)

        setUser(response.data.userData)

        return response.data
    }

    // Log in or register using Google
    const googleLogin = async (idToken) => {
        const response = await api.post('/user/google-auth', {
            idToken
        })

        setUser(response.data.userData)

        return response.data
    }

    // Link Google account
    const linkGoogle = async (idToken) => {
        const response = await api.post('/user/link-google', {
            idToken
        })

        setUser(prev => ({
            ...prev,
            hasGoogle: true
        }))

        return response.data
    }

    // Add password to Google account
    const setPassword = async (password) => {
        const response = await api.post('/user/set-password', {
            password
        })

        setUser(prev => ({
            ...prev,
            hasPassword: true
        }))

        return response.data
    }

    // Log out the current user
    const logout = async () => {
        try {
            await api.post('/user/logout')
        } finally {
            setUser(null)
        }
    }

    const value = {
        user,
        loading,
        login,
        register,
        googleLogin,
        linkGoogle,
        setPassword,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook for accessing authentication context
export function useAuth() {
    return useContext(AuthContext)
}