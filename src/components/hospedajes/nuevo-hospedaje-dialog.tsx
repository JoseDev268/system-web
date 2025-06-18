"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createHospedaje } from "@/actions/hospedaje-actions"
import { EstadoHabitacion } from "@prisma/client"
import { toast } from "sonner"

type Huesped = {
  id: string
  nombre: string
  ci: string
}

type Habitacion = {
  id: string
  numero: number
  estado: EstadoHabitacion
  tipoHabitacion: {
    nombre: string
    precio: number
  }
  piso: {
    numero: number
  }
}

interface NuevoHospedajeDialogProps {
  children: React.ReactNode
  huespedes: Huesped[]
  habitaciones: Habitacion[]
}

export function NuevoHospedajeDialog({ children, huespedes, habitaciones }: NuevoHospedajeDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    huespedId: "",
    habitacionId: "",
    fechaIngreso: "",
    fechaSalida: "",
  })

  const habitacionesDisponibles = habitaciones.filter((h) => h.estado === EstadoHabitacion.DISPONIBLE)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.huespedId || !formData.habitacionId || !formData.fechaIngreso || !formData.fechaSalida) {
      toast.error("Por favor complete todos los campos")
      return
    }

    const fechaIngreso = new Date(formData.fechaIngreso)
    const fechaSalida = new Date(formData.fechaSalida)

    if (fechaSalida <= fechaIngreso) {
      toast.error("La fecha de salida debe ser posterior a la fecha de ingreso")
      return
    }

    startTransition(async () => {
      const result = await createHospedaje({
        huespedId: formData.huespedId,
        habitacionId: formData.habitacionId,
        fechaIngreso,
        fechaSalida,
      })

      if (result.success) {
        toast.success("Hospedaje creado correctamente")
        setOpen(false)
        setFormData({
          huespedId: "",
          habitacionId: "",
          fechaIngreso: "",
          fechaSalida: "",
        })
        window.location.reload()
      } else {
        toast.error(result.error || "Error al crear el hospedaje")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Hospedaje</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="huesped">Huésped *</Label>
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

          <div className="space-y-2">
            <Label htmlFor="habitacion">Habitación *</Label>
            <Select
              value={formData.habitacionId}
              onValueChange={(value) => setFormData({ ...formData, habitacionId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar habitación" />
              </SelectTrigger>
              <SelectContent>
                {habitacionesDisponibles.map((habitacion) => (
                  <SelectItem key={habitacion.id} value={habitacion.id}>
                    Hab. {habitacion.numero} - {habitacion.tipoHabitacion.nombre} (Piso {habitacion.piso.numero}) - Bs.{" "}
                    {habitacion.tipoHabitacion.precio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaIngreso">Fecha de Ingreso *</Label>
              <Input
                id="fechaIngreso"
                type="datetime-local"
                value={formData.fechaIngreso}
                onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaSalida">Fecha de Salida *</Label>
              <Input
                id="fechaSalida"
                type="datetime-local"
                value={formData.fechaSalida}
                onChange={(e) => setFormData({ ...formData, fechaSalida: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creando..." : "Crear Hospedaje"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
