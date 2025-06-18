"use server"

import { prisma } from "@/lib/prisma"
import { EstadoHabitacion } from "@prisma/client"

export async function buscarDisponibilidad(data: {
  fechaIngreso: Date
  fechaSalida: Date
  adultos: number
  ninos: number
}) {
  try {
    // Validar fechas
    if (data.fechaSalida <= data.fechaIngreso) {
      return { success: false, error: "La fecha de salida debe ser posterior a la fecha de ingreso" }
    }

    if (data.fechaIngreso < new Date()) {
      return { success: false, error: "La fecha de ingreso no puede ser anterior a hoy" }
    }

    const totalHuespedes = data.adultos + data.ninos

    // Buscar tipos de habitación que puedan acomodar a los huéspedes
    const tiposHabitacion = await prisma.tipoHabitacion.findMany({
      where: {
        deletedAt: null,
        capacidadAdults: { gte: data.adultos },
        OR: [{ capacidadChildren: { gte: data.ninos } }, { capacidadAdults: { gte: totalHuespedes } }],
      },
      orderBy: { precio: "asc" },
    })

    // Para cada tipo, buscar habitaciones disponibles
    const habitacionesDisponibles = []

    for (const tipo of tiposHabitacion) {
      // Buscar habitaciones de este tipo que estén disponibles
      const habitaciones = await prisma.habitacion.findMany({
        where: {
          tipoHabitacionId: tipo.id,
          estado: EstadoHabitacion.DISPONIBLE,
          deletedAt: null,
          // Verificar que no tengan reservas confirmadas en el período
          NOT: {
            detalleReservaciones: {
              some: {
                reservacion: {
                  estado: "CONFIRMADA",
                  OR: [
                    {
                      AND: [{ fechaIngreso: { lte: data.fechaIngreso } }, { fechaSalida: { gt: data.fechaIngreso } }],
                    },
                    {
                      AND: [{ fechaIngreso: { lt: data.fechaSalida } }, { fechaSalida: { gte: data.fechaSalida } }],
                    },
                    {
                      AND: [{ fechaIngreso: { gte: data.fechaIngreso } }, { fechaSalida: { lte: data.fechaSalida } }],
                    },
                  ],
                },
              },
            },
          },
          // Verificar que no tengan hospedajes activos en el período
          hospedajes: {
            none: {
              estado: "ACTIVO",
              OR: [
                {
                  AND: [{ fechaIngreso: { lte: data.fechaIngreso } }, { fechaSalida: { gt: data.fechaIngreso } }],
                },
                {
                  AND: [{ fechaIngreso: { lt: data.fechaSalida } }, { fechaSalida: { gte: data.fechaSalida } }],
                },
                {
                  AND: [{ fechaIngreso: { gte: data.fechaIngreso } }, { fechaSalida: { lte: data.fechaSalida } }],
                },
              ],
            },
          },
        },
        include: {
          piso: true,
        },
      })

      if (habitaciones.length > 0) {
        // Calcular días de estadía
        const dias = Math.ceil((data.fechaSalida.getTime() - data.fechaIngreso.getTime()) / (1000 * 60 * 60 * 24))
        const totalPrecio = tipo.precio * dias

        habitacionesDisponibles.push({
          tipoHabitacion: tipo,
          habitacionesDisponibles: habitaciones.length,
          habitaciones: habitaciones.slice(0, 3), // Mostrar máximo 3 habitaciones
          precioTotal: totalPrecio,
          precioPorNoche: tipo.precio,
          dias,
        })
      }
    }

    return {
      success: true,
      data: {
        habitaciones: habitacionesDisponibles,
        parametrosBusqueda: data,
      },
    }
  } catch (error) {
    console.error("Error buscando disponibilidad:", error)
    return { success: false, error: "Error al buscar disponibilidad" }
  }
}

export async function getTiposHabitacionPublic() {
  try {
    const tipos = await prisma.tipoHabitacion.findMany({
      where: { deletedAt: null },
      orderBy: { precio: "asc" },
    })

    return { success: true, data: tipos }
  } catch (error) {
    console.error("Error fetching tipos habitacion:", error)
    return { success: false, error: "Error al obtener los tipos de habitación" }
  }
}

export async function createReservaPublic(data: {
  huespedData: {
    nombre: string
    ci: string
    correo: string
    telefono: string
    nacionalidad?: string
  }
  reservaData: {
    fechaIngreso: Date
    fechaSalida: Date
    habitacionId: string
    adultos: number
    ninos: number
    extras: {
      desayuno: boolean
      parking: boolean
    }
  }
  metodoPago: string
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Crear o buscar huésped
      let huesped = await tx.huesped.findUnique({
        where: { ci: data.huespedData.ci },
      })

      if (!huesped) {
        huesped = await tx.huesped.create({
          data: {
            ...data.huespedData,
            nacionalidad: (data.huespedData.nacionalidad as any) || "BOLIVIA",
          },
        })
      }

      // Verificar disponibilidad de la habitación
      const habitacion = await tx.habitacion.findUnique({
        where: { id: data.reservaData.habitacionId },
        include: { tipoHabitacion: true },
      })

      if (!habitacion || habitacion.estado !== EstadoHabitacion.DISPONIBLE) {
        throw new Error("La habitación seleccionada no está disponible")
      }

      // Crear reserva
      const reserva = await tx.reserva.create({
        data: {
          huespedId: huesped.id,
          estado: "PENDIENTE",
          fechaIngreso: data.reservaData.fechaIngreso,
          fechaSalida: data.reservaData.fechaSalida,
        },
      })

      // Crear detalle de reserva
      await tx.detalleReservacion.create({
        data: {
          reservacionId: reserva.id,
          habitacionId: data.reservaData.habitacionId,
          precio: habitacion.tipoHabitacion.precio,
          desayunoExtras: data.reservaData.extras.desayuno,
          parkingExtras: data.reservaData.extras.parking,
        },
      })

      // Actualizar estado de habitación
      await tx.habitacion.update({
        where: { id: data.reservaData.habitacionId },
        data: { estado: EstadoHabitacion.RESERVADA },
      })

      return { reserva, huesped, habitacion }
    })

    return { success: true, data: result }
  } catch (error) {
    console.error("Error creating reserva:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear la reserva",
    }
  }
}
