import { type PrismaClient, Nacionalidad } from "@prisma/client"

export async function seedHuespedes(prisma: PrismaClient) {
  const huespedes = [
    {
      nombre: "Pedro Ramírez González",
      ci: "12345678",
      correo: "pedro.ramirez@email.com",
      telefono: "+591 70111222",
      nacionalidad: Nacionalidad.BOLIVIA,
    },
    {
      nombre: "Laura Fernández Castro",
      ci: "23456789",
      correo: "laura.fernandez@email.com",
      telefono: "+591 70222333",
      nacionalidad: Nacionalidad.BOLIVIA,
    },
    {
      nombre: "Miguel Santos Herrera",
      ci: "34567890",
      correo: "miguel.santos@email.com",
      telefono: "+591 70333444",
      nacionalidad: Nacionalidad.BOLIVIA,
    },
    {
      nombre: "Carmen Delgado Morales",
      ci: "45678901",
      correo: "carmen.delgado@email.com",
      telefono: "+591 70444555",
      nacionalidad: Nacionalidad.BOLIVIA,
    },
    {
      nombre: "José Luis Vargas",
      ci: "56789012",
      correo: "jose.vargas@email.com",
      telefono: "+591 70555666",
      nacionalidad: Nacionalidad.BOLIVIA,
    },
    {
      nombre: "Ana María Jiménez",
      ci: "67890123",
      correo: "ana.jimenez@email.com",
      telefono: "+591 70666777",
      nacionalidad: Nacionalidad.BOLIVIA,
    },
    {
      nombre: "Carlos Eduardo Rojas",
      ci: "78901234",
      correo: "carlos.rojas@email.com",
      telefono: "+591 70777888",
      nacionalidad: Nacionalidad.BOLIVIA,
    },
    {
      nombre: "Isabella Rodriguez",
      ci: "P12345678",
      correo: "isabella.rodriguez@email.com",
      telefono: "+51 987654321",
      nacionalidad: Nacionalidad.PERU,
    },
    {
      nombre: "Diego Alejandro Sánchez",
      ci: "A87654321",
      correo: "diego.sanchez@email.com",
      telefono: "+54 11 23456789",
      nacionalidad: Nacionalidad.ARGENTINA,
    },
    {
      nombre: "Sofía Martínez López",
      ci: "C98765432",
      correo: "sofia.martinez@email.com",
      telefono: "+57 300 1234567",
      nacionalidad: Nacionalidad.COLOMBIA,
    },
    {
      nombre: "Ricardo Mendoza Silva",
      ci: "B11223344",
      correo: "ricardo.mendoza@email.com",
      telefono: "+55 11 98765432",
      nacionalidad: Nacionalidad.BRASIL,
    },
    {
      nombre: "Valentina Torres Ruiz",
      ci: "E55667788",
      correo: "valentina.torres@email.com",
      telefono: "+593 99 8877665",
      nacionalidad: Nacionalidad.ECUADOR,
    },
    {
      nombre: "Andrés Felipe Castro",
      ci: "V99887766",
      correo: "andres.castro@email.com",
      telefono: "+58 414 5566778",
      nacionalidad: Nacionalidad.VENEZUELA,
    },
    {
      nombre: "Camila Alejandra Herrera",
      ci: "U44556677",
      correo: "camila.herrera@email.com",
      telefono: "+598 99 123456",
      nacionalidad: Nacionalidad.URUGUAY,
    },
    {
      nombre: "Sebastián Moreno Díaz",
      ci: "CH33445566",
      correo: "sebastian.moreno@email.com",
      telefono: "+56 9 87654321",
      nacionalidad: Nacionalidad.CHILE,
    },
    {
      nombre: "Gabriela Vásquez Peña",
      ci: "PA22334455",
      correo: "gabriela.vasquez@email.com",
      telefono: "+507 6677 8899",
      nacionalidad: Nacionalidad.MEXICO,
    },
    {
      nombre: "Fernando Aguilar Ramos",
      ci: "89012345",
      correo: "fernando.aguilar@email.com",
      telefono: "+591 70888999",
      nacionalidad: Nacionalidad.BOLIVIA,
    },
    {
      nombre: "Lucía Beatriz Campos",
      ci: "90123456",
      correo: "lucia.campos@email.com",
      telefono: "+591 70999000",
      nacionalidad: Nacionalidad.BOLIVIA,
    },
    {
      nombre: "Alejandro Núñez Ortega",
      ci: "01234567",
      correo: "alejandro.nunez@email.com",
      telefono: "+591 70000111",
      nacionalidad: Nacionalidad.BOLIVIA,
    },
    {
      nombre: "Daniela Solís Guerrero",
      ci: "11223344",
      correo: "daniela.solis@email.com",
      telefono: "+591 70111000",
      nacionalidad: Nacionalidad.BOLIVIA,
    },
  ]

  const createdHuespedes = []
  for (const huesped of huespedes) {
    const created = await prisma.huesped.create({
      data: huesped,
    })
    createdHuespedes.push(created)
  }

  console.log(`✅ Created ${createdHuespedes.length} huéspedes`)
  return createdHuespedes
}
