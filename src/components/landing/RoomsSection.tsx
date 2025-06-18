import { getTiposHabitacionPublic } from "@/actions/landing"
import { RoomGrid } from "./RoomGrid"
// import { RoomGrid } from "./room-grid"

export async function RoomSection() {
  const tiposHabitacion = await getTiposHabitacionPublic()

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestras Habitaciones</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestras elegantes habitaciones diseñadas para brindarte la máxima comodidad y lujo durante tu
            estadía.
          </p>
        </div>

        <RoomGrid rooms={tiposHabitacion} />
      </div>
    </section>
  )
}
