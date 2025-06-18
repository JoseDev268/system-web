"use server"

import { prisma } from "@/lib/prisma"
import { HuespedSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"
import type { z } from "zod"

export async function createHuesped(data: z.infer<typeof HuespedSchema>) {
  try {
    const validatedData = HuespedSchema.parse(data)

    const huesped = await prisma.huesped.create({
      data: {
        ...validatedData,
        correo: validatedData.correo || null,
      },
    })

    // Auditoría
    await prisma.auditoria.create({
      data: {
        entidad: "Huesped",
        entidadId: huesped.id,
        accion: "CREATE",
        descripcion: `Huésped creado: ${huesped.nombre}`,
      },
    })

    revalidatePath("/huespedes")
    return { success: true, data: huesped }
  } catch (error) {
    console.error("Error creating huesped:", error)
    return { success: false, error: "Error al crear el huésped" }
  }
}

export async function updateHuesped(id: string, data: z.infer<typeof HuespedSchema>) {
  try {
    const validatedData = HuespedSchema.parse(data)

    const huesped = await prisma.huesped.update({
      where: { id },
      data: {
        ...validatedData,
        correo: validatedData.correo || null,
      },
    })

    await prisma.auditoria.create({
      data: {
        entidad: "Huesped",
        entidadId: huesped.id,
        accion: "UPDATE",
        descripcion: `Huésped actualizado: ${huesped.nombre}`,
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
    const huesped = await prisma.huesped.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    await prisma.auditoria.create({
      data: {
        entidad: "Huesped",
        entidadId: huesped.id,
        accion: "DELETE",
        descripcion: `Huésped eliminado: ${huesped.nombre}`,
      },
    })

    revalidatePath("/huespedes")
    return { success: true }
  } catch (error) {
    console.error("Error deleting huesped:", error)
    return { success: false, error: "Error al eliminar el huésped" }
  }
}

export async function getHuespedes() {
  try {
    const huespedes = await prisma.huesped.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    })
    return huespedes
  } catch (error) {
    console.error("Error fetching huespedes:", error)
    return []
  }
}

export async function getHuespedById(id: string) {
  try {
    const huesped = await prisma.huesped.findUnique({
      where: { id },
      include: {
        reservas: {
          include: {
            detalleReservas: {
              include: {
                habitacion: {
                  include: {
                    tipoHabitacion: true,
                  },
                },
              },
            },
          },
        },
        hospedajes: {
          include: {
            habitacion: {
              include: {
                tipoHabitacion: true,
              },
            },
            factura: true,
          },
        },
      },
    })
    return huesped
  } catch (error) {
    console.error("Error fetching huesped:", error)
    return null
  }
}
