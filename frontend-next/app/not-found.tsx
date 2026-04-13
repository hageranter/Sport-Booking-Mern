import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">404</h1>
        <p className="text-neutral-600 mb-6">Page not found</p>
        <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
