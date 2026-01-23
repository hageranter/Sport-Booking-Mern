# 🏟️ Sports Booking System - MERN Stack

A comprehensive sports facility booking platform enabling users to book courts, create matches, chat in real-time, and manage payments.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Development](#development)
- [API Documentation](#api-documentation)

## ✨ Features

- **User Authentication:** JWT-based auth with refresh tokens
- **Court Management:** Create, browse, and manage sports courts
- **Booking System:** Real-time court availability and booking
- **Match System:** Create public/private matches, join with others
- **Real-time Chat:** WebSocket-based chat within matches
- **Payment Integration:** Stripe payment processing
- **QR Codes:** Generated for booking verification
- **Multi-language:** Arabic (default) and English support with RTL
- **Email Notifications:** Automated notifications for key events
- **Reviews & Ratings:** Rate and review courts
- **Admin Dashboard:** Manage users, courts, and system analytics

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (jsonwebtoken)
- **Real-time:** Native WebSockets (ws)
- **File Upload:** Multer
- **Payment:** Stripe
- **Email:** Nodemailer
- **Validation:** express-validator
- **Security:** Helmet, express-rate-limit

### Frontend
- **Framework:** React 18
- **Build Tool:** Create React App
- **Styling:** Tailwind CSS
- **State Management:** Context API
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **i18n:** react-i18next
- **Payment UI:** @stripe/react-stripe-js
- **Notifications:** react-toastify

## 📁 Project Structure

```
Sport-Booking-Mern/
├── backend/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── uploads/         # File storage
│   └── server.js        # Entry point
│
├── frontend/
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── contexts/    # React Context
│       ├── services/    # API calls
│       ├── utils/       # Helper functions
│       ├── i18n/        # Translations
│       └── App.js       # Root component
│
└── shared/
    └── constants.js     # Shared constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sport-Booking-Mern
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install --legacy-peer-deps
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

3. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   # App runs on http://localhost:3000
   ```

## ⚙️ Configuration

Edit `backend/config/config.js` to configure:

- **Database:** MongoDB connection URI
- **JWT Secrets:** Authentication secrets
- **Stripe:** API keys for payment processing
- **Email:** SMTP credentials for notifications
- **CORS:** Allowed origins
- **Upload:** File size limits and allowed types

## 💻 Development

### Backend Development

```bash
cd backend
npm run dev  # Runs with nodemon for auto-restart
```

### Frontend Development

```bash
cd frontend
npm start  # Runs on http://localhost:3000 with hot reload
```

### API Health Check

Visit `http://localhost:5000/health` to verify the backend is running.

## 📚 API Documentation

API endpoints will be documented as they are implemented. Key endpoint groups:

- `/api/auth` - Authentication (register, login, refresh)
- `/api/users` - User management
- `/api/courts` - Court CRUD operations
- `/api/bookings` - Booking management
- `/api/matches` - Match/tournament system
- `/api/payments` - Payment processing
- `/api/reviews` - Court reviews
- `/api/notifications` - User notifications

## 🌍 Internationalization

The app supports:
- **Arabic (ar):** Default language with RTL support
- **English (en):** Secondary language

Language files are located in `frontend/src/i18n/`.

## 🔐 Security Features

- Helmet for HTTP headers security
- Rate limiting on API routes
- JWT with short-lived access tokens and refresh tokens
- CORS configuration
- Input validation with express-validator
- File upload restrictions

## 📝 License

[Your License Here]

## 👥 Contributors

[Your Name/Team]

---

**Status:** Phase 1 Complete ✅ - Project setup and infrastructure ready
**Next:** Phase 2 - Database Models Implementation
