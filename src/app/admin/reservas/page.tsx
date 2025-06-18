import { getReservas } from "@/actions/reserva-actions"
import { getHuespedes } from "@/actions/huesped-actions"
import { ReservasCalendar } from "@/components/reservas/reservas-calendar"
import { ReservasList } from "@/components/reservas/reservas-list"
import { NuevaReservaDialog } from "@/components/reservas/nueva-reserva-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function ReservasPage() {
  const [reservasResult, huespedesResult] = await Promise.all([getReservas(), getHuespedes()])

  const reservas = reservasResult.success ? reservasResult.data : []
  const huespedes = huespedesResult.success ? huespedesResult.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-600">Gestión de reservas y calendario</p>
        </div>
        <NuevaReservaDialog huespedes={huespedes}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Reserva
          </Button>
        </NuevaReservaDialog>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <ReservasCalendar reservas={reservas} />
        </TabsContent>

        <TabsContent value="list">
          <ReservasList reservas={reservas} />
        </TabsContent>
      </Tabs>
    </div>
  )
}