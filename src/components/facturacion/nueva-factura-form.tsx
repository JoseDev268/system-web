"use client"

import Link from "next/link"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { crearFacturaManual } from "@/actions/factura-actions"
import { formatCurrency } from "@/lib/utils"
import { Plus, Trash2, Calculator } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type HospedajeSinFactura = {
  id: string
  fechaIngreso: Date
  fechaSalida: Date
  huesped: {
    nombre: string
    ci: string
  }
  habitacion: {
    numero: number
    tipoHabitacion: {
      nombre: string
      precio: number
    }
  }
}

type Producto = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
}

type ConsumoExtra = {
  productoId: string
  cantidad: number
  precioUnitario: number
  total: number
}

interface NuevaFacturaFormProps {
  hospedajes: HospedajeSinFactura[]
  productos: Producto[]
}

export function NuevaFacturaForm({ hospedajes, productos }: NuevaFacturaFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedHospedaje, setSelectedHospedaje] = useState<HospedajeSinFactura | null>(null)
  const [consumosExtras, setConsumosExtras] = useState<ConsumoExtra[]>([])
  const [descuento, setDescuento] = useState(0)
  const [observaciones, setObservaciones] = useState("")

  const hospedajeSeleccionado = hospedajes.find((h) => h.id === selectedHospedaje?.id)

  // Calcular días de hospedaje
  const calcularDias = (hospedaje: HospedajeSinFactura) => {
    const fechaIngreso = new Date(hospedaje.fechaIngreso)
    const fechaSalida = new Date(hospedaje.fechaSalida)
    return Math.ceil((fechaSalida.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24))
  }

  // Calcular subtotales
  const subtotalBase = hospedajeSeleccionado
    ? hospedajeSeleccionado.habitacion.tipoHabitacion.precio * calcularDias(hospedajeSeleccionado)
    : 0

  const subtotalExtras = consumosExtras.reduce((sum, consumo) => sum + consumo.total, 0)
  const subtotalSinDescuento = subtotalBase + subtotalExtras
  const total = subtotalSinDescuento - descuento

  const agregarConsumo = () => {
    setConsumosExtras([
      ...consumosExtras,
      {
        productoId: "",
        cantidad: 1,
        precioUnitario: 0,
        total: 0,
      },
    ])
  }

  const actualizarConsumo = (index: number, field: keyof ConsumoExtra, value: string | number) => {
    const nuevosConsumos = [...consumosExtras]
    nuevosConsumos[index] = { ...nuevosConsumos[index], [field]: value }

    // Si se cambia el producto, actualizar precio
    if (field === "productoId") {
      const producto = productos.find((p) => p.id === value)
      if (producto) {
        nuevosConsumos[index].precioUnitario = producto.precio
        nuevosConsumos[index].total = producto.precio * nuevosConsumos[index].cantidad
      }
    }

    // Si se cambia cantidad o precio, recalcular total
    if (field === "cantidad" || field === "precioUnitario") {
      nuevosConsumos[index].total = nuevosConsumos[index].cantidad * nuevosConsumos[index].precioUnitario
    }

    setConsumosExtras(nuevosConsumos)
  }

  const eliminarConsumo = (index: number) => {
    setConsumosExtras(consumosExtras.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!hospedajeSeleccionado) {
      toast.error("Debe seleccionar un hospedaje")
      return
    }

    startTransition(async () => {
      const result = await crearFacturaManual({
        fichaHospedajeId: hospedajeSeleccionado.id,
        consumosExtras: consumosExtras.filter((c) => c.productoId && c.cantidad > 0),
        descuento,
        observaciones: observaciones || undefined,
      })

      if (result.success) {
        toast.success("Factura creada correctamente")
        router.push(`/facturacion/${result.data?.id}`)
      } else {
        toast.error(result.error || "Error al crear la factura")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selección de Hospedaje */}
      <div className="space-y-2">
        <Label htmlFor="hospedaje">Hospedaje *</Label>
        <Select
          value={selectedHospedaje?.id || ""}
          onValueChange={(value) => {
            const hospedaje = hospedajes.find((h) => h.id === value)
            setSelectedHospedaje(hospedaje || null)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar hospedaje" />
          </SelectTrigger>
          <SelectContent>
            {hospedajes.map((hospedaje) => (
              <SelectItem key={hospedaje.id} value={hospedaje.id}>
                Hab. {hospedaje.habitacion.numero} - {hospedaje.huesped.nombre} ({hospedaje.huesped.ci})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Información del Hospedaje Seleccionado */}
      {hospedajeSeleccionado && (
        <Card>
          <CardHeader>
            <CardTitle>Información del Hospedaje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Huésped</Label>
                <p className="font-semibold">{hospedajeSeleccionado.huesped.nombre}</p>
                <p className="text-sm text-gray-500">{hospedajeSeleccionado.huesped.ci}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Habitación</Label>
                <p className="font-semibold">
                  {hospedajeSeleccionado.habitacion.numero} - {hospedajeSeleccionado.habitacion.tipoHabitacion.nombre}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Período</Label>
                <p className="font-semibold">{calcularDias(hospedajeSeleccionado)} días</p>
                <p className="text-sm text-gray-500">
                  {new Date(hospedajeSeleccionado.fechaIngreso).toLocaleDateString()} -{" "}
                  {new Date(hospedajeSeleccionado.fechaSalida).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Precio por noche</Label>
                <p className="font-semibold">
                  {formatCurrency(hospedajeSeleccionado.habitacion.tipoHabitacion.precio)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consumos Extras */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Consumos Extras</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={agregarConsumo}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Consumo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {consumosExtras.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay consumos extras agregados</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="w-24">Cantidad</TableHead>
                  <TableHead className="w-32">Precio Unit.</TableHead>
                  <TableHead className="w-32">Total</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consumosExtras.map((consumo, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        value={consumo.productoId}
                        onValueChange={(value) => actualizarConsumo(index, "productoId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {productos.map((producto) => (
                            <SelectItem key={producto.id} value={producto.id}>
                              {producto.nombre} - {formatCurrency(producto.precio)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={consumo.cantidad}
                        onChange={(e) => actualizarConsumo(index, "cantidad", Number.parseInt(e.target.value) || 1)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={consumo.precioUnitario}
                        onChange={(e) =>
                          actualizarConsumo(index, "precioUnitario", Number.parseFloat(e.target.value) || 0)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatCurrency(consumo.total)}</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => eliminarConsumo(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Descuento y Observaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="descuento">Descuento</Label>
          <Input
            id="descuento"
            type="number"
            step="0.01"
            min="0"
            max={subtotalSinDescuento}
            value={descuento}
            onChange={(e) => setDescuento(Number.parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Observaciones adicionales..."
            rows={3}
          />
        </div>
      </div>

      {/* Resumen de Totales */}
      {hospedajeSeleccionado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Resumen de Facturación</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal Hospedaje ({calcularDias(hospedajeSeleccionado)} días)</span>
              <span>{formatCurrency(subtotalBase)}</span>
            </div>

            {subtotalExtras > 0 && (
              <div className="flex justify-between">
                <span>Consumos Extras</span>
                <span>{formatCurrency(subtotalExtras)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotalSinDescuento)}</span>
            </div>

            {descuento > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento</span>
                <span>-{formatCurrency(descuento)}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total a Facturar</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/facturacion">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={!hospedajeSeleccionado || isPending}>
          {isPending ? "Creando..." : "Crear Factura"}
        </Button>
      </div>
    </form>
  )
}
