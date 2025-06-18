import {
  type PrismaClient,
  CanalMensaje,
  EstadoMensaje,
  type User,
  type Huesped,
} from "@prisma/client"

export async function seedMensajes(
  prisma: PrismaClient,
  usuarios: User[],
  huespedes: Huesped[]
) {
  const remitente = usuarios.find(u => u.email === "carlos.mendoza@hotel.com")
  const destinatario = huespedes.find(h => h.correo === "juan.huerta@gmail.com")

  if (!remitente || !destinatario) {
    console.warn("❌ remitente o destinatario no encontrado. Se omite creación de mensajes.")
    return []
  }

  const mensajes = [
    {
      canal: CanalMensaje.EMAIL,
      contenido:
        "Estimado huésped, le confirmamos su reserva para el día de mañana. Por favor llegue a partir de las 15:00 hrs.",
      remitenteUser: {
        connect: { id: remitente.id },
      },
      destinatarioHuesped: {
        connect: { id: destinatario.id },
      },
      estado: EstadoMensaje.ENVIADO,
      fechaEnvio: new Date("2025-06-11T16:23:41.767Z"),
    },
  ]

  const createdMensajes = []
  for (const mensaje of mensajes) {
    const created = await prisma.mensaje.create({ data: mensaje })
    createdMensajes.push(created)
  }

  console.log(`✅ Created ${createdMensajes.length} mensajes`)
  return createdMensajes
}
