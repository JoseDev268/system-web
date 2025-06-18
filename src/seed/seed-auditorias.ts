import type { PrismaClient } from "@prisma/client"

export async function seedAuditorias(prisma: PrismaClient, usuarios: any[]) {
  const auditorias = [
    {
      usuarioId: usuarios[0].id,
      entidad: "reserva", // Change 'tabla' to 'entidad'
      entidadId: "1", // Change 'registroId' to 'entidadId'
      accion: "CREAR", // Change TipoAccion.CREAR to string
      descripcion: "Creación de nueva reserva para huésped Pedro Ramírez", // Change 'detalles' to 'descripcion'
    },
    {
      usuarioId: usuarios[1].id,
      entidad: "habitacion",
      entidadId: "101",
      accion: "ACTUALIZAR",
      descripcion: "Cambio de estado de habitación 101 de DISPONIBLE a OCUPADA",
    },
    {
      usuarioId: usuarios[0].id,
      entidad: "factura",
      entidadId: "1",
      accion: "CREAR",
      descripcion: "Generación de factura HPL-2024-00001",
    },
    {
      usuarioId: usuarios[2].id,
      entidad: "reserva",
      entidadId: "2",
      accion: "ACTUALIZAR",
      descripcion: "Confirmación de reserva ID 2",
    },
    {
      usuarioId: usuarios[1].id,
      entidad: "pago",
      entidadId: "1",
      accion: "CREAR",
      descripcion: "Registro de pago de Bs. 450.00 en efectivo",
    },
    {
      usuarioId: usuarios[3].id,
      entidad: "habitacion",
      entidadId: "205",
      accion: "ACTUALIZAR",
      descripcion: "Cambio de estado de habitación 205 de OCUPADA a LIMPIEZA",
    },
    {
      usuarioId: usuarios[0].id,
      entidad: "huesped",
      entidadId: "15",
      accion: "CREAR",
      descripcion: "Registro de nuevo huésped: Laura Fernández Castro",
    },
    {
      usuarioId: usuarios[2].id,
      entidad: "fichaHospedaje",
      entidadId: "3",
      accion: "ACTUALIZAR",
      descripcion: "Check-out realizado para habitación 302",
    },
    {
      usuarioId: usuarios[1].id,
      entidad: "mensaje",
      entidadId: "5",
      accion: "CREAR",
      descripcion: "Envío de mensaje de confirmación por WhatsApp",
    },
    {
      usuarioId: usuarios[4].id,
      entidad: "habitacion",
      entidadId: "310",
      accion: "ACTUALIZAR",
      descripcion: "Mantenimiento completado en habitación 310",
    },
    {
      usuarioId: usuarios[0].id,
      accion: "ELIMINAR",
      entidad: "reserva",
      entidadId: "8",
      descripcion: "Cancelación de reserva por solicitud del huésped",
    },
    {
      usuarioId: usuarios[1].id,
      accion: "CREAR",
      entidad: "consumoExtra",
      entidadId: "12",
      descripcion: "Registro de consumo extra: Servicio de habitaciones",
    },
    {
      usuarioId: usuarios[2].id,
      accion: "ACTUALIZAR",
      entidad: "producto",
      entidadId: "5",
      descripcion: "Actualización de precio de producto: Agua Mineral 500ml",
    },
    {
      usuarioId: usuarios[0].id,
      accion: "CREAR",
      entidad: "usuario",
      entidadId: "6",
      descripcion: "Creación de nueva cuenta de usuario para recepcionista",
    },
    {
      usuarioId: usuarios[3].id,
      accion: "ACTUALIZAR",
      entidad: "habitacion",
      entidadId: "150",
      descripcion: "Habitación 150 marcada como disponible después de limpieza",
    },
  ]

  const createdAuditorias = []
  for (const auditoria of auditorias) {
    const created = await prisma.auditoria.create({
      data: {
        ...auditoria,
      },
    })
    createdAuditorias.push(created)
  }

  console.log(`✅ Created ${createdAuditorias.length} auditorías`)
  return createdAuditorias
}
