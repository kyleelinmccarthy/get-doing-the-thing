import { apiFetch } from "./client";
import type { Response, CheckinNotes } from "@doing-the-thing/shared";
import type { NudgeActionValue } from "@doing-the-thing/shared";

interface NudgeResponse {
  success: boolean;
  requiresCheckin?: boolean;
  deferralCount?: number;
}

export function respondToNudge(
  thingId: string,
  action: NudgeActionValue
): Promise<NudgeResponse> {
  return apiFetch(`/things/${thingId}/respond`, {
    method: "POST",
    body: { action },
  });
}

export function submitCheckin(
  thingId: string,
  notes: CheckinNotes
): Promise<{ success: boolean }> {
  return apiFetch(`/things/${thingId}/checkin`, {
    method: "POST",
    body: { notes },
  });
}

export function getResponseHistory(
  thingId: string,
  limit = 20
): Promise<Response[]> {
  return apiFetch(`/things/${thingId}/responses?limit=${limit}`);
}

export function getDeferralCount(
  thingId: string
): Promise<{ count: number }> {
  return apiFetch(`/things/${thingId}/deferral-count`);
}

interface Completion {
  id: string;
  thingLabel: string;
  type: string;
  respondedAt: string;
}

export function getRecentCompletions(limit = 30): Promise<Completion[]> {
  return apiFetch(`/completions?limit=${limit}`);
}
