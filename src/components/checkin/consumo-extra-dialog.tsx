"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { agregarConsumoExtra } from "@/actions/hospedaje-actions"
import { formatCurrency } from "@/lib/utils"
import { Plus } from "lucide-react"
import { toast } from "sonner"

type Producto = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
}

interface ConsumoExtraDialogProps {
  hospedajeId: string
  productos: Producto[]
  onSuccess?: () => void
}

export function ConsumoExtraDialog({ hospedajeId, productos, onSuccess }: ConsumoExtraDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    productoId: "",
    cantidad: 1,
    precioUnitario: 0,
  })

  const productoSeleccionado = productos.find((p) => p.id === formData.productoId)

  const handleProductoChange = (productoId: string) => {
    const producto = productos.find((p) => p.id === productoId)
    setFormData({
      ...formData,
      productoId,
      precioUnitario: producto?.precio || 0,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.productoId || formData.cantidad <= 0) {
      toast.error("Por favor complete todos los campos")
      return
    }

    startTransition(async () => {
      const result = await agregarConsumoExtra({
        hospedajeId,
        productoId: formData.productoId,
        cantidad: formData.cantidad,
        precioUnitario: formData.precioUnitario,
      })

      if (result.success) {
        toast.success("Consumo agregado correctamente")
        setOpen(false)
        setFormData({
          productoId: "",
          cantidad: 1,
          precioUnitario: 0,
        })
        onSuccess?.()
      } else {
        toast.error(result.error || "Error al agregar el consumo")
      }
    })
  }

  const total = formData.cantidad * formData.precioUnitario

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Consumo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Consumo Extra</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="producto">Producto *</Label>
            <Select value={formData.productoId} onValueChange={handleProductoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                {productos
                  .filter((p) => p.stock > 0)
                  .map((producto) => (
                    <SelectItem key={producto.id} value={producto.id}>
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <div className="font-medium">{producto.nombre}</div>
                          <div className="text-sm text-gray-500">{producto.descripcion}</div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-medium">{formatCurrency(producto.precio)}</div>
                          <div className="text-sm text-gray-500">Stock: {producto.stock}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad *</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                max={productoSeleccionado?.stock || 999}
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: Number.parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio">Precio Unitario *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                value={formData.precioUnitario}
                onChange={(e) => setFormData({ ...formData, precioUnitario: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {total > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-lg font-bold">{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Agregando..." : "Agregar Consumo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
