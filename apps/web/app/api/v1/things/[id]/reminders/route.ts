import { NextRequest, NextResponse } from "next/server";
import { createReminderSchema } from "@doing-the-thing/shared";
import { requireApiAuth } from "@/lib/auth-api";
import * as remindersService from "@/lib/services/reminders";
import { ZodError } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await requireApiAuth(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const reminderList = await remindersService.findReminders(
      id,
      session.user.id
    );

    return NextResponse.json(reminderList);
  } catch (error) {
    if (error instanceof Error && error.message === "Thing not found") {
      return NextResponse.json({ error: "Thing not found" }, { status: 404 });
    }
    console.error("[API] Get reminders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireApiAuth(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const input = createReminderSchema.parse({ ...body, thingId: id });
    const reminder = await remindersService.insertReminder(
      session.user.id,
      input
    );

    return NextResponse.json(reminder, { status: 201 });
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
    console.error("[API] Create reminder error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
