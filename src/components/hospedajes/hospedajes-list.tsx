"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateHospedaje } from "@/actions/hospedaje-actions"
import { crearFacturaManual } from "@/actions/factura-actions"
import { formatCurrency, formatDate } from "@/lib/utils"
import { EstadoHospedaje } from "@prisma/client"
import { MoreVertical, Eye, Receipt, LogOut, Search } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

type HospedajeWithDetails = {
  id: string
  fechaIngreso: Date
  fechaSalida: Date
  estado: EstadoHospedaje
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
  consumosExtras?: Array<{
    total: number
  }>
  factura?: {
    id: string
    numeroFactura: string | null
    total: number
    estado: string
  } | null
}

interface HospedajesListProps {
  hospedajes: HospedajeWithDetails[]
}

export function HospedajesList({ hospedajes }: HospedajesListProps) {
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState<string>("todos")

  const handleFinalizar = (id: string) => {
    startTransition(async () => {
      const result = await updateHospedaje(id, {
        estado: EstadoHospedaje.FINALIZADO,
        fechaSalida: new Date(),
      })
      if (result.success) {
        toast.success("Hospedaje finalizado correctamente")
        window.location.reload()
      } else {
        toast.error(result.error || "Error al finalizar el hospedaje")
      }
    })
  }

  const handleGenerarFactura = (id: string) => {
    startTransition(async () => {
      const result = await crearFacturaManual({
        fichaHospedajeId: id,
        consumosExtras: [],
      })
      if (result.success) {
        toast.success("Factura generada correctamente")
        window.location.reload()
      } else {
        toast.error(result.error || "Error al generar la factura")
      }
    })
  }

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

  const calcularTotal = (hospedaje: HospedajeWithDetails) => {
    if (hospedaje.factura) {
      return hospedaje.factura.total
    }
    // Calcular total estimado
    const dias = Math.ceil(
      (new Date(hospedaje.fechaSalida).getTime() - new Date(hospedaje.fechaIngreso).getTime()) / (1000 * 60 * 60 * 24),
    )
    const subtotalHospedaje = hospedaje.habitacion.tipoHabitacion.precio * dias
    const totalConsumos = hospedaje.consumosExtras?.reduce((sum, c) => sum + c.total, 0) || 0
    return subtotalHospedaje + totalConsumos
  }

  // Filtrar hospedajes
  const hospedajesFiltrados = hospedajes.filter((hospedaje) => {
    const matchesSearch =
      hospedaje.huesped.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospedaje.huesped.ci.includes(searchTerm) ||
      hospedaje.habitacion.numero.toString().includes(searchTerm)

    const matchesEstado = estadoFilter === "todos" || hospedaje.estado === estadoFilter

    return matchesSearch && matchesEstado
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lista de Hospedajes</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por huésped, CI o habitación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                {Object.values(EstadoHospedaje).map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Huésped</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Facturación</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hospedajesFiltrados.map((hospedaje) => {
              const total = calcularTotal(hospedaje)
              const dias = Math.ceil(
                (new Date(hospedaje.fechaSalida).getTime() - new Date(hospedaje.fechaIngreso).getTime()) /
                  (1000 * 60 * 60 * 24),
              )

              return (
                <TableRow key={hospedaje.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{hospedaje.huesped.nombre}</div>
                      <div className="text-sm text-gray-500">{hospedaje.huesped.ci}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">Hab. {hospedaje.habitacion.numero}</div>
                      <div className="text-sm text-gray-500">{hospedaje.habitacion.tipoHabitacion.nombre}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(new Date(hospedaje.fechaIngreso))}</div>
                      <div className="text-gray-500">
                        hasta {formatDate(new Date(hospedaje.fechaSalida))} ({dias} días)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(hospedaje.estado)}>{hospedaje.estado}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatCurrency(total)}</div>
                    {!hospedaje.factura && <div className="text-xs text-gray-500">Estimado</div>}
                  </TableCell>
                  <TableCell>
                    {hospedaje.factura ? (
                      <div>
                        <div className="text-sm font-medium">{hospedaje.factura.numeroFactura}</div>
                        <Badge className="bg-green-100 text-green-800 text-xs">{hospedaje.factura.estado}</Badge>
                      </div>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isPending}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/hospedajes/${hospedaje.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Link>
                        </DropdownMenuItem>
                        {hospedaje.factura ? (
                          <DropdownMenuItem asChild>
                            <Link href={`/facturacion/${hospedaje.factura.id}`}>
                              <Receipt className="w-4 h-4 mr-2" />
                              Ver Factura
                            </Link>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleGenerarFactura(hospedaje.id)}>
                            <Receipt className="w-4 h-4 mr-2" />
                            Generar Factura
                          </DropdownMenuItem>
                        )}
                        {hospedaje.estado === EstadoHospedaje.ACTIVO && (
                          <DropdownMenuItem onClick={() => handleFinalizar(hospedaje.id)}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Finalizar
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

        {hospedajesFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron hospedajes que coincidan con los filtros aplicados
          </div>
        )}
      </CardContent>
    </Card>
  )
}
