import { notFound } from "next/navigation";
import Link from "next/link";
import { getThing, deactivateThing } from "@/lib/actions/things";
import { getResponseHistory } from "@/lib/actions/responses";
import { getReminders } from "@/lib/actions/reminders";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponseHistory } from "@/components/features/response-history";
import { ReminderSettings } from "@/components/features/reminder-settings";

interface ThingDetailPageProps {
  params: { id: string };
}

export default async function ThingDetailPage({ params }: ThingDetailPageProps) {
  const thing = await getThing(params.id);

  if (!thing) {
    notFound();
  }

  const [history, thingReminders] = await Promise.all([
    getResponseHistory(thing.id),
    getReminders(thing.id),
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div>
            <h2
              className="text-xl font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {thing.label}
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              Snooze: {thing.snoozeMinutes}min · Check-in after {thing.deferralThreshold} deferrals
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <ReminderSettings thingId={thing.id} reminders={thingReminders} />
      </Card>

      <Card>
        <h3
          className="text-base font-medium mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          History
        </h3>
        <ResponseHistory responses={history} />
      </Card>

      <div className="flex justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-sm">
            Back
          </Button>
        </Link>
        <form
          action={async () => {
            "use server";
            await deactivateThing(thing.id);
          }}
        >
          <Button type="submit" variant="danger" className="text-sm">
            Remove thing
          </Button>
        </form>
      </div>
    </div>
  );
}
