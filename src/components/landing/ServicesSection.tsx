'use client';

import { Wifi, Car, Plane, Coffee, Tag } from 'lucide-react';

interface Service {
  icon: JSX.Element;
  title: string;
  description: string;
}

export function ServicesSection() {
  const services: Service[] = [
    {
      icon: <Wifi className="h-10 w-10 text-blue-600" aria-label="WiFi" />,
      title: 'WiFi',
      description: 'Conexión WiFi de alta velocidad sin interferencias.',
    },
    {
      icon: <Car className="h-10 w-10 text-blue-600" aria-label="Transporte" />,
      title: 'Transporte',
      description: 'Servicio de recogida desde el aeropuerto o estación.',
    },
    {
      icon: <Coffee className="h-10 w-10 text-blue-600" aria-label="Desayuno" />,
      title: 'Desayuno',
      description: 'Desayuno completo incluido en todas las habitaciones.',
    },
    {
      icon: <Tag className="h-10 w-10 text-blue-600" aria-label="Ofertas" />,
      title: 'Ofertas',
      description: 'Promociones exclusivas para huéspedes frecuentes.',
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 items-center mb-12 bg-[linear-gradient(to_right,white_40%,#f59e0b_60%)] rounded-lg p-6">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">
              Servicio completo, a tu disposición
            </h2>
            <p className="text-lg text-gray-600">
              Más de lo que puedas imaginar, diseñado para tu comodidad.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-4 bg-blue-50 rounded-full">
                {service.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}