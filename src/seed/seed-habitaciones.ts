import { type PrismaClient, EstadoHabitacion } from "@prisma/client"

export async function seedHabitaciones(prisma: PrismaClient, pisos: any[], tiposHabitacion: any[]) {
  const habitacionesData = [
    // PISO 1 - Planta Baja (habitaciones 101-109)
    { numero: 101, pisoId: pisos[0].id, tipoId: tiposHabitacion[4].id }, // Familiar
    { numero: 102, pisoId: pisos[0].id, tipoId: tiposHabitacion[2].id }, // Matrimonial
    { numero: 103, pisoId: pisos[0].id, tipoId: tiposHabitacion[3].id }, // Triple
    { numero: 104, pisoId: pisos[0].id, tipoId: tiposHabitacion[0].id }, // Simple
    { numero: 105, pisoId: pisos[0].id, tipoId: tiposHabitacion[5].id }, // Suite
    { numero: 106, pisoId: pisos[0].id, tipoId: tiposHabitacion[1].id }, // Doble
    { numero: 107, pisoId: pisos[0].id, tipoId: tiposHabitacion[6].id }, // Cuadruple
    { numero: 108, pisoId: pisos[0].id, tipoId: tiposHabitacion[1].id }, // Doble
    { numero: 109, pisoId: pisos[0].id, tipoId: tiposHabitacion[4].id }, // Familiar

    // PISO 2 - Segundo Piso (habitaciones 201-209)
    { numero: 201, pisoId: pisos[1].id, tipoId: tiposHabitacion[4].id }, // Familiar
    { numero: 202, pisoId: pisos[1].id, tipoId: tiposHabitacion[2].id }, // Matrimonial
    { numero: 203, pisoId: pisos[1].id, tipoId: tiposHabitacion[3].id }, // Triple
    { numero: 204, pisoId: pisos[1].id, tipoId: tiposHabitacion[0].id }, // Simple
    { numero: 205, pisoId: pisos[1].id, tipoId: tiposHabitacion[5].id }, // Suite
    { numero: 206, pisoId: pisos[1].id, tipoId: tiposHabitacion[1].id }, // Doble
    { numero: 207, pisoId: pisos[1].id, tipoId: tiposHabitacion[6].id }, // Cuadruple
    { numero: 208, pisoId: pisos[1].id, tipoId: tiposHabitacion[1].id }, // Doble
    { numero: 209, pisoId: pisos[1].id, tipoId: tiposHabitacion[4].id }, // Familiar

    // PISO 3 - Tercer Piso (habitaciones 301-309)
    { numero: 301, pisoId: pisos[2].id, tipoId: tiposHabitacion[4].id }, // Familiar
    { numero: 302, pisoId: pisos[2].id, tipoId: tiposHabitacion[2].id }, // Matrimonial
    { numero: 303, pisoId: pisos[2].id, tipoId: tiposHabitacion[3].id }, // Triple
    { numero: 304, pisoId: pisos[2].id, tipoId: tiposHabitacion[0].id }, // Simple
    { numero: 305, pisoId: pisos[2].id, tipoId: tiposHabitacion[5].id }, // Suite
    { numero: 306, pisoId: pisos[2].id, tipoId: tiposHabitacion[1].id }, // Doble
    { numero: 307, pisoId: pisos[2].id, tipoId: tiposHabitacion[6].id }, // Cuadruple
    { numero: 308, pisoId: pisos[2].id, tipoId: tiposHabitacion[1].id }, // Doble
    { numero: 309, pisoId: pisos[2].id, tipoId: tiposHabitacion[4].id }, // Familiar

    // PISO 4 - Cuarto Piso (habitaciones 401-402) - Solo suites ejecutivas
    { numero: 401, pisoId: pisos[3].id, tipoId: tiposHabitacion[6].id }, // Cuadruple
    { numero: 402, pisoId: pisos[3].id, tipoId: tiposHabitacion[6].id }, // Cuadruple
  ]

  // Estados aleatorios para hacer más realista
  const estados = [
    EstadoHabitacion.DISPONIBLE,
    EstadoHabitacion.OCUPADA,
    EstadoHabitacion.LIMPIEZA,
    EstadoHabitacion.RESERVADA,
  ]

  const createdHabitaciones = []
  for (const habitacionData of habitacionesData) {
    // Asignar estado aleatorio (70% disponible, 20% ocupada, 5% limpieza, 5% reservada)
    const random = Math.random()
    let estado: EstadoHabitacion = EstadoHabitacion.DISPONIBLE

    if (random < 0.05) estado = EstadoHabitacion.RESERVADA
    else if (random < 0.1) estado = EstadoHabitacion.LIMPIEZA
    else if (random < 0.3) estado = EstadoHabitacion.OCUPADA
    else estado = EstadoHabitacion.DISPONIBLE

    const habitacion = await prisma.habitacion.create({
      data: {
        numero: habitacionData.numero,
        pisoId: habitacionData.pisoId,
        tipoHabitacionId: habitacionData.tipoId,
        estado: estado,
        observaciones:
          estado === EstadoHabitacion.LIMPIEZA
            ? "Pendiente de limpieza profunda"
            : estado === EstadoHabitacion.OCUPADA
              ? "Ocupada por huésped"
              : estado === EstadoHabitacion.RESERVADA
                ? "Reservada para próximo huésped"
                : null,
      },
    })
    createdHabitaciones.push(habitacion)
  }

  console.log(`✅ Created ${createdHabitaciones.length} habitaciones`)
  return createdHabitaciones
}
