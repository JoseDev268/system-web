"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { checkRoomAvailability } from "@/actions/landing"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Users, Bed } from "lucide-react"
import { cn } from "@/lib/utils"

interface Room {
  id: string
  nombre: string
  descripcion: string
  precio: number
  images: string[]
  capacidadAdults: number
  capacidadChildren: number
  capacidadMinima: number
}

interface AvailabilityModalProps {
  room: Room | null
  isOpen: boolean
  onClose: () => void
}

export function AvailabilityModal({ room, isOpen, onClose }: AvailabilityModalProps) {
  const [fechaIngreso, setFechaIngreso] = useState<Date>()
  const [fechaSalida, setFechaSalida] = useState<Date>()
  const [checking, setChecking] = useState(false)
  const [availability, setAvailability] = useState<boolean | null>(null)

  const handleCheckAvailability = async () => {
    if (!room || !fechaIngreso || !fechaSalida) return

    setChecking(true)
    try {
      const isAvailable = await checkRoomAvailability(room.id, fechaIngreso, fechaSalida)
      setAvailability(isAvailable)
    } catch (error) {
      console.error("Error checking availability:", error)
      setAvailability(false)
    } finally {
      setChecking(false)
    }
  }

  const resetModal = () => {
    setFechaIngreso(undefined)
    setFechaSalida(undefined)
    setAvailability(null)
    onClose()
  }

  const calculateNights = () => {
    if (!fechaIngreso || !fechaSalida) return 0
    const diffTime = fechaSalida.getTime() - fechaIngreso.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const totalPrice = room ? calculateNights() * room.precio : 0

  if (!room) return null

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{room.nombre}</DialogTitle>
          <DialogDescription>Verifica la disponibilidad para las fechas que deseas</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>Hasta {room.capacidadAdults} adultos</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-gray-500" />
              <span>{room.capacidadChildren} niños</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Fecha de ingreso</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaIngreso && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaIngreso ? format(fechaIngreso, "PPP", { locale: es }) : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fechaIngreso}
                      onSelect={(date) => {
                        setFechaIngreso(date)
                        if (date && (!fechaSalida || date >= fechaSalida)) {
                          setFechaSalida(addDays(date, 1))
                        }
                        setAvailability(null)
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Fecha de salida</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaSalida && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaSalida ? format(fechaSalida, "PPP", { locale: es }) : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fechaSalida}
                      onSelect={(date) => {
                        setFechaSalida(date)
                        setAvailability(null)
                      }}
                      disabled={(date) => !fechaIngreso || date <= fechaIngreso}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {fechaIngreso && fechaSalida && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {calculateNights()} {calculateNights() === 1 ? "noche" : "noches"}
                  </span>
                  <span className="font-semibold">Bs. {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {availability !== null && (
            <div
              className={`p-4 rounded-lg ${availability ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              <p className={`text-sm font-medium ${availability ? "text-green-800" : "text-red-800"}`}>
                {availability
                  ? "¡Habitación disponible! Puedes proceder con la reserva."
                  : "Lo sentimos, no hay disponibilidad para estas fechas."}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleCheckAvailability}
              disabled={!fechaIngreso || !fechaSalida || checking}
              className="flex-1"
            >
              {checking ? "Verificando..." : "Verificar Disponibilidad"}
            </Button>

            {availability === true && (
              <Button variant="default" className="flex-1">
                Reservar Ahora
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
