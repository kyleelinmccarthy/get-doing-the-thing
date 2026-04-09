import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, and, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { createApiToken } from "@/lib/auth-api";

const callbackSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, email } = callbackSchema.parse(body);

    // Find and validate the verification token
    const record = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.identifier, email),
        eq(verificationTokens.token, token),
        gt(verificationTokens.expires, new Date())
      ),
    });

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Consume the token (delete it)
    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, email),
          eq(verificationTokens.token, token)
        )
      );

    // Find or create user
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      const [newUser] = await db
        .insert(users)
        .values({ email, emailVerified: new Date() })
        .returning();

      if (!newUser) {
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }
      user = newUser;
    } else if (!user.emailVerified) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id));
    }

    // Create API token for mobile
    const apiToken = await createApiToken(user.id);

    return NextResponse.json({
      token: apiToken.token,
      expiresAt: apiToken.expiresAt.toISOString(),
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    console.error("[API] Auth callback error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
