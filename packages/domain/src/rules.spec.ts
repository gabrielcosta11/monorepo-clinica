import { describe, expect, it } from "vitest";

import {
  canCreateMedicalRecord,
  hasRequiredAppointmentRelations,
  isValidIsoDateTime,
  isValidUserName,
} from "./rules";

describe("domain rules", () => {
  it("accepts valid user name", () => {
    expect(isValidUserName("Maria Silva")).toBe(true);
  });

  it("rejects empty user name", () => {
    expect(isValidUserName("   ")).toBe(false);
  });

  it("validates appointment relations", () => {
    expect(
      hasRequiredAppointmentRelations({
        patientId: "pat-1",
        professionalId: "pro-1",
      }),
    ).toBe(true);
    expect(
      hasRequiredAppointmentRelations({
        patientId: "pat-1",
        professionalId: "",
      }),
    ).toBe(false);
  });

  it("validates ISO date time", () => {
    expect(isValidIsoDateTime("2026-04-19T13:00:00.000Z")).toBe(true);
    expect(isValidIsoDateTime("19/04/2026 10:00")).toBe(false);
  });

  it("only allows medical record with linked appointment", () => {
    expect(canCreateMedicalRecord({ appointmentId: "apt-1" })).toBe(true);
    expect(canCreateMedicalRecord({ appointmentId: "" })).toBe(false);
  });
});
