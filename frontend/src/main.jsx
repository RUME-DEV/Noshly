import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import router from './routes/router'
import { AuthProvider } from './context/AuthContext'
import { AccountProvider } from './context/AccountContext'
import { CartProvider } from './context/CartContext'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AuthProvider>
                <AccountProvider>
                    <CartProvider>
                        <RouterProvider router={router} />
                    </CartProvider>
                </AccountProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    </StrictMode>
)