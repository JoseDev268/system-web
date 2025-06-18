import type { PrismaClient } from "@prisma/client"

export async function seedProductos(prisma: PrismaClient) {
  const productos = [
    // Bebidas
    {
      nombre: "Agua Mineral 500ml",
      descripcion: "Agua mineral natural embotellada",
      precio: 8.0,
      stock: 100,
      
    },
    {
      nombre: "Coca Cola 350ml",
      descripcion: "Refresco de cola en lata",
      precio: 12.0,
      stock: 80,
      
    },
    {
      nombre: "Cerveza Nacional 330ml",
      descripcion: "Cerveza nacional en botella",
      precio: 18.0,
      stock: 60,
      
    },
    {
      nombre: "Jugo de Naranja Natural",
      descripcion: "Jugo de naranja recién exprimido",
      precio: 15.0,
      stock: 30,
      
    },
    {
      nombre: "Vino Tinto Reserva",
      descripcion: "Vino tinto de reserva nacional",
      precio: 120.0,
      stock: 20,
      
    },

    // Snacks
    {
      nombre: "Papas Fritas Artesanales",
      descripcion: "Papas fritas caseras con sal marina",
      precio: 25.0,
      stock: 40,
      
    },
    {
      nombre: "Mix de Frutos Secos",
      descripcion: "Mezcla de nueces, almendras y pasas",
      precio: 35.0,
      stock: 25,
      
    },
    {
      nombre: "Chocolate Artesanal",
      descripcion: "Chocolate boliviano artesanal 70% cacao",
      precio: 45.0,
      stock: 30,
      
    },
    {
      nombre: "Galletas de Avena",
      descripcion: "Galletas caseras de avena y miel",
      precio: 20.0,
      stock: 35,
      
    },

    // Servicios
    {
      nombre: "Lavandería Express",
      descripcion: "Servicio de lavandería en 24 horas",
      precio: 50.0,
      stock: 999,
      
    },
    {
      nombre: "Servicio de Habitaciones",
      descripcion: "Servicio de comida a la habitación",
      precio: 15.0,
      stock: 999,
      
    },
    {
      nombre: "Masaje Relajante 60min",
      descripcion: "Masaje relajante de cuerpo completo",
      precio: 200.0,
      stock: 999,
      
    },
    {
      nombre: "Transporte al Aeropuerto",
      descripcion: "Servicio de transporte privado al aeropuerto",
      precio: 80.0,
      stock: 999,
      
    },
    {
      nombre: "Tour Ciudad Histórica",
      descripcion: "Tour guiado por el centro histórico de la ciudad",
      precio: 150.0,
      stock: 999,
      
    },

    // Amenidades
    {
      nombre: "Kit de Amenidades Premium",
      descripcion: "Kit completo de amenidades de baño",
      precio: 40.0,
      stock: 50,
      
    },
    {
      nombre: "Bata de Baño",
      descripcion: "Bata de baño de algodón 100%",
      precio: 80.0,
      stock: 30,
      
    },
    {
      nombre: "Pantuflas de Hotel",
      descripcion: "Pantuflas desechables de hotel",
      precio: 25.0,
      stock: 100,
      
    },
    {
      nombre: "Almohada Extra",
      descripcion: "Almohada adicional hipoalergénica",
      precio: 30.0,
      stock: 40,
      
    },
    {
      nombre: "Manta Adicional",
      descripcion: "Manta extra de algodón suave",
      precio: 45.0,
      stock: 25,
      
    },
  ]

  const createdProductos = []
  for (const producto of productos) {
    const created = await prisma.producto.create({
      data: producto,
    })
    createdProductos.push(created)
  }

  console.log(`✅ Created ${createdProductos.length} productos`)
  return createdProductos
}
