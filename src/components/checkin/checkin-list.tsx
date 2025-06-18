"use client"

import { useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { realizarCheckin } from "@/actions/checkin-actions"
import { formatDate, formatDateTime } from "@/lib/utils"
import { LogIn, Clock } from "lucide-react"
import { toast } from "sonner"

type ReservaParaCheckin = {
  id: string
  fechaIngreso: Date
  fechaSalida: Date
  huesped: {
    nombre: string
    ci: string
    telefono: string | null
  }
  detalleReservas: Array<{
    habitacion: {
      numero: number
      tipoHabitacion: {
        nombre: string
      }
      piso: {
        numero: number
      }
    }
  }>
}

interface CheckinListProps {
  reservas: ReservaParaCheckin[]
}

export function CheckinList({ reservas }: CheckinListProps) {
  const [isPending, startTransition] = useTransition()

  const handleCheckin = (reservaId: string) => {
    startTransition(async () => {
      const result = await realizarCheckin(reservaId)
      if (result.success) {
        toast.success("Check-in realizado correctamente")
      } else {
        toast.error(result.error || "Error al realizar el check-in")
      }
    })
  }

  const isCheckinAvailable = (fechaIngreso: Date) => {
    const today = new Date()
    const ingreso = new Date(fechaIngreso)
    return ingreso <= today
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LogIn className="w-5 h-5" />
          <span>Reservas para Check-in</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reservas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay reservas pendientes de check-in</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Huésped</TableHead>
                <TableHead>Habitaciones</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
                <TableHead>Fecha Salida</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[120px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservas.map((reserva) => {
                const canCheckin = isCheckinAvailable(reserva.fechaIngreso)

                return (
                  <TableRow key={reserva.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reserva.huesped.nombre}</div>
                        <div className="text-sm text-gray-500">{reserva.huesped.ci}</div>
                        {reserva.huesped.telefono && (
                          <div className="text-sm text-gray-500">{reserva.huesped.telefono}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {reserva.detalleReservas.map((detalle, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">Hab. {detalle.habitacion.numero}</span>
                            <span className="text-gray-500 ml-2">
                              {detalle.habitacion.tipoHabitacion.nombre} - Piso {detalle.habitacion.piso.numero}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(new Date(reserva.fechaIngreso))}</div>
                        <div className="text-gray-500">{formatDateTime(new Date(reserva.fechaIngreso))}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(new Date(reserva.fechaSalida))}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {canCheckin ? (
                        <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Pendiente</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleCheckin(reserva.id)} disabled={!canCheckin || isPending}>
                        Check-in
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
