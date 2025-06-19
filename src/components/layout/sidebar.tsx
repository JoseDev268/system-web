"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Bed, Users, Calendar, Receipt, MessageSquare, BarChart3, Settings, Package, User, WholeWordIcon, Shield, TrendingUpDown } from "lucide-react"

const navigation = [
  // { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Habitaciones", href: "/admin/habitaciones", icon: Bed },
  { name: "Huéspedes", href: "/admin/huespedes", icon: Users },
  { name: "Reservas", href: "/admin/reservas", icon: Calendar },
  { name: "Hospedajes", href: "/admin/hospedajes", icon: Receipt },
  { name: "Facturación", href: "/admin/facturacion", icon: Receipt },
  { name: "Check-in/out", href: "/admin/checkin", icon: User },
  { name: "Productos", href: "/admin/productos", icon: Package },
  { name: "Mensajes", href: "/admin/mensajes", icon: MessageSquare },
  { name: "Reportes", href: "/admin/reportes", icon: BarChart3 },
  { name: "Configuración", href: "/admin/configuracion", icon: Settings },
  { name: "Auditoría", href: "/admin/auditoria", icon: Shield },
  { name: "Prediccion", href: "/admin/prediccion", icon: TrendingUpDown },
  { name: "Web", href: "/", icon: WholeWordIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 bg-primary">
        <h1 className="text-xl font-bold text-white">Hotel Perla del Lago</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
