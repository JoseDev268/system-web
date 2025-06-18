'use client';

import Link from 'next/link';
import { MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-8 w-8 text-amber-500" aria-label="Hotel Perla del Lago" />
              <span className="text-xl font-bold text-white">Hotel Perla del Lago</span>
            </div>
            <p className="mb-4 text-gray-400">
              Disfruta de una experiencia única en Copacabana con vistas al Lago Titicaca y servicios de primera clase.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://facebook.com/perladelago"
                className="hover:text-amber-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com/perladelago"
                className="hover:text-amber-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://instagram.com/perladelago"
                className="hover:text-amber-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://youtube.com/perladelago"
                className="hover:text-amber-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#rooms" className="hover:text-amber-400 transition-colors">
                  Habitaciones
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-amber-400 transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-amber-400 transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition-colors">
                  Galería
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>3 de Mayo, Copacabana, La Paz, Bolivia</li>
              <li>(+591) 6899122</li>
              <li>info@perladelago.com</li>
            </ul>
          </div>

          {/* Boletín */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Boletín</h3>
            <p className="mb-4 text-gray-400">
              Suscríbete para recibir ofertas exclusivas y novedades del Hotel Perla del Lago.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Tu email"
                className="px-3 py-2 bg-gray-800 border-gray-700 text-white"
              />
              <Button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium">
                Enviar
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Hotel Perla del Lago. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}