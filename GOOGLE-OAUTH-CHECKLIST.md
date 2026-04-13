# Google OAuth Implementation Checklist

Use this checklist to implement Google OAuth in your Sport Booking application.

---

## Phase 1: Google Cloud Console Setup

### Create Google Cloud Project

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create a new project named "Sports Booking"
- [ ] Enable Google+ API
- [ ] Navigate to Credentials page

### Create OAuth 2.0 Credentials

- [ ] Click "Create Credentials" → "OAuth 2.0 Client ID"
- [ ] If prompted, configure OAuth consent screen:
  - [ ] Select "External" user type
  - [ ] Fill required app information
  - [ ] Add your email as test user
  - [ ] Save and continue
- [ ] Select "Web application" for application type
- [ ] Add Authorized JavaScript Origins:
  - [ ] `http://localhost:3000`
  - [ ] `http://localhost:5000`
  - [ ] Add production domain
- [ ] Add Authorized Redirect URIs:
  - [ ] `http://localhost:5000/api/auth/google/callback`
  - [ ] Add production URLs
- [ ] Click "Create"
- [ ] Copy "Client ID" and "Client Secret"
- [ ] Save credentials somewhere safe

---

## Phase 2: Backend Configuration

### Update Environment Variables

- [ ] Copy `.env.example` to `.env` (if not exists)
- [ ] Add Google credentials to `.env`:
  ```
  GOOGLE_CLIENT_ID=<your_client_id_here>
  GOOGLE_CLIENT_SECRET=<your_client_secret_here>
  ```
- [ ] Verify other required variables are set:
  - [ ] `JWT_SECRET`
  - [ ] `JWT_REFRESH_SECRET`
  - [ ] `MONGODB_URI`
  - [ ] `CORS_ORIGIN=http://localhost:3000`

### Install Dependencies

- [ ] Open terminal in `backend` directory
- [ ] Run: `npm install`
- [ ] Verify packages installed:
  - [ ] google-auth-library
  - [ ] passport
  - [ ] passport-google-oauth20

### Verify Backend Code

- [ ] Check `models/User.js` has Google fields:
  - [ ] `googleId` field
  - [ ] `googleEmail` field
  - [ ] `socialLoginProvider` field
- [ ] Check `controllers/authController.js` has `googleLogin` method
- [ ] Check `routes/auth.js` has POST `/google` endpoint
- [ ] Check `config/config.js` has Google variables:
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `GOOGLE_CALLBACK_URL`

### Test Backend

- [ ] Start backend: `npm run dev`
- [ ] Verify server starts without errors
- [ ] Check console for "Server running on port 5000"
- [ ] Test with curl (optional):
  ```bash
  curl -X POST http://localhost:5000/api/auth/google \
    -H "Content-Type: application/json" \
    -d '{"tokenId":"test_token"}'
  ```

---

## Phase 3: Frontend Configuration

### Update Environment Variables

- [ ] Create `.env.local` in `frontend-next` directory
- [ ] Copy content from `.env.example`
- [ ] Add Google credentials:
  ```
  NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your_client_id_here>
  ```
