import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { requireApiAuth } from "@/lib/auth-api";
import { db } from "@/lib/db";
import { expoPushTokens } from "@/lib/db/schema";

const tokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { token } = tokenSchema.parse(body);

    // Upsert: if token exists for any user, update; otherwise insert
    const existing = await db.query.expoPushTokens.findFirst({
      where: eq(expoPushTokens.token, token),
    });

    if (existing) {
      if (existing.userId !== session.user.id) {
        await db
          .update(expoPushTokens)
          .set({ userId: session.user.id })
          .where(eq(expoPushTokens.id, existing.id));
      }
    } else {
      await db
        .insert(expoPushTokens)
        .values({ userId: session.user.id, token });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    console.error("[API] Save expo token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireApiAuth(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { token } = tokenSchema.parse(body);

    await db
      .delete(expoPushTokens)
      .where(
        and(
          eq(expoPushTokens.userId, session.user.id),
          eq(expoPushTokens.token, token)
        )
      );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    console.error("[API] Delete expo token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
