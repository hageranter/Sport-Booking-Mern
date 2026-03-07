'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUser } from '@/store/slices/authSlice';

export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const { accessToken, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken && !user) {
      dispatch(fetchUser());
    }
  }, [accessToken, user, dispatch]);

  return null;
}
