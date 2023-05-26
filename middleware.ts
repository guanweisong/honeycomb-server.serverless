import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const origin = requestHeaders.get('origin');

  requestHeaders.set('Access-Control-Allow-Origin', origin!);
  requestHeaders.set('Access-Control-Allow-Credentials', 'true');
  requestHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  requestHeaders.set(
    'Access-Control-Allow-Headers',
    'content-type, x-auth-token, x-requested-with',
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
