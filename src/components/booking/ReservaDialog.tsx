"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createReservaPublic } from "@/actions/public-actions"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Nacionalidad } from "@prisma/client"
import { User, CreditCard, Coffee, MapPin, Calendar } from "lucide-react"
import { toast } from "sonner"

type HabitacionDisponible = {
  tipoHabitacion: {
    id: string
    nombre: string
    descripcion: string
    precio: number
    capacidadAdults: number
    capacidadChildren: number
  }
  precioTotal: number
  precioPorNoche: number
  dias: number
}

interface ReservaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  habitacion: HabitacionDisponible
  habitacionEspecifica: {
    id: string
    numero: number
    piso: {
      numero: number
    }
  }
  parametrosBusqueda: {
    fechaIngreso: Date
    fechaSalida: Date
    adultos: number
    ninos: number
  }
}

export function ReservaDialog({
  open,
  onOpenChange,
  habitacion,
  habitacionEspecifica,
  parametrosBusqueda,
}: ReservaDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState(1) // 1: Datos personales, 2: Extras, 3: Pago

  const [formData, setFormData] = useState({
    // Datos del huésped
    nombre: "",
    ci: "",
    correo: "",
    telefono: "",
    nacionalidad: "BOLIVIA" as Nacionalidad,

    // Extras
    desayuno: false,
    parking: false,

    // Método de pago
    metodoPago: "",
    numeroTarjeta: "",
    nombreTarjeta: "",
    fechaVencimiento: "",
    cvv: "",
  })

  // Calcular precios
  const precioBase = habitacion.precioTotal
  const precioDesayuno = formData.desayuno ? 25 * habitacion.dias : 0
  const precioParking = formData.parking ? 15 * habitacion.dias : 0
  const subtotal = precioBase + precioDesayuno + precioParking
  const impuestos = subtotal * 0.13 // 13% de impuestos
  const total = subtotal + impuestos

  const handleSubmit = () => {
    if (step < 3) {
      setStep(step + 1)
      return
    }

    // Validaciones finales
    if (!formData.nombre || !formData.ci || !formData.correo || !formData.metodoPago) {
      toast.error("Por favor complete todos los campos requeridos")
      return
    }

    startTransition(async () => {
      const result = await createReservaPublic({
        huespedData: {
          nombre: formData.nombre,
          ci: formData.ci,
          correo: formData.correo,
          telefono: formData.telefono,
          nacionalidad: formData.nacionalidad,
        },
        reservaData: {
          fechaIngreso: parametrosBusqueda.fechaIngreso,
          fechaSalida: parametrosBusqueda.fechaSalida,
          habitacionId: habitacionEspecifica.id,
          adultos: parametrosBusqueda.adultos,
          ninos: parametrosBusqueda.ninos,
          extras: {
            desayuno: formData.desayuno,
            parking: formData.parking,
          },
        },
        metodoPago: formData.metodoPago,
      })

      if (result.success) {
        toast.success("¡Reserva creada exitosamente!")
        onOpenChange(false)
        // Aquí podrías redirigir a una página de confirmación
      } else {
        toast.error(result.error || "Error al crear la reserva")
      }
    })
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <User className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-semibold">Datos del Huésped Principal</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre Completo *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ingrese su nombre completo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ci">CI/Documento *</Label>
          <Input
            id="ci"
            value={formData.ci}
            onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
            placeholder="Número de documento"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="correo">Email *</Label>
          <Input
            id="correo"
            type="email"
            value={formData.correo}
            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            placeholder="+591 70123456"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nacionalidad">Nacionalidad</Label>
          <Select
            value={formData.nacionalidad}
            onValueChange={(value) => setFormData({ ...formData, nacionalidad: value as Nacionalidad })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Nacionalidad).map((nacionalidad) => (
                <SelectItem key={nacionalidad} value={nacionalidad}>
                  {nacionalidad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Coffee className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-semibold">Servicios Adicionales</h3>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="desayuno"
                  checked={formData.desayuno}
                  onCheckedChange={(checked) => setFormData({ ...formData, desayuno: !!checked })}
                />
                <div>
                  <Label htmlFor="desayuno" className="font-medium">
                    Desayuno Incluido
                  </Label>
                  <p className="text-sm text-gray-600">Desayuno buffet continental</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(25)} / noche</p>
                <p className="text-sm text-gray-600">Total: {formatCurrency(25 * habitacion.dias)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="parking"
                  checked={formData.parking}
                  onCheckedChange={(checked) => setFormData({ ...formData, parking: !!checked })}
                />
                <div>
                  <Label htmlFor="parking" className="font-medium">
                    Estacionamiento
                  </Label>
                  <p className="text-sm text-gray-600">Estacionamiento privado cubierto</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(15)} / noche</p>
                <p className="text-sm text-gray-600">Total: {formatCurrency(15 * habitacion.dias)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <CreditCard className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-semibold">Información de Pago</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="metodoPago">Método de Pago *</Label>
          <Select
            value={formData.metodoPago}
            onValueChange={(value) => setFormData({ ...formData, metodoPago: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione método de pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TARJETA">Tarjeta de Crédito/Débito</SelectItem>
              <SelectItem value="QR">Pago QR</SelectItem>
              <SelectItem value="TRANSFERENCIA">Transferencia Bancaria</SelectItem>
              <SelectItem value="EFECTIVO">Efectivo (en el hotel)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.metodoPago === "TARJETA" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="numeroTarjeta">Número de Tarjeta</Label>
              <Input
                id="numeroTarjeta"
                value={formData.numeroTarjeta}
                onChange={(e) => setFormData({ ...formData, numeroTarjeta: e.target.value })}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombreTarjeta">Nombre en la Tarjeta</Label>
              <Input
                id="nombreTarjeta"
                value={formData.nombreTarjeta}
                onChange={(e) => setFormData({ ...formData, nombreTarjeta: e.target.value })}
                placeholder="Como aparece en la tarjeta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
              <Input
                id="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                placeholder="MM/AA"
                maxLength={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
        )}

        {formData.metodoPago === "QR" && (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-2">Escanea el código QR para realizar el pago</p>
            <div className="w-32 h-32 bg-gray-300 mx-auto rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Código QR</span>
            </div>
          </div>
        )}

        {formData.metodoPago === "EFECTIVO" && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Pago en efectivo:</strong> Podrá realizar el pago al momento del check-in en el hotel. Se requiere
              una reserva válida.
            </p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Reservar {habitacion.tipoHabitacion.nombre} - Habitación {habitacionEspecifica.numero}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-2">
            {/* Indicador de pasos */}
            <div className="flex items-center justify-center mb-6">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber ? "bg-amber-500 text-black" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-12 h-1 mx-2 ${step > stepNumber ? "bg-amber-500" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Contenido del paso */}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {/* Botones de navegación */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => (step > 1 ? setStep(step - 1) : onOpenChange(false))}>
                {step === 1 ? "Cancelar" : "Anterior"}
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-amber-500 hover:bg-amber-600 text-black"
              >
                {isPending ? "Procesando..." : step === 3 ? "Confirmar Reserva" : "Siguiente"}
              </Button>
            </div>
          </div>

          {/* Resumen de reserva */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Información de la habitación */}
                <div>
                  <h4 className="font-semibold">{habitacion.tipoHabitacion.nombre}</h4>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      Habitación {habitacionEspecifica.numero}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Fechas */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Check-in: {formatDate(parametrosBusqueda.fechaIngreso)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Check-out: {formatDate(parametrosBusqueda.fechaSalida)}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {habitacion.dias} noche{habitacion.dias !== 1 ? "s" : ""} •{" "}
                    {parametrosBusqueda.adultos + parametrosBusqueda.ninos} huésped
                    {parametrosBusqueda.adultos + parametrosBusqueda.ninos !== 1 ? "es" : ""}
                  </p>
                </div>

                <Separator />

                {/* Desglose de precios */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Habitación ({habitacion.dias} noche{habitacion.dias !== 1 ? "s" : ""})
                    </span>
                    <span>{formatCurrency(precioBase)}</span>
                  </div>

                  {formData.desayuno && (
                    <div className="flex justify-between text-sm">
                      <span>
                        Desayuno ({habitacion.dias} noche{habitacion.dias !== 1 ? "s" : ""})
                      </span>
                      <span>{formatCurrency(precioDesayuno)}</span>
                    </div>
                  )}

                  {formData.parking && (
                    <div className="flex justify-between text-sm">
                      <span>
                        Estacionamiento ({habitacion.dias} noche{habitacion.dias !== 1 ? "s" : ""})
                      </span>
                      <span>{formatCurrency(precioParking)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Impuestos (13%)</span>
                    <span>{formatCurrency(impuestos)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                {/* Políticas */}
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <strong>Cancelación gratuita</strong> hasta 24 horas antes
                  </p>
                  <p>
                    <strong>Check-in:</strong> 15:00 - 22:00
                  </p>
                  <p>
                    <strong>Check-out:</strong> 08:00 - 12:00
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
