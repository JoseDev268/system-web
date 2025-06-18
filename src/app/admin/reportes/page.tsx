"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OcupacionChart } from "@/components/reportes/ocupacion-chart"
import { getReporteOcupacion, getReporteIngresos } from "@/actions/reportes"
import type { ReporteOcupacion, ReporteIngresos } from "@/lib/types"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Download, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ReportesPage() {
  const [fechaInicio, setFechaInicio] = useState<Date>(subDays(new Date(), 30))
  const [fechaFin, setFechaFin] = useState<Date>(new Date())
  const [reporteOcupacion, setReporteOcupacion] = useState<ReporteOcupacion[]>([])
  const [reporteIngresos, setReporteIngresos] = useState<ReporteIngresos | null>(null)
  const [loading, setLoading] = useState(false)

  const generarReportes = async () => {
    setLoading(true)
    try {
      const [ocupacion, ingresos] = await Promise.all([
        getReporteOcupacion(fechaInicio, fechaFin),
        getReporteIngresos(fechaInicio, fechaFin),
      ])
      setReporteOcupacion(ocupacion)
      setReporteIngresos(ingresos)
    } catch (error) {
      console.error("Error generating reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const setRangoMesActual = () => {
    const inicio = startOfMonth(new Date())
    const fin = endOfMonth(new Date())
    setFechaInicio(inicio)
    setFechaFin(fin)
  }

  const setRangoUltimos30Dias = () => {
    setFechaInicio(subDays(new Date(), 30))
    setFechaFin(new Date())
  }

  const promedioOcupacion =
    reporteOcupacion.length > 0
      ? reporteOcupacion.reduce((sum, item) => sum + item.porcentajeOcupacion, 0) / reporteOcupacion.length
      : 0

  const totalIngresosPeriodo = reporteOcupacion.reduce((sum, item) => sum + item.ingresosTotales, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
        <p className="text-gray-600">Análisis de ocupación, ingresos y rendimiento del hotel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurar Período de Análisis</CardTitle>
          <CardDescription>Selecciona el rango de fechas para generar los reportes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !fechaInicio && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaInicio ? format(fechaInicio, "PPP", { locale: es }) : "Fecha inicio"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaInicio}
                    onSelect={(date) => date && setFechaInicio(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !fechaFin && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaFin ? format(fechaFin, "PPP", { locale: es }) : "Fecha fin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaFin}
                    onSelect={(date) => date && setFechaFin(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={setRangoUltimos30Dias}>
                Últimos 30 días
              </Button>
              <Button variant="outline" onClick={setRangoMesActual}>
                Mes actual
              </Button>
            </div>

            <Button onClick={generarReportes} disabled={loading}>
              {loading ? "Generando..." : "Generar Reportes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {reporteOcupacion.length > 0 && (
        <Tabs defaultValue="ocupacion" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ocupacion">Ocupación</TabsTrigger>
            <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
          </TabsList>

          <TabsContent value="ocupacion" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ocupación Promedio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{promedioOcupacion.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">En el período seleccionado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mejor Día</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.max(...reporteOcupacion.map((r) => r.porcentajeOcupacion)).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Máxima ocupación registrada</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Días con 100%</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reporteOcupacion.filter((r) => r.porcentajeOcupacion === 100).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Días con ocupación completa</p>
                </CardContent>
              </Card>
            </div>

            <OcupacionChart data={reporteOcupacion} />
          </TabsContent>

          <TabsContent value="ingresos" className="space-y-4">
            {reporteIngresos && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos por Hospedaje</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Bs. {reporteIngresos.ingresosPorHospedaje.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos por Extras</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Bs. {reporteIngresos.ingresosPorExtras.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Bs. {reporteIngresos.totalIngresos.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reporteIngresos.totalFacturas}</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="resumen" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Período</CardTitle>
                  <CardDescription>{reporteIngresos?.periodo}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Ocupación promedio:</span>
                    <span className="font-medium">{promedioOcupacion.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de ingresos:</span>
                    <span className="font-medium">Bs. {totalIngresosPeriodo.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Días analizados:</span>
                    <span className="font-medium">{reporteOcupacion.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingreso promedio/día:</span>
                    <span className="font-medium">
                      Bs. {(totalIngresosPeriodo / reporteOcupacion.length).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                  <CardDescription>Exportar y compartir reportes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar a Excel
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar a PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
