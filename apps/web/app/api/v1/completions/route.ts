import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth-api";
import * as responsesService from "@/lib/services/responses";

export async function GET(req: NextRequest) {
  const session = await requireApiAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? 30);

  const completions = await responsesService.findRecentCompletions(
    session.user.id,
    limit
  );

  return NextResponse.json(completions);
}
