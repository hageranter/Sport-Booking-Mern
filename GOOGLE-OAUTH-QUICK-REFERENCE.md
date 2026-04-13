# Google OAuth Integration - Quick Reference

## What Was Added

### Backend Changes

1. **Updated User Model** (`backend/models/User.js`)
   - Added `googleId` field (unique, sparse)
   - Added `googleEmail` field
   - Added `socialLoginProvider` enum field
   - Updated password hashing to handle null passwords for OAuth users

2. **New Controller Method** (`backend/controllers/authController.js`)
   - `googleLogin()` - Handles Google OAuth login/registration
   - Verifies Google ID tokens
   - Auto-creates users from Google profile
   - Links existing email users to Google
   - Returns JWT tokens for session management

3. **New API Route** (`backend/routes/auth.js`)
   - `POST /api/auth/google` - Google login endpoint
   - Full OpenAPI documentation included

4. **Configuration** (`backend/config/config.js`)
   - Added Google OAuth configuration variables
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL`

5. **Dependencies Added** (`backend/package.json`)
   - `google-auth-library` - For token verification
   - `passport` - OAuth middleware framework
   - `passport-google-oauth20` - Google strategy

### Documentation Files

1. **backend/GOOGLE-OAUTH-SETUP.md** - Complete backend setup guide
2. **frontend-next/GOOGLE-OAUTH-SETUP.md** - Complete frontend setup guide
3. **backend/.env.example** - Environment variables template
4. **frontend-next/.env.example** - Frontend environment variables template

---

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Update .env file with Google credentials
# Copy .env.example to .env and fill in:
# GOOGLE_CLIENT_ID=your_client_id
# GOOGLE_CLIENT_SECRET=your_client_secret
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend-next

# Install Google OAuth package
npm install @react-oauth/google

# Create .env.local with:
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Get Google Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized origins and redirect URIs
6. Copy Client ID and Secret to `.env` files

---

## API Endpoint

### POST `/api/auth/google`

**Request:**

```json
{
  "tokenId": "google_id_token_from_frontend"
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "User Name",
      "profilePicture": "url",
      "role": "User",
      "language": "en"
    },
    "accessToken": "jwt_token",
    "refreshToken": "jwt_token"
  }
}
```

---

## Key Features

✅ **Secure Token Verification** - Verifies all Google tokens on backend
✅ **Auto Account Creation** - Creates users automatically from Google profile
✅ **Account Linking** - Links Google to existing email accounts
✅ **Email Pre-verification** - Google emails marked as verified
✅ **Profile Pictures** - Imports user profile images from Google
✅ **JWT Tokens** - Uses existing JWT auth system
✅ **Role Support** - Supports User, CourtOwner, Admin roles
✅ **Language Support** - Maintains language preferences

---

## Frontend Integration Example

```tsx
import { GoogleLogin } from "@react-oauth/google";

const handleSuccess = async (credentialResponse) => {
  const response = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokenId: credentialResponse.credential }),
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    // Redirect to dashboard
  }
};

return <GoogleLogin onSuccess={handleSuccess} />;
```

---

## Flow Diagram

```
Frontend (Google Sign-In Button)
    ↓
User clicks Google button
    ↓
Google provides ID Token
    ↓
Frontend sends tokenId to Backend
    ↓
Backend (POST /api/auth/google)
    ↓
Google-auth-library validates token
    ↓
Check if user exists by googleId
    ├→ EXISTS: Generate JWT tokens, update lastLogin
    │
    └→ NOT EXISTS: Check if email exists
        ├→ EMAIL EXISTS: Link Google to account
        │
        └→ NEW: Create user from Google profile
    ↓
Return JWT tokens + user data
    ↓
Frontend stores tokens, redirects to dashboard
```

---

## User Flow Scenarios

### Scenario 1: New Google User

1. User clicks "Sign in with Google"
2. Backend creates new user account
3. User automatically logged in
4. Redirected to dashboard

### Scenario 2: Existing Email User

1. User clicks "Sign in with Google" with same email
2. Backend links Google to existing account
3. User logged in with linked account
4. Both email and Google can be used for login

### Scenario 3: Returning Google User

1. User clicks "Sign in with Google"
2. Backend finds existing Google account
3. User logged in, lastLogin updated
4. Session refreshed

---

## Testing

```bash
# Backend should be running
cd backend
npm run dev

# Frontend should be running
cd frontend-next
npm run dev

# Test with Google account
# 1. Go to http://localhost:3000/login
# 2. Click Google Sign-In button
# 3. Complete Google authentication
# 4. Should see JWT tokens in console/localStorage
# 5. Should be redirected to dashboard
```

---

## Environment Variables Checklist

### Backend (.env)

- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `JWT_SECRET` - Generate random string
- [ ] `JWT_REFRESH_SECRET` - Generate random string
- [ ] `MONGODB_URI` - Your MongoDB connection

### Frontend (.env.local)

- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Same as backend
- [ ] `NEXT_PUBLIC_API_URL` - Your backend URL

---

## Security Notes

⚠️ **Important Security Measures:**

- Store credentials in `.env` files (never commit)
- Backend validates all Google tokens
- Tokens expire after 15 minutes (configurable)
- Refresh tokens rotate on use
- Maximum 5 concurrent refresh tokens per user
- Password hashing disabled for OAuth users
- Email verification automatic for Google users

---

## Troubleshooting

| Issue                        | Solution                                                  |
| ---------------------------- | --------------------------------------------------------- |
| "Invalid Google token"       | Check Client ID matches between frontend & backend        |
| Google button not displaying | Verify env var is set and `GoogleOAuthProvider` wraps app |
| CORS errors                  | Update CORS_ORIGIN in backend config                      |
| Tokens not saving            | Check localStorage is enabled                             |
| User not created             | Verify MongoDB connection and no duplicate emails         |

---

## Files Modified/Created

✅ `backend/models/User.js` - Added Google fields
✅ `backend/controllers/authController.js` - Added googleLogin method
✅ `backend/routes/auth.js` - Added /google endpoint
✅ `backend/config/config.js` - Added Google config variables
✅ `backend/package.json` - Added packages
✅ `backend/GOOGLE-OAUTH-SETUP.md` - Setup guide
✅ `backend/.env.example` - Environment template
✅ `frontend-next/GOOGLE-OAUTH-SETUP.md` - Frontend guide
✅ `frontend-next/.env.example` - Frontend env template

---

## Next Steps

1. ✅ Get Google OAuth credentials
2. ✅ Configure `.env` files
3. ✅ Install dependencies (`npm install`)
4. ✅ Implement frontend Google button
5. ✅ Test authentication flow
6. ✅ Add user profile completion flow (optional)
7. ✅ Deploy to production with HTTPS

---

## Support

For detailed setup instructions:

- Backend: See `backend/GOOGLE-OAUTH-SETUP.md`
- Frontend: See `frontend-next/GOOGLE-OAUTH-SETUP.md`
- Issues: Check troubleshooting sections in both guides
