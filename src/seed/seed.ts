import { PrismaClient } from "@prisma/client"
import { seedUsuarios } from "../seed/seed-usuarios"
import { seedPisos } from "../seed/seed-pisos"
import { seedTiposHabitacion } from "../seed/seed-tipos-habitacion"
import { seedHabitaciones } from "../seed/seed-habitaciones"
import { seedHuespedes } from "../seed/seed-huespedes"
import { seedReservas } from "../seed/seed-reservas"
import { seedHospedajes } from "../seed/seed-hospedajes"
import { seedProductos } from "../seed/seed-productos"
import { seedFacturas } from "../seed/seed-facturas"
import { seedMensajes } from "../seed/seed-mensajes"
import { seedAuditorias } from "../seed/seed-auditorias"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  try {
    // Clear existing data in reverse dependency order
    console.log("🧹 Cleaning existing data...")
    await prisma.auditoria.deleteMany()
    await prisma.mensaje.deleteMany()
    await prisma.pago.deleteMany()
    await prisma.consumoExtra.deleteMany()
    await prisma.factura.deleteMany()
    await prisma.fichaHospedaje.deleteMany()
    await prisma.detalleReservacionHuesped.deleteMany()
    await prisma.detalleReservacion.deleteMany()
    await prisma.reserva.deleteMany()
    await prisma.huesped.deleteMany()
    await prisma.habitacion.deleteMany()
    await prisma.tipoHabitacion.deleteMany()
    await prisma.piso.deleteMany()
    await prisma.producto.deleteMany()
    await prisma.user.deleteMany()

    // Seed data in dependency order
    console.log("👥 Seeding usuarios...")
    const usuarios = await seedUsuarios(prisma)

    console.log("🏢 Seeding pisos...")
    const pisos = await seedPisos(prisma)

    console.log("🛏️ Seeding tipos de habitación...")
    const tiposHabitacion = await seedTiposHabitacion(prisma)

    console.log("🏠 Seeding habitaciones...")
    const habitaciones = await seedHabitaciones(prisma, pisos, tiposHabitacion)

    console.log("🧳 Seeding huéspedes...")
    const huespedes = await seedHuespedes(prisma)

    console.log("📅 Seeding reservas...")
    const reservas = await seedReservas(prisma, huespedes, habitaciones)

    console.log("🏨 Seeding hospedajes...")
    const hospedajes = await seedHospedajes(prisma, huespedes, habitaciones)

    console.log("🛍️ Seeding productos...")
    const productos = await seedProductos(prisma)

    console.log("🧾 Seeding facturas...")
    const facturas = await seedFacturas(prisma, hospedajes, productos, usuarios)

    console.log("💬 Seeding mensajes...")
    await seedMensajes(prisma, usuarios, huespedes)

    console.log("📋 Seeding auditorías...")
    await seedAuditorias(prisma, usuarios)

    console.log("✅ Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error during seeding:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
