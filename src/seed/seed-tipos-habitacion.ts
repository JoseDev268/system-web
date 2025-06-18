import type { PrismaClient } from "@prisma/client"

export async function seedTiposHabitacion(prisma: PrismaClient) {
  const tiposHabitacion = [
    {
      nombre: "Habitación Simple",
      descripcion: "Habitación cómoda para una persona con cama individual",
      capacidadAdults: 1,
      capacidadChildren: 1,
      capacidadMinima: 1,
      precio: 150.0,
      images: ["/simple1.jpg"],
    },
    {
      nombre: "Habitación Doble",
      descripcion: "Habitación cómoda para 2 personas con 2 camas individuales",
      capacidadAdults: 2,
      capacidadChildren: 0,
      capacidadMinima: 1,
      precio: 150.0,
      images: ["/doble1.jpg"],
    },
    {
      nombre: "Habitación Matrimonial",
      descripcion: "Habitación cómoda para dos personas con cama matrimonial",
      capacidadAdults: 2,
      capacidadChildren: 1,
      capacidadMinima: 1,
      precio: 220.0,
      images: ["/matrimonial1.jpg"],
    },
    {
      nombre: "Habitación Triple",
      descripcion: "Habitación cómoda para tres personas con 3 camas individuales",
      capacidadAdults: 3,
      capacidadChildren: 1,
      capacidadMinima: 2,
      precio: 275.0,
      images: ["/triple1.jpg"],
    },
    {
      nombre: "Habitación Familiar",
      descripcion: "Habitación cómoda para 3 personas con cama matrimonial + cama individual",
      capacidadAdults: 2,
      capacidadChildren: 1,
      capacidadMinima: 2,
      precio: 250.0,
      images: ["/familiar1.jpg"],
    },
    {
      nombre: "Habitación Suite",
      descripcion: "Habitación cómoda para 2 personas con cama matrimonial king size",
      capacidadAdults: 2,
      capacidadChildren: 1,
      capacidadMinima: 1,
      precio: 250.0,
      images: ["/suite1.jpg"],
    },
    {
      nombre: "Habitación Cuadruple",
      descripcion: "Habitación cómoda para 4 personas con 4 camas individuales",
      capacidadAdults: 4,
      capacidadChildren: 2,
      capacidadMinima: 3,
      precio: 350.0,
      images: ["/cuadruple1.jpg"],
    },
  ]

  const createdTipos = []
  for (const tipo of tiposHabitacion) {
    const created = await prisma.tipoHabitacion.create({
      data: tipo,
    })
    createdTipos.push(created)
  }

  console.log(`✅ Created ${createdTipos.length} tipos de habitación`)
  return createdTipos
}