- [ ] Verify other variables:
  - [ ] `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

### Install Dependencies

- [ ] Open terminal in `frontend-next` directory
- [ ] Run: `npm install @react-oauth/google`
- [ ] Verify installation: `npm list @react-oauth/google`

### Update App Layout

- [ ] Open `app/layout.tsx`
- [ ] Import GoogleOAuthProvider:
  ```tsx
  import { GoogleOAuthProvider } from "@react-oauth/google";
  ```
- [ ] Wrap children with GoogleOAuthProvider:
  ```tsx
  <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
    {children}
  </GoogleOAuthProvider>
  ```
- [ ] Save file

### Create Google Login Component

- [ ] Create `components/auth/GoogleLoginButton.tsx`
- [ ] Copy code from GOOGLE-OAUTH-IMPLEMENTATION-GUIDE.md
- [ ] Update imports as needed for your project
- [ ] Save file

### Update Login Page

- [ ] Open `app/(public)/login/page.tsx`
- [ ] Import GoogleLoginButton component
- [ ] Add GoogleLoginButton to login form
- [ ] Add divider between Google and email login (optional)
- [ ] Save file

### Create Redux Auth Slice (if needed)

- [ ] Check `store/slices/authSlice.ts` exists
- [ ] If not exists, create it with code from GOOGLE-OAUTH-IMPLEMENTATION-GUIDE.md
- [ ] Add actions: `setUser`, `setTokens`, `logout`, etc.

### Create Auth Service (if needed)

- [ ] Create `services/google-auth.service.ts`
- [ ] Copy code from GOOGLE-OAUTH-IMPLEMENTATION-GUIDE.md
- [ ] Update to match your API structure

---

## Phase 4: Frontend Setup & Testing

### Start Frontend Development Server

- [ ] Terminal in `frontend-next` directory
- [ ] Run: `npm run dev`
- [ ] Check: "compiled client and server successfully"
- [ ] Open: http://localhost:3000

### Visual Testing

- [ ] Navigate to login page
- [ ] Verify Google button is visible
- [ ] Button should display Google branding

### Functional Testing

- [ ] Click on Google login button
- [ ] You should see Google sign-in popup
- [ ] Sign in with your test Google account
- [ ] Check browser console for any errors
- [ ] Should see tokens in localStorage
- [ ] Should be redirected to dashboard
- [ ] User info should display on dashboard

### Error Testing

- [ ] Test with invalid token (check error handling)
- [ ] Test network error scenarios
- [ ] Test duplicate email (should link account)
- [ ] Verify error messages are user-friendly

---

## Phase 5: Advanced Features (Optional)

### Add "Remember Me" Feature

- [ ] Add checkbox to login form
- [ ] Save email to localStorage if checked
- [ ] Pre-fill email on next visit

### Add Account Linking UI

- [ ] Show current auth method on profile
- [ ] Allow users to link/unlink Google account
- [ ] Show profile picture from both sources

### Add Profile Completion Flow

- [ ] After Google signup, prompt for:
  - [ ] Phone number
  - [ ] Profile picture (optional)
  - [ ] Preferences/language
- [ ] Save to profile
- [ ] Redirect to profile page

### Add Facebook/GitHub OAuth (Optional)

- [ ] Create credentials on respective platforms
- [ ] Update backend to support multiple providers
- [ ] Add buttons to login page

---

## Phase 6: Deployment Setup

### Backend Deployment

- [ ] Update GOOGLE_CLIENT_ID in production `.env`
- [ ] Update GOOGLE_CLIENT_SECRET in production `.env`
- [ ] Update GOOGLE_CALLBACK_URL to production URL
- [ ] Update CORS_ORIGIN to production frontend URL
- [ ] Update JWT_SECRET to strong random string
- [ ] Update JWT_REFRESH_SECRET to strong random string
- [ ] Configure HTTPS for production

### Frontend Deployment

- [ ] Update NEXT_PUBLIC_GOOGLE_CLIENT_ID for production
- [ ] Update NEXT_PUBLIC_API_URL to production backend URL
- [ ] Build frontend: `npm run build`
- [ ] Test production build locally: `npm run start`
- [ ] Deploy to hosting service

### Google Cloud Console Updates

- [ ] Add production domain to Authorized JavaScript Origins
- [ ] Add production callback URL to Authorized Redirect URIs
- [ ] Review and update OAuth consent screen with production info
- [ ] Move app from "External" to "Internal" (if applicable)

---

## Phase 7: Security Hardening

### Backend Security

- [ ] Ensure all env variables use strong random values
- [ ] Enable HTTPS in production
- [ ] Set secure CORS policy
- [ ] Implement rate limiting on auth endpoints
- [ ] Enable logging and monitoring
- [ ] Regularly rotate credentials
- [ ] Use environment-specific configurations

### Frontend Security

- [ ] Never expose GOOGLE_CLIENT_SECRET
- [ ] Always validate tokens on backend
- [ ] Use HttpOnly cookies in production (not localStorage)
- [ ] Implement CSRF protection
- [ ] Sanitize user input
- [ ] Enable Content Security Policy

### Database Security

- [ ] Enable MongoDB authentication
- [ ] Use encrypted connections
- [ ] Regular backups
- [ ] Monitor for suspicious activity
- [ ] Index googleId field for performance

---

## Phase 8: Monitoring & Maintenance

### Setup Monitoring

- [ ] Enable server logs
- [ ] Monitor failed login attempts
- [ ] Track Google auth errors
- [ ] Monitor token expiration issues
- [ ] Setup alerts for high error rates

### Regular Maintenance

- [ ] Review Google OAuth documentation regularly
- [ ] Update dependencies monthly: `npm update`
- [ ] Security patches: `npm audit fix`
- [ ] Monitor Google API status page
- [ ] Review user feedback about login

### Documentation

- [ ] Update team documentation
- [ ] Record support tickets and resolutions
- [ ] Create runbook for troubleshooting
- [ ] Document any customizations made

---

## File Checklist

### Backend Files Modified

- [ ] `backend/models/User.js` - Contains Google fields
- [ ] `backend/controllers/authController.js` - Contains googleLogin method
- [ ] `backend/routes/auth.js` - Contains /google route
- [ ] `backend/config/config.js` - Contains Google variables
- [ ] `backend/package.json` - Contains new packages

### Backend Files Created

- [ ] `backend/.env.example` - Environment template
- [ ] `backend/GOOGLE-OAUTH-SETUP.md` - Setup guide

### Frontend Files Created

- [ ] `frontend-next/components/auth/GoogleLoginButton.tsx` - Login button component
- [ ] `frontend-next/.env.example` - Environment template
- [ ] `frontend-next/GOOGLE-OAUTH-SETUP.md` - Setup guide

### Frontend Files Modified

- [ ] `frontend-next/app/layout.tsx` - GoogleOAuthProvider wrapper
- [ ] `frontend-next/app/(public)/login/page.tsx` - Google button added
- [ ] `frontend-next/store/slices/authSlice.ts` - Updated auth actions (optional)

### Documentation Files Created

- [ ] `GOOGLE-OAUTH-QUICK-REFERENCE.md`
- [ ] `GOOGLE-OAUTH-IMPLEMENTATION-GUIDE.md`
- [ ] `GOOGLE-OAUTH-CHANGES-SUMMARY.md`
- [ ] `GOOGLE-OAUTH-CHECKLIST.md` (this file)

---

## Command Reference

### Backend Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test API endpoint
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"tokenId":"your_token"}'

# Check installed packages
npm list | grep google
```

