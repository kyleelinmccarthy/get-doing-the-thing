import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth-api";
import * as remindersService from "@/lib/services/reminders";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await requireApiAuth(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await remindersService.removeReminder(id, session.user.id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Reminder not found") {
      return NextResponse.json(
        { error: "Reminder not found" },
        { status: 404 }
      );
    }
    console.error("[API] Delete reminder error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
