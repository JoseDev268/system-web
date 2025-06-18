"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { registrarPago } from "@/actions/factura-actions"
import { MetodoPago } from "@prisma/client"
import { toast } from "sonner"

interface PagoDialogProps {
  facturaId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PagoDialog({ facturaId, open, onOpenChange }: PagoDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    monto: "",
    metodo: "" as MetodoPago | "",
    observacion: "",
    numeroTransaccion: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.monto || !formData.metodo) {
      toast.error("Por favor complete los campos requeridos")
      return
    }

    startTransition(async () => {
      const result = await registrarPago({
        facturaId,
        monto: Number.parseFloat(formData.monto),
        metodo: formData.metodo as MetodoPago,
        observacion: formData.observacion || undefined,
        numeroTransaccion: formData.numeroTransaccion || undefined,
      })

      if (result.success) {
        toast.success("Pago registrado correctamente")
        onOpenChange(false)
        setFormData({
          monto: "",
          metodo: "",
          observacion: "",
          numeroTransaccion: "",
        })
      } else {
        toast.error(result.error || "Error al registrar el pago")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Pago</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monto">Monto *</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metodo">Método de Pago *</Label>
            <Select
              value={formData.metodo}
              onValueChange={(value) => setFormData({ ...formData, metodo: value as MetodoPago })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(MetodoPago).map((metodo) => (
                  <SelectItem key={metodo} value={metodo}>
                    {metodo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroTransaccion">Número de Transacción</Label>
            <Input
              id="numeroTransaccion"
              placeholder="Opcional"
              value={formData.numeroTransaccion}
              onChange={(e) => setFormData({ ...formData, numeroTransaccion: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacion">Observaciones</Label>
            <Textarea
              id="observacion"
              placeholder="Observaciones adicionales..."
              value={formData.observacion}
              onChange={(e) => setFormData({ ...formData, observacion: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Registrando..." : "Registrar Pago"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
