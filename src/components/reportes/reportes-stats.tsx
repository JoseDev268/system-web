"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Bed, Users, TrendingUp, AlertTriangle } from "lucide-react"

interface EstadisticasGenerales {
  totalHabitaciones: number
  habitacionesOcupadas: number
  hospedajesActivos: number
  reservasPendientes: number
  facturasPendientes: number
  ingresosMes: number
  ocupacionPorcentaje: number
}

interface ReportesStatsProps {
  estadisticas: EstadisticasGenerales
}

export function ReportesStats({ estadisticas }: ReportesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ocupación Actual</CardTitle>
          <Bed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.ocupacionPorcentaje.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {estadisticas.habitacionesOcupadas} de {estadisticas.totalHabitaciones} habitaciones
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Huéspedes Activos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.hospedajesActivos}</div>
          <p className="text-xs text-muted-foreground">Hospedajes en curso</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(estadisticas.ingresosMes)}</div>
          <p className="text-xs text-muted-foreground">Facturación mensual</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.reservasPendientes + estadisticas.facturasPendientes}</div>
          <p className="text-xs text-muted-foreground">
            {estadisticas.reservasPendientes} reservas, {estadisticas.facturasPendientes} facturas
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
