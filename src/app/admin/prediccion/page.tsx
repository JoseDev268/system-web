"use client"

import { useState } from "react"
import { CalendarIcon, Plus, Trash2, TrendingUp, AlertTriangle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DataRow {
    id: string
    fecha: string
    ocupacion: string
}

interface Prediccion {
    fecha: string
    prediccion: number
}

export default function OcupacionPredictor() {
    const [fechaObjetivo, setFechaObjetivo] = useState<Date>()
    const [dataRows, setDataRows] = useState<DataRow[]>([{ id: "1", fecha: "", ocupacion: "" }])
    const [predicciones, setPredicciones] = useState<Prediccion[]>([])
    const [advertencia, setAdvertencia] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>("")

    const addRow = () => {
        const newRow: DataRow = {
            id: Date.now().toString(),
            fecha: "",
            ocupacion: "",
        }
        setDataRows([...dataRows, newRow])
    }

    const removeRow = (id: string) => {
        if (dataRows.length > 1) {
            setDataRows(dataRows.filter((row) => row.id !== id))
        }
    }

    const updateRow = (id: string, field: keyof Omit<DataRow, "id">, value: string) => {
        setDataRows(dataRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
    }

    const isFormValid = () => {
        return fechaObjetivo && dataRows.every((row) => row.fecha && row.ocupacion) && dataRows.length > 0
    }

    const handlePrediccion = async () => {
        if (!isFormValid()) return

        setLoading(true)
        setError("")
        setAdvertencia("")
        setPredicciones([])

        try {
            const requestData = {
                fecha_objetivo: format(fechaObjetivo!, "yyyy-MM-dd"),
                datos: dataRows.map((row) => ({
                    fecha: row.fecha,
                    ocupacion: Number.parseFloat(row.ocupacion),
                })),
            }

            const response = await fetch("/api/prediccion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Error en la predicción")
            }

            if (data.prediccion) {
                setPredicciones(data.prediccion)
            }

            if (data.advertencia) {
                setAdvertencia(data.advertencia)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido")
        } finally {
            setLoading(false)
        }
    }

    const chartData = predicciones.map((p) => ({
        fecha: format(new Date(p.fecha), "dd/MM", { locale: es }),
        ocupacion: p.prediccion,
    }))

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-3 bg-blue-600 rounded-xl">
                            <TrendingUp className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">Predicciones de Ocupación</h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Sistema inteligente para predecir tendencias de ocupación basado en datos históricos
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Formulario de entrada */}
                    <div className="xl:col-span-1 space-y-6">
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                                    Configuración de Predicción
                                </CardTitle>
                                <CardDescription>Ingresa la fecha objetivo y los datos históricos de ocupación</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Fecha Objetivo */}
                                <div className="space-y-2">
                                    <Label htmlFor="fecha-objetivo" className="text-sm font-medium">
                                        Fecha Objetivo
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                                disabled={loading}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {fechaObjetivo ? (
                                                    format(fechaObjetivo, "PPP", { locale: es })
                                                ) : (
                                                    <span className="text-muted-foreground">Seleccionar fecha</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={fechaObjetivo}
                                                onSelect={setFechaObjetivo}
                                                initialFocus
                                                locale={es}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <Separator />

                                {/* Datos Históricos */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">Datos Históricos de Ocupación</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addRow}
                                            disabled={loading}
                                            className="h-8"
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Agregar
                                        </Button>
                                    </div>

                                    <div className="space-y-3 max-h-80 overflow-y-auto">
                                        {dataRows.map((row, index) => (
                                            <div key={row.id} className="flex gap-2 items-end">
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-xs text-gray-500">Fecha {index + 1}</Label>
                                                    <Input
                                                        type="date"
                                                        value={row.fecha}
                                                        onChange={(e) => updateRow(row.id, "fecha", e.target.value)}
                                                        disabled={loading}
                                                        className="text-sm"
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-xs text-gray-500">Ocupación</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        value={row.ocupacion}
                                                        onChange={(e) => updateRow(row.id, "ocupacion", e.target.value)}
                                                        disabled={loading}
                                                        className="text-sm"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeRow(row.id)}
                                                    disabled={loading || dataRows.length === 1}
                                                    className="h-9 w-9 p-0 shrink-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Botón de Predicción */}
                                <Button
                                    onClick={handlePrediccion}
                                    disabled={!isFormValid() || loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                                    size="lg"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <TrendingUp className="mr-2 h-4 w-4" />
                                            Generar Predicción
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resultados */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Alertas */}
                        {error && (
                            <Alert variant="destructive" className="border-red-200 bg-red-50">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="font-medium">{error}</AlertDescription>
                            </Alert>
                        )}

                        {advertencia && (
                            <Alert className="border-amber-200 bg-amber-50">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                <AlertDescription className="text-amber-800 font-medium">{advertencia}</AlertDescription>
                            </Alert>
                        )}

                        {/* Gráfico */}
                        {predicciones.length > 0 && (
                            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                                <CardHeader>
                                    <CardTitle className="text-xl">Tendencia de Ocupación</CardTitle>
                                    <CardDescription>Visualización de las predicciones generadas</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={{
                                            ocupacion: {
                                                label: "Ocupación",
                                                color: "hsl(var(--chart-1))",
                                            },
                                        }}
                                        className="h-80"
                                    >
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                                <XAxis dataKey="fecha" className="text-xs" tick={{ fontSize: 12 }} />
                                                <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="ocupacion"
                                                    stroke="rgb(37 99 235)"
                                                    strokeWidth={3}
                                                    dot={{ fill: "rgb(37 99 235)", strokeWidth: 2, r: 4 }}
                                                    activeDot={{ r: 6, stroke: "rgb(37 99 235)", strokeWidth: 2 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tabla de Resultados */}
                        {predicciones.length > 0 && (
                            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                                <CardHeader>
                                    <CardTitle className="text-xl">Resultados Detallados</CardTitle>
                                    <CardDescription>Valores de predicción por fecha</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg border overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50">
                                                    <TableHead className="font-semibold">Fecha</TableHead>
                                                    <TableHead className="font-semibold">Predicción</TableHead>
                                                    <TableHead className="font-semibold">Estado</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {predicciones.map((pred, index) => (
                                                    <TableRow key={index} className="hover:bg-gray-50">
                                                        <TableCell className="font-medium">
                                                            {format(new Date(pred.fecha), "PPP", { locale: es })}
                                                        </TableCell>
                                                        <TableCell className="text-lg font-semibold text-blue-600">
                                                            {pred.prediccion.toFixed(2)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    pred.prediccion > 0.7 ? "default" : pred.prediccion > 0.4 ? "secondary" : "outline"
                                                                }
                                                                className={
                                                                    pred.prediccion > 0.7
                                                                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                                        : pred.prediccion > 0.4
                                                                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                                            : "bg-red-100 text-red-800 hover:bg-red-200"
                                                                }
                                                            >
                                                                {pred.prediccion > 0.7 ? "Alta" : pred.prediccion > 0.4 ? "Media" : "Baja"}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Estado inicial */}
                        {predicciones.length === 0 && !loading && !error && (
                            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                                        <TrendingUp className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Listo para generar predicciones</h3>
                                    <p className="text-gray-600 max-w-md">
                                        Completa el formulario con la fecha objetivo y los datos históricos para comenzar
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
