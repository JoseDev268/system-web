"use server"

import { prisma } from "@/lib/prisma"
import { EstadoHospedaje, EstadoHabitacion, EstadoReserva } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function realizarCheckin(reservaId: string) {
  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id: reservaId },
      include: {
        huesped: true,
        detalleReservas: {
          include: {
            habitacion: true,
            huespedes: {
              include: {
                huesped: true,
              },
            },
          },
        },
      },
    })

    if (!reserva) {
      return { success: false, error: "Reserva no encontrada" }
    }

    if (reserva.estado !== EstadoReserva.CONFIRMADA) {
      return { success: false, error: "La reserva debe estar confirmada para hacer check-in" }
    }

    const fichasHospedaje = await prisma.$transaction(async (tx) => {
      const fichas = []

      for (const detalle of reserva.detalleReservas) {
        // Crear ficha de hospedaje para el huésped principal
        const fichaHospedaje = await tx.fichaHospedaje.create({
          data: {
            huespedId: reserva.huespedId,
            habitacionId: detalle.habitacionId,
            fechaIngreso: reserva.fechaIngreso,
            fechaSalida: reserva.fechaSalida,
            estado: EstadoHospedaje.ACTIVO,
          },
        })

        // Actualizar estado de habitación
        await tx.habitacion.update({
          where: { id: detalle.habitacionId },
          data: { estado: EstadoHabitacion.OCUPADA },
        })

        fichas.push(fichaHospedaje)
      }

      return fichas
    })

    revalidatePath("/checkin")
    revalidatePath("/habitaciones")
    return { success: true, data: fichasHospedaje }
  } catch (error) {
    console.error("Error during checkin:", error)
    return { success: false, error: "Error al realizar el check-in" }
  }
}

export async function realizarCheckout(fichaHospedajeId: string) {
  try {
    const fichaHospedaje = await prisma.fichaHospedaje.findUnique({
      where: { id: fichaHospedajeId },
      include: {
        habitacion: true,
        huesped: true,
      },
    })

    if (!fichaHospedaje) {
      return { success: false, error: "Ficha de hospedaje no encontrada" }
    }

    const updatedFicha = await prisma.$transaction(async (tx) => {
      // Actualizar ficha de hospedaje
      const ficha = await tx.fichaHospedaje.update({
        where: { id: fichaHospedajeId },
        data: {
          estado: EstadoHospedaje.FINALIZADO,
          fechaSalida: new Date(),
        },
      })

      // Actualizar estado de habitación
      await tx.habitacion.update({
        where: { id: fichaHospedaje.habitacionId },
        data: { estado: EstadoHabitacion.LIMPIEZA },
      })

      return ficha
    })

    revalidatePath("/checkin")
    revalidatePath("/habitaciones")
    return { success: true, data: updatedFicha }
  } catch (error) {
    console.error("Error during checkout:", error)
    return { success: false, error: "Error al realizar el check-out" }
  }
}

export async function getHospedajesActivos() {
  try {
    const hospedajes = await prisma.fichaHospedaje.findMany({
      where: {
        estado: EstadoHospedaje.ACTIVO,
        deletedAt: null,
      },
      include: {
        huesped: true,
        habitacion: {
          include: {
            tipoHabitacion: true,
            piso: true,
          },
        },
      },
      orderBy: { fechaIngreso: "desc" },
    })

    return { success: true, data: hospedajes }
  } catch (error) {
    console.error("Error fetching hospedajes activos:", error)
    return { success: false, error: "Error al obtener los hospedajes activos" }
  }
}

export async function getReservasParaCheckin() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const reservas = await prisma.reserva.findMany({
      where: {
        estado: EstadoReserva.CONFIRMADA,
        fechaIngreso: {
          lte: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Hasta mañana
        },
        deletedAt: null,
      },
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
          },
        },
      },
      orderBy: { fechaIngreso: "asc" },
    })

    return { success: true, data: reservas }
  } catch (error) {
    console.error("Error fetching reservas para checkin:", error)
    return { success: false, error: "Error al obtener las reservas para check-in" }
  }
}
