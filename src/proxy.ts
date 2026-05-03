import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  console.log("Proxy jalan:", pathname, "token:", token);

  // ✅ kalau SUDAH login dan buka /login → redirect ke dashboard
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ❌ kalau BELUM login dan akses halaman protected
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// tentukan route mana yang diproteksi
export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
