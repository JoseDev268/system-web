"use server"

import { prisma } from "@/lib/prisma"

export async function getTiposHabitacionPublic() {
  return await prisma.tipoHabitacion.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      precio: true,
      images: true,
      capacidadAdults: true,
      capacidadChildren: true,
      capacidadMinima: true,
    },
    orderBy: { precio: "asc" },
  })
}

export async function checkRoomAvailability(tipoHabitacionId: string, fechaIngreso: Date, fechaSalida: Date) {
  const habitacionesDisponibles = await prisma.habitacion.count({
    where: {
      tipoHabitacionId,
      deletedAt: null,
      NOT: {
        hospedajes: {
          some: {
            OR: [
              {
                AND: [{ fechaIngreso: { lte: fechaSalida } }, { fechaSalida: { gte: fechaIngreso } }],
              },
            ],
            estado: "ACTIVO",
          },
        },
      },
    },
  })

  return habitacionesDisponibles > 0
}
