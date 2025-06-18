// "use server"

// import { prisma } from "@/lib/prisma"
// import { EstadoHospedaje, EstadoHabitacion } from "@prisma/client"

// export async function getReporteOcupacion(fechaInicio: Date, fechaFin: Date) {
//   try {
//     const hospedajes = await prisma.fichaHospedaje.findMany({
//       where: {
//         OR: [
//           {
//             fechaIngreso: {
//               gte: fechaInicio,
//               lte: fechaFin,
//             },
//           },
//           {
//             fechaSalida: {
//               gte: fechaInicio,
//               lte: fechaFin,
//             },
//           },
//           {
//             AND: [{ fechaIngreso: { lte: fechaInicio } }, { fechaSalida: { gte: fechaFin } }],
//           },
//         ],
//         deletedAt: null,
//       },
//       include: {
//         habitacion: {
//           include: {
//             tipoHabitacion: true,
//           },
//         },
//         huesped: true,
//       },
//     })

//     const totalHabitaciones = await prisma.habitacion.count({
//       where: { deletedAt: null },
//     })

//     // Calcular ocupación por día
//     const ocupacionPorDia = []
//     const currentDate = new Date(fechaInicio)

//     while (currentDate <= fechaFin) {
//       const hospedajesDelDia = hospedajes.filter((h) => {
//         const fechaIngreso = new Date(h.fechaIngreso)
//         const fechaSalida = new Date(h.fechaSalida)
//         return currentDate >= fechaIngreso && currentDate <= fechaSalida
//       })

//       ocupacionPorDia.push({
//         fecha: new Date(currentDate),
//         ocupadas: hospedajesDelDia.length,
//         porcentaje: totalHabitaciones > 0 ? (hospedajesDelDia.length / totalHabitaciones) * 100 : 0,
//       })

//       currentDate.setDate(currentDate.getDate() + 1)
//     }

//     return { success: true, data: { ocupacionPorDia, totalHabitaciones, hospedajes } }
//   } catch (error) {
//     console.error("Error generating reporte ocupacion:", error)
//     return { success: false, error: "Error al generar el reporte de ocupación" }
//   }
// }

// export async function getReporteIngresos(fechaInicio: Date, fechaFin: Date) {
//   try {
//     const facturas = await prisma.factura.findMany({
//       where: {
//         fechaEmision: {
//           gte: fechaInicio,
//           lte: fechaFin,
//         },
//         estado: "EMITIDA",
//         deletedAt: null,
//       },
//       include: {
//         pagos: true,
//         fichaHospedaje: {
//           include: {
//             habitacion: {
//               include: {
//                 tipoHabitacion: true,
//               },
//             },
//           },
//         },
//       },
//     })

//     const ingresosPorDia = []
//     const currentDate = new Date(fechaInicio)

//     while (currentDate <= fechaFin) {
//       const facturasDelDia = facturas.filter((f) => {
//         const fechaFactura = new Date(f.fechaEmision)
//         return (
//           fechaFactura.getDate() === currentDate.getDate() &&
//           fechaFactura.getMonth() === currentDate.getMonth() &&
//           fechaFactura.getFullYear() === currentDate.getFullYear()
//         )
//       })

//       const ingresosDia = facturasDelDia.reduce((sum, f) => sum + f.total, 0)
//       const pagosDia = facturasDelDia.reduce((sum, f) => sum + f.pagos.reduce((pSum, p) => pSum + p.monto, 0), 0)

//       ingresosPorDia.push({
//         fecha: new Date(currentDate),
//         ingresos: ingresosDia,
//         pagos: pagosDia,
//         facturas: facturasDelDia.length,
//       })

//       currentDate.setDate(currentDate.getDate() + 1)
//     }

//     const totalIngresos = facturas.reduce((sum, f) => sum + f.total, 0)
//     const totalPagos = facturas.reduce((sum, f) => sum + f.pagos.reduce((pSum, p) => pSum + p.monto, 0), 0)

//     return {
//       success: true,
//       data: {
//         ingresosPorDia,
//         totalIngresos,
//         totalPagos,
//         totalFacturas: facturas.length,
//       },
//     }
//   } catch (error) {
//     console.error("Error generating reporte ingresos:", error)
//     return { success: false, error: "Error al generar el reporte de ingresos" }
//   }
// }

// export async function getEstadisticasGenerales() {
//   try {
//     const [
//       totalHabitaciones,
//       habitacionesOcupadas,
//       hospedajesActivos,
//       reservasPendientes,
//       facturasPendientes,
//       ingresosMes,
//     ] = await Promise.all([
//       prisma.habitacion.count({ where: { deletedAt: null } }),
//       prisma.habitacion.count({ where: { estado: EstadoHabitacion.OCUPADA, deletedAt: null } }),
//       prisma.fichaHospedaje.count({ where: { estado: EstadoHospedaje.ACTIVO, deletedAt: null } }),
//       prisma.reserva.count({ where: { estado: "PENDIENTE", deletedAt: null } }),
//       prisma.factura.count({ where: { estado: "EMITIDA", deletedAt: null } }),
//       prisma.factura.aggregate({
//         where: {
//           fechaEmision: {
//             gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
//           },
//           estado: "EMITIDA",
//           deletedAt: null,
//         },
//         _sum: { total: true },
//       }),
//     ])

//     return {
//       success: true,
//       data: {
//         totalHabitaciones,
//         habitacionesOcupadas,
//         hospedajesActivos,
//         reservasPendientes,
//         facturasPendientes,
//         ingresosMes: ingresosMes._sum.total || 0,
//         ocupacionPorcentaje: totalHabitaciones > 0 ? (habitacionesOcupadas / totalHabitaciones) * 100 : 0,
//       },
//     }
//   } catch (error) {
//     console.error("Error fetching estadisticas generales:", error)
//     return { success: false, error: "Error al obtener las estadísticas generales" }
//   }
// }
