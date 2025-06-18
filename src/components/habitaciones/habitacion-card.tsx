"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEstadoColor, formatCurrency } from "@/lib/utils"
import { Bed, Users, MapPin } from "lucide-react"
import type { Habitacion, TipoHabitacion, Piso, FichaHospedaje, Huesped } from "@prisma/client"
import { Button } from "../ui/button"

interface HabitacionCardProps {
  habitacion: Habitacion & {
    tipoHabitacion: TipoHabitacion
    piso: Piso
    hospedajes: (FichaHospedaje & {
      huesped: Huesped
    })[]
  }
  onEstadoChange?: (id: string, estado: string) => void
  onSelect?: (habitacion: any) => void
  isSelectable?: boolean
  isSelected?: boolean
}

export function HabitacionCard({
  habitacion,
  onEstadoChange,
  onSelect,
  isSelectable = false,
  isSelected = false,
}: HabitacionCardProps) {
  const huespedActual = habitacion.hospedajes[0]?.huesped

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        isSelectable ? "cursor-pointer hover:border-primary" : ""
      } ${isSelected ? "border-primary bg-primary/5" : ""}`}
      onClick={() => isSelectable && onSelect?.(habitacion)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Habitación {habitacion.numero}</CardTitle>
          <Badge className={getEstadoColor(habitacion.estado)}>{habitacion.estado}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          Piso {habitacion.piso.numero}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="font-medium">{habitacion.tipoHabitacion.nombre}</div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {habitacion.tipoHabitacion.capacidadAdults} adultos
            </div>
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {habitacion.tipoHabitacion.capacidadChildren} niños
            </div>
          </div>
          <div className="font-semibold text-lg">{formatCurrency(habitacion.tipoHabitacion.precio)}/noche</div>
        </div>

        {huespedActual && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="font-medium text-sm">Huésped actual:</div>
            <div className="text-sm">{huespedActual.nombre}</div>
            <div className="text-xs text-muted-foreground">{huespedActual.ci}</div>
          </div>
        )}

        {onEstadoChange && !isSelectable && (
          <div className="flex gap-2 pt-2">
            {habitacion.estado === "OCUPADA" && (
              <Button size="sm" variant="outline" onClick={() => onEstadoChange(habitacion.id, "LIMPIEZA")}>
                Limpieza
              </Button>
            )}
            {habitacion.estado === "LIMPIEZA" && (
              <Button size="sm" variant="outline" onClick={() => onEstadoChange(habitacion.id, "DISPONIBLE")}>
                Disponible
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
