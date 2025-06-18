"use server"

import { prisma } from "@/lib/prisma"
import { createPagoSchema, type CreatePagoInput } from "@/lib/validations"
import { EstadoFactura } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function crearFacturaManual(data: {
  fichaHospedajeId: string
  consumosExtras: Array<{
    productoId: string
    cantidad: number
    precioUnitario: number
    total: number
  }>
  descuento?: number
  observaciones?: string
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Obtener información del hospedaje
      const hospedaje = await tx.fichaHospedaje.findUnique({
        where: { id: data.fichaHospedajeId },
        include: {
          habitacion: {
            include: {
              tipoHabitacion: true,
            },
          },
        },
      })

      if (!hospedaje) {
        throw new Error("Hospedaje no encontrado")
      }

      // Verificar que no tenga factura ya
      const facturaExistente = await tx.factura.findFirst({
        where: { fichaHospedajeId: data.fichaHospedajeId },
      })

      if (facturaExistente) {
        throw new Error("Este hospedaje ya tiene una factura generada")
      }

      // Calcular días y subtotal base
      const fechaIngreso = new Date(hospedaje.fechaIngreso)
      const fechaSalida = new Date(hospedaje.fechaSalida)
      const diasHospedaje = Math.ceil((fechaSalida.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24))
      const subtotalBase = hospedaje.habitacion.tipoHabitacion.precio * diasHospedaje

      // Crear consumos extras si los hay
      let subtotalExtras = 0
      for (const consumo of data.consumosExtras) {
        await tx.consumoExtra.create({
          data: {
            fichaHospedajeId: data.fichaHospedajeId,
            productoId: consumo.productoId,
            cantidad: consumo.cantidad,
            precioUnitario: consumo.precioUnitario,
            total: consumo.total,
            fecha: new Date(), // Add the required 'fecha' property
          },
        })

        // Actualizar stock
        await tx.producto.update({
          where: { id: consumo.productoId },
          data: {
            stock: {
              decrement: consumo.cantidad,
            },
          },
        })

        subtotalExtras += consumo.total
      }

      const total = subtotalBase + subtotalExtras - (data.descuento || 0)

      // Generar número de factura
      const year = new Date().getFullYear()
      const lastFactura = await tx.factura.findFirst({
        where: {
          numeroFactura: {
            startsWith: `HPL-${year}-`,
          },
        },
        orderBy: { numeroFactura: "desc" },
      })

      let numeroSecuencial = 1
      if (lastFactura?.numeroFactura) {
        const lastNumber = Number.parseInt(lastFactura.numeroFactura.split("-")[2])
        numeroSecuencial = lastNumber + 1
      }

      const numeroFactura = `HPL-${year}-${numeroSecuencial.toString().padStart(5, "0")}`

      // Crear factura
      const factura = await tx.factura.create({
        data: {
          fichaHospedajeId: data.fichaHospedajeId,
          usuarioId: "user-id-placeholder", // En producción usar el ID real del usuario
          estado: EstadoFactura.EMITIDA,
          subtotalBase,
          subtotalExtras,
          descuento: data.descuento || 0,
          total,
          numeroFactura,
          fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        include: {
          fichaHospedaje: {
            include: {
              huesped: true,
              habitacion: {
                include: {
                  tipoHabitacion: true,
                },
              },
            },
          },
          consumosExtras: {
            include: {
              producto: true,
            },
          },
          pagos: true,
        },
      })

      return factura
    })

    revalidatePath("/facturacion")
    revalidatePath("/hospedajes")
    return { success: true, data: result }
  } catch (error) {
    console.error("Error creando factura manual:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error al crear la factura" }
  }
}

