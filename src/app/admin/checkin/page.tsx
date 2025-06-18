import { getReservasParaCheckin, getHospedajesActivos } from "@/actions/checkin-actions"
import { CheckinList } from "@/components/checkin/checkin-list"
import { CheckoutList } from "@/components/checkin/checkout-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function CheckinPage() {
  const [reservasResult, hospedajesResult] = await Promise.all([getReservasParaCheckin(), getHospedajesActivos()])

  const reservas = reservasResult.success ? reservasResult.data : []
  const hospedajes = hospedajesResult.success ? hospedajesResult.data : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Check-in / Check-out</h1>
        <p className="text-gray-600">Gestión de ingresos y salidas de huéspedes</p>
      </div>

      <Tabs defaultValue="checkin" className="space-y-4">
        <TabsList>
          <TabsTrigger value="checkin">Check-in ({reservas.length})</TabsTrigger>
          <TabsTrigger value="checkout">Check-out ({hospedajes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="checkin">
          <CheckinList reservas={reservas} />
        </TabsContent>

        <TabsContent value="checkout">
          <CheckoutList hospedajes={hospedajes} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
