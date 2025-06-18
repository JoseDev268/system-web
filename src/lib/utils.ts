import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("es-BO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function getEstadoColor(estado: string): string {
  const colors: Record<string, string> = {
    DISPONIBLE: "bg-green-100 text-green-800",
    OCUPADA: "bg-red-100 text-red-800",
    LIMPIEZA: "bg-yellow-100 text-yellow-800",
    RESERVADA: "bg-blue-100 text-blue-800",
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    CONFIRMADA: "bg-green-100 text-green-800",
    CANCELADA: "bg-red-100 text-red-800",
    ACTIVO: "bg-green-100 text-green-800",
    FINALIZADO: "bg-gray-100 text-gray-800",
    EMITIDA: "bg-blue-100 text-blue-800",
    ANULADA: "bg-red-100 text-red-800",
  }
  return colors[estado] || "bg-gray-100 text-gray-800"
}
