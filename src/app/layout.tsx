import type { Metadata } from "next";
// import { Roboto } from "@/config/fonts"; // Asegúrate de que esta fuente esté configurada
import "./globals.css"; // Importa los estilos globales
import { Providers } from "@/components/provider/Provider";
import { inter } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    template: "%s - HotelApp", // Cambia el nombre del proyecto
    default: "Inicio - HotelApp", // Título predeterminado
  },
  description: "Una plataforma integral para la gestión hotelera", // Descripción actualizada
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es"> {/* Cambia el idioma si es necesario */}
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}