### Frontend Commands

```bash
# Install Google OAuth package
npm install @react-oauth/google

# Start development server
npm run dev

# Build for production
npm run build

# Check environment variables
echo $NEXT_PUBLIC_GOOGLE_CLIENT_ID
```

---

## Troubleshooting Quick Links

| Issue                     | Resolution                              |
| ------------------------- | --------------------------------------- |
| "Invalid Google token"    | See backend/GOOGLE-OAUTH-SETUP.md       |
| Google button not showing | See frontend-next/GOOGLE-OAUTH-SETUP.md |
| CORS errors               | Update CORS_ORIGIN in backend .env      |
| Dependency errors         | Run `npm install` again                 |
| Port already in use       | Change PORT in .env or kill process     |

---

## Estimated Timeline

- **Phase 1** (Google Cloud): 15-30 minutes
- **Phase 2** (Backend): 10-15 minutes
- **Phase 3** (Frontend Setup): 10-15 minutes
- **Phase 4** (Testing): 15-30 minutes
- **Phase 5** (Advanced): 1-3 hours (optional)
- **Phase 6** (Deployment): 30 minutes - 2 hours
- **Phase 7** (Security): 30 minutes
- **Phase 8** (Monitoring): 15-30 minutes

**Total**: 2-4 hours (including optional features)

---

## Success Criteria

- [ ] Google login button visible on login page
- [ ] Can sign in with Google account
- [ ] JWT tokens saved to localStorage
- [ ] User redirected to dashboard after login
- [ ] User profile displayed correctly
- [ ] Token refresh works
- [ ] Logout functionality works
- [ ] Error messages display appropriately
- [ ] No console errors
- [ ] No CORS errors
- [ ] Backend logs show successful login attempts

---

## Support

If you get stuck:

1. Check the detailed guides in root directory
2. Review error messages carefully
3. Check browser console for errors
4. Check backend console for errors
5. Verify all environment variables
6. Ensure correct Google Client ID in both files
7. Make sure ports 3000 and 5000 are available

---

## Next Steps After Completion

1. ✅ Test in development
2. ✅ Test with multiple Google accounts
3. ✅ Test account linking (same email)
4. ✅ Implement frontend components for additional OAuth providers
5. ✅ Set up user profile completion flow
6. ✅ Add email verification for non-Google users
7. ✅ Implement "Connect Account" feature
8. ✅ Deploy to production
9. ✅ Monitor and maintain

---

**Remember**: Always test thoroughly before deploying to production!
