import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { HuespedForm } from "@/components/forms/huesped-form"
import { getHuespedes } from "@/actions/huespedes"
import { formatDate } from "@/lib/utils"
import { Search, Users, Phone, Mail, MapPin } from "lucide-react"

export default async function HuespedesPage() {
  const huespedes = await getHuespedes()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Huéspedes</h1>
          <p className="text-muted-foreground">Administra la información de los huéspedes</p>
        </div>
        <HuespedForm />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Huéspedes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{huespedes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{huespedes.filter((h) => h.correo).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Teléfono</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{huespedes.filter((h) => h.telefono).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Extranjeros</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {huespedes.filter((h) => h.nacionalidad && h.nacionalidad !== "BOLIVIA").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Buscar por nombre, CI o email..." className="pl-10" />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>CI</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Nacionalidad</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {huespedes.map((huesped) => (
                <TableRow key={huesped.id}>
                  <TableCell className="font-medium">{huesped.nombre}</TableCell>
                  <TableCell>{huesped.ci}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {huesped.correo && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {huesped.correo}
                        </div>
                      )}
                      {huesped.telefono && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {huesped.telefono}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {huesped.nacionalidad && <Badge variant="outline">{huesped.nacionalidad}</Badge>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(huesped.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <HuespedForm huesped={huesped} />
                      <Button variant="ghost" size="sm">
                        Ver Historial
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
