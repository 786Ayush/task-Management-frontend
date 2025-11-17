// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;

    // Public routes (no authentication needed)
    const publicRoutes = ["/login", "/register"];

    const pathname = req.nextUrl.pathname;

    // Allow public routes
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // If no token → redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Token exists → allow request
    return NextResponse.next();
  } catch (err) {
    console.log("Middleware Error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Define which routes middleware should run on
export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/tasks/:path*", 
    "/" 
    // Add protected routes here
  ],
};
