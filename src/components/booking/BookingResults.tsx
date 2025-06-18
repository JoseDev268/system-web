"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Users, Wifi, Car, Coffee, Tv, Bath, MapPin, Star } from "lucide-react"
import { ReservaDialog } from "./ReservaDialog"
import { useState } from "react"

interface BookingResultsProps {
  habitaciones: Array<{
    tipoHabitacion: {
      id: string
      nombre: string
      descripcion: string | null
      precio: number
      capacidadAdults: number
      capacidadChildren: number
      amenidades: string[]
    }
    habitacionesDisponibles: number
    habitaciones: Array<{
      id: string
      numero: string
      piso: {
        numero: number
        nombre: string
      }
    }>
    precioTotal: number
    precioPorNoche: number
    dias: number
  }>
  parametrosBusqueda: {
    fechaIngreso: Date
    fechaSalida: Date
    adultos: number
    ninos: number
  }
}

export function BookingResults({ habitaciones, parametrosBusqueda }: BookingResultsProps) {
  const [selectedRoom, setSelectedRoom] = useState<{
    habitacion: {
      tipoHabitacion: any
      precioTotal: number
      precioPorNoche: number
      dias: number
    }
    habitacionEspecifica: any
  } | null>(null)

  const getAmenityIcon = (amenidad: string) => {
    switch (amenidad.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-4 h-4" />
      case "parking":
        return <Car className="w-4 h-4" />
      case "desayuno":
        return <Coffee className="w-4 h-4" />
      case "tv":
        return <Tv className="w-4 h-4" />
      case "baño privado":
        return <Bath className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  if (habitaciones.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-yellow-800 font-semibold mb-2">No hay habitaciones disponibles</h3>
          <p className="text-yellow-600">
            No encontramos habitaciones disponibles para las fechas seleccionadas. Intenta con fechas diferentes o
            reduce el número de huéspedes.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {habitaciones.length} tipo{habitaciones.length !== 1 ? "s" : ""} de habitación disponible
          {habitaciones.length !== 1 ? "s" : ""}
        </h2>
        <p className="text-gray-600">
          {parametrosBusqueda.adultos + parametrosBusqueda.ninos} huésped
          {parametrosBusqueda.adultos + parametrosBusqueda.ninos !== 1 ? "es" : ""} •{" "}
          {Math.ceil(
            (parametrosBusqueda.fechaSalida.getTime() - parametrosBusqueda.fechaIngreso.getTime()) /
              (1000 * 60 * 60 * 24),
          )}{" "}
          noche
          {Math.ceil(
            (parametrosBusqueda.fechaSalida.getTime() - parametrosBusqueda.fechaIngreso.getTime()) /
              (1000 * 60 * 60 * 24),
          ) !== 1
            ? "s"
            : ""}
        </p>
      </div>

      {habitaciones.map((item) => (
        <Card key={item.tipoHabitacion.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {/* Imagen de la habitación */}
            <div className="lg:col-span-1 bg-gradient-to-br from-blue-100 to-blue-200 p-8 flex items-center justify-center">
              <div className="text-center">
                <Bed className="w-16 h-16 text-blue-600 mx-auto mb-2" />
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {item.tipoHabitacion.nombre}
                </Badge>
              </div>
            </div>

            {/* Información de la habitación */}
            <div className="lg:col-span-2 p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-bold text-gray-900">{item.tipoHabitacion.nombre}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{item.tipoHabitacion.capacidadAdults} adultos</span>
                  </div>
                  {item.tipoHabitacion.capacidadChildren > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{item.tipoHabitacion.capacidadChildren} niños</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {item.habitacionesDisponibles} disponible{item.habitacionesDisponibles !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {item.tipoHabitacion.descripcion && (
                  <p className="text-gray-600 mb-4">{item.tipoHabitacion.descripcion}</p>
                )}

                {/* Amenidades */}
                {item.tipoHabitacion.amenidades && item.tipoHabitacion.amenidades.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Amenidades incluidas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.tipoHabitacion.amenidades.map((amenidad, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded"
                        >
                          {getAmenityIcon(amenidad)}
                          <span>{amenidad}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Habitaciones específicas disponibles */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Habitaciones disponibles:</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.habitaciones.map((habitacion) => (
                      <Badge key={habitacion.id} variant="outline" className="text-xs">
                        #{habitacion.numero} - Piso {habitacion.piso.numero}
                      </Badge>
                    ))}
                    {item.habitacionesDisponibles > item.habitaciones.length && (
                      <Badge variant="outline" className="text-xs">
                        +{item.habitacionesDisponibles - item.habitaciones.length} más
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                  <span className="text-sm text-gray-500">
                    Reservado hace {Math.floor(Math.random() * 8) + 1} hora
                    {Math.floor(Math.random() * 8) + 1 !== 1 ? "s" : ""}
                  </span>
                </div>
              </CardContent>
            </div>

            {/* Precio y acciones */}
            <div className="lg:col-span-1 p-6 bg-gray-50 flex flex-col justify-between">
              <div className="text-right mb-4">
                <div className="text-3xl font-bold text-gray-900">Bs/ {item.precioPorNoche}</div>
                <div className="text-sm text-gray-600">por noche</div>
                <div className="text-lg font-semibold text-blue-600 mt-2">Total: Bs/ {item.precioTotal}</div>
                <div className="text-xs text-gray-500">
                  {item.dias} noche{item.dias !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                  onClick={() =>
                    setSelectedRoom({
                      habitacion: {
                        tipoHabitacion: item.tipoHabitacion,
                        precioTotal: item.precioTotal,
                        precioPorNoche: item.precioPorNoche,
                        dias: item.dias,
                      },
                      habitacionEspecifica: item.habitaciones[0],
                    })
                  }
                >
                  Reservar Ahora
                </Button>
                <Button variant="outline" className="w-full">
                  Ver Detalles
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Dialog de reserva */}
      {selectedRoom && (
        <ReservaDialog
          open={!!selectedRoom}
          onOpenChange={(open) => !open && setSelectedRoom(null)}
          habitacion={selectedRoom.habitacion}
          habitacionEspecifica={selectedRoom.habitacionEspecifica}
          parametrosBusqueda={parametrosBusqueda}
        />
      )}
    </div>
  )
}
