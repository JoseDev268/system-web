import { type PrismaClient, EstadoReserva } from "@prisma/client"

export async function seedReservas(prisma: PrismaClient, huespedes: any[], habitaciones: any[]) {
  const reservas = []

  // Crear reservas para los próximos 30 días
  const today = new Date()

  for (let i = 0; i < 15; i++) {
    const fechaIngreso = new Date(today)
    fechaIngreso.setDate(today.getDate() + Math.floor(Math.random() * 30))

    const fechaSalida = new Date(fechaIngreso)
    fechaSalida.setDate(fechaIngreso.getDate() + Math.floor(Math.random() * 7) + 1)

    const huesped = huespedes[Math.floor(Math.random() * huespedes.length)]
    const habitacion = habitaciones[Math.floor(Math.random() * habitaciones.length)]

    reservas.push({
      huespedId: huesped.id,
      estado: getRandomEstadoReserva(),
      fechaIngreso,
      fechaSalida,
      habitacionId: habitacion.id,
      precio: getRandomPrice(habitacion.tipoHabitacion?.precio || 200),
    })
  }

  const createdReservas = []
  for (const reservaData of reservas) {
    const { habitacionId, precio, ...reserva } = reservaData

    const created = await prisma.reserva.create({
      data: reserva,
    })

    // Crear detalle de reservación
    await prisma.detalleReservacion.create({
      data: {
        reservacionId: created.id,
        habitacionId,
        precio,
        desayunoExtras: Math.random() > 0.7,
        parkingExtras: Math.random() > 0.8,
      },
    })

    createdReservas.push(created)
  }

  console.log(`✅ Created ${createdReservas.length} reservas`)
  return createdReservas
}

function getRandomEstadoReserva(): EstadoReserva {
  const estados = [EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, EstadoReserva.CANCELADA]
  const weights = [0.3, 0.6, 0.1] // 30% pendiente, 60% confirmada, 10% cancelada

  const random = Math.random()
  let cumulative = 0

  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i]
    if (random < cumulative) {
      return estados[i]
    }
  }

  return EstadoReserva.CONFIRMADA
}

function getRandomPrice(basePrice: number): number {
  // Variación de ±20% del precio base
  const variation = (Math.random() - 0.5) * 0.4
  return Math.round(basePrice * (1 + variation) * 100) / 100
}
