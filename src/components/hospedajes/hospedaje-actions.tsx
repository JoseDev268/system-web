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
import { updateHospedaje, deleteHospedaje } from "@/actions/hospedaje-actions"
import { crearFacturaManual } from "@/actions/factura-actions"
import { EstadoHospedaje } from "@prisma/client"
import { MoreVertical, LogOut, Receipt, ArrowLeft, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

type HospedajeWithDetails = {
  id: string
  estado: EstadoHospedaje
  factura?: {
    id: string
  } | null
}

interface HospedajeActionsProps {
  hospedaje: HospedajeWithDetails
}

export function HospedajeActions({ hospedaje }: HospedajeActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showFinalizarDialog, setShowFinalizarDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleFinalizar = () => {
    startTransition(async () => {
      const result = await updateHospedaje(hospedaje.id, {
        estado: EstadoHospedaje.FINALIZADO,
        fechaSalida: new Date(),
      })
      if (result.success) {
        toast.success("Hospedaje finalizado correctamente")
        router.refresh()
      } else {
        toast.error(result.error || "Error al finalizar el hospedaje")
      }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteHospedaje(hospedaje.id)
      if (result.success) {
        toast.success("Hospedaje eliminado correctamente")
        router.push("/hospedajes")
      } else {
        toast.error(result.error || "Error al eliminar el hospedaje")
      }
    })
  }

  const handleGenerarFactura = () => {
    startTransition(async () => {
      const result = await crearFacturaManual({
        fichaHospedajeId: hospedaje.id,
        consumosExtras: [],
      })
      if (result.success) {
        toast.success("Factura generada correctamente")
        router.push(`/facturacion/${result.data?.id}`)
      } else {
        toast.error(result.error || "Error al generar la factura")
      }
    })
  }

  const canFinalize = hospedaje.estado === EstadoHospedaje.ACTIVO
  const canGenerateInvoice = hospedaje.estado === EstadoHospedaje.ACTIVO && !hospedaje.factura
  const canDelete = !hospedaje.factura

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button variant="outline" asChild>
          <Link href="/hospedajes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </Button>

        {canGenerateInvoice && (
          <Button onClick={handleGenerarFactura} disabled={isPending}>
            <Receipt className="w-4 h-4 mr-2" />
            Generar Factura
          </Button>
        )}

        {hospedaje.factura && (
          <Button variant="outline" asChild>
            <Link href={`/facturacion/${hospedaje.factura.id}`}>
              <Receipt className="w-4 h-4 mr-2" />
              Ver Factura
            </Link>
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
              <Edit className="w-4 h-4 mr-2" />
              Editar Hospedaje
            </DropdownMenuItem>
            {canFinalize && (
              <DropdownMenuItem onClick={() => setShowFinalizarDialog(true)}>
                <LogOut className="w-4 h-4 mr-2" />
                Finalizar Hospedaje
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Hospedaje
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog para finalizar hospedaje */}
      <AlertDialog open={showFinalizarDialog} onOpenChange={setShowFinalizarDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Finalizar Hospedaje?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción finalizará el hospedaje y liberará la habitación para limpieza. ¿Está seguro de continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalizar} disabled={isPending}>
              {isPending ? "Procesando..." : "Finalizar Hospedaje"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para eliminar hospedaje */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Hospedaje?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El hospedaje será eliminado permanentemente.
              {hospedaje.factura && " No se puede eliminar un hospedaje con factura emitida."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending || !!hospedaje.factura}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Eliminando..." : "Eliminar Hospedaje"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
