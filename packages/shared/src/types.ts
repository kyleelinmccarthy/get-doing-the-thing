import type { ResponseTypeValue, CheckinControlValue } from "./constants";

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Thing {
  id: string;
  userId: string;
  label: string;
  snoozeMinutes: number;
  deferralThreshold: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  thingId: string;
  scheduleCron: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Response {
  id: string;
  thingId: string;
  type: ResponseTypeValue;
  deferralCount: number;
  checkinNotes: CheckinNotes | null;
  respondedAt: Date;
}

export interface CheckinNotes {
  challenges: string;
  withinControl: CheckinControlValue;
  canDoAnyway: boolean;
  alternative: string | null;
}

export interface PushSubscriptionRecord {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: Date;
}

export interface NudgeState {
  thingId: string;
  thingLabel: string;
  currentDeferralCount: number;
  deferralThreshold: number;
  snoozeMinutes: number;
}
