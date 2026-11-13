# Food Ordering App

A full-stack food ordering application built with React, Node.js, Express, and MongoDB. The application allows customers to browse food shops, order meals, and track their orders, while shop owners can manage their shops and food menus.


## Features

### Customer
- User registration and login.
- Password recovery with OTP verification.
- Browse available food shops.
- Filter shops by city.
- View shops and their food menus.
- Add food items to a shopping cart.
- Manage cart quantities and remove items.
- Checkout with delivery address.
- Cash on delivery.
- View order history and order details.
- Cancel eligible pending orders.

### Shop Owner
- Create and manage multiple shops.
- View owned shops.
- Update shop information and images.
- Open and close shops.
- Manage food items and menus.

### Delivery Rider
- Separate delivery rider account structure.
- Rider management and order delivery workflow.

### Administration
- Admin and superadmin roles.
- Administrative management features.

*Note: Features are being implemented and integrated progressively.*

## Tech Stack

### Frontend
- React
- JavaScript
- React Router
- Axios
- CSS Modules
- Vite
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer
- Cloudinary
- Nodemailer

## Project Structure

```text
food_app/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── actions/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── loaders/
│   │   ├── pages/
│   │   ├── services/
│   │   └── index.css
│   └── package.json
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB database
- Cloudinary account
- Email account configured for Nodemailer

### 1. Clone the repository

```bash
git clone https://github.com/RUME-DEV/Food_App.git
cd food_app
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL=your_email_address
PASS=your_email_app_password
```

Start the backend development server:

```bash
npm run dev
```

The backend runs on port `5000` by default.

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

Vite will provide the local development URL, usually `http://localhost:5173`.

## API Route Groups

The backend organizes its API endpoints into the following route groups:

| Route | Purpose |
|---|---|
| `/user` | User authentication and account management |
| `/shop` | Shop creation and management |
| `/item` | Food item management |
| `/order` | Order creation and management |
| `/delivery-rider` | Delivery rider operations |
| `/admin` | Administrative operations |

## Application Architecture

- React Router Data APIs are used for route loaders, actions, navigation and protected routes.
- React Context manages authentication and shopping cart state.
- Axios handles communication between the frontend and backend.
- Express handles API requests and middleware.
- MongoDB and Mongoose manage application data.
- JWT authentication uses HTTP-only cookies.
- Cloudinary stores uploaded shop and food images.
- Multer handles incoming image uploads.

## Development

The frontend and backend run as separate applications during development.

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

## Security

- Authentication uses HTTP-only cookies.
- Protected API routes require authentication and appropriate authorization.
- Backend validation is used to protect application data.

## Project Status

The application is under active development. Customer ordering features have been implemented progressively, and shop owner, delivery rider and administrative workflows are being developed and integrated.

## License

This project is developed for educational purposes.
