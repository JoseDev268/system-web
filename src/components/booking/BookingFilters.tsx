"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Calendar, Users, Baby, Filter } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface BookingFiltersProps {
  searchParams: {
    checkin?: string
    checkout?: string
    adults?: string
    children?: string
  }
}

export function BookingFilters({ searchParams }: BookingFiltersProps) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()

  const [filters, setFilters] = useState({
    checkin: searchParams.checkin || "",
    checkout: searchParams.checkout || "",
    adults: Number.parseInt(searchParams.adults || "1"),
    children: Number.parseInt(searchParams.children || "0"),
    precioMin: 0,
    precioMax: 500,
  })



  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.checkin) params.set("checkin", filters.checkin)
    if (filters.checkout) params.set("checkout", filters.checkout)
    params.set("adults", filters.adults.toString())
    params.set("children", filters.children.toString())

    if (filters.precioMin > 0) params.set("precio_min", filters.precioMin.toString())
    if (filters.precioMax < 500) params.set("precio_max", filters.precioMax.toString())

    router.push(`/booking?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      checkin: "",
      checkout: "",
      adults: 1,
      children: 0,
      precioMin: 0,
      precioMax: 500,
    })
    router.push("/booking")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtrar Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fechas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="checkin" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Fecha de Ingreso
              </Label>
              <Input
                id="checkin"
                type="date"
                value={filters.checkin}
                onChange={(e) => handleFilterChange("checkin", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <Label htmlFor="checkout" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Fecha de Salida
              </Label>
              <Input
                id="checkout"
                type="date"
                value={filters.checkout}
                onChange={(e) => handleFilterChange("checkout", e.target.value)}
                min={filters.checkin || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Huéspedes */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="adults" className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                Adultos
              </Label>
              <Input
                id="adults"
                type="number"
                min="1"
                max="10"
                value={filters.adults}
                onChange={(e) => handleFilterChange("adults", Number.parseInt(e.target.value) || 1)}
              />
            </div>

            <div>
              <Label htmlFor="children" className="flex items-center gap-2 mb-2">
                <Baby className="w-4 h-4" />
                Niños
              </Label>
              <Input
                id="children"
                type="number"
                min="0"
                max="10"
                value={filters.children}
                onChange={(e) => handleFilterChange("children", Number.parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Rango de precios */}
          <div>
            <Label className="mb-4 block">
              Precio por noche: Bs/ {filters.precioMin} - Bs/ {filters.precioMax}
            </Label>
            <div className="space-y-4">
              <Slider
                value={[filters.precioMin, filters.precioMax]}
                onValueChange={([min, max]) => {
                  handleFilterChange("precioMin", min)
                  handleFilterChange("precioMax", max)
                }}
                max={500}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-2">
            <Button onClick={applyFilters} className="w-full bg-amber-500 hover:bg-amber-600 text-black">
              Aplicar Filtros
            </Button>
            <Button onClick={clearFilters} variant="outline" className="w-full">
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
