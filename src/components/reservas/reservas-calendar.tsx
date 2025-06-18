"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { EstadoReserva } from "@prisma/client"

type ReservaWithDetails = {
  id: string
  estado: EstadoReserva
  fechaIngreso: Date
  fechaSalida: Date
  huesped: {
    nombre: string
    ci: string
  }
  detalleReservas: Array<{
    habitacion: {
      numero: number
      tipoHabitacion: {
        nombre: string
      }
    }
  }>
}

interface ReservasCalendarProps {
  reservas: ReservaWithDetails[]
}

export function ReservasCalendar({ reservas }: ReservasCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startOfCalendar = new Date(startOfMonth)
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay())

  const days = []
  const currentCalendarDate = new Date(startOfCalendar)

  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentCalendarDate))
    currentCalendarDate.setDate(currentCalendarDate.getDate() + 1)
  }

  const getReservasForDay = (date: Date) => {
    return reservas.filter((reserva) => {
      const fechaIngreso = new Date(reserva.fechaIngreso)
      const fechaSalida = new Date(reserva.fechaSalida)
      return date >= fechaIngreso && date <= fechaSalida
    })
  }

  const getEstadoColor = (estado: EstadoReserva) => {
    switch (estado) {
      case EstadoReserva.CONFIRMADA:
        return "bg-green-100 text-green-800 border-green-200"
      case EstadoReserva.PENDIENTE:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case EstadoReserva.CANCELADA:
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>
              {currentDate.toLocaleDateString("es-BO", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()
            const isToday = day.toDateString() === new Date().toDateString()
            const reservasDelDia = getReservasForDay(day)

            return (
              <div
                key={index}
                className={`min-h-[100px] p-1 border rounded-lg ${
                  isCurrentMonth ? "bg-white" : "bg-gray-50"
                } ${isToday ? "ring-2 ring-blue-500" : ""}`}
              >
                <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}>
                  {day.getDate()}
                </div>

                <div className="space-y-1">
                  {reservasDelDia.slice(0, 2).map((reserva) => (
                    <div key={reserva.id} className={`text-xs p-1 rounded border ${getEstadoColor(reserva.estado)}`}>
                      <div className="font-medium truncate">{reserva.huesped.nombre}</div>
                      <div className="truncate">
                        Hab. {reserva.detalleReservas.map((d) => d.habitacion.numero).join(", ")}
                      </div>
                    </div>
                  ))}
                  {reservasDelDia.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">+{reservasDelDia.length - 2} más</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
