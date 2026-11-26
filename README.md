# Noshly

**Good food. Good mood.**

Noshly is a full-stack multi-vendor food delivery application that connects customers with food shops. Customers can discover shops, browse menus, place orders and track deliveries, while shop owners manage their shops, menus and incoming orders.

The platform also includes delivery rider workflows and administrative tools for managing users, shops, orders and rider applications.

## Features

### Customer
- Register and log in using email and password or Google.
- Link a Google account to an existing account.
- Add a password to a Google-only account.
- Recover passwords using email OTP verification.
- Browse available food shops and filter by city.
- View shop details and food menus.
- Add items to a cart and manage quantities.
- Place orders with delivery addresses.
- Pay using Cash on Delivery.
- View order history and detailed order information.
- Cancel eligible orders with an optional cancellation reason.
- View assigned rider contact details and contact the rider.

### Shop Owner
- Create and manage multiple shops.
- Update shop details and images.
- Open and close shops.
- Add, edit and manage food items.
- View and manage incoming orders.
- Update order statuses.
- Cancel orders with a required cancellation reason.
- View shop-related order information.

### Delivery Rider
- Apply to become a delivery rider.
- Submit and manage rider profile information.
- View assigned delivery orders.
- Update delivery progress.
- Confirm cash collection for Cash on Delivery orders.

### Administration
- Admin and Super Admin roles.
- Dashboard statistics and overview.
- Manage users, shops and orders.
- Review and manage delivery rider applications.
- Suspend and reactivate users and shops.
- Manage administrative roles and permissions.

## Tech Stack

| Frontend | Backend | Database & Services |
|---|---|---|
| React | Node.js | MongoDB |
| React Router | Express.js | Cloudinary |
| JavaScript | Mongoose | Nodemailer |
| Axios | JWT | Google OAuth |
| CSS Modules | Multer | |
| Vite | bcryptjs | |
| Lucide React | | |

## Project Structure

```text
food_app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
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
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.css
│   └── package.json
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/) account
- Email account with an app password for Nodemailer
- Google OAuth client ID for Google authentication

### 1. Clone the repository

```bash
git clone https://github.com/RUME-DEV/Noshly.git
cd Food_App
```

### 2. Backend setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

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

GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the backend development server:

```bash
npm run dev
```

The backend will run on the configured port (5000 in the example above).

### 3. Frontend setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the frontend development server:

```bash
npm run dev
```

Vite will display the local development URL, usually:

```text
http://localhost:5173
```

### 4. Available frontend scripts

Run these commands from the `frontend` directory:

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production application |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## API Route Groups

The backend organizes its endpoints into the following route groups:

| Base Route | Description |
|---|---|
| `/user` | Authentication and account management |
| `/shop` | Shop creation and management |
| `/item` | Food item management |
| `/order` | Order creation and management |
| `/delivery-rider` | Rider applications and delivery operations |
| `/admin` | Administrative operations |

## Application Architecture

- **React Router Data APIs** handle route navigation, loaders, actions and protected routes.
- **React Context** manages authentication, account information and shopping cart state.
- **Axios** handles communication between the frontend and backend.
- **Express.js** provides the REST API and middleware.
- **MongoDB and Mongoose** handle data storage, schemas and relationships.
- **JWT authentication** uses HTTP-only cookies for session management.
- **Google OAuth** supports Google sign-in and account linking.
- **Multer** handles image uploads.
- **Cloudinary** stores shop and food item images.
- **Nodemailer** handles email-based OTP verification and password recovery.

## Security

- HTTP-only authentication cookies.
- Password hashing with bcryptjs.
- Authentication and role-based authorization for protected routes.
- Server-side validation and error handling.
- Restricted image uploads by file type and size.
- Environment variables for sensitive credentials.

## Configuration Notes

- Keep `.env` files out of version control.
- Use your own MongoDB connection string, Cloudinary credentials and Google OAuth client ID.
- Configure the Google OAuth authorized JavaScript origins for your frontend domain when deploying.
- Update `CLIENT_URL` and `VITE_API_URL` to match your deployed frontend and backend URLs.
