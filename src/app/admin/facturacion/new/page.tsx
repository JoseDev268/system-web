import { getHospedajesSinFactura } from "@/actions/hospedaje-actions"
import { getProductos } from "@/actions/producto-actions"
import { NuevaFacturaForm } from "@/components/facturacion/nueva-factura-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NuevaFacturaPage() {
    const [hospedajesResult, productosResult] = await Promise.all([getHospedajesSinFactura(), getProductos()])

    const hospedajes = hospedajesResult.success ? hospedajesResult.data : []
    const productos = productosResult.success ? productosResult.data : []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Nueva Factura</h1>
                    <p className="text-gray-600">Hotel Perla del Lago - Generar factura manual</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/facturacion">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Datos de Facturación</CardTitle>
                </CardHeader>
                <CardContent>
                    <NuevaFacturaForm hospedajes={hospedajes} productos={productos} />
                </CardContent>
            </Card>
        </div>
    )
}
