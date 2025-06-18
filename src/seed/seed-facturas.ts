import { type PrismaClient, EstadoFactura, MetodoPago } from "@prisma/client"

export async function seedFacturas(prisma: PrismaClient, hospedajes: any[], productos: any[], usuarios: any[]) {
  const facturas = []

  // Crear facturas para hospedajes finalizados
  const hospedajesFinalizados = hospedajes.filter((h) => h.estado === "FINALIZADO")

  for (let i = 0; i < Math.min(hospedajesFinalizados.length, 15); i++) {
    const hospedaje = hospedajesFinalizados[i]
    const usuario = usuarios[Math.floor(Math.random() * usuarios.length)]

    // Calcular días de hospedaje
    const fechaIngreso = new Date(hospedaje.fechaIngreso)
    const fechaSalida = new Date(hospedaje.fechaSalida)
    const dias = Math.ceil((fechaSalida.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24))

    const subtotalBase = 200 * dias // Precio base estimado
    const subtotalExtras = Math.random() > 0.5 ? Math.floor(Math.random() * 300) + 50 : 0
    const total = subtotalBase + subtotalExtras

    // Generar número de factura
    const year = fechaSalida.getFullYear()
    const numeroFactura = `HPL-${year}-${String(i + 1).padStart(5, "0")}`

    const factura = {
      fichaHospedajeId: hospedaje.id,
      usuarioId: usuario.id,
      estado: EstadoFactura.EMITIDA,
      subtotalBase,
      subtotalExtras,
      total,
      numeroFactura,
      fechaEmision: fechaSalida,
      fechaVencimiento: new Date(fechaSalida.getTime() + 30 * 24 * 60 * 60 * 1000),
    }

    facturas.push(factura)
  }

  const createdFacturas = []
  for (const factura of facturas) {
    const created = await prisma.factura.create({
      data: factura,
    })

    // Crear algunos consumos extras aleatorios
    if (factura.subtotalExtras > 0) {
      const numConsumos = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numConsumos; j++) {
        const producto = productos[Math.floor(Math.random() * productos.length)]
        const cantidad = Math.floor(Math.random() * 3) + 1

        await prisma.consumoExtra.create({
          data: {
            facturaId: created.id,
            productoId: producto.id,
            cantidad,
            precioUnitario: producto.precio,
            total: producto.precio * cantidad,
            fecha: new Date(), // Add the current date as the 'fecha'
          },
        })
      }
    }

    // Crear pagos para algunas facturas
    if (Math.random() > 0.3) {
      const montoPago = Math.random() > 0.5 ? factura.total : factura.total * (0.5 + Math.random() * 0.5)

      await prisma.pago.create({
        data: {
          facturaId: created.id,
          monto: montoPago,
          metodo: getRandomMetodoPago(),
          observacion: Math.random() > 0.7 ? "Pago procesado correctamente" : null,
          numeroTransaccion: Math.random() > 0.5 ? `TXN${Date.now()}${Math.floor(Math.random() * 1000)}` : null,
        },
      })
    }

    createdFacturas.push(created)
  }

  console.log(`✅ Created ${createdFacturas.length} facturas`)
  return createdFacturas
}

function getRandomMetodoPago(): MetodoPago {
  const metodos = [MetodoPago.EFECTIVO, MetodoPago.TARJETA, MetodoPago.QR, MetodoPago.TRANSFERENCIA]
  return metodos[Math.floor(Math.random() * metodos.length)]
}
