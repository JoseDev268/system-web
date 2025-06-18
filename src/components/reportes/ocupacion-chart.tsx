"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReporteOcupacion } from "@/lib/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface OcupacionChartProps {
  data: ReporteOcupacion[]
}

export function OcupacionChart({ data }: OcupacionChartProps) {
  const chartData = data.map((item) => ({
    fecha: format(item.fecha, "dd/MM", { locale: es }),
    ocupacion: item.porcentajeOcupacion,
    ingresos: item.ingresosTotales,
    habitacionesOcupadas: item.habitacionesOcupadas,
    totalHabitaciones: item.totalHabitaciones,
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Porcentaje de Ocupación</CardTitle>
          <CardDescription>Ocupación diaria del hotel</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, "Ocupación"]} />
              <Bar dataKey="ocupacion" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingresos Diarios</CardTitle>
          <CardDescription>Ingresos generados por día</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`Bs. ${value.toFixed(2)}`, "Ingresos"]} />
              <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
