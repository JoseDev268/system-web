import { type PrismaClient, RolUser } from "@prisma/client"

export async function seedUsuarios(prisma: PrismaClient) {
  const usuarios = [
    {
      name: "Carlos Mendoza",
      email: "carlos.mendoza@hotel.com",
      password: "admin123",
      rol: RolUser.ADMIN,

    },
    {
      name: "María García",
      email: "maria.garcia@hotel.com",
      password: "recep123",
      rol: RolUser.RECEPCIONISTA,

    },
    {
      name: "Juan Pérez",
      email: "juan.perez@hotel.com",
      password: "recep123",
      rol: RolUser.RECEPCIONISTA,
    },
    {
      name: "Ana López",
      email: "ana.lopez@hotel.com",
      password: "house123",
      rol: RolUser.USER,

    },
    {
      name: "Roberto Silva",
      email: "roberto.silva@hotel.com",
      password: "maint123",
      rol: RolUser.USER,

    },
  ]

  const createdUsuarios = []
  for (const usuario of usuarios) {
    const created = await prisma.user.create({ data: usuario })
    createdUsuarios.push(created)
  }

  console.log(`✅ Created ${createdUsuarios.length} usuarios`)
  return createdUsuarios
}
