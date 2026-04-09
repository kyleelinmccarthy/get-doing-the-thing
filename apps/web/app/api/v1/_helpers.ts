import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireApiAuth } from "@/lib/auth-api";

type AuthenticatedHandler = (
  req: NextRequest,
  userId: string
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest) => {
    try {
      const session = await requireApiAuth(req);

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      return await handler(req, session.user.id);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: error.errors[0]?.message ?? "Validation error" },
          { status: 400 }
        );
      }
      console.error("[API] Error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
