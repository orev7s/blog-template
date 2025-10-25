import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // AUTH PROTECTION: Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }
  
  // Add aggressive cache headers for static content and article pages
  if (request.nextUrl.pathname.startsWith("/posts/")) {
    // Cache article pages aggressively in CDN
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
    )
  } else if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/_next/static") ||
    request.nextUrl.pathname.startsWith("/images")
  ) {
    // Cache home page and static assets
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
    )
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
