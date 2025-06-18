"use client"

import { useState } from "react"
import { RoomCard } from "./RoomCard"
import { AvailabilityModal } from "./Availability-modal"
// import { RoomCard } from "./room-card"
// import { AvailabilityModal } from "./availability-modal"

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

interface RoomGridProps {
  rooms: Room[]
}

export function RoomGrid({ rooms }: RoomGridProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCheckAvailability = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    if (room) {
      setSelectedRoom(room)
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            id={room.id}
            nombre={room.nombre}
            descripcion={room.descripcion}
            precio={room.precio}
            images={room.images}
            capacidadAdults={room.capacidadAdults}
            capacidadChildren={room.capacidadChildren}
            onCheckAvailability={handleCheckAvailability}
          />
        ))}
      </div>

      <AvailabilityModal
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedRoom(null)
        }}
      />
    </>
  )
}
