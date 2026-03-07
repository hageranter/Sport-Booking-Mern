import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'CourtBooker - Football Field Booking',
  description: 'Find and book sports courts, join tournaments, and connect with players!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={googleClientId}>
          <ReduxProvider>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </ReduxProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