export async function anularFactura(id: string) {
  try {
    const factura = await prisma.factura.findUnique({
      where: { id },
      include: { pagos: true },
    })

    if (!factura) {
      return { success: false, error: "Factura no encontrada" }
    }

    const totalPagado = factura.pagos.reduce((sum, pago) => sum + pago.monto, 0)

    if (totalPagado > 0) {
      return { success: false, error: "No se puede anular una factura con pagos registrados" }
    }

    await prisma.factura.update({
      where: { id },
      data: { estado: EstadoFactura.ANULADA },
    })

    revalidatePath("/facturacion")
    revalidatePath(`/facturacion/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Error anulando factura:", error)
    return { success: false, error: "Error al anular la factura" }
  }
}

export async function modificarFactura(id: string, data: { descuento?: number; observaciones?: string }) {
  try {
    const factura = await prisma.factura.update({
      where: { id },
      data: {
        descuento: data.descuento,
        // observaciones: data.observaciones, // Si tienes este campo
        total: {
          // Recalcular total si hay descuento
          decrement: data.descuento || 0,
        },
      },
    })

    revalidatePath("/facturacion")
    revalidatePath(`/facturacion/${id}`)
    return { success: true, data: factura }
  } catch (error) {
    console.error("Error modificando factura:", error)
    return { success: false, error: "Error al modificar la factura" }
  }
}

export async function generarFactura(fichaHospedajeId: string, usuarioId: string) {
  try {
    const fichaHospedaje = await prisma.fichaHospedaje.findUnique({
      where: { id: fichaHospedajeId },
      include: {
        habitacion: {
          include: {
            tipoHabitacion: true,
          },
        },
        consumosExtras: {
          include: {
            producto: true,
          },
        },
      },
    })

    if (!fichaHospedaje) {
      return { success: false, error: "Ficha de hospedaje no encontrada" }
    }

    // Calcular días de hospedaje
    const fechaIngreso = new Date(fichaHospedaje.fechaIngreso)
    const fechaSalida = new Date(fichaHospedaje.fechaSalida)
    const diasHospedaje = Math.ceil((fechaSalida.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24))

    // Calcular subtotales
    const subtotalBase = fichaHospedaje.habitacion.tipoHabitacion.precio * diasHospedaje
    const subtotalExtras = fichaHospedaje.consumosExtras.reduce((sum, consumo) => sum + consumo.total, 0)
    const total = subtotalBase + subtotalExtras

    // Generar número de factura
    const year = new Date().getFullYear()
    const lastFactura = await prisma.factura.findFirst({
      where: {
        numeroFactura: {
          startsWith: `HPL-${year}-`,
        },
      },
      orderBy: { numeroFactura: "desc" },
    })

    let numeroSecuencial = 1
    if (lastFactura?.numeroFactura) {
      const lastNumber = Number.parseInt(lastFactura.numeroFactura.split("-")[2])
      numeroSecuencial = lastNumber + 1
    }

    const numeroFactura = `HPL-${year}-${numeroSecuencial.toString().padStart(5, "0")}`

    const factura = await prisma.factura.create({
      data: {
        fichaHospedajeId,
        usuarioId,
        estado: EstadoFactura.EMITIDA,
        subtotalBase,
        subtotalExtras,
        total,
        numeroFactura,
        fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      },
      include: {
        fichaHospedaje: {
          include: {
            huesped: true,
            habitacion: {
              include: {
                tipoHabitacion: true,
              },
            },
          },
        },
        consumosExtras: {
          include: {
            producto: true,
          },
        },
        pagos: true,
      },
    })

    revalidatePath("/facturacion")
    return { success: true, data: factura }
  } catch (error) {
    console.error("Error generating factura:", error)
    return { success: false, error: "Error al generar la factura" }
  }
}

export async function registrarPago(data: CreatePagoInput) {
  try {
    const validatedData = createPagoSchema.parse(data)

    const pago = await prisma.pago.create({
      data: validatedData,
    })

    revalidatePath("/facturacion")
    return { success: true, data: pago }
  } catch (error) {
    console.error("Error registering pago:", error)
    return { success: false, error: "Error al registrar el pago" }
  }
}

export async function getFacturas() {
  try {
    const facturas = await prisma.factura.findMany({
      where: { deletedAt: null },
      include: {
        fichaHospedaje: {
          include: {
            huesped: true,
            habitacion: {
              include: {
                tipoHabitacion: true,
              },
            },
          },
        },
        pagos: true,
        usuario: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: facturas }
  } catch (error) {
    console.error("Error fetching facturas:", error)
    return { success: false, error: "Error al obtener las facturas" }
  }
}

export async function getFacturaById(id: string) {
  try {
    const factura = await prisma.factura.findUnique({
      where: { id },
      include: {
        fichaHospedaje: {
          include: {
            huesped: true,
            habitacion: {
              include: {
                tipoHabitacion: true,
                piso: true,
              },
            },
          },
        },
        consumosExtras: {
          include: {
            producto: true,
          },
        },
        pagos: true,
        usuario: true,
      },
    })

    return { success: true, data: factura }
  } catch (error) {
    console.error("Error fetching factura:", error)
    return { success: false, error: "Error al obtener la factura" }
  }
}
