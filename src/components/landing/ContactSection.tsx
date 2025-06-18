'use client';

import { Button, Textarea, Input } from '@/components';
import { MapPin, Phone, Mail, Clock, Coffee, Wifi, Car } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contáctanos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte con cualquier consulta o reserva. No dudes en ponerte en contacto con nosotros.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-800">Información de Contacto</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                  <MapPin className="h-6 w-6" aria-label="Dirección" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Dirección</h4>
                  <p className="text-gray-600">
                    3 de Mayo, Copacabana
                    <br />
                    La Paz, Bolivia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                  <Phone className="h-6 w-6" aria-label="Teléfono" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Teléfono</h4>
                  <p className="text-gray-600">
                    (+591) 6899122
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                  <Mail className="h-6 w-6" aria-label="Email" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-gray-600">
                    reservas@perladelago.com
                    <br />
                    info@perladelago.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                  <Clock className="h-6 w-6" aria-label="Horario" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Horario</h4>
                  <p className="text-gray-600">
                    Lunes - Domingo
                    <br />
                    8:00 - 22:00
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ventajas de Hospedarse con Nosotros
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                    <Coffee className="h-5 w-5" aria-label="Desayuno" />
                  </div>
                  <span className="text-gray-600">
                    Desayuno incluido en todas las reservas
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                    <Wifi className="h-5 w-5" aria-label="WiFi" />
                  </div>
                  <span className="text-gray-600">
                    WiFi de alta velocidad en todas las áreas
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                    <Car className="h-5 w-5" aria-label="Transporte" />
                  </div>
                  <span className="text-gray-600">
                    Servicio de transporte al aeropuerto (consultar disponibilidad)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Envíanos un Mensaje
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <Input id="name" placeholder="Tu nombre" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  Asunto
                </label>
                <Input id="subject" placeholder="Asunto de tu mensaje" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  placeholder="Escribe tu mensaje aquí..."
                  rows={5}
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Enviar Mensaje
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}