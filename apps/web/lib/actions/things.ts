"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import { createThingSchema, updateThingSchema } from "@doing-the-thing/shared";
import * as thingsService from "@/lib/services/things";

export async function createThing(formData: FormData) {
  const session = await requireAuth();

  const input = createThingSchema.parse({
    label: formData.get("label"),
    snoozeMinutes: formData.get("snoozeMinutes")
      ? Number(formData.get("snoozeMinutes"))
      : undefined,
    deferralThreshold: formData.get("deferralThreshold")
      ? Number(formData.get("deferralThreshold"))
      : undefined,
  });

  await thingsService.insertThing(session.user.id, input);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function getThings() {
  const session = await requireAuth();
  return thingsService.findThingsForUser(session.user.id);
}

export async function getThing(id: string) {
  const session = await requireAuth();
  return thingsService.findThing(id, session.user.id) ?? null;
}

export async function updateThing(id: string, formData: FormData) {
  const session = await requireAuth();

  const rawInput: Record<string, unknown> = {};
  const label = formData.get("label");
  const snoozeMinutes = formData.get("snoozeMinutes");
  const deferralThreshold = formData.get("deferralThreshold");

  if (label) rawInput.label = label;
  if (snoozeMinutes) rawInput.snoozeMinutes = Number(snoozeMinutes);
  if (deferralThreshold) rawInput.deferralThreshold = Number(deferralThreshold);

  const input = updateThingSchema.parse(rawInput);

  await thingsService.patchThing(id, session.user.id, input);

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/things/${id}`);
}

export async function deactivateThing(id: string) {
  const session = await requireAuth();

  await thingsService.deactivateThing(id, session.user.id);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
