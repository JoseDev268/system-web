import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { formatDateTime, getEstadoColor } from "@/lib/utils"
import { MessageSquare, Send, Mail, Phone, MessageCircle, Plus } from "lucide-react"
import { SendWhatsAppButton } from "@/components/mensajes/SendWhatsAppButton"

async function getMensajes() {
  return await prisma.mensaje.findMany({
    where: { deletedAt: null },
    include: {
      remitenteUser: true,
      destinatarioUser: true,
      remitenteHuesped: true,
      destinatarioHuesped: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
}

function getCanalIcon(canal: string) {
  switch (canal) {
    case "EMAIL":
      return <Mail className="h-4 w-4" />
    case "SMS":
      return <Phone className="h-4 w-4" />
    case "WHATSAPP":
      return <MessageCircle className="h-4 w-4" />
    case "INTERNO":
      return <MessageSquare className="h-4 w-4" />
    default:
      return <Send className="h-4 w-4" />
  }
}

export default async function MensajesPage() {
  const mensajes = await getMensajes()

  const stats = {
    total: mensajes.length,
    pendientes: mensajes.filter((m) => m.estado === "PENDIENTE").length,
    enviados: mensajes.filter((m) => m.estado === "ENVIADO").length,
    leidos: mensajes.filter((m) => m.estado === "LEIDO").length,
    errores: mensajes.filter((m) => m.estado === "ERROR").length,
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Centro de Mensajes</h1>
          <p className="text-muted-foreground">Gestiona la comunicación con huéspedes y staff</p>
        </div>
        <SendWhatsAppButton />
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Mensaje
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviados</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.enviados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leídos</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.leidos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errores</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.errores}</div>
          </CardContent>
        </Card>
      </div>

      {/* Mensajes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Mensajes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Canal</TableHead>
                <TableHead>Remitente</TableHead>
                <TableHead>Destinatario</TableHead>
                <TableHead>Contenido</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mensajes.map((mensaje) => (
                <TableRow key={mensaje.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCanalIcon(mensaje.canal)}
                      <Badge variant="outline">{mensaje.canal}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {mensaje.remitenteUser?.name || mensaje.remitenteHuesped?.nombre || "Sistema"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {mensaje.destinatarioUser?.name || mensaje.destinatarioHuesped?.nombre || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm">{mensaje.contenido}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(mensaje.estado)}>{mensaje.estado}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">{formatDateTime(mensaje.createdAt)}</div>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">
                      Ver Detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
