"use server"

import { prisma } from "@/lib/prisma"
import { createHuespedSchema, type CreateHuespedInput } from "@/lib/validations"
import { revalidatePath } from "next/cache"

export async function createHuesped(data: CreateHuespedInput) {
  try {
    const validatedData = createHuespedSchema.parse(data)

    const existingHuesped = await prisma.huesped.findUnique({
      where: { ci: validatedData.ci },
    })

    if (existingHuesped) {
      return { success: false, error: "Ya existe un huésped con este CI" }
    }

    const huesped = await prisma.huesped.create({
      data: {
        ...validatedData,
        correo: validatedData.correo || null,
      },
    })

    revalidatePath("/huespedes")
    return { success: true, data: huesped }
  } catch (error) {
    console.error("Error creating huesped:", error)
    return { success: false, error: "Error al crear el huésped" }
  }
}

export async function getHuespedes() {
  try {
    const huespedes = await prisma.huesped.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        reservas: {
          where: { deletedAt: null },
          include: {
            detalleReservas: {
              include: {
                habitacion: true,
              },
            },
          },
        },
        hospedajes: {
          where: { deletedAt: null },
          include: {
            habitacion: true,
          },
        },
      },
    })

    return { success: true, data: huespedes }
  } catch (error) {
    console.error("Error fetching huespedes:", error)
    return { success: false, error: "Error al obtener los huéspedes" }
  }
}

export async function updateHuesped(id: string, data: CreateHuespedInput) {
  try {
    const validatedData = createHuespedSchema.parse(data)

    const huesped = await prisma.huesped.update({
      where: { id },
      data: {
        ...validatedData,
        correo: validatedData.correo || null,
      },
    })

    revalidatePath("/huespedes")
    return { success: true, data: huesped }
  } catch (error) {
    console.error("Error updating huesped:", error)
    return { success: false, error: "Error al actualizar el huésped" }
  }
}

export async function deleteHuesped(id: string) {
  try {
    await prisma.huesped.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    revalidatePath("/huespedes")
    return { success: true }
  } catch (error) {
    console.error("Error deleting huesped:", error)
    return { success: false, error: "Error al eliminar el huésped" }
  }
}
