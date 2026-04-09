import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// ─── Auth.js Required Tables ───

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// ─── Application Tables ───

export const things = pgTable("things", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  snoozeMinutes: integer("snooze_minutes").notNull().default(15),
  deferralThreshold: integer("deferral_threshold").notNull().default(3),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const reminders = pgTable("reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  thingId: uuid("thing_id")
    .notNull()
    .references(() => things.id, { onDelete: "cascade" }),
  scheduleCron: text("schedule_cron").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const responses = pgTable("responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  thingId: uuid("thing_id")
    .notNull()
    .references(() => things.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  deferralCount: integer("deferral_count").notNull().default(0),
  checkinNotes: text("checkin_notes"),
  respondedAt: timestamp("responded_at", { mode: "date" }).defaultNow().notNull(),
});

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const apiTokens = pgTable("api_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const expoPushTokens = pgTable("expo_push_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Relations ───

export const usersRelations = relations(users, ({ many }) => ({
  things: many(things),
  pushSubscriptions: many(pushSubscriptions),
  apiTokens: many(apiTokens),
  expoPushTokens: many(expoPushTokens),
}));

export const thingsRelations = relations(things, ({ one, many }) => ({
  user: one(users, { fields: [things.userId], references: [users.id] }),
  reminders: many(reminders),
  responses: many(responses),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  thing: one(things, { fields: [reminders.thingId], references: [things.id] }),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  thing: one(things, { fields: [responses.thingId], references: [things.id] }),
}));

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  user: one(users, { fields: [pushSubscriptions.userId], references: [users.id] }),
}));

export const apiTokensRelations = relations(apiTokens, ({ one }) => ({
  user: one(users, { fields: [apiTokens.userId], references: [users.id] }),
}));

export const expoPushTokensRelations = relations(expoPushTokens, ({ one }) => ({
  user: one(users, { fields: [expoPushTokens.userId], references: [users.id] }),
}));
