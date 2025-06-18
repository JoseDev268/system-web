"use server"

import { prisma } from "@/lib/prisma"
import { createReservaSchema, type CreateReservaInput } from "@/lib/validations"
import { EstadoReserva, EstadoHabitacion } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function createReserva(data: CreateReservaInput) {
  try {
    const validatedData = createReservaSchema.parse(data)

    // Verificar disponibilidad de habitaciones
    const habitacionesOcupadas = await prisma.habitacion.findMany({
      where: {
        id: { in: validatedData.habitaciones.map((h) => h.habitacionId) },
        OR: [{ estado: EstadoHabitacion.OCUPADA }, { estado: EstadoHabitacion.RESERVADA }],
      },
    })

    if (habitacionesOcupadas.length > 0) {
      return {
        success: false,
        error: `Las habitaciones ${habitacionesOcupadas.map((h) => h.numero).join(", ")} no están disponibles`,
      }
    }

    const reserva = await prisma.$transaction(async (tx) => {
      // Crear la reserva
      const nuevaReserva = await tx.reserva.create({
        data: {
          huespedId: validatedData.huespedId,
          estado: EstadoReserva.PENDIENTE,
          fechaIngreso: validatedData.fechaIngreso,
          fechaSalida: validatedData.fechaSalida,
        },
      })

      // Crear los detalles de reservación
      for (const habitacion of validatedData.habitaciones) {
        const detalleReservacion = await tx.detalleReservacion.create({
          data: {
            reservacionId: nuevaReserva.id,
            habitacionId: habitacion.habitacionId,
            precio: habitacion.precio,
            desayunoExtras: habitacion.desayunoExtras,
            parkingExtras: habitacion.parkingExtras,
          },
        })

        // Asociar huéspedes al detalle
        for (const huespedId of habitacion.huespedes) {
          await tx.detalleReservacionHuesped.create({
            data: {
              detalleReservacionId: detalleReservacion.id,
              huespedId: huespedId,
            },
          })
        }

        // Actualizar estado de habitación
        await tx.habitacion.update({
          where: { id: habitacion.habitacionId },
          data: { estado: EstadoHabitacion.RESERVADA },
        })
      }

      return nuevaReserva
    })

    revalidatePath("/reservas")
    revalidatePath("/habitaciones")
    return { success: true, data: reserva }
  } catch (error) {
    console.error("Error creating reserva:", error)
    return { success: false, error: "Error al crear la reserva" }
  }
}

export async function getReservas() {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { deletedAt: null },
      include: {
        huesped: true,
        detalleReservas: {
          include: {
            habitacion: {
              include: {
                tipoHabitacion: true,
                piso: true,
              },
            },
            huespedes: {
              include: {
                huesped: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: reservas }
  } catch (error) {
    console.error("Error fetching reservas:", error)
    return { success: false, error: "Error al obtener las reservas" }
  }
}

export async function confirmarReserva(id: string) {
  try {
    const reserva = await prisma.reserva.update({
      where: { id },
      data: { estado: EstadoReserva.CONFIRMADA },
    })

    revalidatePath("/reservas")
    return { success: true, data: reserva }
  } catch (error) {
    console.error("Error confirming reserva:", error)
    return { success: false, error: "Error al confirmar la reserva" }
  }
}

export async function cancelarReserva(id: string) {
  try {
    const reserva = await prisma.$transaction(async (tx) => {
      // Actualizar estado de la reserva
      const updatedReserva = await tx.reserva.update({
        where: { id },
        data: { estado: EstadoReserva.CANCELADA },
      })

      // Liberar habitaciones
      const detalleReservas = await tx.detalleReservacion.findMany({
        where: { reservacionId: id },
      })

      for (const detalle of detalleReservas) {
        await tx.habitacion.update({
          where: { id: detalle.habitacionId },
          data: { estado: EstadoHabitacion.DISPONIBLE },
        })
      }

      return updatedReserva
    })

    revalidatePath("/reservas")
    revalidatePath("/habitaciones")
    return { success: true, data: reserva }
  } catch (error) {
    console.error("Error canceling reserva:", error)
    return { success: false, error: "Error al cancelar la reserva" }
  }
}