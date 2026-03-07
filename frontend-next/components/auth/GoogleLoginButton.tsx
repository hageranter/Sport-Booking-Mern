'use client';

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/store/hooks';
import { fetchUser } from '@/store/slices/authSlice';

export default function GoogleLoginButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('No credential received from Google');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      console.log('Sending Google credential to backend:', apiUrl);
      
      const response = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId: credentialResponse.credential,
        }),
      });

      const data = await response.json();
      console.log('======= BACKEND RESPONSE DEBUG =======');
      console.log('Full response object:', data);
      console.log('data.success:', data?.success);
      console.log('data.data:', data?.data);
      console.log('data.data.accessToken:', data?.data?.accessToken);
      console.log('response status:', response.status);
      console.log('======= END DEBUG =======');

      if (data.success && data.data && data.data.accessToken) {
        // Store tokens in localStorage
        console.log('✅ Credentials check passed, storing tokens...');
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        console.log('✅ Tokens stored successfully');
        console.log('Stored accessToken:', data.data.accessToken.substring(0, 50) + '...');
        
        // Dispatch fetchUser to update Redux state
        console.log('📍 Fetching user data to update Redux...');
        await dispatch(fetchUser());
        
        toast.success('Google login successful!');
        
        console.log('🔄 Redirecting to home...');
        
        // Redirect to home
        router.replace('/');
      } else {
        console.error('❌ Login failed - Missing required fields');
        console.error('data structure:', data);
        toast.error(data.message || 'Google login failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      toast.error('An error occurred during Google login. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login was cancelled or failed');
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        locale="en"
        text="signin_with"
      />
    </div>
  );
}
