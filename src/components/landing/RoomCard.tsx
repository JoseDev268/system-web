"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Bed } from "lucide-react"
import Image from "next/image"

interface RoomCardProps {
  id: string
  nombre: string
  descripcion: string
  precio: number
  images: string[]
  capacidadAdults: number
  capacidadChildren: number
  categoria?: string
  onCheckAvailability: (roomId: string) => void
}

const getCategoriaByPrice = (precio: number): { label: string; color: string } => {
  if (precio <= 200) return { label: "ELEGANCE AND COMFORT", color: "bg-blue-100 text-blue-800" }
  if (precio <= 300) return { label: "LUXURIOUS AND MODERN", color: "bg-purple-100 text-purple-800" }
  if (precio <= 400) return { label: "MODERN FURNISHINGS", color: "bg-green-100 text-green-800" }
  return { label: "EXCLUSIVE AND PRIVATE", color: "bg-amber-100 text-amber-800" }
}

export function RoomCard({
  id,
  nombre,
  descripcion,
  precio,
  images,
  capacidadAdults,
  capacidadChildren,
  onCheckAvailability,
}: RoomCardProps) {
  const categoria = getCategoriaByPrice(precio)
  const imageUrl = images.length > 0 ? images[0] : "/placeholder.svg?height=300&width=400"

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 w-full">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={nombre}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <Badge className={categoria.color}>{categoria.label}</Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{nombre}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{descripcion}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Hasta {capacidadAdults} adultos</span>
            </div>
            {capacidadChildren > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{capacidadChildren} niños</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-left">
              <span className="text-sm text-gray-500">From </span>
              <span className="text-2xl font-bold text-gray-900">Bs. {precio.toFixed(0)}</span>
              <span className="text-sm text-gray-500"> /night</span>
            </div>

            <Button
              onClick={() => onCheckAvailability(id)}
              variant="outline"
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              Check availability
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
