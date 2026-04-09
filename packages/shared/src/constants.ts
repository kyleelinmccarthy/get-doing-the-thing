export const DEFAULT_SNOOZE_MINUTES = 15;
export const DEFAULT_DEFERRAL_THRESHOLD = 3;
export const DEFAULT_THING_LABEL = "The Thing";

export const SNOOZE_PRESETS = [15, 30, 60, 120] as const;

export const ResponseType = {
  COMPLETED: "completed",
  IN_PROGRESS: "in_progress",
  DEFERRED: "deferred",
  CHECKIN_COMPLETED: "checkin_completed",
} as const;

export type ResponseTypeValue =
  (typeof ResponseType)[keyof typeof ResponseType];

export const NudgeAction = {
  DID_IT: "completed",
  DOING_IT: "in_progress",
  CANT_RIGHT_NOW: "deferred",
} as const;

export type NudgeActionValue =
  (typeof NudgeAction)[keyof typeof NudgeAction];

export const CheckinControl = {
  YES: "yes",
  NO: "no",
  PARTIALLY: "partially",
} as const;

export type CheckinControlValue =
  (typeof CheckinControl)[keyof typeof CheckinControl];
