import { HabitacionesGrid } from "@/components/habitaciones/habitaciones-grid"
import { getHabitaciones } from "@/actions/habitaciones"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function HabitacionesPage() {
  const habitaciones = await getHabitaciones()

  // Estadísticas
  const stats = {
    total: habitaciones.length,
    disponibles: habitaciones.filter((h) => h.estado === "DISPONIBLE").length,
    ocupadas: habitaciones.filter((h) => h.estado === "OCUPADA").length,
    limpieza: habitaciones.filter((h) => h.estado === "LIMPIEZA").length,
    reservadas: habitaciones.filter((h) => h.estado === "RESERVADA").length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Habitaciones</h1>
        <p className="text-muted-foreground">Administra el estado y disponibilidad de las habitaciones</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.disponibles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ocupadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.ocupadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Limpieza</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.limpieza}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reservadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.reservadas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Habitaciones Grid */}
      <HabitacionesGrid habitaciones={habitaciones} />
    </div>
  )
}
