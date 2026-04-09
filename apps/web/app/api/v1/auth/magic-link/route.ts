import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

const requestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const TOKEN_EXPIRY_MINUTES = 10;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = requestSchema.parse(body);

    const token = randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + TOKEN_EXPIRY_MINUTES);

    await db.insert(verificationTokens).values({
      identifier: email,
      token,
      expires,
    });

    const appScheme = process.env.MOBILE_APP_SCHEME ?? "doingthething";
    const callbackUrl = `${appScheme}://auth/callback?token=${token}&email=${encodeURIComponent(email)}`;

    const transport = nodemailer.createTransport(process.env.EMAIL_SERVER);
    await transport.sendMail({
      to: email,
      from: process.env.EMAIL_FROM ?? "noreply@getdoingthething.com",
      subject: "Sign in to Doing The Thing",
      text: `Sign in to Doing The Thing:\n\n${callbackUrl}\n\nThis link expires in ${TOKEN_EXPIRY_MINUTES} minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Sign in to Doing The Thing</h2>
          <p><a href="${callbackUrl}" style="display: inline-block; padding: 12px 24px; background: #96A797; color: white; text-decoration: none; border-radius: 8px;">Open in App</a></p>
          <p style="color: #7B8A91; font-size: 14px;">This link expires in ${TOKEN_EXPIRY_MINUTES} minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    console.error("[API] Magic link error:", error);
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500 }
    );
  }
}
