import { NextRequest, NextResponse } from "next/server";
import { createThingSchema } from "@doing-the-thing/shared";
import { requireApiAuth } from "@/lib/auth-api";
import * as thingsService from "@/lib/services/things";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  const session = await requireApiAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const things = await thingsService.findThingsForUser(session.user.id);
  return NextResponse.json(things);
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const input = createThingSchema.parse(body);
    const thing = await thingsService.insertThing(session.user.id, input);

    return NextResponse.json(thing, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    console.error("[API] Create thing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
