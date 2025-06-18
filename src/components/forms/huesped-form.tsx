"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HuespedSchema, NacionalidadSchema } from "@/lib/types"
import { createHuesped, updateHuesped } from "@/actions/huespedes"
import { toast } from "sonner"
import { Plus, Edit } from "lucide-react"
import type { z } from "zod"
import type { Huesped } from "@prisma/client"

interface HuespedFormProps {
  huesped?: Huesped
  onSuccess?: () => void
}

export function HuespedForm({ huesped, onSuccess }: HuespedFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof HuespedSchema>>({
    resolver: zodResolver(HuespedSchema),
    defaultValues: {
      nombre: huesped?.nombre || "",
      ci: huesped?.ci || "",
      correo: huesped?.correo || "",
      telefono: huesped?.telefono || "",
      nacionalidad: huesped?.nacionalidad || undefined,
    },
  })

  const onSubmit = async (data: z.infer<typeof HuespedSchema>) => {
    setLoading(true)
    try {
      const result = huesped ? await updateHuesped(huesped.id, data) : await createHuesped(data)

      if (result.success) {
        toast.success(huesped ? "Huésped actualizado" : "Huésped creado")
        setOpen(false)
        form.reset()
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
        <Button variant={huesped ? "ghost" : "default"} size={huesped ? "sm" : "default"}>
          {huesped ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4 mr-2" />}
          {huesped ? "" : "Nuevo Huésped"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{huesped ? "Editar Huésped" : "Nuevo Huésped"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input id="nombre" {...form.register("nombre")} placeholder="Ingrese el nombre completo" />
            {form.formState.errors.nombre && (
              <p className="text-sm text-red-500">{form.formState.errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ci">Cédula de Identidad</Label>
            <Input id="ci" {...form.register("ci")} placeholder="Ingrese el CI" />
            {form.formState.errors.ci && <p className="text-sm text-red-500">{form.formState.errors.ci.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo">Correo electrónico</Label>
            <Input id="correo" type="email" {...form.register("correo")} placeholder="correo@ejemplo.com" />
            {form.formState.errors.correo && (
              <p className="text-sm text-red-500">{form.formState.errors.correo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" {...form.register("telefono")} placeholder="Ingrese el teléfono" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nacionalidad">Nacionalidad</Label>
            <Select
              value={form.watch("nacionalidad") || ""}
              onValueChange={(value) => form.setValue("nacionalidad", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione nacionalidad" />
              </SelectTrigger>
              <SelectContent>
                {NacionalidadSchema.options.map((nacionalidad) => (
                  <SelectItem key={nacionalidad} value={nacionalidad}>
                    {nacionalidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : huesped ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
