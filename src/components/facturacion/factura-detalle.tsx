"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils"
import { EstadoFactura } from "@prisma/client"
import { Building, User, Bed, Receipt, CreditCard } from "lucide-react"

type FacturaWithDetails = {
  id: string
  numeroFactura: string | null
  estado: EstadoFactura
  subtotalBase: number
  subtotalExtras: number | null
  descuento: number | null
  total: number
  fechaEmision: Date
  fechaVencimiento: Date | null
  fichaHospedaje: {
    fechaIngreso: Date
    fechaSalida: Date
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
      }
      piso: {
        numero: number
      }
    }
  }
  consumosExtras: Array<{
    cantidad: number
    precioUnitario: number
    total: number
    producto: {
      nombre: string
      descripcion: string
    }
  }>
  pagos: Array<{
    id: string
    monto: number
    metodo: string
    observacion: string | null
    numeroTransaccion: string | null
    createdAt: Date
  }>
  usuario: {
    name: string
  } | null
}

interface FacturaDetalleProps {
  factura: FacturaWithDetails
}

export function FacturaDetalle({ factura }: FacturaDetalleProps) {
  const totalPagado = factura.pagos.reduce((sum, pago) => sum + pago.monto, 0)
  const saldoPendiente = factura.total - totalPagado

  const getEstadoColor = (estado: EstadoFactura) => {
    switch (estado) {
      case EstadoFactura.EMITIDA:
        return "bg-green-100 text-green-800"
      case EstadoFactura.PENDIENTE:
        return "bg-yellow-100 text-yellow-800"
      case EstadoFactura.ANULADA:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calcular días de hospedaje
  const fechaIngreso = new Date(factura.fichaHospedaje.fechaIngreso)
  const fechaSalida = new Date(factura.fichaHospedaje.fechaSalida)
  const diasHospedaje = Math.ceil((fechaSalida.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Información Principal */}
      <div className="lg:col-span-2 space-y-6">
        {/* Datos del Huésped */}
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
                <label className="text-sm font-medium text-gray-500">Nombre</label>
                <p className="text-lg font-semibold">{factura.fichaHospedaje.huesped.nombre}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">CI/Documento</label>
                <p className="text-lg">{factura.fichaHospedaje.huesped.ci}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg">{factura.fichaHospedaje.huesped.correo || "No registrado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Teléfono</label>
                <p className="text-lg">{factura.fichaHospedaje.huesped.telefono || "No registrado"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos del Hospedaje */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bed className="w-5 h-5" />
              <span>Información del Hospedaje</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Habitación</label>
                <p className="text-lg font-semibold">
                  {factura.fichaHospedaje.habitacion.numero} - {factura.fichaHospedaje.habitacion.tipoHabitacion.nombre}
                </p>
                <p className="text-sm text-gray-500">Piso {factura.fichaHospedaje.habitacion.piso.numero}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Período</label>
                <p className="text-lg">
                  {diasHospedaje} {diasHospedaje === 1 ? "día" : "días"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Check-in</label>
                <p className="text-lg">{formatDateTime(fechaIngreso)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Check-out</label>
                <p className="text-lg">{formatDateTime(fechaSalida)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalle de Consumos */}
        {factura.consumosExtras.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Consumos Extras</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factura.consumosExtras.map((consumo, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{consumo.producto.nombre}</div>
                          <div className="text-sm text-gray-500">{consumo.producto.descripcion}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{consumo.cantidad}</TableCell>
                      <TableCell className="text-right">{formatCurrency(consumo.precioUnitario)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(consumo.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Historial de Pagos */}
        {factura.pagos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Historial de Pagos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Transacción</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factura.pagos.map((pago) => (
                    <TableRow key={pago.id}>
                      <TableCell>{formatDateTime(new Date(pago.createdAt))}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{pago.metodo}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{pago.numeroTransaccion || "N/A"}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(pago.monto)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resumen de Factura */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Resumen de Factura</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Estado</span>
              <Badge className={getEstadoColor(factura.estado)}>{factura.estado}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Número</span>
              <span className="font-mono">{factura.numeroFactura}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Fecha Emisión</span>
              <span>{formatDate(new Date(factura.fechaEmision))}</span>
            </div>

            {factura.fechaVencimiento && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Vencimiento</span>
                <span>{formatDate(new Date(factura.fechaVencimiento))}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Emitida por</span>
              <span>{factura.usuario?.name || "Sistema"}</span>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal Hospedaje</span>
                <span>{formatCurrency(factura.subtotalBase)}</span>
              </div>

              {factura.subtotalExtras && factura.subtotalExtras > 0 && (
                <div className="flex justify-between">
                  <span>Consumos Extras</span>
                  <span>{formatCurrency(factura.subtotalExtras)}</span>
                </div>
              )}

              {factura.descuento && factura.descuento > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-{formatCurrency(factura.descuento)}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(factura.total)}</span>
            </div>

            <div className="flex justify-between items-center text-green-600">
              <span>Total Pagado</span>
              <span className="font-semibold">{formatCurrency(totalPagado)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Saldo Pendiente</span>
              <span className={`font-semibold ${saldoPendiente > 0 ? "text-red-600" : "text-green-600"}`}>
                {formatCurrency(saldoPendiente)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Información del Hotel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Hotel Perla del Lago</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Av. Principal #123</p>
            <p>Copacabana, La Paz - Bolivia</p>
            <p>Tel: +591 2 862-2266</p>
            <p>Email: info@hotelperladellago.com</p>
            <p>NIT: 1234567890</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
