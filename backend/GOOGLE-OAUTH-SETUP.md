# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Sports Booking application.

## Prerequisites

- A Google Cloud Project
- OAuth 2.0 credentials (Client ID and Client Secret)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown and select "New Project"
3. Enter a project name (e.g., "Sports Booking")
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to the APIs & Services page
2. Click "Enable APIs and Services"
3. Search for "Google+ API"
4. Click on it and select "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to the Credentials page in Google Cloud Console
2. Click "Create Credentials" and select "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required information
   - Add test users (your email)
   - Save and continue
4. For Application type, select "Web application"
5. Add Authorized JavaScript origins:
   - `http://localhost:3000` (frontend)
   - `http://localhost:5000` (backend)
   - Your production domain
6. Add Authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - Your production callback URL
7. Click "Create"
8. Copy the Client ID and Client Secret

## Step 4: Configure Environment Variables

Add the following to your `.env` file in the backend directory:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

## Step 5: Install Dependencies

Run the following command in the backend directory:

```bash
npm install
```

This will install the required packages:

- `google-auth-library`: For verifying Google ID tokens
- `passport-google-oauth20`: For OAuth strategy

## Frontend Setup

In your Next.js frontend, you need to:

1. Install Google Sign-In library:

```bash
npm install @react-oauth/google
```

2. Wrap your app with GoogleOAuthProvider:

```jsx
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {/* Your app components */}
    </GoogleOAuthProvider>
  );
}
```

3. Use the Google Sign-In button in your login page:

```jsx
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const handleGoogleSuccess = (credentialResponse) => {
    // Send tokenId to your backend
    const credential = credentialResponse.credential;

    fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId: credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Store tokens and redirect
          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);
          // Redirect to dashboard
        }
      });
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
}
```

## API Endpoint

### POST `/api/auth/google`

Login or register a user with Google ID token.

**Request Body:**

```json
{
  "tokenId": "google_id_token_from_frontend"
}
```

**Success Response (200/201):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "User Name",
      "profilePicture": "picture_url",
      "role": "User",
      "language": "en"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid Google token"
}
```

## Features

- **Automatic Account Creation**: New Google users are automatically registered
- **Account Linking**: Existing email-based accounts can be linked with Google
- **Email Verification**: Google verified emails are automatically marked as verified
- **Profile Picture**: User profile pictures from Google are imported
- **Secure Token Verification**: Backend verifies all Google tokens

## Testing

1. Make sure your backend is running on `http://localhost:5000`
2. Make sure your frontend is running on `http://localhost:3000`
3. Add your email to the test users in Google OAuth consent screen
4. Test the Google Sign-In flow from your frontend

## Troubleshooting

### "Invalid Google token" error

- Make sure the Client ID matches in both frontend and backend
- Verify the token is being sent correctly from frontend
- Check that the token isn't expired

### CORS errors

- Make sure `http://localhost:3000` is in your CORS origin configuration
- Update the CORS configuration in `backend/server.js`

### Token not being created

- Verify your JWT_SECRET and JWT_REFRESH_SECRET are set in `.env`
- Check the MongoDB connection

## Security Notes

1. Never commit your `.env` file with real credentials
2. Use environment variables only
3. In production, use HTTPS and secure cookies
4. Rotate your Google Client Secret regularly
5. Monitor failed login attempts
