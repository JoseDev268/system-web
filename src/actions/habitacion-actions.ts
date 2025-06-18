"use server"

import { prisma } from "@/lib/prisma"
import { createHabitacionSchema, type CreateHabitacionInput } from "@/lib/validations"
import { EstadoHabitacion } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getHabitaciones() {
  try {
    const habitaciones = await prisma.habitacion.findMany({
      where: { deletedAt: null },
      include: {
        tipoHabitacion: true,
        piso: true,
        hospedajes: {
          where: {
            estado: "ACTIVO",
            deletedAt: null,
          },
          include: {
            huesped: true,
          },
        },
      },
      orderBy: [{ piso: { numero: "asc" } }, { numero: "asc" }],
    })

    return { success: true, data: habitaciones }
  } catch (error) {
    console.error("Error fetching habitaciones:", error)
    return { success: false, error: "Error al obtener las habitaciones" }
  }
}

export async function updateEstadoHabitacion(id: string, estado: EstadoHabitacion) {
  try {
    const habitacion = await prisma.habitacion.update({
      where: { id },
      data: { estado },
    })

    revalidatePath("/habitaciones")
    return { success: true, data: habitacion }
  } catch (error) {
    console.error("Error updating habitacion estado:", error)
    return { success: false, error: "Error al actualizar el estado de la habitación" }
  }
}

export async function createHabitacion(data: CreateHabitacionInput) {
  try {
    const validatedData = createHabitacionSchema.parse(data)

    const existingHabitacion = await prisma.habitacion.findUnique({
      where: { numero: validatedData.numero },
    })

    if (existingHabitacion) {
      return { success: false, error: "Ya existe una habitación con este número" }
    }

    const habitacion = await prisma.habitacion.create({
      data: {
        ...validatedData,
        estado: EstadoHabitacion.DISPONIBLE,
      },
      include: {
        tipoHabitacion: true,
        piso: true,
      },
    })

    revalidatePath("/habitaciones")
    return { success: true, data: habitacion }
  } catch (error) {
    console.error("Error creating habitacion:", error)
    return { success: false, error: "Error al crear la habitación" }
  }
}

export async function getTiposHabitacion() {
  try {
    const tipos = await prisma.tipoHabitacion.findMany({
      where: { deletedAt: null },
      orderBy: { nombre: "asc" },
    })

    return { success: true, data: tipos }
  } catch (error) {
    console.error("Error fetching tipos habitacion:", error)
    return { success: false, error: "Error al obtener los tipos de habitación" }
  }
}

export async function getPisos() {
  try {
    const pisos = await prisma.piso.findMany({
      where: { deletedAt: null },
      orderBy: { numero: "asc" },
    })

    return { success: true, data: pisos }
  } catch (error) {
    console.error("Error fetching pisos:", error)
    return { success: false, error: "Error al obtener los pisos" }
  }
}
