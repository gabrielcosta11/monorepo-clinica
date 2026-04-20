import { describe, expect, it } from "vitest";

import {
  appointmentListResponseSchema,
  appointmentSchema,
  createPatientWithUserInputSchema,
  createProfessionalWithUserInputSchema,
  createPatientInputSchema,
  createUserInputSchema,
  medicalRecordSchema,
  patientResponseSchema,
  professionalResponseSchema,
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

  it("accepts create patient with user input", () => {
    const parsed = createPatientWithUserInputSchema.safeParse({
      user: {
        name: "Ana Lima",
        email: "ana@example.com",
        passwordHash: "hash123",
      },
      patient: {
        birthDate: "1990-01-01T00:00:00.000Z",
        document: "12345678900",
        phone: "11999999999",
      },
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects create patient with user input without user email", () => {
    const parsed = createPatientWithUserInputSchema.safeParse({
      user: {
        name: "Ana Lima",
        email: " ",
        passwordHash: "hash123",
      },
      patient: {
        birthDate: "1990-01-01T00:00:00.000Z",
        document: "12345678900",
        phone: "11999999999",
      },
    });

    expect(parsed.success).toBe(false);
  });

  it("accepts patient response schema", () => {
    const parsed = patientResponseSchema.safeParse({
      id: "pat-1",
      birthDate: "1990-01-01T00:00:00.000Z",
      document: "12345678900",
      phone: "11999999999",
      createdAt: "2026-04-19T12:00:00.000Z",
      user: {
        id: "usr-1",
        name: "Ana Lima",
        email: "ana@example.com",
        role: "PATIENT",
        createdAt: "2026-04-19T12:00:00.000Z",
      },
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects patient response schema with passwordHash leak", () => {
    const parsed = patientResponseSchema.safeParse({
      id: "pat-1",
      birthDate: "1990-01-01T00:00:00.000Z",
      document: "12345678900",
      phone: "11999999999",
      createdAt: "2026-04-19T12:00:00.000Z",
      user: {
        id: "usr-1",
        name: "Ana Lima",
        email: "ana@example.com",
        role: "PATIENT",
        createdAt: "2026-04-19T12:00:00.000Z",
        passwordHash: "hash123",
      },
    });

    expect(parsed.success).toBe(false);
  });

  it("accepts create professional with user input", () => {
    const parsed = createProfessionalWithUserInputSchema.safeParse({
      user: {
        name: "Dr. Carlos",
        email: "carlos@example.com",
        passwordHash: "hash123",
      },
      professional: {
        specialty: "Psiquiatria",
        document: "CRM12345",
      },
    });

    expect(parsed.success).toBe(true);
  });

  it("accepts professional response schema", () => {
    const parsed = professionalResponseSchema.safeParse({
      id: "pro-1",
      specialty: "Psiquiatria",
      document: "CRM12345",
      createdAt: "2026-04-19T12:00:00.000Z",
      user: {
        id: "usr-1",
        name: "Dr. Carlos",
        email: "carlos@example.com",
        role: "PROFESSIONAL",
        createdAt: "2026-04-19T12:00:00.000Z",
      },
    });

    expect(parsed.success).toBe(true);
  });

  it("accepts appointment list response schema", () => {
    const parsed = appointmentListResponseSchema.safeParse([
      {
        id: "apt-1",
        patientId: "pat-1",
        professionalId: "pro-1",
        date: "2026-04-19T13:00:00.000Z",
        status: "SCHEDULED",
        createdAt: "2026-04-19T12:00:00.000Z",
      },
    ]);

    expect(parsed.success).toBe(true);
  });
});
