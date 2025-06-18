import { getFacturaById } from "@/actions/factura-actions"
import { FacturaDetalle } from "@/components/facturacion/factura-detalle"
import { FacturaActions } from "@/components/facturacion/factura-actions"
import { notFound } from "next/navigation"

interface FacturaPageProps {
  params: {
    id: string
  }
}

export default async function FacturaPage({ params }: FacturaPageProps) {
  const result = await getFacturaById(params.id)

  if (!result.success || !result.data) {
    notFound()
  }

  const factura = result.data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Factura {factura.numeroFactura}</h1>
          <p className="text-gray-600">Hotel Perla del Lago</p>
        </div>
        <FacturaActions factura={factura} />
      </div>

      <FacturaDetalle factura={factura} />
    </div>
  )
}
