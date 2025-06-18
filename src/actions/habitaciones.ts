"use server"

import { prisma } from "@/lib/prisma"
import { HabitacionSchema } from "@/lib/types"
// import { prisma } from "@/src/lib/prisma"
// import type { HabitacionSchema } from "@/src/lib/types"
import { revalidatePath } from "next/cache"
import type { z } from "zod"

export async function getHabitaciones() {
  try {
    const habitaciones = await prisma.habitacion.findMany({
      where: { deletedAt: null },
      include: {
        tipoHabitacion: true,
        piso: true,
        hospedajes: {
          where: { estado: "ACTIVO" },
          include: {
            huesped: true,
          },
        },
      },
      orderBy: [{ piso: { numero: "asc" } }, { numero: "asc" }],
    })
    return habitaciones
  } catch (error) {
    console.error("Error fetching habitaciones:", error)
    return []
  }
}

export async function updateEstadoHabitacion(id: string, estado: z.infer<typeof HabitacionSchema>["estado"]) {
  try {
    const habitacion = await prisma.habitacion.update({
      where: { id },
      data: { estado },
    })

    await prisma.auditoria.create({
      data: {
        entidad: "Habitacion",
        entidadId: habitacion.id,
        accion: "UPDATE",
        descripcion: `Estado de habitación ${habitacion.numero} cambiado a ${estado}`,
      },
    })

    revalidatePath("/habitaciones")
    return { success: true, data: habitacion }
  } catch (error) {
    console.error("Error updating habitacion:", error)
    return { success: false, error: "Error al actualizar la habitación" }
  }
}

export async function getHabitacionesDisponibles(fechaIngreso: Date, fechaSalida: Date) {
  try {
    const habitacionesOcupadas = await prisma.detalleReservacion.findMany({
      where: {
        reservacion: {
          OR: [
            {
              fechaIngreso: { lte: fechaSalida },
              fechaSalida: { gte: fechaIngreso },
            },
          ],
          estado: { not: "CANCELADA" },
        },
      },
      select: { habitacionId: true },
    })

    const habitacionesOcupadasIds = habitacionesOcupadas.map((h) => h.habitacionId)

    const habitacionesDisponibles = await prisma.habitacion.findMany({
      where: {
        deletedAt: null,
        id: { notIn: habitacionesOcupadasIds },
        estado: { in: ["DISPONIBLE", "LIMPIEZA"] },
      },
      include: {
        tipoHabitacion: true,
        piso: true,
      },
      orderBy: [{ piso: { numero: "asc" } }, { numero: "asc" }],
    })

    return habitacionesDisponibles
  } catch (error) {
    console.error("Error fetching available habitaciones:", error)
    return []
  }
}

export async function getTiposHabitacion() {
  try {
    const tipos = await prisma.tipoHabitacion.findMany({
      where: { deletedAt: null },
      include: {
        habitaciones: {
          where: { deletedAt: null },
        },
      },
      orderBy: { nombre: "asc" },
    })
    return tipos
  } catch (error) {
    console.error("Error fetching tipos habitacion:", error)
    return []
  }
}

export async function getPisos() {
  try {
    const pisos = await prisma.piso.findMany({
      where: { deletedAt: null },
      orderBy: { numero: "asc" },
    })
    return pisos
  } catch (error) {
    console.error("Error fetching pisos:", error)
    return []
  }
}
