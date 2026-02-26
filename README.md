# Sport Booking – MERN Stack

Sports facility booking platform. Book courts, create matches, chat in real-time, and pay online.  
Built with **React** (web) + **React Native** (mobile, coming) sharing the same REST API.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT (access + refresh tokens) |
| Frontend | React 18, Tailwind CSS, React Router v6, Axios |
| Real-time | WebSockets (ws) |
| Payments | Stripe |
| i18n | react-i18next (Arabic default, English) |

---

## Quick Start

**Prerequisites:** Node.js ≥ 18, MongoDB running on `localhost:27017`

```bash
# 1 – Backend
cd backend
npm install
npm run dev          # http://localhost:5000

# 2 – Frontend (new terminal)
cd frontend
npm install --legacy-peer-deps
npm start            # http://localhost:3000
```

Verify the API: `GET http://localhost:5000/health`

---

## Environment Variables

Create `backend/.env` (optional – defaults work for local dev):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sportsbooking
JWT_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
CORS_ORIGIN=http://localhost:3000

# Optional
STRIPE_SECRET_KEY=
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=
EMAIL_PASS=
```

Create `frontend/.env` (optional):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## API Endpoints

| Group | Prefix |
|---|---|
| Auth | `POST /api/auth/register` · `login` · `refresh` · `logout` · `forgot-password` · `reset-password` |
| Users | `/api/users` |
| Courts | `/api/courts` |
| Bookings | `/api/bookings` |
| Matches | `/api/matches` |
| Payments | `/api/payments` |
| Reviews | `/api/reviews` |
| Notifications | `/api/notifications` |

---

## Project Structure

```
Sport-Booking-Mern/
├── backend/
│   ├── config/          # DB & app config
│   ├── controllers/     # Route handlers
│   ├── middlewares/     # Auth, validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── services/        # Business logic
│   ├── utils/           # JWT helpers, etc.
│   └── server.js
│
└── frontend/
    └── src/
        ├── services/    # api.js (axios) + *Service.js files
        ├── contexts/    # AuthContext
        ├── pages/       # Route-level components
        ├── components/  # Shared UI components
        └── i18n/        # Translation files
```

> **React Native:** swap `src/services/api.js` (replace `localStorage` → `AsyncStorage` and set `REACT_APP_API_URL` to your server IP). All service files and context logic stay the same.
