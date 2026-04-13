'use client';

import { useEffect } from 'react';
import { getErrorMessage } from '@/lib/helpers';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h2>
        <p className="text-neutral-600 mb-6">{getErrorMessage(error)}</p>
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
