"use server"

import { prisma } from "@/lib/prisma"
import type { ReporteOcupacion, ReporteIngresos } from "@/lib/types"
import { reporteOcupacionSchema } from "@/lib/validations"
import { startOfDay, endOfDay, eachDayOfInterval, format } from "date-fns"
import { es } from "date-fns/locale"

export async function getReporteOcupacion(fechaInicio: Date, fechaFin: Date): Promise<ReporteOcupacion[]> {
  const validatedData = reporteOcupacionSchema.parse({ fechaInicio, fechaFin })

  const totalHabitaciones = await prisma.habitacion.count({
    where: { deletedAt: null },
  })

  const dias = eachDayOfInterval({
    start: validatedData.fechaInicio,
    end: validatedData.fechaFin,
  })

  const reportes: ReporteOcupacion[] = []

  for (const dia of dias) {
    const inicioDelDia = startOfDay(dia)
    const finDelDia = endOfDay(dia)

    // Contar habitaciones ocupadas
    const habitacionesOcupadas = await prisma.fichaHospedaje.count({
      where: {
        fechaIngreso: { lte: finDelDia },
        fechaSalida: { gte: inicioDelDia },
        estado: "ACTIVO",
        deletedAt: null,
      },
    })

    // Calcular ingresos del día
    const facturas = await prisma.factura.findMany({
      where: {
        fechaEmision: {
          gte: inicioDelDia,
          lte: finDelDia,
        },
        estado: { not: "ANULADA" },
        deletedAt: null,
      },
      select: {
        total: true,
      },
    })

    const ingresosTotales = facturas.reduce((sum, factura) => sum + factura.total, 0)

    reportes.push({
      fecha: dia,
      totalHabitaciones,
      habitacionesOcupadas,
      porcentajeOcupacion: totalHabitaciones > 0 ? (habitacionesOcupadas / totalHabitaciones) * 100 : 0,
      ingresosTotales,
    })
  }

  return reportes
}

export async function getReporteIngresos(fechaInicio: Date, fechaFin: Date): Promise<ReporteIngresos> {
  const inicioDelPeriodo = startOfDay(fechaInicio)
  const finDelPeriodo = endOfDay(fechaFin)

  const facturas = await prisma.factura.findMany({
    where: {
      fechaEmision: {
        gte: inicioDelPeriodo,
        lte: finDelPeriodo,
      },
      estado: { not: "ANULADA" },
      deletedAt: null,
    },
    include: {
      consumosExtras: true,
    },
  })

  const ingresosPorHospedaje = facturas.reduce((sum, factura) => sum + factura.subtotalBase, 0)
  const ingresosPorExtras = facturas.reduce((sum, factura) => sum + (factura.subtotalExtras || 0), 0)
  const totalIngresos = facturas.reduce((sum, factura) => sum + factura.total, 0)

  return {
    periodo: `${format(fechaInicio, "dd/MM/yyyy", { locale: es })} - ${format(fechaFin, "dd/MM/yyyy", { locale: es })}`,
    ingresosPorHospedaje,
    ingresosPorExtras,
    totalIngresos,
    totalFacturas: facturas.length,
  }
}

export async function getEstadisticasGenerales() {
  const [
    totalHuespedes,
    totalReservas,
    reservasActivas,
    habitacionesDisponibles,
    habitacionesOcupadas,
    ingresosMesActual,
  ] = await Promise.all([
    prisma.huesped.count({ where: { deletedAt: null } }),
    prisma.reserva.count({ where: { deletedAt: null } }),
    prisma.reserva.count({
      where: {
        estado: "CONFIRMADA",
        deletedAt: null,
      },
    }),
    prisma.habitacion.count({
      where: {
        estado: "DISPONIBLE",
        deletedAt: null,
      },
    }),
    prisma.habitacion.count({
      where: {
        estado: "OCUPADA",
        deletedAt: null,
      },
    }),
    prisma.factura.aggregate({
      where: {
        fechaEmision: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
        estado: { not: "ANULADA" },
        deletedAt: null,
      },
      _sum: {
        total: true,
      },
    }),
  ])

  return {
    totalHuespedes,
    totalReservas,
    reservasActivas,
    habitacionesDisponibles,
    habitacionesOcupadas,
    ingresosMesActual: ingresosMesActual._sum.total || 0,
  }
}
