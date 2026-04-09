import {
  createThingSchema,
  updateThingSchema,
  respondToNudgeSchema,
  checkinNotesSchema,
  submitCheckinSchema,
  createReminderSchema,
} from "../validation";

describe("createThingSchema", () => {
  it("accepts valid input with defaults", () => {
    const result = createThingSchema.parse({ label: "Exercise" });
    expect(result).toEqual({
      label: "Exercise",
      snoozeMinutes: 15,
      deferralThreshold: 3,
    });
  });

  it("accepts valid input with custom values", () => {
    const result = createThingSchema.parse({
      label: "Meditate",
      snoozeMinutes: 30,
      deferralThreshold: 5,
    });
    expect(result.snoozeMinutes).toBe(30);
    expect(result.deferralThreshold).toBe(5);
  });

  it("trims whitespace from label", () => {
    const result = createThingSchema.parse({ label: "  Exercise  " });
    expect(result.label).toBe("Exercise");
  });

  it("rejects empty label", () => {
    expect(() => createThingSchema.parse({ label: "" })).toThrow(
      "Label is required"
    );
  });

  it("rejects label over 100 characters", () => {
    expect(() =>
      createThingSchema.parse({ label: "a".repeat(101) })
    ).toThrow("Label must be 100 characters or less");
  });

  it("rejects negative snooze minutes", () => {
    expect(() =>
      createThingSchema.parse({ label: "Test", snoozeMinutes: -5 })
    ).toThrow("Snooze must be a positive number");
  });

  it("rejects snooze over 24 hours", () => {
    expect(() =>
      createThingSchema.parse({ label: "Test", snoozeMinutes: 1441 })
    ).toThrow("Snooze cannot exceed 24 hours");
  });

  it("rejects non-integer snooze", () => {
    expect(() =>
      createThingSchema.parse({ label: "Test", snoozeMinutes: 15.5 })
    ).toThrow();
  });

  it("rejects deferral threshold of 0", () => {
    expect(() =>
      createThingSchema.parse({ label: "Test", deferralThreshold: 0 })
    ).toThrow("Threshold must be at least 1");
  });

  it("rejects deferral threshold over 20", () => {
    expect(() =>
      createThingSchema.parse({ label: "Test", deferralThreshold: 21 })
    ).toThrow("Threshold cannot exceed 20");
  });
});

describe("updateThingSchema", () => {
  it("accepts partial updates", () => {
    const result = updateThingSchema.parse({ label: "New Label" });
    expect(result).toEqual({ label: "New Label" });
  });

  it("accepts empty object", () => {
    const result = updateThingSchema.parse({});
    expect(result).toEqual({});
  });
});

describe("respondToNudgeSchema", () => {
  it("accepts valid completed response", () => {
    const result = respondToNudgeSchema.parse({
      thingId: "550e8400-e29b-41d4-a716-446655440000",
      action: "completed",
    });
    expect(result.action).toBe("completed");
  });

  it("accepts valid in_progress response", () => {
    const result = respondToNudgeSchema.parse({
      thingId: "550e8400-e29b-41d4-a716-446655440000",
      action: "in_progress",
    });
    expect(result.action).toBe("in_progress");
  });

  it("accepts valid deferred response", () => {
    const result = respondToNudgeSchema.parse({
      thingId: "550e8400-e29b-41d4-a716-446655440000",
      action: "deferred",
    });
    expect(result.action).toBe("deferred");
  });

  it("rejects invalid action", () => {
    expect(() =>
      respondToNudgeSchema.parse({
        thingId: "550e8400-e29b-41d4-a716-446655440000",
        action: "invalid",
      })
    ).toThrow();
  });

  it("rejects invalid UUID", () => {
    expect(() =>
      respondToNudgeSchema.parse({
        thingId: "not-a-uuid",
        action: "completed",
      })
    ).toThrow("Invalid thing ID");
  });
});

describe("checkinNotesSchema", () => {
  it("accepts valid checkin notes", () => {
    const result = checkinNotesSchema.parse({
      challenges: "Too tired after work",
      withinControl: "partially",
      canDoAnyway: false,
      alternative: "Take a short walk instead",
    });
    expect(result.challenges).toBe("Too tired after work");
    expect(result.alternative).toBe("Take a short walk instead");
  });

  it("allows null alternative", () => {
    const result = checkinNotesSchema.parse({
      challenges: "No time",
      withinControl: "yes",
      canDoAnyway: true,
      alternative: null,
    });
    expect(result.alternative).toBeNull();
  });

  it("defaults alternative to null", () => {
    const result = checkinNotesSchema.parse({
      challenges: "No time",
      withinControl: "yes",
      canDoAnyway: true,
    });
    expect(result.alternative).toBeNull();
  });

  it("rejects empty challenges", () => {
    expect(() =>
      checkinNotesSchema.parse({
        challenges: "",
        withinControl: "yes",
        canDoAnyway: true,
      })
    ).toThrow("Please describe what's getting in the way");
  });

  it("rejects invalid withinControl value", () => {
    expect(() =>
      checkinNotesSchema.parse({
        challenges: "Something",
        withinControl: "maybe",
        canDoAnyway: true,
      })
    ).toThrow();
  });
});

describe("submitCheckinSchema", () => {
  it("accepts valid submission", () => {
    const result = submitCheckinSchema.parse({
      thingId: "550e8400-e29b-41d4-a716-446655440000",
      notes: {
        challenges: "Felt overwhelmed",
        withinControl: "partially",
        canDoAnyway: false,
        alternative: "Do half the task",
      },
    });
    expect(result.thingId).toBe("550e8400-e29b-41d4-a716-446655440000");
    expect(result.notes.challenges).toBe("Felt overwhelmed");
  });
});

describe("createReminderSchema", () => {
  it("accepts valid cron expression", () => {
    const result = createReminderSchema.parse({
      thingId: "550e8400-e29b-41d4-a716-446655440000",
      scheduleCron: "0 9 * * 1-5",
    });
    expect(result.scheduleCron).toBe("0 9 * * 1-5");
  });

  it("accepts every-minute cron", () => {
    const result = createReminderSchema.parse({
      thingId: "550e8400-e29b-41d4-a716-446655440000",
      scheduleCron: "* * * * *",
    });
    expect(result.scheduleCron).toBe("* * * * *");
  });

  it("rejects invalid cron expression", () => {
    expect(() =>
      createReminderSchema.parse({
        thingId: "550e8400-e29b-41d4-a716-446655440000",
        scheduleCron: "not a cron",
      })
    ).toThrow("Invalid cron expression format");
  });
});
