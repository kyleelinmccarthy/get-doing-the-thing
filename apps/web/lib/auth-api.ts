import { createHash, randomBytes } from "crypto";
import { eq, and, gt } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiTokens, users } from "@/lib/db/schema";

const TOKEN_EXPIRY_DAYS = 90;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createApiToken(userId: string) {
  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + TOKEN_EXPIRY_DAYS);

  await db.insert(apiTokens).values({ userId, tokenHash, expiresAt });

  return { token: rawToken, expiresAt };
}

export async function revokeApiToken(tokenHash: string) {
  await db.delete(apiTokens).where(eq(apiTokens.tokenHash, tokenHash));
}

export async function revokeAllUserTokens(userId: string) {
  await db.delete(apiTokens).where(eq(apiTokens.userId, userId));
}

export async function requireApiAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const rawToken = authHeader.slice(7);
  const tokenHash = hashToken(rawToken);

  const record = await db.query.apiTokens.findFirst({
    where: and(
      eq(apiTokens.tokenHash, tokenHash),
      gt(apiTokens.expiresAt, new Date())
    ),
  });

  if (!record) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, record.userId),
  });

  if (!user) {
    return null;
  }

  return { user: { id: user.id, email: user.email } };
}
