import Link from "next/link";
import { getThings } from "@/lib/actions/things";
import { getCurrentDeferralCount } from "@/lib/actions/responses";
import { ThingList } from "@/components/features/thing-list";
import { NotificationPrompt } from "@/components/features/notification-prompt";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const things = await getThings();

  if (things.length === 0) {
    return (
      <Card className="text-center">
        <p
          className="text-lg font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          No things yet.
        </p>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Add something you want to follow through on.
        </p>
        <Link href="/dashboard/things/new" className="mt-6 block">
          <Button variant="neutral" fullWidth>
            Add a thing
          </Button>
        </Link>
      </Card>
    );
  }

  const deferralCounts: Record<string, number> = {};
  for (const thing of things) {
    deferralCounts[thing.id] = await getCurrentDeferralCount(thing.id);
  }

  return (
    <div className="space-y-6">
      <NotificationPrompt />
      <ThingList things={things} deferralCounts={deferralCounts} />
      <div className="text-center">
        <Link href="/dashboard/things/new">
          <Button variant="ghost" className="text-sm">
            Add another thing
          </Button>
        </Link>
      </div>
    </div>
  );
}
