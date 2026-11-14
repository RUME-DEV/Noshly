import { createBrowserRouter } from 'react-router-dom'

// Layouts
import CustomerLayout from '../layouts/CustomerLayout'

// Error page
import ErrorPage from './ErrorPage'

// Auth components
import GuestRoute from '../components/auth/GuestRoute'
import ProtectedRoute from '../components/auth/ProtectedRoute'

// Auth pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import VerifyOTP from '../pages/auth/VerifyOTP'
import ResetPassword from '../pages/auth/ResetPassword'

// Customer pages
import Home from '../pages/customer/Home'
import ShopDetails from '../pages/customer/ShopDetails'
import Cart from '../pages/customer/Cart'
import Checkout from '../pages/customer/Checkout'
import MyOrders from '../pages/customer/MyOrders'
import OrderDetails from '../pages/customer/OrderDetails'

// Owner pages
import MyShops from '../pages/owner/MyShops'
import CreateShop from '../pages/owner/CreateShop'
import ManageShop from '../pages/owner/ManageShop'
import EditShop from '../pages/owner/EditShop'
import CreateItem from '../pages/owner/CreateItem'
import EditItem from '../pages/owner/EditItem'


// Loaders
import homeLoader from '../loaders/homeLoader'
import shopDetailsLoader from '../loaders/shopDetailsLoader'
import myOrdersLoader from '../loaders/myOrdersLoader'
import orderDetailsLoader from '../loaders/orderDetailsLoader'
import myShopsLoader from '../loaders/myShopsLoader'
import manageShopLoader from '../loaders/manageShopLoader'

// Actions
import createShopAction from '../actions/createShopAction'
import editShopAction from '../actions/editShopAction'
import createItemAction from '../actions/createItemAction'
import editItemAction from '../actions/editItemAction'
import deleteItemAction from '../actions/deleteItemAction'



const router = createBrowserRouter([
    {
        path: '/',
        element: <CustomerLayout />,
        errorElement: <ErrorPage />,
        children: [
            // Public routes
            {
                index: true,
                element: <Home />,
                loader: homeLoader,
            },
            {
                path: 'shops/:shopId',
                element: <ShopDetails />,
                loader: shopDetailsLoader,
            },
            {
                path: 'cart',
                element: <Cart />,
            },

            // Guest-only routes
            {
                element: <GuestRoute />,
                children: [
                    {
                        path: 'login',
                        element: <Login />,
                    },
                    {
                        path: 'register',
                        element: <Register />,
                    },
                    {
                        path: 'forgot-password',
                        element: <ForgotPassword />,
                    },
                    {
                        path: 'verify-otp',
                        element: <VerifyOTP />,
                    },
                    {
                        path: 'reset-password',
                        element: <ResetPassword />,
                    },
                ],
            },

            // Authenticated customer routes
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: 'checkout',
                        element: <Checkout />,
                    },
                    {
                        path: 'my-orders',
                        element: <MyOrders />,
                        loader: myOrdersLoader,
                    },
                    {
                        path: 'orders/:orderId',
                        element: <OrderDetails />,
                        loader: orderDetailsLoader,
                    },
                    {
                        path: 'owner/shops',
                        element: <MyShops />,
                        loader: myShopsLoader,
                    },
                    {
                        path: 'owner/shops/new',
                        element: <CreateShop />,
                        action: createShopAction,
                    },
                    {
                        path: 'owner/shops/:shopId',
                        element: <ManageShop />,
                        loader: manageShopLoader,
                        action: deleteItemAction
                    },
                    {
                        path: 'owner/shops/:shopId/edit',
                        element: <EditShop />,
                        loader: manageShopLoader,
                        action: editShopAction,
                    },
                    {
                        path: 'owner/shops/:shopId/items/new',
                        element: <CreateItem />,
                        loader: manageShopLoader,
                        action: createItemAction,
                    },
                    {
                        path: 'owner/shops/:shopId/items/:itemId/edit',
                        element: <EditItem />,
                        loader: manageShopLoader,
                        action: editItemAction,
                    },
                ],
            },
        ],
    },
])

export default router