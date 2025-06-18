"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PagoDialog } from "./pago-dialog"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { EstadoFactura } from "@prisma/client"
import { MoreVertical, Eye, CreditCard, Download } from "lucide-react"
import Link from "next/link"

type FacturaWithDetails = {
  id: string
  numeroFactura: string | null
  total: number
  subtotalBase: number
  subtotalExtras: number | null
  estado: EstadoFactura
  fechaEmision: Date
  fichaHospedaje: {
    huesped: {
      nombre: string
      ci: string
    }
    habitacion: {
      numero: number
      tipoHabitacion: {
        nombre: string
      }
    }
  }
  pagos: Array<{
    id: string
    monto: number
    metodo: string
    createdAt: Date
  }>
}

interface FacturasListProps {
  facturas: FacturaWithDetails[]
}

export function FacturasList({ facturas }: FacturasListProps) {
  const [selectedFactura, setSelectedFactura] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const getTotalPagado = (factura: FacturaWithDetails) => {
    return factura.pagos.reduce((sum, pago) => sum + pago.monto, 0)
  }

  const getSaldoPendiente = (factura: FacturaWithDetails) => {
    return factura.total - getTotalPagado(factura)
  }

  const getEstadoPago = (factura: FacturaWithDetails) => {
    const saldo = getSaldoPendiente(factura)
    if (saldo <= 0) return { label: "Pagado", color: "bg-green-100 text-green-800" }
    if (getTotalPagado(factura) > 0) return { label: "Parcial", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Pendiente", color: "bg-red-100 text-red-800" }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Huésped</TableHead>
                <TableHead>Habitación</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pagado</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturas.map((factura) => {
                const totalPagado = getTotalPagado(factura)
                const saldoPendiente = getSaldoPendiente(factura)
                const estadoPago = getEstadoPago(factura)

                return (
                  <TableRow key={factura.id}>
                    <TableCell>
                      <div className="font-medium">{factura.numeroFactura || "Sin número"}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{factura.fichaHospedaje.huesped.nombre}</div>
                        <div className="text-sm text-gray-500">{factura.fichaHospedaje.huesped.ci}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>Hab. {factura.fichaHospedaje.habitacion.numero}</div>
                        <div className="text-sm text-gray-500">
                          {factura.fichaHospedaje.habitacion.tipoHabitacion.nombre}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(factura.total)}</TableCell>
                    <TableCell>{formatCurrency(totalPagado)}</TableCell>
                    <TableCell>
                      <span className={saldoPendiente > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                        {formatCurrency(saldoPendiente)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={estadoPago.color}>{estadoPago.label}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(new Date(factura.fechaEmision))}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link
                            href={`/admin/facturacion/${factura.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Descargar PDF
                          </DropdownMenuItem>
                          {saldoPendiente > 0 && (
                            <DropdownMenuItem onClick={() => setSelectedFactura(factura.id)}>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Registrar Pago
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedFactura && (
        <PagoDialog
          facturaId={selectedFactura}
          open={!!selectedFactura}
          onOpenChange={(open) => !open && setSelectedFactura(null)}
        />
      )}
    </>
  )
}
