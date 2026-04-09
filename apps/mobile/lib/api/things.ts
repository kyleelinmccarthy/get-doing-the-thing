import { apiFetch } from "./client";
import type { Thing } from "@doing-the-thing/shared";
import type { CreateThingInput, UpdateThingInput } from "@doing-the-thing/shared";

export function getThings(): Promise<Thing[]> {
  return apiFetch("/things");
}

export function getThing(id: string): Promise<Thing> {
  return apiFetch(`/things/${id}`);
}

export function createThing(input: CreateThingInput): Promise<Thing> {
  return apiFetch("/things", { method: "POST", body: input });
}

export function updateThing(
  id: string,
  input: UpdateThingInput
): Promise<Thing> {
  return apiFetch(`/things/${id}`, { method: "PATCH", body: input });
}

export function deleteThing(id: string): Promise<void> {
  return apiFetch(`/things/${id}`, { method: "DELETE" });
}
