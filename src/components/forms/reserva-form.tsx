"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { HabitacionesGrid } from "@/components/habitaciones/habitaciones-grid"
import { ReservaSchema } from "@/lib/types"
import { createReserva } from "@/actions/reserva-actions"
import { getHuespedes } from "@/actions/huespedes"
import { getHabitacionesDisponibles } from "@/actions/habitaciones"
import { toast } from "sonner"
import { Plus, Calendar } from "lucide-react"
import type { z } from "zod"
import type { Huesped } from "@prisma/client"

interface ReservaFormProps {
  onSuccess?: () => void
}

export function ReservaForm({ onSuccess }: ReservaFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [huespedes, setHuespedes] = useState<Huesped[]>([])
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState<any[]>([])
  const [selectedHabitaciones, setSelectedHabitaciones] = useState<string[]>([])

  const form = useForm<z.infer<typeof ReservaSchema>>({
    resolver: zodResolver(ReservaSchema),
    defaultValues: {
      huespedId: "",
      fechaIngreso: new Date(),
      fechaSalida: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
      habitacionIds: [],
      desayunoExtras: false,
      parkingExtras: false,
    },
  })

  useEffect(() => {
    if (open) {
      loadHuespedes()
    }
  }, [open])

  useEffect(() => {
    const fechaIngreso = form.watch("fechaIngreso")
    const fechaSalida = form.watch("fechaSalida")

    if (fechaIngreso && fechaSalida && fechaIngreso < fechaSalida) {
      loadHabitacionesDisponibles(fechaIngreso, fechaSalida)
    }
  }, [form.watch("fechaIngreso"), form.watch("fechaSalida")])

  const loadHuespedes = async () => {
    const data = await getHuespedes()
    setHuespedes(data)
  }

  const loadHabitacionesDisponibles = async (fechaIngreso: Date, fechaSalida: Date) => {
    const data = await getHabitacionesDisponibles(fechaIngreso, fechaSalida)
    setHabitacionesDisponibles(data)
  }

  const onSubmit = async (data: z.infer<typeof ReservaSchema>) => {
    if (selectedHabitaciones.length === 0) {
      toast.error("Debe seleccionar al menos una habitación")
      return
    }

    setLoading(true)
    try {
      const result = await createReserva({
        ...data,
        habitacionIds: selectedHabitaciones,
      })

      if (result.success) {
        toast.success("Reserva creada exitosamente")
        setOpen(false)
        form.reset()
        setSelectedHabitaciones([])
        onSuccess?.()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Reserva
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Reserva</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="huespedId">Huésped</Label>
              <Select value={form.watch("huespedId")} onValueChange={(value) => form.setValue("huespedId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un huésped" />
                </SelectTrigger>
                <SelectContent>
                  {huespedes.map((huesped) => (
                    <SelectItem key={huesped.id} value={huesped.id}>
                      {huesped.nombre} - {huesped.ci}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.huespedId && (
                <p className="text-sm text-red-500">{form.formState.errors.huespedId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
              <Input id="fechaIngreso" type="date" {...form.register("fechaIngreso", { valueAsDate: true })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaSalida">Fecha de Salida</Label>
              <Input id="fechaSalida" type="date" {...form.register("fechaSalida", { valueAsDate: true })} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="desayunoExtras"
                  checked={form.watch("desayunoExtras")}
                  onCheckedChange={(checked) => form.setValue("desayunoExtras", !!checked)}
                />
                <Label htmlFor="desayunoExtras">Incluir desayuno</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parkingExtras"
                  checked={form.watch("parkingExtras")}
                  onCheckedChange={(checked) => form.setValue("parkingExtras", !!checked)}
                />
                <Label htmlFor="parkingExtras">Incluir parking</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Habitaciones Disponibles</Label>
              <span className="text-sm text-muted-foreground">{selectedHabitaciones.length} seleccionada(s)</span>
            </div>

            {habitacionesDisponibles.length > 0 ? (
              <HabitacionesGrid
                habitaciones={habitacionesDisponibles}
                isSelectable={true}
                selectedHabitaciones={selectedHabitaciones}
                onSelectionChange={setSelectedHabitaciones}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Seleccione las fechas para ver habitaciones disponibles</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
