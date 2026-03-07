# Google OAuth Frontend Setup

This guide explains how to implement Google Sign-In in your Next.js frontend for the Sports Booking application.

## Installation

First, install the Google OAuth package:

```bash
npm install @react-oauth/google
```

## Environment Variables

Create a `.env.local` file in the `frontend-next` directory:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Setup Steps

### 1. Wrap App with GoogleOAuthProvider

Update your `frontend-next/app/layout.tsx`:

```tsx
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
```

### 2. Create Google Login Component

Create `frontend-next/components/auth/GoogleLoginButton.tsx`:

```tsx
"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setAuthToken } from "@/store/slices/authSlice";
import { CredentialResponse } from "@react-oauth/google";

export default function GoogleLoginButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      console.error("No credential received");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tokenId: credentialResponse.credential,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        // Store tokens in localStorage or Redux
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);

        // Store user info in Redux
        dispatch(
          setAuthToken({
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            user: data.data.user,
          }),
        );

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        locale="en"
      />
    </div>
  );
}
```

### 3. Update Login Page

Update your login page (`frontend-next/app/(public)/login/page.tsx`) to include Google login:

```tsx
"use client";

import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Email/Password Login */}
        <form className="space-y-4 mb-6">
          {/* Your existing email/password form here */}
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {/* Google Login */}
        <GoogleLoginButton />

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:text-blue-900">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
```

### 4. Update Redux Auth Slice

Update your `frontend-next/store/slices/authSlice.ts`:

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<any>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.error = null;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setAuthToken, logout, setError } = authSlice.actions;
export default authSlice.reducer;
```

### 5. Create Google Login Service

Create `frontend-next/services/google-auth.service.ts`:

```typescript
import { API_BASE_URL } from "@/lib/api";

export interface GoogleLoginRequest {
  tokenId: string;
}

export interface GoogleLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      fullName: string;
      profilePicture: string;
      role: string;
      language: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export const googleAuthService = {
  async loginWithGoogle(tokenId: string): Promise<GoogleLoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId }),
    });

    return response.json();
  },

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
};
```

## Usage Example

Here's a complete example of a login component:

```tsx
"use client";

import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { googleAuthService } from "@/services/google-auth.service";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await googleAuthService.loginWithGoogle(
        credentialResponse.credential,
      );

      if (response.success) {
        googleAuthService.saveTokens(
          response.data.accessToken,
          response.data.refreshToken,
        );

        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Sign In with Google
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setError("Google sign-in failed")}
          size="large"
          theme="outline"
          locale="en"
        />
      </div>
    </div>
  );
}
```

## Styling the Google Button

You can customize the Google Sign-In button appearance:

```tsx
<GoogleLogin
  onSuccess={handleSuccess}
  onError={handleError}
  theme="outline" // or "filled_blue", "filled_black"
  size="large" // or "medium", "small"
  text="signin_with" // or "signup_with", "signin", "signup"
  locale="en" // Language code
  logo_alignment="left" // or "center"
/>
```

## Security Best Practices

1. **Never expose Client Secret on frontend** - Only use Client ID
2. **Validate tokens on backend** - Always verify Google tokens server-side
3. **Use HTTPS in production** - Never use HTTP for sensitive operations
4. **Store tokens securely** - Consider using HttpOnly cookies instead of localStorage in production
5. **Implement token refresh** - Refresh access tokens before they expire
6. **Add CSRF protection** - Implement CSRF tokens for session-based attacks
7. **Monitor for suspicious activity** - Log and monitor authentication attempts

## Troubleshooting

### Google button not displaying

- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
- Make sure `GoogleOAuthProvider` wraps your component
- Check browser console for errors

### "Invalid audience" error

- Ensure the Client ID in frontend matches the one in backend config
- Verify the token is being sent to the correct endpoint

### CORS errors

- Check that your backend CORS configuration allows your frontend domain
- Update CORS settings in `backend/config/config.js`

### Token not persisting

- Verify localStorage is enabled in the browser
- Check that you're saving tokens correctly
- In production, use HttpOnly cookies instead

## Next Steps

1. Test the Google OAuth flow locally
2. Update your backend `.env` with real Google credentials
3. Test the complete authentication flow
4. Add user profile completion after Google sign-up
5. Implement token refresh logic
6. Deploy with production credentials
