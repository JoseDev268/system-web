"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConsumoExtraDialog } from "./consumo-extra-dialog"
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils"
import { EstadoHospedaje } from "@prisma/client"
import { User, Bed, Calendar, Receipt, ShoppingCart, Clock, MapPin } from "lucide-react"

type HospedajeWithDetails = {
  id: string
  fechaIngreso: Date
  fechaSalida: Date
  estado: EstadoHospedaje
  createdAt: Date
  huesped: {
    nombre: string
    ci: string
    correo: string | null
    telefono: string | null
    nacionalidad: string | null
  }
  habitacion: {
    numero: number
    tipoHabitacion: {
      nombre: string
      precio: number
      descripcion: string
      amenidades: string[]
    }
    piso: {
      numero: number
      nombre: string
    }
  }
  consumosExtras?: Array<{
    id: string
    cantidad: number
    precioUnitario: number
    total: number
    createdAt: Date
    producto: {
      nombre: string
      descripcion: string
    }
  }>
  factura?: {
    id: string
    numeroFactura: string | null
    total: number
    estado: string
    fechaEmision: Date
  } | null
}

type Producto = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
}

interface CheckinDetalleProps {
  hospedaje: HospedajeWithDetails
  productos: Producto[]
}

export function CheckinDetalle({ hospedaje, productos }: CheckinDetalleProps) {
  const [showConsumoDialog, setShowConsumoDialog] = useState(false)

  const getEstadoColor = (estado: EstadoHospedaje) => {
    switch (estado) {
      case EstadoHospedaje.ACTIVO:
        return "bg-green-100 text-green-800"
      case EstadoHospedaje.FINALIZADO:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  // Calcular días de hospedaje
  const fechaIngreso = new Date(hospedaje.fechaIngreso)
  const fechaSalida = new Date(hospedaje.fechaSalida)
  const diasHospedaje = Math.ceil((fechaSalida.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24))
  const diasTranscurridos = Math.ceil((new Date().getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24))

  // Calcular totales
  const subtotalHospedaje = hospedaje.habitacion.tipoHabitacion.precio * diasHospedaje
  const totalConsumos = hospedaje.consumosExtras?.reduce((sum, consumo) => sum + consumo.total, 0) || 0
  const totalEstimado = subtotalHospedaje + totalConsumos

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Información Principal */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="consumos">Consumos</TabsTrigger>
            <TabsTrigger value="facturacion">Facturación</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            {/* Información del Huésped */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Información del Huésped</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                    <p className="text-lg font-semibold">{hospedaje.huesped.nombre}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">CI/Documento</label>
                    <p className="text-lg">{hospedaje.huesped.ci}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg">{hospedaje.huesped.correo || "No registrado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="text-lg">{hospedaje.huesped.telefono || "No registrado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nacionalidad</label>
                    <p className="text-lg">{hospedaje.huesped.nacionalidad || "No especificada"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de la Habitación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bed className="w-5 h-5" />
                  <span>Información de la Habitación</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Habitación</label>
                    <p className="text-lg font-semibold">{hospedaje.habitacion.numero}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tipo</label>
                    <p className="text-lg">{hospedaje.habitacion.tipoHabitacion.nombre}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ubicación</label>
                    <p className="text-lg flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hospedaje.habitacion.piso.nombre}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Precio por Noche</label>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(hospedaje.habitacion.tipoHabitacion.precio)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Descripción</label>
                  <p className="text-sm text-gray-700">{hospedaje.habitacion.tipoHabitacion.descripcion}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Amenidades</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {hospedaje.habitacion.tipoHabitacion.amenidades.map((amenidad, index) => (
                      <Badge key={index} variant="outline">
                        {amenidad}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consumos" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Consumos Extras</span>
                  </CardTitle>
                  {hospedaje.estado === EstadoHospedaje.ACTIVO && (
                    <ConsumoExtraDialog
                      hospedajeId={hospedaje.id}
                      productos={productos}
                      onSuccess={() => window.location.reload()}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!hospedaje.consumosExtras || hospedaje.consumosExtras.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay consumos registrados</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead className="text-right">Precio Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hospedaje.consumosExtras.map((consumo) => (
                        <TableRow key={consumo.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{consumo.producto.nombre}</div>
                              <div className="text-sm text-gray-500">{consumo.producto.descripcion}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{consumo.cantidad}</TableCell>
                          <TableCell className="text-right">{formatCurrency(consumo.precioUnitario)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(consumo.total)}</TableCell>
                          <TableCell>{formatDateTime(new Date(consumo.createdAt))}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-medium">
                        <TableCell colSpan={3}>Total Consumos</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalConsumos)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facturacion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5" />
                  <span>Estado de Facturación</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hospedaje.factura ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">Factura Generada</p>
                        <p className="text-sm text-green-600">
                          {hospedaje.factura.numeroFactura} - {formatDate(new Date(hospedaje.factura.fechaEmision))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-800">{formatCurrency(hospedaje.factura.total)}</p>
                        <Badge className="bg-green-100 text-green-800">{hospedaje.factura.estado}</Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="font-medium text-yellow-800">Factura Pendiente</p>
                      <p className="text-sm text-yellow-600">No se ha generado factura para este hospedaje</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal Hospedaje ({diasHospedaje} días)</span>
                        <span>{formatCurrency(subtotalHospedaje)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consumos Extras</span>
                        <span>{formatCurrency(totalConsumos)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total Estimado</span>
                        <span>{formatCurrency(totalEstimado)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Historial del Hospedaje</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Check-in realizado</p>
                      <p className="text-sm text-gray-500">{formatDateTime(new Date(hospedaje.createdAt))}</p>
                    </div>
                  </div>

                  {hospedaje.consumosExtras?.map((consumo) => (
                    <div key={consumo.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Consumo agregado: {consumo.producto.nombre}</p>
                        <p className="text-sm text-gray-500">
                          {consumo.cantidad}x {formatCurrency(consumo.precioUnitario)} = {formatCurrency(consumo.total)}
                        </p>
                        <p className="text-sm text-gray-500">{formatDateTime(new Date(consumo.createdAt))}</p>
                      </div>
                    </div>
                  ))}

                  {hospedaje.factura && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Factura generada</p>
                        <p className="text-sm text-gray-500">
                          {hospedaje.factura.numeroFactura} - {formatCurrency(hospedaje.factura.total)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(new Date(hospedaje.factura.fechaEmision))}
                        </p>
                      </div>
                    </div>
                  )}

                  {hospedaje.estado === EstadoHospedaje.FINALIZADO && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Check-out realizado</p>
                        <p className="text-sm text-gray-500">{formatDateTime(fechaSalida)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Panel Lateral - Resumen */}
      <div className="space-y-6">
        {/* Estado del Hospedaje */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del Hospedaje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Estado</span>
              <Badge className={getEstadoColor(hospedaje.estado)}>{hospedaje.estado}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Check-in</span>
              <span>{formatDateTime(fechaIngreso)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Check-out</span>
              <span>{formatDateTime(fechaSalida)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Duración</span>
              <span>{diasHospedaje} días</span>
            </div>

            {hospedaje.estado === EstadoHospedaje.ACTIVO && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Días transcurridos</span>
                <span>{diasTranscurridos} días</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumen Financiero */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Resumen Financiero</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Hospedaje ({diasHospedaje} días)</span>
              <span>{formatCurrency(subtotalHospedaje)}</span>
            </div>

            <div className="flex justify-between">
              <span>Consumos Extras</span>
              <span>{formatCurrency(totalConsumos)}</span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(totalEstimado)}</span>
              </div>
            </div>

            {hospedaje.factura && (
              <div className="text-center pt-2">
                <Badge className="bg-green-100 text-green-800">Facturado</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
