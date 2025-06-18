"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { EstadoHospedaje } from "@prisma/client"
import { Bed, Users, TrendingUp, Clock } from "lucide-react"

type HospedajeWithDetails = {
  id: string
  estado: EstadoHospedaje
  fechaIngreso: Date
  fechaSalida: Date
  habitacion: {
    tipoHabitacion: {
      precio: number
    }
  }
  consumosExtras?: Array<{
    total: number
  }>
  factura?: {
    total: number
  } | null
}

interface HospedajesStatsProps {
  hospedajes: HospedajeWithDetails[]
}

export function HospedajesStats({ hospedajes }: HospedajesStatsProps) {
  const stats = {
    totalHospedajes: hospedajes.length,
    hospedajesActivos: hospedajes.filter((h) => h.estado === EstadoHospedaje.ACTIVO).length,
    hospedajesFinalizados: hospedajes.filter((h) => h.estado === EstadoHospedaje.FINALIZADO).length,
    sinFactura: hospedajes.filter((h) => !h.factura).length,
    ingresosTotales: hospedajes.reduce((sum, h) => {
      if (h.factura) {
        return sum + h.factura.total
      }
      // Calcular ingreso estimado para hospedajes sin factura
      const dias = Math.ceil(
        (new Date(h.fechaSalida).getTime() - new Date(h.fechaIngreso).getTime()) / (1000 * 60 * 60 * 24),
      )
      const subtotalHospedaje = h.habitacion.tipoHabitacion.precio * dias
      const totalConsumos = h.consumosExtras?.reduce((cSum, c) => cSum + c.total, 0) || 0
      return sum + subtotalHospedaje + totalConsumos
    }, 0),
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Hospedajes</CardTitle>
          <Bed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalHospedajes}</div>
          <p className="text-xs text-muted-foreground">{stats.hospedajesActivos} activos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hospedajes Activos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.hospedajesActivos}</div>
          <p className="text-xs text-muted-foreground">En curso actualmente</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.ingresosTotales)}</div>
          <p className="text-xs text-muted-foreground">Facturados + estimados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendientes Facturación</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.sinFactura}</div>
          <p className="text-xs text-muted-foreground">Sin factura emitida</p>
        </CardContent>
      </Card>
    </div>
  )
}
