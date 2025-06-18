import type { PrismaClient } from "@prisma/client"

export async function seedPisos(prisma: PrismaClient) {
  const pisos = [
    {
      numero: 1,
    },
    {
      numero: 2,
    },
    {
      numero: 3,
    },
    {
      numero: 4,
    },
  ]

  const createdPisos = []
  for (const piso of pisos) {
    const created = await prisma.piso.create({
      data: piso,
    })
    createdPisos.push(created)
  }

  console.log(`✅ Created ${createdPisos.length} pisos`)
  return createdPisos
}
