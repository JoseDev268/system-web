import { getHospedajeById } from "@/actions/hospedaje-actions"
import { getProductos } from "@/actions/producto-actions"
import { CheckinDetalle } from "@/components/checkin/checkin-detalle"
import { CheckinActions } from "@/components/checkin/checkin-actions"
import { notFound } from "next/navigation"

interface CheckinPageProps {
  params: {
    id: string
  }
}

export default async function CheckinPage({ params }: CheckinPageProps) {
  const [hospedajeResult, productosResult] = await Promise.all([getHospedajeById(params.id), getProductos()])

  if (!hospedajeResult.success || !hospedajeResult.data) {
    notFound()
  }

  const hospedaje = hospedajeResult.data
  const productos = productosResult.success ? productosResult.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospedaje - Habitación {hospedaje.habitacion.numero}</h1>
          <p className="text-gray-600">Hotel Perla del Lago - Gestión de hospedaje</p>
        </div>
        <CheckinActions hospedaje={hospedaje} />
      </div>

      <CheckinDetalle hospedaje={hospedaje} productos={productos} />
    </div>
  )
}
