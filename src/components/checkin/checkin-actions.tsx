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
import { realizarCheckout } from "@/actions/checkin-actions"
import { generarFactura } from "@/actions/factura-actions"
import { EstadoHospedaje } from "@prisma/client"
import { MoreVertical, LogOut, Receipt, ArrowLeft, Edit } from "lucide-react"
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

interface CheckinActionsProps {
    hospedaje: HospedajeWithDetails
}

export function CheckinActions({ hospedaje }: CheckinActionsProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)

    const handleCheckout = () => {
        startTransition(async () => {
            const result = await realizarCheckout(hospedaje.id)
            if (result.success) {
                toast.success("Check-out realizado correctamente")
                router.refresh()
            } else {
                toast.error(result.error || "Error al realizar el check-out")
            }
        })
    }

    const handleGenerarFactura = () => {
        startTransition(async () => {
            const result = await generarFactura(hospedaje.id, "user-id-placeholder") // En producción usar el ID real del usuario
            if (result.success) {
                toast.success("Factura generada correctamente")
                router.push(`/facturacion/${result.data?.id}`)
            } else {
                toast.error(result.error || "Error al generar la factura")
            }
        })
    }

    const canCheckout = hospedaje.estado === EstadoHospedaje.ACTIVO
    const canGenerateInvoice = hospedaje.estado === EstadoHospedaje.ACTIVO && !hospedaje.factura

    return (
        <>
            <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                    <Link href="/checkin">
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
                        {canCheckout && (
                            <DropdownMenuItem onClick={() => setShowCheckoutDialog(true)} className="text-red-600">
                                <LogOut className="w-4 h-4 mr-2" />
                                Realizar Check-out
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Dialog para check-out */}
            <AlertDialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Realizar Check-out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción finalizará el hospedaje y liberará la habitación para limpieza. ¿Está seguro de continuar?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCheckout} disabled={isPending}>
                            {isPending ? "Procesando..." : "Realizar Check-out"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
