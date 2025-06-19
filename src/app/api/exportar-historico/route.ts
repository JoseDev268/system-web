import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Obtener todos los registros históricos ordenados por fecha
    const historicos = await prisma.historicoOcupacion.findMany({
      orderBy: {
        fecha: "asc",
      },
    })

    if (historicos.length === 0) {
      return NextResponse.json({ error: "No hay datos históricos disponibles" }, { status: 404 })
    }

    // Crear contenido CSV
    const csvHeader = "Fecha,Ocupacion,Fecha_Creacion\n"
    const csvContent = historicos
      .map((registro) => {
        const fecha = registro.fecha.toISOString().split("T")[0] // YYYY-MM-DD
        const fechaCreacion = registro.createdAt.toISOString().split("T")[0]
        return `${fecha},${registro.ocupacion},${fechaCreacion}`
      })
      .join("\n")

    const csv = csvHeader + csvContent

    // Configurar headers para descarga
    const headers = new Headers()
    headers.set("Content-Type", "text/csv; charset=utf-8")
    headers.set("Content-Disposition", 'attachment; filename="historico-ocupacion.csv"')

    return new NextResponse(csv, { headers })
  } catch (error) {
    console.error("Error al exportar histórico:", error)
    return NextResponse.json({ error: "Error interno del servidor al exportar datos" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
