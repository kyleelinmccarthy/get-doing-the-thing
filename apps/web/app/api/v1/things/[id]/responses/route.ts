import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth-api";
import * as responsesService from "@/lib/services/responses";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await requireApiAuth(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? 20);

    const history = await responsesService.findResponseHistory(
      id,
      session.user.id,
      limit
    );

    return NextResponse.json(history);
  } catch (error) {
    if (error instanceof Error && error.message === "Thing not found") {
      return NextResponse.json({ error: "Thing not found" }, { status: 404 });
    }
    console.error("[API] Response history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
