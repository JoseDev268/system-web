import { type PrismaClient, EstadoHospedaje } from "@prisma/client"

export async function seedHospedajes(prisma: PrismaClient, huespedes: any[], habitaciones: any[]) {
  const hospedajes = []

  // Crear hospedajes activos (últimos 30 días)
  const today = new Date()

  for (let i = 0; i < 20; i++) {
    const fechaIngreso = new Date(today)
    fechaIngreso.setDate(today.getDate() - Math.floor(Math.random() * 30))

    const fechaSalida = new Date(fechaIngreso)
    fechaSalida.setDate(fechaIngreso.getDate() + Math.floor(Math.random() * 10) + 1)

    const huesped = huespedes[Math.floor(Math.random() * huespedes.length)]
    const habitacion = habitaciones[Math.floor(Math.random() * habitaciones.length)]

    // Determinar si el hospedaje está activo o finalizado
    const isActive = fechaSalida > today && Math.random() > 0.3

    hospedajes.push({
      huespedId: huesped.id,
      habitacionId: habitacion.id,
      fechaIngreso,
      fechaSalida: isActive ? fechaSalida : new Date(today.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      estado: isActive ? EstadoHospedaje.ACTIVO : EstadoHospedaje.FINALIZADO,
    })
  }

  const createdHospedajes = []
  for (const hospedaje of hospedajes) {
    const created = await prisma.fichaHospedaje.create({
      data: hospedaje,
    })
    createdHospedajes.push(created)
  }

  console.log(`✅ Created ${createdHospedajes.length} hospedajes`)
  return createdHospedajes
}
