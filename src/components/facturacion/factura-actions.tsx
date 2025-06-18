"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PagoDialog } from "./pago-dialog"
import { anularFactura } from "@/actions/factura-actions"
import { EstadoFactura } from "@prisma/client"
import { MoreVertical, Edit, Ban, Download, CreditCard, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

type FacturaWithDetails = {
  id: string
  estado: EstadoFactura
  total: number
  pagos: Array<{
    monto: number
  }>
}

interface FacturaActionsProps {
  factura: FacturaWithDetails
}

export function FacturaActions({ factura }: FacturaActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showAnularDialog, setShowAnularDialog] = useState(false)
  const [showPagoDialog, setShowPagoDialog] = useState(false)

  const totalPagado = factura.pagos.reduce((sum, pago) => sum + pago.monto, 0)
  const saldoPendiente = factura.total - totalPagado

  const handleAnular = () => {
    startTransition(async () => {
      const result = await anularFactura(factura.id)
      if (result.success) {
        toast.success("Factura anulada correctamente")
        router.refresh()
      } else {
        toast.error(result.error || "Error al anular la factura")
      }
    })
  }

  const canAnular = factura.estado === EstadoFactura.EMITIDA && totalPagado === 0
  const canAddPayment = factura.estado === EstadoFactura.EMITIDA && saldoPendiente > 0

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button variant="outline" asChild>
          <Link href="/admin/facturacion">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </Button>

        {canAddPayment && (
          <Button onClick={() => setShowPagoDialog(true)}>
            <CreditCard className="w-4 h-4 mr-2" />
            Registrar Pago
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Modificar
            </DropdownMenuItem>
            {canAnular && (
              <DropdownMenuItem onClick={() => setShowAnularDialog(true)} className="text-red-600">
                <Ban className="w-4 h-4 mr-2" />
                Anular Factura
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog para anular factura */}
      <AlertDialog open={showAnularDialog} onOpenChange={setShowAnularDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Anular Factura?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La factura será marcada como anulada y no se podrán registrar más pagos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAnular} disabled={isPending} className="bg-red-600 hover:bg-red-700">
              {isPending ? "Anulando..." : "Anular Factura"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para registrar pago */}
      {showPagoDialog && <PagoDialog facturaId={factura.id} open={showPagoDialog} onOpenChange={setShowPagoDialog} />}
    </>
  )
}
