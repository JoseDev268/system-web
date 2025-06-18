"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { enviarMensaje } from "@/actions/mensaje-actions"
import { CanalMensaje } from "@prisma/client"
import { toast } from "sonner"

type Huesped = {
  id: string
  nombre: string
  ci: string
}

interface NuevoMensajeDialogProps {
  children: React.ReactNode
  huespedes: Huesped[]
}

export function NuevoMensajeDialog({ children, huespedes }: NuevoMensajeDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    canal: "" as CanalMensaje | "",
    contenido: "",
    destinatarioHuespedId: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.canal || !formData.contenido || !formData.destinatarioHuespedId) {
      toast.error("Por favor complete todos los campos")
      return
    }

    startTransition(async () => {
      const result = await enviarMensaje(
        {
          canal: formData.canal as CanalMensaje,
          contenido: formData.contenido,
          destinatarioHuespedId: formData.destinatarioHuespedId,
        },
        "user-id-placeholder", // En una implementación real, esto vendría del contexto de autenticación
      )

      if (result.success) {
        toast.success("Mensaje enviado correctamente")
        setOpen(false)
        setFormData({
          canal: "",
          contenido: "",
          destinatarioHuespedId: "",
        })
      } else {
        toast.error(result.error || "Error al enviar el mensaje")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Mensaje</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="canal">Canal</Label>
            <Select
              value={formData.canal}
              onValueChange={(value) => setFormData({ ...formData, canal: value as CanalMensaje })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar canal" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CanalMensaje).map((canal) => (
                  <SelectItem key={canal} value={canal}>
                    {canal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destinatario">Destinatario</Label>
            <Select
              value={formData.destinatarioHuespedId}
              onValueChange={(value) => setFormData({ ...formData, destinatarioHuespedId: value })}
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
            <Label htmlFor="contenido">Mensaje</Label>
            <Textarea
              id="contenido"
              placeholder="Escriba su mensaje aquí..."
              value={formData.contenido}
              onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enviando..." : "Enviar Mensaje"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
