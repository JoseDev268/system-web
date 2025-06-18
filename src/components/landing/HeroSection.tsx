"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Baby } from "lucide-react"
// import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fechaIngreso: "",
    fechaSalida: "",
    adultos: 1,
    ninos: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Form submitted with data:", formData) // Debug

    if (!formData.fechaIngreso || !formData.fechaSalida) {
      toast.error("Por favor selecciona las fechas de ingreso y salida")
      return
    }

    const fechaIngreso = new Date(formData.fechaIngreso)
    const fechaSalida = new Date(formData.fechaSalida)

    if (fechaSalida <= fechaIngreso) {
      toast.error("La fecha de salida debe ser posterior a la fecha de ingreso")
      return
    }

    if (fechaIngreso < new Date()) {
      toast.error("La fecha de ingreso no puede ser anterior a hoy")
      return
    }

    // Navegar a la página de resultados con los parámetros
    const params = new URLSearchParams({
      checkin: formData.fechaIngreso,
      checkout: formData.fechaSalida,
      adults: formData.adultos.toString(),
      children: formData.ninos.toString(),
    })

    console.log("Navigating to:", `/booking?${params.toString()}`) // Debug
    router.push(`/booking/?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background con gradiente y elementos decorativos */}
      <div className="absolute inset-0 bg-cover bg-center z-0"
      style={{
        backgroundImage: "url('/images/hotel-bg-1.png?height=1080&width=1920')",
        filter: 'brightness(0.3)',
      }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Título principal */}
        <div className="mb-8">
          <p className="text-amber-400 text-lg font-medium mb-4 tracking-wide">DISFRUTA TUS VACACIONES CON</p>
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 mb-6 leading-tight">
            HOTEL PERLA DEL LAGO
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Déjanos planear tus vacaciones perfectas
          </p>

          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Explorar Ahora
          </Button>
        </div>

        {/* Formulario de búsqueda mejorado */}
        <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Fecha de Ingreso */}
                <div className="space-y-2">
                  <Label htmlFor="fechaIngreso" className="flex items-center text-gray-700 font-medium">
                    <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                    Fecha de Ingreso
                  </Label>
                  <Input
                    id="fechaIngreso"
                    type="date"
                    value={formData.fechaIngreso}
                    onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                {/* Fecha de Salida */}
                <div className="space-y-2">
                  <Label htmlFor="fechaSalida" className="flex items-center text-gray-700 font-medium">
                    <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                    Fecha de Salida
                  </Label>
                  <Input
                    id="fechaSalida"
                    type="date"
                    value={formData.fechaSalida}
                    onChange={(e) => setFormData({ ...formData, fechaSalida: e.target.value })}
                    min={formData.fechaIngreso || new Date().toISOString().split("T")[0]}
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                {/* Adultos */}
                <div className="space-y-2">
                  <Label htmlFor="adultos" className="flex items-center text-gray-700 font-medium">
                    <Users className="w-4 h-4 mr-2 text-amber-600" />
                    Adultos
                  </Label>
                  <Input
                    id="adultos"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.adultos}
                    onChange={(e) => setFormData({ ...formData, adultos: Number.parseInt(e.target.value) || 1 })}
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                {/* Niños */}
                <div className="space-y-2">
                  <Label htmlFor="ninos" className="flex items-center text-gray-700 font-medium">
                    <Baby className="w-4 h-4 mr-2 text-amber-600" />
                    Niños
                  </Label>
                  <Input
                    id="ninos"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.ninos}
                    onChange={(e) => setFormData({ ...formData, ninos: Number.parseInt(e.target.value) || 0 })}
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-black font-semibold px-12 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Verificar Disponibilidad
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
