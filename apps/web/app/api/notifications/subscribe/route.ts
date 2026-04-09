import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { savePushSubscription } from "@/lib/actions/subscriptions";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await request.json();

  if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  await savePushSubscription(subscription);

  return NextResponse.json({ success: true });
}
