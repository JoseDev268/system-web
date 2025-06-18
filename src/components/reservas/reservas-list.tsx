"use client"

import { useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { confirmarReserva, cancelarReserva } from "@/actions/reserva-actions"
import { formatDate, formatCurrency } from "@/lib/utils"
import { EstadoReserva } from "@prisma/client"
import { MoreVertical, Check, X, Eye } from "lucide-react"
import { toast } from "sonner"

type ReservaWithDetails = {
  id: string
  estado: EstadoReserva
  fechaIngreso: Date
  fechaSalida: Date
  huesped: {
    nombre: string
    ci: string
  }
  detalleReservas: Array<{
    precio: number
    habitacion: {
      numero: number
      tipoHabitacion: {
        nombre: string
      }
    }
  }>
}

interface ReservasListProps {
  reservas: ReservaWithDetails[]
}

export function ReservasList({ reservas }: ReservasListProps) {
  const [isPending, startTransition] = useTransition()

  const handleConfirmar = (id: string) => {
    startTransition(async () => {
      const result = await confirmarReserva(id)
      if (result.success) {
        toast.success("Reserva confirmada correctamente")
      } else {
        toast.error(result.error || "Error al confirmar la reserva")
      }
    })
  }

  const handleCancelar = (id: string) => {
    startTransition(async () => {
      const result = await cancelarReserva(id)
      if (result.success) {
        toast.success("Reserva cancelada correctamente")
      } else {
        toast.error(result.error || "Error al cancelar la reserva")
      }
    })
  }

  const getEstadoColor = (estado: EstadoReserva) => {
    switch (estado) {
      case EstadoReserva.CONFIRMADA:
        return "bg-green-100 text-green-800"
      case EstadoReserva.PENDIENTE:
        return "bg-yellow-100 text-yellow-800"
      case EstadoReserva.CANCELADA:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Reservas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Huésped</TableHead>
              <TableHead>Habitaciones</TableHead>
              <TableHead>Fechas</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservas.map((reserva) => {
              const total = reserva.detalleReservas.reduce((sum, detalle) => sum + detalle.precio, 0)

              return (
                <TableRow key={reserva.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{reserva.huesped.nombre}</div>
                      <div className="text-sm text-gray-500">{reserva.huesped.ci}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {reserva.detalleReservas.map((detalle, index) => (
                        <div key={index} className="text-sm">
                          Hab. {detalle.habitacion.numero} - {detalle.habitacion.tipoHabitacion.nombre}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(new Date(reserva.fechaIngreso))}</div>
                      <div className="text-gray-500">hasta {formatDate(new Date(reserva.fechaSalida))}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(total)}</TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(reserva.estado)}>{reserva.estado}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isPending}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        {reserva.estado === EstadoReserva.PENDIENTE && (
                          <>
                            <DropdownMenuItem onClick={() => handleConfirmar(reserva.id)}>
                              <Check className="w-4 h-4 mr-2" />
                              Confirmar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCancelar(reserva.id)}>
                              <X className="w-4 h-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                          </>
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
  )
}
