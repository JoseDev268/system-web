import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { Package, Plus, Edit, Trash2 } from "lucide-react"

async function getProductos() {
  return await prisma.producto.findMany({
    where: { deletedAt: null },
    include: {
      tipoHabitacion: true,
      consumosExtras: {
        where: { deletedAt: null },
      },
    },
    orderBy: { nombre: "asc" },
  })
}

export default async function ProductosPage() {
  const productos = await getProductos()

  const stats = {
    total: productos.length,
    conStock: productos.filter((p) => p.stock > 0).length,
    sinStock: productos.filter((p) => p.stock === 0).length,
    masVendidos: productos.filter((p) => p.consumosExtras.length > 0).length,
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Productos</h1>
          <p className="text-muted-foreground">Administra el inventario y productos del hotel</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.conStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.sinStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Más Vendidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.masVendidos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Productos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Tipo Habitación</TableHead>
                <TableHead>Ventas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{producto.nombre}</div>
                      <div className="text-sm text-muted-foreground">{producto.descripcion}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{formatCurrency(producto.precio)}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={producto.stock > 0 ? "default" : "destructive"}>{producto.stock} unidades</Badge>
                  </TableCell>
                  <TableCell>
                    {producto.tipoHabitacion ? (
                      <Badge variant="outline">{producto.tipoHabitacion.nombre}</Badge>
                    ) : (
                      <span className="text-muted-foreground">General</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{producto.consumosExtras.length} venta(s)</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={producto.stock > 0 ? "default" : "secondary"}>
                      {producto.stock > 0 ? "Disponible" : "Agotado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
