const ISO_DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/;

export interface AppointmentRelationInput {
  patientId: string;
  professionalId: string;
}

export interface MedicalRecordRelationInput {
  appointmentId: string;
}

export function isValidUserName(name: string): boolean {
  return name.trim().length > 0;
}

export function hasRequiredAppointmentRelations(
  input: AppointmentRelationInput,
): boolean {
  return input.patientId.trim().length > 0 && input.professionalId.trim().length > 0;
}

export function isValidIsoDateTime(value: string): boolean {
  if (!ISO_DATE_TIME_REGEX.test(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}

export function canCreateMedicalRecord(
  input: MedicalRecordRelationInput,
): boolean {
  return input.appointmentId.trim().length > 0;
}
