
import { createContext, useContext, useEffect, useState } from 'react'

// Create the cart context
const CartContext = createContext(null)

// Provide cart data and functions to the app
export function CartProvider({ children }) {

    // Initialize cart state from localStorage or default to an empty cart (Lazy initialization to avoid unnecessary parsing on every render)
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('food-app-cart')

        if (!savedCart) {
            return { shop: null, items: [] }
        }

        try {
            return JSON.parse(savedCart)
        } catch {
            return { shop: null, items: [] }
        }
    })

    // Save cart whenever it changes
    useEffect(() => {
        localStorage.setItem('food-app-cart', JSON.stringify(cart))
    }, [cart])

    // Add an item to the cart
    const addToCart = (item, shop) => {
        // Prevent items from different shops being mixed
        if (cart.shop && cart.shop._id !== shop._id) {
            return {
                success: false,
                message: 'Your cart contains items from another shop.',
            }
        }

        // Check if the item already exists in the cart
        const existingItem = cart.items.find(
            cartItem => cartItem._id === item._id
        )

        let updatedItems

        if (existingItem) {
            // Increase quantity if the item already exists
            updatedItems = cart.items.map(cartItem =>
                cartItem._id === item._id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            )
        } else {
            // Add a new item with an initial quantity of 1
            updatedItems = [
                ...cart.items,
                { ...item, quantity: 1 },
            ]
        }

        setCart({
            shop: { _id: shop._id, name: shop.name },
            items: updatedItems,
        })

        return { success: true, message: 'Item added to cart.' }
    }

    // Update an item's quantity
    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) return

        setCart(currentCart => ({
            ...currentCart,
            items: currentCart.items.map(item =>
                item._id === itemId
                    ? { ...item, quantity }
                    : item
            ),
        }))
    }

    // Remove an item from the cart
    const removeFromCart = (itemId) => {
        setCart(currentCart => {
            const updatedItems = currentCart.items.filter(
                item => item._id !== itemId
            )

            return {
                shop: updatedItems.length > 0 ? currentCart.shop : null,
                items: updatedItems,
            }
        })
    }

    // Empty the entire cart
    const clearCart = () => {
        setCart({ shop: null, items: [] })
    }

    // Calculate the total number of individual items
    const cartCount = cart.items.reduce(
        (total, item) => total + item.quantity,
        0
    )

    const value = {
        cart,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

// Custom hook for accessing the cart
export function useCart() {
    return useContext(CartContext)
}
