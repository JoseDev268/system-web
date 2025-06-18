import { getHospedajes } from "@/actions/hospedaje-actions"
import { HospedajesList } from "@/components/hospedajes/hospedajes-list"
import { HospedajesStats } from "@/components/hospedajes/hospedajes-stats"
import { NuevoHospedajeDialog } from "@/components/hospedajes/nuevo-hospedaje-dialog"
import { getHuespedes } from "@/actions/huesped-actions"
import { getHabitaciones } from "@/actions/habitacion-actions"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function HospedajesPage() {
  const [hospedajesResult, huespedesResult, habitacionesResult] = await Promise.all([
    getHospedajes(),
    getHuespedes(),
    getHabitaciones(),
  ])

  const hospedajes = hospedajesResult.success ? hospedajesResult.data : []
  const huespedes = huespedesResult.success ? huespedesResult.data : []
  const habitaciones = habitacionesResult.success ? habitacionesResult.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospedajes</h1>
          <p className="text-gray-600">Gestión completa de hospedajes - Hotel Perla del Lago</p>
        </div>
        <NuevoHospedajeDialog huespedes={huespedes} habitaciones={habitaciones}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Hospedaje
          </Button>
        </NuevoHospedajeDialog>
      </div>

      <HospedajesStats hospedajes={hospedajes} />
      <HospedajesList hospedajes={hospedajes} />
    </div>
  )
}
