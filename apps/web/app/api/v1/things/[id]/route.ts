import { NextRequest, NextResponse } from "next/server";
import { updateThingSchema } from "@doing-the-thing/shared";
import { requireApiAuth } from "@/lib/auth-api";
import * as thingsService from "@/lib/services/things";
import { ZodError } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const session = await requireApiAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const thing = await thingsService.findThing(id, session.user.id);

  if (!thing) {
    return NextResponse.json({ error: "Thing not found" }, { status: 404 });
  }

  return NextResponse.json(thing);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await requireApiAuth(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const input = updateThingSchema.parse(body);
    const updated = await thingsService.patchThing(id, session.user.id, input);

    if (!updated) {
      return NextResponse.json({ error: "Thing not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    console.error("[API] Update thing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await requireApiAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await thingsService.deactivateThing(id, session.user.id);

  return new NextResponse(null, { status: 204 });
}
