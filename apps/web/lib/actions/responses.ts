"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-utils";
import {
  respondToNudgeSchema,
  submitCheckinSchema,
  type RespondToNudgeInput,
  type SubmitCheckinInput,
} from "@doing-the-thing/shared";
import * as responsesService from "@/lib/services/responses";

export type { NudgeResponse } from "@/lib/services/responses";

export async function respondToNudge(input: RespondToNudgeInput) {
  const session = await requireAuth();
  const validated = respondToNudgeSchema.parse(input);

  const result = await responsesService.respondToNudge(
    session.user.id,
    validated
  );

  revalidatePath("/dashboard");
  return result;
}

export async function submitCheckin(input: SubmitCheckinInput) {
  const session = await requireAuth();
  const validated = submitCheckinSchema.parse(input);

  const result = await responsesService.submitCheckin(
    session.user.id,
    validated
  );

  revalidatePath("/dashboard");
  return result;
}

export async function getResponseHistory(thingId: string, limit = 20) {
  const session = await requireAuth();
  return responsesService.findResponseHistory(thingId, session.user.id, limit);
}

export async function getRecentCompletions(limit = 30) {
  const session = await requireAuth();
  return responsesService.findRecentCompletions(session.user.id, limit);
}

export async function getCurrentDeferralCount(
  thingId: string
): Promise<number> {
  return responsesService.getDeferralCount(thingId);
}
