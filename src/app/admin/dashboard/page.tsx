import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, Bed, DollarSign } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"

async function getDashboardStats() {
  const [
    totalHabitaciones,
    habitacionesOcupadas,
    reservasPendientes,
    huespedesTotales,
    ingresosMes,
    mensajesPendientes,
  ] = await Promise.all([
    prisma.habitacion.count({ where: { deletedAt: null } }),
    prisma.habitacion.count({ where: { estado: "OCUPADA", deletedAt: null } }),
    prisma.reserva.count({ where: { estado: "PENDIENTE", deletedAt: null } }),
    prisma.huesped.count({ where: { deletedAt: null } }),
    prisma.factura.aggregate({
      _sum: { total: true },
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
        estado: "EMITIDA",
      },
    }),
    prisma.mensaje.count({ where: { estado: "PENDIENTE" } }),
  ])

  const ocupacion = totalHabitaciones > 0 ? (habitacionesOcupadas / totalHabitaciones) * 100 : 0

  return {
    totalHabitaciones,
    habitacionesOcupadas,
    reservasPendientes,
    huespedesTotales,
    ingresosMes: ingresosMes._sum.total || 0,
    mensajesPendientes,
    ocupacion,
  }
}

async function getRecentActivity() {
  const [recentReservas, recentHospedajes] = await Promise.all([
    prisma.reserva.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        huesped: true,
        detalleReservas: {
          include: {
            habitacion: true,
          },
        },
      },
    }),
    prisma.fichaHospedaje.findMany({
      take: 5,
      where: { estado: "ACTIVO" },
      orderBy: { createdAt: "desc" },
      include: {
        huesped: true,
        habitacion: true,
      },
    }),
  ])

  return { recentReservas, recentHospedajes }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const { recentReservas, recentHospedajes } = await getRecentActivity()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del hotel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ocupacion.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.habitacionesOcupadas} de {stats.totalHabitaciones} habitaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendientes</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reservasPendientes}</div>
            <p className="text-xs text-muted-foreground">Requieren confirmación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Huéspedes Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.huespedesTotales}</div>
            <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.ingresosMes)}</div>
            <p className="text-xs text-muted-foreground">Facturas emitidas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Reservas Recientes</CardTitle>
            <CardDescription>Últimas reservas realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservas.map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{reserva.huesped.nombre}</p>
                    <p className="text-xs text-muted-foreground">{reserva.detalleReservas.length} habitación(es)</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        reserva.estado === "PENDIENTE"
                          ? "bg-yellow-100 text-yellow-800"
                          : reserva.estado === "CONFIRMADA"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {reserva.estado}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Hospedajes */}
        <Card>
          <CardHeader>
            <CardTitle>Hospedajes Activos</CardTitle>
            <CardDescription>Huéspedes actualmente en el hotel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentHospedajes.map((hospedaje) => (
                <div key={hospedaje.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{hospedaje.huesped.nombre}</p>
                    <p className="text-xs text-muted-foreground">Habitación {hospedaje.habitacion.numero}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Hasta {hospedaje.fechaSalida.toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
