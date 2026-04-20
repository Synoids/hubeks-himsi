// Server Component — forces dynamic rendering and wraps LoginClient
// in a Suspense boundary (required for useSearchParams in Next.js 14)
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import LoginClient from './LoginClient';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
      </div>
    }>
      <LoginClient />
    </Suspense>
  );
}
