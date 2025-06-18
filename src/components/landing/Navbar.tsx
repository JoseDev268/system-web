"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, LogIn } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Habitaciones", href: "/habitaciones" },
    { name: "Servicios", href: "/servicios" },
    { name: "Contacto", href: "/contacto" },
    { name: "Mis Reservas", href: "/mis-reservas" },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PL</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Hotel Perla del Lago</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Link>
            </Button>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black" asChild>
              <Link href="/admin/dashboard">Dashboard</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-amber-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-amber-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 bg-amber-500 text-black font-medium rounded-md mx-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
