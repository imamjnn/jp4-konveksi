import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  console.log("Proxy jalan:", pathname, "accessToken:", accessToken);

  // ✅ kalau SUDAH login dan buka /login → redirect ke dashboard
  if (accessToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ❌ kalau BELUM login dan akses halaman protected
  if (!accessToken && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// tentukan route mana yang diproteksi
export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
