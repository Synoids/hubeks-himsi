import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT use getSession(). Use getUser() as it sends a request to the Supabase server
  // to validate the token, preventing spoofing and ensuring the token is refreshed if expired.
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 1. Allow login page and demo pages through
  if (pathname.startsWith('/login') || pathname.startsWith('/demo')) {
    // Only redirect away from /login if logged in, but always allow /demo
    if (pathname.startsWith('/login') && user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response; 
  }

  // 2. Protect all other routes
  if (!user) {
    const validRoutes = ['/', '/members', '/media-partners'];
    const safeRedirect = validRoutes.includes(pathname) ? pathname : '/';

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', safeRedirect);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
