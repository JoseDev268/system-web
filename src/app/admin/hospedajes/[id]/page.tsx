import { getHospedajeById } from "@/actions/hospedaje-actions"
import { getProductos } from "@/actions/producto-actions"
import { HospedajeDetalle } from "@/components/hospedajes/hospedaje-detalle"
import { HospedajeActions } from "@/components/hospedajes/hospedaje-actions"
import { notFound } from "next/navigation"

interface HospedajePageProps {
  params: {
    id: string
  }
}

export default async function HospedajePage({ params }: HospedajePageProps) {
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
          <h1 className="text-3xl font-bold text-gray-900">Hospedaje - {hospedaje.huesped.nombre}</h1>
          <p className="text-gray-600">Habitación {hospedaje.habitacion.numero} - Hotel Perla del Lago</p>
        </div>
        <HospedajeActions hospedaje={hospedaje} />
      </div>

      <HospedajeDetalle hospedaje={hospedaje} productos={productos} />
    </div>
  )
}
