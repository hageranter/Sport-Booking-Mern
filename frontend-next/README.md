# Sport Booking – Next.js Frontend

Migrated from the original React (Vite/CRA) + Tailwind frontend to **Next.js 14** (App Router), **TypeScript**, and **Redux Toolkit**.

## Quick start

```bash
cp .env.local.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL (e.g. http://localhost:5000/api)

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Backend must be running for auth and API calls.

## Final folder structure

```
frontend-next/
├── app/
│   ├── (public)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── fields/page.tsx
│   │   └── field/[id]/page.tsx
│   ├── (dashboard)/
│   │   ├── admin/page.tsx
│   │   ├── owner/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── bookings/page.tsx
│   │   ├── matches/page.tsx
│   │   └── notifications/page.tsx
│   ├── layout.tsx
│   ├── page.tsx          # Home
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── auth/
│   │   ├── AuthInitializer.tsx
│   │   └── DashboardGuard.tsx
│   ├── layout/
│   │   ├── TopNavigation.tsx
│   │   └── BottomNavigation.tsx
│   ├── providers/
│   │   └── ReduxProvider.tsx
│   ├── ui/
│   ├── forms/
│   ├── fields/
│   └── booking/
├── store/
│   ├── store.ts
│   ├── hooks.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── fieldSlice.ts
│       └── bookingSlice.ts
├── lib/
│   ├── axios.ts
│   ├── api.ts
│   └── helpers.ts
├── services/
│   ├── auth.service.ts
│   ├── field.service.ts
│   └── booking.service.ts
├── types/
│   ├── auth.types.ts
│   ├── field.types.ts
│   ├── booking.types.ts
│   └── index.ts
├── hooks/
│   ├── useAuth.ts
│   └── useBooking.ts
├── middleware.ts
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

## Major changes from original frontend

| Area | Before | After |
|------|--------|--------|
| **Framework** | React (CRA) + React Router | Next.js 14 App Router |
| **Language** | JavaScript | TypeScript (strict, no `any`) |
| **State** | AuthContext only | Redux Toolkit (auth, fields, bookings) + redux-persist for auth |
| **Routing** | `/courts/:id`, `/explore` | `/field/[id]`, `/fields` (same UI, URLs aligned with “fields”) |
| **Auth** | Context + localStorage | Redux auth slice + persist; tokens still in localStorage; DashboardGuard for protected routes |
| **API** | Single `api.js` axios instance | Same pattern in `lib/axios.ts`; services in `services/*.service.ts` |
| **Design** | Tailwind (custom theme) | Same Tailwind theme in `tailwind.config.ts` (colors, shadows, radii preserved) |

## Design and styling

- **Preserved:** All Tailwind classes, primary/accent/neutral palette, `card` / `card-hover` shadows, `card` / `chip` radii.
- **No UI/UX changes:** Layouts and components match the original look and behavior.

## Performance and practices

- **App Router:** File-based routing, layouts per section, and route groups `(public)` / `(dashboard)`.
- **Loading/error UI:** Root `loading.tsx` and `error.tsx` for better perceived performance and error handling.
- **Metadata:** Root `layout.tsx` sets default title and description (Next.js metadata API).
- **Client boundaries:** `"use client"` only where needed (auth, forms, navigation, Redux).
- **Typed Redux:** `useAppDispatch` / `useAppSelector` and typed slices; async flows with `createAsyncThunk`.
- **Centralized API:** One axios instance in `lib/axios.ts`, token and refresh logic unchanged; `NEXT_PUBLIC_API_URL` for base URL.

## Auth and protection

- **Token storage:** Still `localStorage` (`accessToken`, `refreshToken`); Redux auth state is persisted with redux-persist.
- **On load:** If a token exists, `AuthInitializer` runs `fetchUser` to sync user with Redux.
- **Protected routes:** All routes under `(dashboard)` are wrapped in `DashboardGuard`, which redirects to `/login` when not authenticated and enforces Admin / CourtOwner for `/admin` and `/owner`.

## Backend

No backend changes. API base URL is set via `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:5000/api`). Endpoints used: `/auth/*`, `/courts/*`, `/bookings/*` (same as original frontend).
