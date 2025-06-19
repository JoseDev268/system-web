import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Obtener estadísticas básicas
    const estadisticas = await prisma.historicoOcupacion.aggregate({
      _count: {
        id: true,
      },
      _avg: {
        ocupacion: true,
      },
      _max: {
        ocupacion: true,
        fecha: true,
      },
      _min: {
        ocupacion: true,
        fecha: true,
      },
    })

    // Obtener datos de los últimos 30 días
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() - 30)

    const ultimosTreintaDias = await prisma.historicoOcupacion.findMany({
      where: {
        fecha: {
          gte: fechaLimite,
        },
      },
      orderBy: {
        fecha: "desc",
      },
      take: 30,
    })

    return NextResponse.json({
      totalRegistros: estadisticas._count.id,
      ocupacionPromedio: estadisticas._avg.ocupacion,
      ocupacionMaxima: estadisticas._max.ocupacion,
      ocupacionMinima: estadisticas._min.ocupacion,
      fechaUltimoRegistro: estadisticas._max.fecha,
      fechaPrimerRegistro: estadisticas._min.fecha,
      ultimosTreintaDias: ultimosTreintaDias.map((registro) => ({
        fecha: registro.fecha.toISOString().split("T")[0],
        ocupacion: registro.ocupacion,
      })),
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
