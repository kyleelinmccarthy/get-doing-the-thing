import Link from "next/link";
import { getThings } from "@/lib/actions/things";
import { getCurrentDeferralCount, getRecentCompletions } from "@/lib/actions/responses";
import { ThingList } from "@/components/features/thing-list";
import { DoneThings } from "@/components/features/done-things";
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
            + Add a thing
          </Button>
        </Link>
      </Card>
    );
  }

  const deferralCounts: Record<string, number> = {};
  for (const thing of things) {
    deferralCounts[thing.id] = await getCurrentDeferralCount(thing.id);
  }

  const completions = await getRecentCompletions();

  return (
    <div className="space-y-6">
      <NotificationPrompt />
      <div className="max-w-lg mx-auto">
        <Link href="/dashboard/things/new" className="block">
          <Button variant="neutral" fullWidth>
            + Add a thing
          </Button>
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 max-w-lg mx-auto lg:mx-0 space-y-4">
          <ThingList things={things} deferralCounts={deferralCounts} />
        </div>
        <div className="w-full lg:w-72 lg:shrink-0">
          <DoneThings entries={completions} />
        </div>
      </div>
    </div>
  );
}
