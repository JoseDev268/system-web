import { z } from "zod"

// Enums de Zod basados en el esquema Prisma
export const EstadoReservaSchema = z.enum(["PENDIENTE", "CONFIRMADA", "CANCELADA"])
export const EstadoHospedajeSchema = z.enum(["ACTIVO", "FINALIZADO", "CANCELADO"])
export const EstadoFacturaSchema = z.enum(["EMITIDA", "ANULADA"])
export const MetodoPagoSchema = z.enum(["EFECTIVO", "TARJETA", "QR", "TRANSFERENCIA", "OTRO"])
export const EstadoHabitacionSchema = z.enum(["DISPONIBLE", "OCUPADA", "LIMPIEZA", "RESERVADA"])
export const RolUserSchema = z.enum(["ADMIN", "RECEPCIONISTA", "GERENTE", "USER"])
export const EstadoMensajeSchema = z.enum(["PENDIENTE", "ENVIADO", "LEIDO", "ERROR"])
export const CanalMensajeSchema = z.enum(["EMAIL", "SMS", "PUSH", "WHATSAPP", "FACEBOOK_MESSENGER", "INTERNO"])
export const NacionalidadSchema = z.enum([
  "BOLIVIA",
  "ARGENTINA",
  "CHILE",
  "PERU",
  "BRASIL",
  "PARAGUAY",
  "URUGUAY",
  "COLOMBIA",
  "VENEZUELA",
  "ECUADOR",
  "MEXICO",
  "ESTADOUNIDENSE",
])

// Schemas de validación para formularios
export const HuespedSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  ci: z.string().min(5, "El CI debe tener al menos 5 caracteres"),
  correo: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
  nacionalidad: NacionalidadSchema.optional(),
})

export const ReservaSchema = z.object({
  huespedId: z.string().uuid(),
  fechaIngreso: z.date(),
  fechaSalida: z.date(),
  habitacionIds: z.array(z.string().uuid()).min(1, "Debe seleccionar al menos una habitación"),
  desayunoExtras: z.boolean().default(false),
  parkingExtras: z.boolean().default(false),
})

export const HabitacionSchema = z.object({
  numero: z.number().min(1, "El número debe ser mayor a 0"),
  tipoHabitacionId: z.string().uuid(),
  pisoId: z.string().uuid(),
  estado: EstadoHabitacionSchema,
})

export const ProductoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
  precio: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  stock: z.number().min(0, "El stock debe ser mayor o igual a 0"),
  tipoHabitacionId: z.string().uuid().optional(),
})

export const ConsumoExtraSchema = z.object({
  fichaHospedajeId: z.string().uuid().optional(),
  productoId: z.string().uuid(),
  huespedId: z.string().uuid().optional(),
  cantidad: z.number().min(1, "La cantidad debe ser mayor a 0"),
  observacion: z.string().optional(),
})

export const MensajeSchema = z.object({
  canal: CanalMensajeSchema,
  contenido: z.string().min(1, "El contenido no puede estar vacío"),
  destinatarioUserId: z.string().uuid().optional(),
  destinatarioHuespedId: z.string().uuid().optional(),
})

export const PagoSchema = z.object({
  facturaId: z.string().uuid(),
  monto: z.number().min(0.01, "El monto debe ser mayor a 0"),
  metodo: MetodoPagoSchema,
  observacion: z.string().optional(),
  numeroTransaccion: z.string().optional(),
})

export interface ReporteOcupacion {
  fecha: Date
  totalHabitaciones: number
  habitacionesOcupadas: number
  porcentajeOcupacion: number
  ingresosTotales: number
}

export interface ReporteIngresos {
  periodo: string
  ingresosPorHospedaje: number
  ingresosPorExtras: number
  totalIngresos: number
  totalFacturas: number
}

export interface ReporteEgresos {
  periodo: string
  gastosOperativos: number
  gastosMantenimiento: number
  totalEgresos: number
}
export type EstadoReserva = z.infer<typeof EstadoReservaSchema>
export type EstadoHospedaje = z.infer<typeof EstadoHospedajeSchema>
export type EstadoFactura = z.infer<typeof EstadoFacturaSchema>
export type MetodoPago = z.infer<typeof MetodoPagoSchema>
export type EstadoHabitacion = z.infer<typeof EstadoHabitacionSchema>
export type RolUser = z.infer<typeof RolUserSchema>
export type EstadoMensaje = z.infer<typeof EstadoMensajeSchema>
export type CanalMensaje = z.infer<typeof CanalMensajeSchema>
export type Nacionalidad = z.infer<typeof NacionalidadSchema>
