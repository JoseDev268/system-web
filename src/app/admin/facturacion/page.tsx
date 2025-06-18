import { getFacturas } from "@/actions/factura-actions"
import { FacturasList } from "@/components/facturacion/facturas-list"
import { FacturasStats } from "@/components/facturacion/facturas-stats"
import { EstadoFactura } from "@prisma/client"

type FacturaWithDetails = {
  id: string
  numeroFactura: string | null
  total: number
  subtotalBase: number
  subtotalExtras: number | null
  estado: EstadoFactura
  fechaEmision: Date
  fichaHospedaje: {
    huesped: {
      nombre: string
      ci: string
    }
    habitacion: {
      numero: number
      tipoHabitacion: {
        nombre: string
      }
    }
  }
  pagos: Array<{
    id: string
    monto: number
    metodo: string
    createdAt: Date
  }>
}

export default async function FacturacionPage() {
  const result = await getFacturas()
  const facturas: FacturaWithDetails[] = result.success ? (result.data as FacturaWithDetails[]) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
        <p className="text-gray-600">Gestión de facturas y pagos</p>
      </div>

      <FacturasStats facturas={facturas} />
      <FacturasList facturas={facturas} />
    </div>
  )
}
