// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Ambil token dari cookie. Kita beri nama 'auth_token' sebagai contoh.
  // Backend Laravel Anda yang akan mengatur cookie ini saat login berhasil.
  let authToken = request.cookies.get('auth_token')?.value;

  // Jika tidak ada token dan pengguna mencoba mengakses halaman admin
  if (!authToken) {
    // Redirect ke halaman login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Jika ada token, biarkan permintaan dilanjutkan
  return NextResponse.next();
}

// Tentukan path mana saja yang ingin dilindungi oleh middleware ini
export const config = {
  matcher: '/admin/:path*', // Melindungi /admin dan semua sub-pathnya
};