"use client"

import { useState } from "react"
import { HabitacionCard } from "./habitacion-card"
import { updateEstadoHabitacion } from "@/actions/habitaciones"
import { toast } from "sonner"
import type { Habitacion, TipoHabitacion, Piso, FichaHospedaje, Huesped } from "@prisma/client"

interface HabitacionesGridProps {
  habitaciones: (Habitacion & {
    tipoHabitacion: TipoHabitacion
    piso: Piso
    hospedajes: (FichaHospedaje & {
      huesped: Huesped
    })[]
  })[]
  isSelectable?: boolean
  selectedHabitaciones?: string[]
  onSelectionChange?: (selected: string[]) => void
}

export function HabitacionesGrid({
  habitaciones,
  isSelectable = false,
  selectedHabitaciones = [],
  onSelectionChange,
}: HabitacionesGridProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleEstadoChange = async (id: string, estado: string) => {
    setLoading(id)
    try {
      const result = await updateEstadoHabitacion(id, estado as any)
      if (result.success) {
        toast.success("Estado actualizado correctamente")
      } else {
        toast.error(result.error || "Error al actualizar el estado")
      }
    } catch (error) {
      toast.error("Error al actualizar el estado")
    } finally {
      setLoading(null)
    }
  }

  const handleSelect = (habitacion: any) => {
    if (!isSelectable || !onSelectionChange) return

    const isSelected = selectedHabitaciones.includes(habitacion.id)
    if (isSelected) {
      onSelectionChange(selectedHabitaciones.filter((id) => id !== habitacion.id))
    } else {
      onSelectionChange([...selectedHabitaciones, habitacion.id])
    }
  }

  // Agrupar por piso
  const habitacionesPorPiso = habitaciones.reduce(
    (acc, habitacion) => {
      const pisoNumero = habitacion.piso.numero
      if (!acc[pisoNumero]) {
        acc[pisoNumero] = []
      }
      acc[pisoNumero].push(habitacion)
      return acc
    },
    {} as Record<number, typeof habitaciones>,
  )

  return (
    <div className="space-y-8">
      {Object.entries(habitacionesPorPiso)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([pisoNumero, habitacionesPiso]) => (
          <div key={pisoNumero} className="space-y-4">
            <h3 className="text-lg font-semibold">Piso {pisoNumero}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {habitacionesPiso.map((habitacion) => (
                <HabitacionCard
                  key={habitacion.id}
                  habitacion={habitacion}
                  onEstadoChange={loading === habitacion.id ? undefined : handleEstadoChange}
                  onSelect={handleSelect}
                  isSelectable={isSelectable}
                  isSelected={selectedHabitaciones.includes(habitacion.id)}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
