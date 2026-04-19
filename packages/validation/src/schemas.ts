import {
  APPOINTMENT_STATUS_VALUES,
  USER_ROLE_VALUES,
  type Appointment,
  type CreatePatientWithUserInput as CreatePatientWithUserInputType,
  type MedicalRecord,
  type Patient,
  type PatientResponse as PatientResponseType,
  type Professional,
  type User,
} from "@clinica/types/index";
import { z } from "zod";

const isoDateTimeSchema = z.iso.datetime();
const entityIdSchema = z.string().trim().min(1);

export const userRoleSchema = z.enum(USER_ROLE_VALUES);
export const appointmentStatusSchema = z.enum(APPOINTMENT_STATUS_VALUES);

export const userSchema = z.object({
  id: entityIdSchema,
  name: z.string().trim().min(1),
  email: z.string().email(),
  passwordHash: z.string().trim().min(1),
  role: userRoleSchema,
  createdAt: isoDateTimeSchema,
}) satisfies z.ZodType<User>;

export const patientSchema = z.object({
  id: entityIdSchema,
  userId: entityIdSchema,
  birthDate: isoDateTimeSchema,
  document: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  createdAt: isoDateTimeSchema,
}) satisfies z.ZodType<Patient>;

export const professionalSchema = z.object({
  id: entityIdSchema,
  userId: entityIdSchema,
  specialty: z.string().trim().min(1),
  document: z.string().trim().min(1),
  createdAt: isoDateTimeSchema,
}) satisfies z.ZodType<Professional>;

export const appointmentSchema = z.object({
  id: entityIdSchema,
  patientId: entityIdSchema,
  professionalId: entityIdSchema,
  date: isoDateTimeSchema,
  status: appointmentStatusSchema,
  notes: z.string().trim().min(1).optional(),
  createdAt: isoDateTimeSchema,
}) satisfies z.ZodType<Appointment>;

export const medicalRecordSchema = z.object({
  id: entityIdSchema,
  appointmentId: entityIdSchema,
  description: z.string().trim().min(1),
  createdAt: isoDateTimeSchema,
}) satisfies z.ZodType<MedicalRecord>;

export const createUserInputSchema = userSchema.omit({
  id: true,
  createdAt: true,
});
export const createPatientInputSchema = patientSchema.omit({
  id: true,
  createdAt: true,
});
export const createProfessionalInputSchema = professionalSchema.omit({
  id: true,
  createdAt: true,
});
export const createAppointmentInputSchema = appointmentSchema.omit({
  id: true,
  createdAt: true,
});
export const createMedicalRecordInputSchema = medicalRecordSchema.omit({
  id: true,
  createdAt: true,
});

export const createPatientWithUserInputSchema = z
  .object({
    user: createUserInputSchema.omit({ role: true }).strict(),
    patient: createPatientInputSchema.omit({ userId: true }).strict(),
  })
  .strict() satisfies z.ZodType<CreatePatientWithUserInputType>;

export const patientResponseSchema = z
  .object({
    id: entityIdSchema,
    birthDate: isoDateTimeSchema,
    document: z.string().trim().min(1),
    phone: z.string().trim().min(1),
    createdAt: isoDateTimeSchema,
    user: z
      .object({
        id: entityIdSchema,
        name: z.string().trim().min(1),
        email: z.string().email(),
        role: userRoleSchema,
        createdAt: isoDateTimeSchema,
      })
      .strict(),
  })
  .strict() satisfies z.ZodType<PatientResponseType>;

export const patientListResponseSchema = z.array(patientResponseSchema);

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type CreatePatientInput = z.infer<typeof createPatientInputSchema>;
export type CreateProfessionalInput = z.infer<typeof createProfessionalInputSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentInputSchema>;
export type CreateMedicalRecordInput = z.infer<
  typeof createMedicalRecordInputSchema
>;
export type CreatePatientWithUserInput = z.infer<
  typeof createPatientWithUserInputSchema
>;
export type PatientResponse = z.infer<typeof patientResponseSchema>;
