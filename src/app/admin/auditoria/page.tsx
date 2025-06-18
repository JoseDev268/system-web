"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAuditorias } from "@/actions/auditoria"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Shield, User, Calendar } from "lucide-react"

interface AuditoriaData {
  id: string
  entidad: string
  entidadId: string
  accion: string
  descripcion: string
  createdAt: Date
  usuario: {
    name: string
    email: string
  } | null
}

interface AuditoriasResponse {
  auditorias: AuditoriaData[]
  total: number
  pages: number
  currentPage: number
}

export default function AuditoriaPage() {
  const [auditorias, setAuditorias] = useState<AuditoriasResponse>({
    auditorias: [],
    total: 0,
    pages: 0,
    currentPage: 1,
  })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const loadAuditorias = async (page = 1) => {
    setLoading(true)
    try {
      const data = await getAuditorias(page, 50)
      setAuditorias(data)
      setCurrentPage(page)
    } catch (error) {
      console.error("Error loading audit logs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuditorias()
  }, [])

  const getAccionColor = (accion: string) => {
    switch (accion.toUpperCase()) {
      case "CREATE":
        return "bg-green-100 text-green-800"
      case "UPDATE":
      case "UPDATE_ESTADO":
        return "bg-blue-100 text-blue-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEntidadIcon = (entidad: string) => {
    switch (entidad.toLowerCase()) {
      case "habitacion":
        return "🏠"
      case "reserva":
        return "📅"
      case "huesped":
        return "👤"
      case "factura":
        return "🧾"
      case "pago":
        return "💳"
      default:
        return "📋"
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando registros de auditoría...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Auditoría del Sistema</h1>
        <p className="text-gray-600">Registro completo de todas las acciones realizadas en el sistema</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditorias.total}</div>
            <p className="text-xs text-muted-foreground">Acciones registradas en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                auditorias.auditorias.filter(
                  (a) => format(new Date(a.createdAt), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Acciones realizadas hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(auditorias.auditorias.filter((a) => a.usuario).map((a) => a.usuario!.email)).size}
            </div>
            <p className="text-xs text-muted-foreground">Usuarios con actividad reciente</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Auditoría</CardTitle>
          <CardDescription>Historial completo de acciones realizadas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditorias.auditorias.map((auditoria) => (
                <TableRow key={auditoria.id}>
                  <TableCell className="font-mono text-sm">
                    {format(new Date(auditoria.createdAt), "dd/MM/yyyy HH:mm:ss", { locale: es })}
                  </TableCell>
                  <TableCell>
                    {auditoria.usuario ? (
                      <div>
                        <div className="font-medium">{auditoria.usuario.name}</div>
                        <div className="text-sm text-muted-foreground">{auditoria.usuario.email}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Sistema</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getEntidadIcon(auditoria.entidad)}</span>
                      <span>{auditoria.entidad}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getAccionColor(auditoria.accion)}>{auditoria.accion}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate" title={auditoria.descripcion}>
                      {auditoria.descripcion}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {auditorias.pages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Página {auditorias.currentPage} de {auditorias.pages}({auditorias.total} registros totales)
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadAuditorias(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadAuditorias(currentPage + 1)}
                  disabled={currentPage >= auditorias.pages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
