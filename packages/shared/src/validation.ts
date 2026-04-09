import { z } from "zod";
import {
  DEFAULT_SNOOZE_MINUTES,
  DEFAULT_DEFERRAL_THRESHOLD,
  ResponseType,
  CheckinControl,
} from "./constants";

export const createThingSchema = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label must be 100 characters or less")
    .trim(),
  snoozeMinutes: z
    .number()
    .int()
    .positive("Snooze must be a positive number")
    .max(1440, "Snooze cannot exceed 24 hours")
    .default(DEFAULT_SNOOZE_MINUTES),
  deferralThreshold: z
    .number()
    .int()
    .min(1, "Threshold must be at least 1")
    .max(20, "Threshold cannot exceed 20")
    .default(DEFAULT_DEFERRAL_THRESHOLD),
});

export type CreateThingInput = z.infer<typeof createThingSchema>;

export const updateThingSchema = createThingSchema.partial();

export type UpdateThingInput = z.infer<typeof updateThingSchema>;

export const respondToNudgeSchema = z.object({
  thingId: z.string().uuid("Invalid thing ID"),
  action: z.enum([
    ResponseType.COMPLETED,
    ResponseType.IN_PROGRESS,
    ResponseType.DEFERRED,
  ]),
});

export type RespondToNudgeInput = z.infer<typeof respondToNudgeSchema>;

export const checkinNotesSchema = z.object({
  challenges: z
    .string()
    .min(1, "Please describe what's getting in the way")
    .max(1000)
    .trim(),
  withinControl: z.enum([
    CheckinControl.YES,
    CheckinControl.NO,
    CheckinControl.PARTIALLY,
  ]),
  canDoAnyway: z.boolean(),
  alternative: z
    .string()
    .max(500)
    .trim()
    .nullable()
    .default(null),
});

export type CheckinNotesInput = z.infer<typeof checkinNotesSchema>;

export const submitCheckinSchema = z.object({
  thingId: z.string().uuid("Invalid thing ID"),
  notes: checkinNotesSchema,
});

export type SubmitCheckinInput = z.infer<typeof submitCheckinSchema>;

export const createReminderSchema = z.object({
  thingId: z.string().uuid("Invalid thing ID"),
  scheduleCron: z
    .string()
    .min(9, "Invalid cron expression")
    .max(100, "Cron expression too long")
    .regex(
      /^(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)$/,
      "Invalid cron expression format"
    ),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
