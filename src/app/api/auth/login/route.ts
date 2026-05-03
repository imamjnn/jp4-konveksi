import { db } from "@/db";
import { userCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { sessions } from "@/db/schema";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const credential = await db.query.userCredentials.findFirst({
    where: eq(userCredentials.email, email),
  });

  if (!credential) {
    return NextResponse.json({ error: "Invalid email" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, credential.password);

  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // update last login
  await db
    .update(userCredentials)
    .set({ lastLoginAt: new Date() })
    .where(eq(userCredentials.id, credential.id));

  // create session
  const accessToken = randomUUID();

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8); // 8 jam

  await db.insert(sessions).values({
    userId: credential.userId,
    accessToken,
    expiresAt,
  });

  const cookieStore = await cookies();

  cookieStore.set("token", accessToken, {
    httpOnly: true,
  });

  return NextResponse.json({
    accessToken,
    role: credential.role,
  });
}
