"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Receipt, DollarSign, CreditCard, AlertCircle } from "lucide-react"

type FacturaWithDetails = {
  id: string
  total: number
  estado: string
  pagos: Array<{
    monto: number
  }>
}

interface FacturasStatsProps {
  facturas: FacturaWithDetails[]
}

export function FacturasStats({ facturas }: FacturasStatsProps) {
  const stats = {
    totalFacturas: facturas.length,
    totalFacturado: facturas.reduce((sum, f) => sum + f.total, 0),
    totalPagado: facturas.reduce((sum, f) => sum + f.pagos.reduce((pSum, p) => pSum + p.monto, 0), 0),
    facturasPendientes: facturas.filter((f) => {
      const totalPagado = f.pagos.reduce((sum, p) => sum + p.monto, 0)
      return totalPagado < f.total
    }).length,
  }

  const pendienteCobro = stats.totalFacturado - stats.totalPagado

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFacturas}</div>
          <p className="text-xs text-muted-foreground">{stats.facturasPendientes} pendientes de pago</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalFacturado)}</div>
          <p className="text-xs text-muted-foreground">Monto total emitido</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cobrado</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalPagado)}</div>
          <p className="text-xs text-muted-foreground">Pagos recibidos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendiente de Cobro</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(pendienteCobro)}</div>
          <p className="text-xs text-muted-foreground">Por cobrar</p>
        </CardContent>
      </Card>
    </div>
  )
}
