import { NextRequest, NextResponse } from "next/server";
import { submitCheckinSchema } from "@doing-the-thing/shared";
import { requireApiAuth } from "@/lib/auth-api";
import * as responsesService from "@/lib/services/responses";
import { ZodError } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireApiAuth(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const input = submitCheckinSchema.parse({ ...body, thingId: id });
    const result = await responsesService.submitCheckin(
      session.user.id,
      input
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === "Thing not found") {
      return NextResponse.json({ error: "Thing not found" }, { status: 404 });
    }
    console.error("[API] Checkin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
