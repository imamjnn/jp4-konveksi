import { cookies } from "next/headers";
import { db } from "@/db";
import { sessions, userCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.accessToken, token),
  });

  if (!session) return null;

  const credential = await db.query.userCredentials.findFirst({
    where: eq(userCredentials.userId, session.userId),
  });

  if (!credential) return null;

  return {
    userId: session.userId,
    role: credential.role,
    sessionId: session.id,
  };
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function requireRole(roles: string[]) {
  const session = await requireAuth();

  if (!roles.includes(session.role)) {
    throw new Error("FORBIDDEN");
  }

  return session;
}
