"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { getReporteIngresos } from "@/actions/reportes-actions"
import { formatCurrency } from "@/lib/utils"
import { DollarSign } from "lucide-react"

export function IngresosChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fechaInicio, setFechaInicio] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return date.toISOString().split("T")[0]
  })
  const [fechaFin, setFechaFin] = useState(() => {
    return new Date().toISOString().split("T")[0]
  })

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const result = await getReporteIngresos(new Date(fechaInicio), new Date(fechaFin))
      if (result.success) {
        const chartData = result.data.ingresosPorDia.map((item) => ({
          fecha: item.fecha.toLocaleDateString("es-BO", { month: "short", day: "numeric" }),
          ingresos: item.ingresos,
          pagos: item.pagos,
        }))
        setData(chartData)
      }
    } catch (error) {
      console.error("Error loading ingresos data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5" />
          <span>Reporte de Ingresos</span>
        </CardTitle>
        <CardDescription>Ingresos y pagos por día</CardDescription>

        <div className="flex items-end space-x-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="fechaInicio">Fecha Inicio</Label>
            <Input id="fechaInicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaFin">Fecha Fin</Label>
            <Input id="fechaFin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </div>
          <Button onClick={cargarDatos} disabled={loading}>
            {loading ? "Cargando..." : "Actualizar"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            ingresos: {
              label: "Ingresos",
              color: "hsl(var(--chart-1))",
            },
            pagos: {
              label: "Pagos",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [formatCurrency(value), ""]}
              />
              <Bar dataKey="ingresos" fill="var(--color-ingresos)" name="Ingresos" />
              <Bar dataKey="pagos" fill="var(--color-pagos)" name="Pagos" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
