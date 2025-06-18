"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoShirtOutline,
  IoTicketOutline,
  IoAnalyticsOutline,
  IoDocumentTextOutline,
  IoHomeOutline,
} from "react-icons/io5";

import { useUIStore } from "@/store/ui/ui-store";
import { logout } from "@/actions/auth/logout";

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.rol === "ADMIN";

  return (
    <div>
      {/* Fondo oscuro */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
      )}

      {/* Efecto blur */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        />
      )}

      {/* Menú lateral */}
      <nav
        className={clsx(
          "fixed p-5 right-0 top-0 w-[350px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        {/* Botón de cierre */}
        <IoCloseOutline
          size={30}
          className="absolute top-5 right-5 cursor-pointer text-gray-600 hover:text-gray-900"
          onClick={() => closeMenu()}
        />

        {/* Enlaces del menú */}
        {isAuthenticated && (
          <>
            <Link
              href="/profile"
              onClick={closeMenu}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPersonOutline size={24} className="text-gray-600" />
              <span className="ml-3 text-lg">Perfil</span>
            </Link>

            <Link
              href="/checkin"
              onClick={closeMenu}
              className="flex items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={24} className="text-gray-600" />
              <span className="ml-3 text-lg">Reservas</span>
            </Link>
          </>
        )}

        {/* Botón de cierre de sesión */}
        {isAuthenticated && (
          <button
            className="flex w-full items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={() => logout()}
          >
            <IoLogOutOutline size={24} className="text-gray-600" />
            <span className="ml-3 text-lg">Cerrar sesión</span>
          </button>
        )}

        {/* Enlace de inicio de sesión */}
        {!isAuthenticated && (
          <Link
            href="/auth/login"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={closeMenu}
          >
            <IoLogInOutline size={24} className="text-gray-600" />
            <span className="ml-3 text-lg">Iniciar sesión</span>
          </Link>
        )}

        {/* Opciones de administrador */}
        {isAdmin && (
          <>
            <div className="w-full h-px bg-gray-200 my-5" />

            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoHomeOutline size={24} className="text-gray-600" />
              <span className="ml-3 text-lg">Dashboard</span>
            </Link>

            <Link
              href="/reservations"
              onClick={closeMenu}
              className="flex items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoAnalyticsOutline size={24} className="text-gray-600" />
              <span className="ml-3 text-lg">Ocupación</span>
            </Link>

            <Link
              href="/reports"
              onClick={closeMenu}
              className="flex items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoDocumentTextOutline size={24} className="text-gray-600" />
              <span className="ml-3 text-lg">Reporte Ingresos</span>
            </Link>

            <Link
              href="/rooms"
              onClick={closeMenu}
              className="flex items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoShirtOutline size={24} className="text-gray-600" />
              <span className="ml-3 text-lg">Habitaciones</span>
            </Link>

            <Link
              href="/audits"
              onClick={closeMenu}
              className="flex items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPeopleOutline size={24} className="text-gray-600" />
              <span className="ml-3 text-lg">Auditoria</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};