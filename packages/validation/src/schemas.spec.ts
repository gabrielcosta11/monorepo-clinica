import { describe, expect, it } from "vitest";

import {
  appointmentSchema,
  createPatientInputSchema,
  createUserInputSchema,
  medicalRecordSchema,
} from "./schemas";

describe("validation schemas", () => {
  it("accepts valid create user input", () => {
    const parsed = createUserInputSchema.safeParse({
      name: "Ana Lima",
      email: "ana@example.com",
      passwordHash: "hash123",
      role: "PATIENT",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects empty create user name", () => {
    const parsed = createUserInputSchema.safeParse({
      name: "  ",
      email: "ana@example.com",
      passwordHash: "hash123",
      role: "PATIENT",
    });

    expect(parsed.success).toBe(false);
  });

  it("accepts valid patient input with ISO birthDate", () => {
    const parsed = createPatientInputSchema.safeParse({
      userId: "usr-1",
      birthDate: "1990-01-01T00:00:00.000Z",
      document: "12345678900",
      phone: "11999999999",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects appointment with invalid status", () => {
    const parsed = appointmentSchema.safeParse({
      id: "apt-1",
      patientId: "pat-1",
      professionalId: "pro-1",
      date: "2026-04-19T13:00:00.000Z",
      status: "UNKNOWN",
      createdAt: "2026-04-19T12:00:00.000Z",
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects medical record without appointment relation", () => {
    const parsed = medicalRecordSchema.safeParse({
      id: "mr-1",
      appointmentId: "",
      description: "Paciente com melhora clinica.",
      createdAt: "2026-04-19T12:00:00.000Z",
    });

    expect(parsed.success).toBe(false);
  });
});
