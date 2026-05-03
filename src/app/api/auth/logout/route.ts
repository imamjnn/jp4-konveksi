import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    // hapus session di DB
    await db.delete(sessions).where(eq(sessions.accessToken, token));
  }

  // hapus cookie
  cookieStore.delete("token");

  return NextResponse.json({ success: true });
}
