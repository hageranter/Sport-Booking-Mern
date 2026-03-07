# Google Login Setup - Quick Start Guide

This guide will help you add Google login to your Sport Booking frontend.

## ✅ What Was Done

1. **Updated package.json** - Added `@react-oauth/google` dependency
2. **Updated app/layout.tsx** - Wrapped with `GoogleOAuthProvider`
3. **Created GoogleLoginButton.tsx** - Ready-to-use Google login button component
4. **Updated login page** - Added Google button with divider

## 🚀 Installation Steps

### Step 1: Install Dependencies

```bash
cd frontend-next
npm install
```

This will install:

- `@react-oauth/google` - Google Sign-In library (already added to package.json)

### Step 2: Configure Environment Variables

1. Create or update `.env.local` file in the `frontend-next` directory:

```bash
# Copy from the example file
cp .env.example .env.local
```

2. Edit `.env.local` and add your Google Client ID:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

**Where to get Google Client ID:**

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project
- Enable Google+ API
- Create OAuth 2.0 credentials (Web application)
- Copy the Client ID and add it to `.env.local`

### Step 3: Start the Frontend

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Step 4: Start the Backend

In another terminal:

```bash
cd backend
npm run dev
```

The backend should run on `http://localhost:5000`

### Step 5: Test Google Login

1. Go to `http://localhost:3000/login`
2. You should see the Google login button
3. Click on it and sign in with your Google account
4. You should be redirected to the home page

## 📋 What Changed

### Files Modified

1. **frontend-next/package.json**
   - Added `@react-oauth/google` dependency

2. **frontend-next/app/layout.tsx**
   - Imported `GoogleOAuthProvider`
   - Wrapped the app with `GoogleOAuthProvider`

3. **frontend-next/app/(public)/login/page.tsx**
   - Imported `GoogleLoginButton` component
   - Added Google login button above the email form
   - Added divider between Google and email login

### Files Created

1. **frontend-next/components/auth/GoogleLoginButton.tsx**
   - New Google login button component
   - Handles Google token verification
   - Sends token to backend
   - Stores JWT tokens in localStorage
   - Shows toast notifications

## 🔧 How It Works

### User Flow

```
1. User clicks Google Login button
   ↓
2. Google Sign-In popup appears
   ↓
3. User authenticates with Google
   ↓
4. GoogleLoginButton receives credential
   ↓
5. Sends tokenId to backend: POST /api/auth/google
   ↓
6. Backend verifies token and returns JWT tokens
   ↓
7. Tokens stored in localStorage
   ↓
8. User redirected to home page
   ↓
9. Login successful!
```

### Key Features

✅ **Secure** - Backend verifies all Google tokens
✅ **Automatic Login** - New users created automatically
✅ **Account Linking** - Existing users linked to Google
✅ **Email Import** - Email and profile picture imported from Google
✅ **Error Handling** - User-friendly error messages
✅ **Toast Notifications** - Success/error feedback

## 🎨 Customization

### Change Google Button Appearance

Edit `frontend-next/components/auth/GoogleLoginButton.tsx`:

```tsx
<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
  theme="outline" // Options: "outline", "filled_blue", "filled_black"
  size="large" // Options: "large", "medium", "small"
  locale="en" // Language code
  text="signin_with" // Options: "signin_with", "signup_with", "signin", "signup"
  width="100%"
/>
```

### Add to Other Pages

To add Google login to other pages (like register page):

1. Import the button:

```tsx
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
```

2. Add it to your page:

```tsx
<GoogleLoginButton />
```

## 🔍 Troubleshooting

### Google button not showing?

- Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `.env.local`
- Verify the ClientID is correct from Google Cloud Console
- Restart your dev server after changes

### "Invalid Google token" error?

- Check that backend `.env` has the same `GOOGLE_CLIENT_ID`
- Verify Google Cloud Console authorized origins include `http://localhost:3000`
- Check backend is running on `http://localhost:5000`

### CORS error?

- Ensure backend CORS includes frontend URL
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Restart backend server

### Login button doesn't work?

- Check browser console for errors
- Verify Google token is being sent to backend
- Check backend logs for errors
- Make sure both servers are running

### Token not saving?

- Check localStorage is enabled in browser
- Verify no console errors
- Check API response includes tokens in data

## 📞 Support

For detailed information, see:

- Backend setup: `backend/GOOGLE-OAUTH-SETUP.md`
- Implementation guide: `GOOGLE-OAUTH-IMPLEMENTATION-GUIDE.md`
- Complete checklist: `GOOGLE-OAUTH-CHECKLIST.md`

## 🔐 Security Notes

- Never commit `.env.local` to git
- Keep `GOOGLE_CLIENT_SECRET` only in backend `.env`
- Frontend only needs `GOOGLE_CLIENT_ID`
- Always verify tokens on backend

## ✨ Next Steps

1. ✅ Install dependencies
2. ✅ Configure `.env.local`
3. ✅ Get Google credentials
4. ✅ Start both servers
5. ✅ Test Google login
6. ✅ (Optional) Customize button appearance
7. ✅ (Optional) Add to other pages

---

**You're all set!** Your frontend now has Google login. Just run `npm install` and configure the `.env.local` file!
