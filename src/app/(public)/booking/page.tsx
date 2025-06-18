import { buscarDisponibilidad } from "@/actions/public-actions"
import { BookingResults } from "@/components/booking/BookingResults"
import { BookingFilters } from "@/components/booking/BookingFilters"
import { Navbar } from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Suspense } from "react"

interface BookingPageProps {
    searchParams: {
        checkin?: string
        checkout?: string
        adults?: string
        children?: string
    }
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
    let resultados = null
    let error = null

    // Si hay parámetros de búsqueda, realizar la búsqueda
    if (searchParams.checkin && searchParams.checkout && searchParams.adults) {
        const fechaIngreso = new Date(searchParams.checkin)
        const fechaSalida = new Date(searchParams.checkout)
        const adultos = Number.parseInt(searchParams.adults) || 1
        const ninos = Number.parseInt(searchParams.children || "0")

        const result = await buscarDisponibilidad({
            fechaIngreso,
            fechaSalida,
            adultos,
            ninos,
        })

        if (result.success) {
            resultados = result.data
        } else {
            error = result.error
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl font-bold text-center mb-2">Hotel Perla del Lago - Habitaciones Disponibles</h1>
                        {resultados && (
                            <p className="text-center text-blue-100">
                                Check-in: {new Date(resultados.parametrosBusqueda.fechaIngreso).toLocaleDateString("es-BO")} |
                                Check-out: {new Date(resultados.parametrosBusqueda.fechaSalida).toLocaleDateString("es-BO")} |
                                Huéspedes: {resultados.parametrosBusqueda.adultos} adultos, {resultados.parametrosBusqueda.ninos} niños
                            </p>
                        )}
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Filtros laterales */}
                        <div className="lg:col-span-1">
                            <Suspense fallback={<div>Cargando filtros...</div>}>
                                <BookingFilters searchParams={searchParams} />
                            </Suspense>
                        </div>

                        {/* Resultados */}
                        <div className="lg:col-span-3">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                                    <h3 className="text-red-800 font-semibold mb-2">Error en la búsqueda</h3>
                                    <p className="text-red-600">{error}</p>
                                </div>
                            )}

                            {!resultados && !error && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                                    <h3 className="text-blue-800 font-semibold mb-2">Realiza una búsqueda</h3>
                                    <p className="text-blue-600">Utiliza los filtros para encontrar habitaciones disponibles</p>
                                </div>
                            )}

                            {resultados && (
                                <BookingResults
                                    habitaciones={resultados.habitaciones}
                                    parametrosBusqueda={resultados.parametrosBusqueda}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
