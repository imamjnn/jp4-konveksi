import { db } from "@/db";
import { users, userCredentials } from "@/db/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  // hash password
  const hashed = await bcrypt.hash(password, 10);

  // insert user
  const [user] = await db.insert(users).values({ name }).returning();

  // insert credential
  await db.insert(userCredentials).values({
    userId: user.id,
    email,
    password: hashed,
  });

  return NextResponse.json({ success: true });
}
