// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl.pathname;

  // Only target the problematic pages
  if (url.startsWith('/products') || url.startsWith('/')) {
    const res = NextResponse.next();
    // Prevent BFCache by telling browser not to store it
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/products', '/'],
};