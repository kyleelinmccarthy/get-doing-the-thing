import { ResponseType } from "@doing-the-thing/shared";

interface Response {
  id: string;
  type: string;
  deferralCount: number;
  respondedAt: Date;
}

interface ResponseHistoryProps {
  responses: Response[];
}

const typeLabels: Record<string, string> = {
  [ResponseType.COMPLETED]: "Did the thing",
  [ResponseType.IN_PROGRESS]: "Doing the thing",
  [ResponseType.DEFERRED]: "Deferred",
  [ResponseType.CHECKIN_COMPLETED]: "Checked in",
};

const typeDots: Record<string, string> = {
  [ResponseType.COMPLETED]: "bg-[var(--success)]",
  [ResponseType.IN_PROGRESS]: "bg-[var(--accent)]",
  [ResponseType.DEFERRED]: "bg-[var(--muted)]",
  [ResponseType.CHECKIN_COMPLETED]: "bg-[var(--accent)]",
};

export function ResponseHistory({ responses }: ResponseHistoryProps) {
  if (responses.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        No history yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {responses.map((response) => (
        <div
          key={response.id}
          className="flex items-center gap-3 py-2"
        >
          <div
            className={`h-2 w-2 rounded-full ${typeDots[response.type] ?? "bg-gray-400"}`}
          />
          <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>
            {typeLabels[response.type] ?? response.type}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {new Date(response.respondedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      ))}
    </div>
  );
}
