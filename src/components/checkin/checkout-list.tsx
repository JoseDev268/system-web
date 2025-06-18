"use client"

import { useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { realizarCheckout } from "@/actions/checkin-actions"
import { formatDate, formatDateTime } from "@/lib/utils"
import { LogOut, Receipt } from "lucide-react"
import { toast } from "sonner"

type HospedajeActivo = {
  id: string
  fechaIngreso: Date
  fechaSalida: Date
  huesped: {
    nombre: string
    ci: string
    telefono: string | null
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

interface CheckoutListProps {
  hospedajes: HospedajeActivo[]
}

export function CheckoutList({ hospedajes }: CheckoutListProps) {
  const [isPending, startTransition] = useTransition()

  const handleCheckout = (hospedajeId: string) => {
    startTransition(async () => {
      const result = await realizarCheckout(hospedajeId)
      if (result.success) {
        toast.success("Check-out realizado correctamente")
      } else {
        toast.error(result.error || "Error al realizar el check-out")
      }
    })
  }

  const isCheckoutDue = (fechaSalida: Date) => {
    const today = new Date()
    const salida = new Date(fechaSalida)
    return salida <= today
  }

  const getDaysStayed = (fechaIngreso: Date) => {
    const today = new Date()
    const ingreso = new Date(fechaIngreso)
    const diffTime = Math.abs(today.getTime() - ingreso.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LogOut className="w-5 h-5" />
          <span>Hospedajes Activos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hospedajes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay hospedajes activos</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Huésped</TableHead>
                <TableHead>Habitación</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
                <TableHead>Fecha Salida</TableHead>
                <TableHead>Días</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[160px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hospedajes.map((hospedaje) => {
                const checkoutDue = isCheckoutDue(hospedaje.fechaSalida)
                const daysStayed = getDaysStayed(hospedaje.fechaIngreso)

                return (
                  <TableRow key={hospedaje.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{hospedaje.huesped.nombre}</div>
                        <div className="text-sm text-gray-500">{hospedaje.huesped.ci}</div>
                        {hospedaje.huesped.telefono && (
                          <div className="text-sm text-gray-500">{hospedaje.huesped.telefono}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">Hab. {hospedaje.habitacion.numero}</div>
                        <div className="text-sm text-gray-500">
                          {hospedaje.habitacion.tipoHabitacion.nombre} - Piso {hospedaje.habitacion.piso.numero}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(new Date(hospedaje.fechaIngreso))}</div>
                        <div className="text-gray-500">{formatDateTime(new Date(hospedaje.fechaIngreso))}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(new Date(hospedaje.fechaSalida))}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{daysStayed} días</Badge>
                    </TableCell>
                    <TableCell>
                      {checkoutDue ? (
                        <Badge className="bg-red-100 text-red-800">Vencido</Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800">Activo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Receipt className="w-4 h-4 mr-1" />
                          Facturar
                        </Button>
                        <Button size="sm" onClick={() => handleCheckout(hospedaje.id)} disabled={isPending}>
                          Check-out
                        </Button>
                      </div>
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
