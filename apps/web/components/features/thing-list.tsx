import { NudgeCard } from "./nudge-card";
import { getCurrentDeferralCount } from "@/lib/actions/responses";

interface Thing {
  id: string;
  label: string;
  snoozeMinutes: number;
  deferralThreshold: number;
}

interface ThingListProps {
  things: Thing[];
  deferralCounts: Record<string, number>;
}

export function ThingList({ things, deferralCounts }: ThingListProps) {
  if (things.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {things.map((thing) => (
        <NudgeCard
          key={thing.id}
          thingId={thing.id}
          thingLabel={thing.label}
          currentDeferralCount={deferralCounts[thing.id] ?? 0}
          deferralThreshold={thing.deferralThreshold}
          snoozeMinutes={thing.snoozeMinutes}
        />
      ))}
    </div>
  );
}
