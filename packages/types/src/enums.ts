export const USER_ROLE_VALUES = ["ADMIN", "PROFESSIONAL", "PATIENT"] as const;
export type UserRole = (typeof USER_ROLE_VALUES)[number];

export const APPOINTMENT_STATUS_VALUES = [
  "SCHEDULED",
  "COMPLETED",
  "CANCELED",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUS_VALUES)[number];
