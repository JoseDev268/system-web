"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getHabitaciones } from "@/actions/habitacion-actions"
import { EstadoHabitacion } from "@prisma/client"
import { toast } from "sonner"
import { useEffect } from "react"
import { createReserva } from "@/actions/reserva-actions"

type Huesped = {
  id: string
  nombre: string
  ci: string
}

interface NuevaReservaDialogProps {
  children: React.ReactNode
  huespedes: Huesped[]
}

export function NuevaReservaDialog({ children, huespedes }: NuevaReservaDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [habitaciones, setHabitaciones] = useState<any[]>([])
  const [formData, setFormData] = useState({
    huespedId: "",
    fechaIngreso: "",
    fechaSalida: "",
    habitacionId: "",
    precio: 0,
  })

  useEffect(() => {
    if (open) {
      getHabitaciones().then((result) => {
        if (result.success) {
          const disponibles = result.data.filter((h) => h.estado === EstadoHabitacion.DISPONIBLE)
          setHabitaciones(disponibles)
        }
      })
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.huespedId || !formData.fechaIngreso || !formData.fechaSalida || !formData.habitacionId) {
      toast.error("Por favor complete todos los campos")
      return
    }

    startTransition(async () => {
      const result = await createReserva({
        huespedId: formData.huespedId,
        fechaIngreso: new Date(formData.fechaIngreso),
        fechaSalida: new Date(formData.fechaSalida),
        habitaciones: [
          {
            habitacionId: formData.habitacionId,
            precio: formData.precio,
            desayunoExtras: false,
            parkingExtras: false,
            huespedes: [formData.huespedId],
          },
        ],
      })

      if (result.success) {
        toast.success("Reserva creada correctamente")
        setOpen(false)
        setFormData({
          huespedId: "",
          fechaIngreso: "",
          fechaSalida: "",
          habitacionId: "",
          precio: 0,
        })
      } else {
        toast.error(result.error || "Error al crear la reserva")
      }
    })
  }

  const handleHabitacionChange = (habitacionId: string) => {
    const habitacion = habitaciones.find((h) => h.id === habitacionId)
    setFormData({
      ...formData,
      habitacionId,
      precio: habitacion?.tipoHabitacion.precio || 0,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Reserva</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="huesped">Huésped</Label>
            <Select
              value={formData.huespedId}
              onValueChange={(value) => setFormData({ ...formData, huespedId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar huésped" />
              </SelectTrigger>
              <SelectContent>
                {huespedes.map((huesped) => (
                  <SelectItem key={huesped.id} value={huesped.id}>
                    {huesped.nombre} - {huesped.ci}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
              <Input
                id="fechaIngreso"
                type="date"
                value={formData.fechaIngreso}
                onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaSalida">Fecha de Salida</Label>
              <Input
                id="fechaSalida"
                type="date"
                value={formData.fechaSalida}
                onChange={(e) => setFormData({ ...formData, fechaSalida: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="habitacion">Habitación</Label>
            <Select value={formData.habitacionId} onValueChange={handleHabitacionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar habitación" />
              </SelectTrigger>
              <SelectContent>
                {habitaciones.map((habitacion) => (
                  <SelectItem key={habitacion.id} value={habitacion.id}>
                    Hab. {habitacion.numero} - {habitacion.tipoHabitacion.nombre} (Bs.{" "}
                    {habitacion.tipoHabitacion.precio})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="precio">Precio por Noche</Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: Number.parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creando..." : "Crear Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
