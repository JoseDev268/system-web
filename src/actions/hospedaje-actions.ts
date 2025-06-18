"use server"

import { prisma } from "@/lib/prisma"
import { EstadoHospedaje, EstadoHabitacion } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getHospedajesSinFactura() {
  try {
    const hospedajes = await prisma.fichaHospedaje.findMany({
      where: {
        deletedAt: null,
        factura: null,
        estado: EstadoHospedaje.ACTIVO,
      },
      include: {
        huesped: true,
        habitacion: {
          include: {
            tipoHabitacion: true,
          },
        },
      },
      orderBy: { fechaIngreso: "desc" },
    })

    return { success: true, data: hospedajes }
  } catch (error) {
    console.error("Error fetching hospedajes sin factura:", error)
    return { success: false, error: "Error al obtener los hospedajes" }
  }
}

export async function getHospedajeById(id: string) {
  try {
    const hospedaje = await prisma.fichaHospedaje.findUnique({
      where: { id },
      include: {
        huesped: true,
        habitacion: {
          include: {
            tipoHabitacion: true,
            piso: true,
          },
        },
        consumosExtras: {
          include: {
            producto: true,
          },
          orderBy: { createdAt: "desc" },
        },
        factura: true,
      },
    })

    return { success: true, data: hospedaje }
  } catch (error) {
    console.error("Error fetching hospedaje:", error)
    return { success: false, error: "Error al obtener el hospedaje" }
  }
}

export async function agregarConsumoExtra(data: {
  hospedajeId: string
  productoId: string
  cantidad: number
  precioUnitario: number
}) {
  try {
    const total = data.cantidad * data.precioUnitario

    const consumo = await prisma.consumoExtra.create({
      data: {
        fichaHospedajeId: data.hospedajeId,
        productoId: data.productoId,
        cantidad: data.cantidad,
        precioUnitario: data.precioUnitario,
        total,
        fecha: new Date(), // Add the required 'fecha' property
      },
      include: {
        producto: true,
      },
    })

    // Actualizar stock del producto
    await prisma.producto.update({
      where: { id: data.productoId },
      data: {
        stock: {
          decrement: data.cantidad,
        },
      },
    })

    revalidatePath(`/checkin/${data.hospedajeId}`)
    return { success: true, data: consumo }
  } catch (error) {
    console.error("Error agregando consumo extra:", error)
    return { success: false, error: "Error al agregar el consumo" }
  }
}

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
          estado: "EMITIDA",
          subtotalBase,
          subtotalExtras,
          descuento: data.descuento || 0,
          total,
          numeroFactura,
          fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })

      return factura
    })

    revalidatePath("/facturacion")
    return { success: true, data: result }
  } catch (error) {
    console.error("Error creando factura manual:", error)
    return { success: false, error: "Error al crear la factura" }
  }
}

export async function getHospedajes() {
  try {
    const hospedajes = await prisma.fichaHospedaje.findMany({
      where: { deletedAt: null },
      include: {
        huesped: true,
        habitacion: {
          include: {
            tipoHabitacion: true,
            piso: true,
          },
        },
        factura: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: hospedajes }
  } catch (error) {
    console.error("Error fetching hospedajes:", error)
    return { success: false, error: "Error al obtener los hospedajes" }
  }
}

export async function createHospedaje(data: {
  huespedId: string
  habitacionId: string
  fechaIngreso: Date
  fechaSalida: Date
}) {
  try {
    // Verificar que la habitación esté disponible
    const habitacion = await prisma.habitacion.findUnique({
      where: { id: data.habitacionId },
    })

    if (!habitacion || habitacion.estado !== EstadoHabitacion.DISPONIBLE) {
      return { success: false, error: "La habitación no está disponible" }
    }

    const hospedaje = await prisma.$transaction(async (tx) => {
      // Crear hospedaje
      const nuevoHospedaje = await tx.fichaHospedaje.create({
        data: {
          ...data,
          estado: EstadoHospedaje.ACTIVO,
        },
        include: {
          huesped: true,
          habitacion: {
            include: {
              tipoHabitacion: true,
              piso: true,
            },
          },
        },
      })

      // Actualizar estado de habitación
      await tx.habitacion.update({
        where: { id: data.habitacionId },
        data: { estado: EstadoHabitacion.OCUPADA },
      })

      return nuevoHospedaje
    })

    revalidatePath("/hospedajes")
    revalidatePath("/habitaciones")
    return { success: true, data: hospedaje }
  } catch (error) {
    console.error("Error creating hospedaje:", error)
    return { success: false, error: "Error al crear el hospedaje" }
  }
}

export async function updateHospedaje(
  id: string,
  data: {
    fechaSalida?: Date
    estado?: EstadoHospedaje
  },
) {
  try {
    const hospedaje = await prisma.fichaHospedaje.update({
      where: { id },
      data,
      include: {
        huesped: true,
        habitacion: {
          include: {
            tipoHabitacion: true,
            piso: true,
          },
        },
      },
    })

    // Si se finaliza el hospedaje, liberar la habitación
    if (data.estado === EstadoHospedaje.FINALIZADO) {
      await prisma.habitacion.update({
        where: { id: hospedaje.habitacionId },
        data: { estado: EstadoHabitacion.LIMPIEZA },
      })
    }

    revalidatePath("/hospedajes")
    revalidatePath("/habitaciones")
    return { success: true, data: hospedaje }
  } catch (error) {
    console.error("Error updating hospedaje:", error)
    return { success: false, error: "Error al actualizar el hospedaje" }
  }
}

export async function deleteHospedaje(id: string) {
  try {
    const hospedaje = await prisma.fichaHospedaje.findUnique({
      where: { id },
      include: { factura: true },
    })

    if (!hospedaje) {
      return { success: false, error: "Hospedaje no encontrado" }
    }

    if (hospedaje.factura) {
      return { success: false, error: "No se puede eliminar un hospedaje con factura emitida" }
    }

    await prisma.$transaction(async (tx) => {
      // Soft delete del hospedaje
      await tx.fichaHospedaje.update({
        where: { id },
        data: { deletedAt: new Date() },
      })

      // Liberar habitación si estaba ocupada
      if (hospedaje.estado === EstadoHospedaje.ACTIVO) {
        await tx.habitacion.update({
          where: { id: hospedaje.habitacionId },
          data: { estado: EstadoHabitacion.DISPONIBLE },
        })
      }
    })

    revalidatePath("/hospedajes")
    revalidatePath("/habitaciones")
    return { success: true }
  } catch (error) {
    console.error("Error deleting hospedaje:", error)
    return { success: false, error: "Error al eliminar el hospedaje" }
  }
}
