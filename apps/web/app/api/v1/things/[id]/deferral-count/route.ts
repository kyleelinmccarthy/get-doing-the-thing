import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth-api";
import * as responsesService from "@/lib/services/responses";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const session = await requireApiAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  await responsesService.verifyThingOwnership(id, session.user.id);

  const count = await responsesService.getDeferralCount(id);
  return NextResponse.json({ count });
}
