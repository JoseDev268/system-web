"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDateTime } from "@/lib/utils"
import { CanalMensaje, EstadoMensaje } from "@prisma/client"
import { Mail, MessageCircle, Phone, Send, CheckCircle, AlertCircle, Clock } from "lucide-react"

type MensajeWithDetails = {
  id: string
  canal: CanalMensaje
  contenido: string
  estado: EstadoMensaje
  errorMensaje: string | null
  createdAt: Date
  remitenteUser: {
    name: string
  } | null
  destinatarioUser: {
    name: string
  } | null
  destinatarioHuesped: {
    nombre: string
  } | null
}

interface MensajesListProps {
  mensajes: MensajeWithDetails[]
}

export function MensajesList({ mensajes }: MensajesListProps) {
  const getCanalIcon = (canal: CanalMensaje) => {
    switch (canal) {
      case CanalMensaje.EMAIL:
        return <Mail className="w-4 h-4" />
      case CanalMensaje.WHATSAPP:
        return <MessageCircle className="w-4 h-4" />
      case CanalMensaje.SMS:
        return <Phone className="w-4 h-4" />
      default:
        return <Send className="w-4 h-4" />
    }
  }

  const getEstadoIcon = (estado: EstadoMensaje) => {
    switch (estado) {
      case EstadoMensaje.ENVIADO:
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case EstadoMensaje.LEIDO:
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      case EstadoMensaje.ERROR:
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getEstadoColor = (estado: EstadoMensaje) => {
    switch (estado) {
      case EstadoMensaje.ENVIADO:
        return "bg-green-100 text-green-800"
      case EstadoMensaje.LEIDO:
        return "bg-blue-100 text-blue-800"
      case EstadoMensaje.ERROR:
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Mensajes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Canal</TableHead>
              <TableHead>Destinatario</TableHead>
              <TableHead>Contenido</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mensajes.map((mensaje) => (
              <TableRow key={mensaje.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getCanalIcon(mensaje.canal)}
                    <span className="text-sm">{mensaje.canal}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {mensaje.destinatarioUser?.name || mensaje.destinatarioHuesped?.nombre || "Desconocido"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate text-sm">{mensaje.contenido}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getEstadoIcon(mensaje.estado)}
                    <Badge className={getEstadoColor(mensaje.estado)}>{mensaje.estado}</Badge>
                  </div>
                  {mensaje.errorMensaje && <div className="text-xs text-red-500 mt-1">{mensaje.errorMensaje}</div>}
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatDateTime(new Date(mensaje.createdAt))}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
