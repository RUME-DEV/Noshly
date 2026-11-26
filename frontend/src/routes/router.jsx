import { createBrowserRouter } from 'react-router-dom'

import { Navigate } from 'react-router-dom'

// Layouts
import CustomerLayout from '../layouts/CustomerLayout'
import AdminLayout from '../layouts/AdminLayout'

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

// Account Management Pages
import Account from '../pages/account/Account'

// Admin pages
import RiderApplications from '../pages/admin/RiderApplications'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminShops from '../pages/admin/AdminShops'
import AdminOrders from '../pages/admin/AdminOrders'

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
import ShopOrders from '../pages/owner/ShopOrders'

// Rider pages
import ApplyAsRider from '../pages/rider/ApplyAsRider'
import RiderApplication from '../pages/rider/RiderApplication'
import RiderDashboard from '../pages/rider/RiderDashboard'

// Legal Pages
import PrivacyPolicy from '../pages/legal/PrivacyPolicy'
import TermsOfService from '../pages/legal/TermsOfService'

// Not Found Page
import NotFoundPage from '../pages/NotFoundPage';

// Loaders
import homeLoader from '../loaders/homeLoader'
import shopDetailsLoader from '../loaders/shopDetailsLoader'
import myOrdersLoader from '../loaders/myOrdersLoader'
import orderDetailsLoader from '../loaders/orderDetailsLoader'
import myShopsLoader from '../loaders/myShopsLoader'
import manageShopLoader from '../loaders/manageShopLoader'
import riderApplicationLoader from '../loaders/riderApplicationLoader'
import riderApplicationsLoader from '../loaders/riderApplicationsLoader'
import riderDashboardLoader from '../loaders/riderDashboardLoader'
import adminDashboardLoader from '../loaders/adminDashboardLoader'
import adminUsersLoader from '../loaders/adminUsersLoader'
import adminShopsLoader from '../loaders/adminShopsLoader'
import adminOrdersLoader from '../loaders/adminOrdersLoader'
import shopOrdersLoader from '../loaders/shopOrdersLoader'

// Actions
import createShopAction from '../actions/createShopAction'
import editShopAction from '../actions/editShopAction'
import createItemAction from '../actions/createItemAction'
import editItemAction from '../actions/editItemAction'
import deleteItemAction from '../actions/deleteItemAction'
import applyAsRiderAction from '../actions/applyAsRiderAction'
import reviewRiderApplicationAction from '../actions/reviewRiderApplicationAction'
import riderDashboardAction from '../actions/riderDashboardAction'
import adminUsersAction from '../actions/adminUsersAction'
import adminShopsAction from '../actions/adminShopsAction'
import shopOrdersAction from '../actions/shopOrdersAction'
import orderDetailsAction from '../actions/orderDetailsAction'



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
            {
                path: 'privacy-policy',
                element: <PrivacyPolicy />,
            },
            {
                path: 'terms',
                element: <TermsOfService />,
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
                        action: orderDetailsAction,
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
                    {
                        path: 'owner/orders',
                        element: <ShopOrders />,
                        loader: shopOrdersLoader,
                        action: shopOrdersAction,
                    },
                    {
                        path: 'account',
                        element: <Account />,
                    },
                    {
                        path: 'rider/apply',
                        element: <ApplyAsRider />,
                        action: applyAsRiderAction,
                    },
                    {
                        path: 'rider/application',
                        element: <RiderApplication />,
                        loader: riderApplicationLoader,
                        action: applyAsRiderAction,
                    },
                    {
                        path: 'rider/dashboard',
                        element: <RiderDashboard />,
                        loader: riderDashboardLoader,
                        action: riderDashboardAction,
                    },
                ],
            },
        ],
    },

    // Admin-only routes
    {
        path: '/admin',
        element: <ProtectedRoute allowedRoles={['admin', 'superAdmin']} />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    // 1. Redirect /admin to the dashboard
                    {
                        index: true,
                        element: <Navigate to="dashboard" replace />,
                    },

                    // 2. Admin dashboard
                    {
                        path: 'dashboard',
                        element: <AdminDashboard />,
                        loader: adminDashboardLoader,
                    },

                    // 3. Rider applications
                    {
                        path: 'rider-applications',
                        element: <RiderApplications />,
                        loader: riderApplicationsLoader,
                        action: reviewRiderApplicationAction,
                    },
                    {
                        path: 'users',
                        element: <AdminUsers />,
                        loader: adminUsersLoader,
                        action: adminUsersAction,
                    },
                    {
                        path: 'shops',
                        element: <AdminShops />,
                        loader: adminShopsLoader,
                        action: adminShopsAction,
                    },
                    {
                        path: 'orders',
                        element: <AdminOrders />,
                        loader: adminOrdersLoader,
                    },
                ],
            },
        ],
    },

    {
        path: '*',
        element: <NotFoundPage />,
    },
])

export default router