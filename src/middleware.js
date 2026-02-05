import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Buat Client Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Cek User Login
  const { data: { user } } = await supabase.auth.getUser()

  // 3. LOGIKA PROTEKSI ROUTE

  // A. Proteksi Halaman ADMIN (/admin/...)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Kalau belum login -> Lempar ke Login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Kalau sudah login, CEK ROLE di tabel profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Kalau role BUKAN admin -> Lempar ke Home (403 Access Denied)
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // B. Proteksi Halaman PROFILE (/profile/...)
  if (request.nextUrl.pathname.startsWith('/profile')) {
    // Kalau belum login -> Lempar ke Login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // C. Proteksi Halaman LOGIN (Kalau sudah login, gak boleh buka login lagi)
  if (request.nextUrl.pathname.startsWith('/login')) {
    if (user) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

// Tentukan route mana saja yang mau diawasi oleh Satpam ini
export const config = {
  matcher: [
    '/admin/:path*',   // Semua yang depannya /admin
    '/profile/:path*', // Semua yang depannya /profile
    '/login',          // Halaman login
  ],
}