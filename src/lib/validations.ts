import { z } from "zod"
import { MetodoPago, Nacionalidad, CanalMensaje } from "@prisma/client"

export const createHuespedSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  ci: z.string().min(5, "El CI debe tener al menos 5 caracteres"),
  correo: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
  nacionalidad: z.nativeEnum(Nacionalidad).optional(),
})

export const createReservaSchema = z
  .object({
    huespedId: z.string().uuid(),
    fechaIngreso: z.date(),
    fechaSalida: z.date(),
    habitaciones: z
      .array(
        z.object({
          habitacionId: z.string().uuid(),
          precio: z.number().positive(),
          desayunoExtras: z.boolean().default(false),
          parkingExtras: z.boolean().default(false),
          huespedes: z.array(z.string().uuid()).min(1),
        }),
      )
      .min(1),
  })
  .refine((data) => data.fechaSalida > data.fechaIngreso, {
    message: "La fecha de salida debe ser posterior a la fecha de ingreso",
    path: ["fechaSalida"],
  })

export const createHabitacionSchema = z.object({
  numero: z.number().int().positive(),
  tipoHabitacionId: z.string().uuid(),
  pisoId: z.string().uuid(),
  observaciones: z.string().optional(),
})

export const createPagoSchema = z.object({
  facturaId: z.string().uuid(),
  monto: z.number().positive(),
  metodo: z.nativeEnum(MetodoPago),
  observacion: z.string().optional(),
  numeroTransaccion: z.string().optional(),
})

export const createMensajeSchema = z
  .object({
    canal: z.nativeEnum(CanalMensaje),
    contenido: z.string().min(1),
    destinatarioUserId: z.string().uuid().optional(),
    destinatarioHuespedId: z.string().uuid().optional(),
  })
  .refine((data) => data.destinatarioUserId || data.destinatarioHuespedId, {
    message: "Debe especificar un destinatario",
  })

export const reporteOcupacionSchema = z
  .object({
    fechaInicio: z.date(),
    fechaFin: z.date(),
  })
  .refine((data) => data.fechaFin >= data.fechaInicio, {
    message: "La fecha fin debe ser posterior o igual a la fecha inicio",
    path: ["fechaFin"],
  })

export type CreateHuespedInput = z.infer<typeof createHuespedSchema>
export type CreateReservaInput = z.infer<typeof createReservaSchema>
export type CreateHabitacionInput = z.infer<typeof createHabitacionSchema>
export type CreatePagoInput = z.infer<typeof createPagoSchema>
export type CreateMensajeInput = z.infer<typeof createMensajeSchema>
