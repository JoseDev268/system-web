
"use client";
import { useState } from "react";
import Chat from "./Chat";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Botón toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg focus:outline-none"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? (
          // Icono para cerrar (X)
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Icono para abrir (burbuja de chat)
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.274 0-2.474-.28-3.557-.773L3 20l1.773-5.443A7.964 7.964 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Ventana de chat */}
      {isOpen && (
        <div className="w-80 h-[600px] bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden flex flex-col">
          <Chat />
        </div>
      )}
    </div>
  );
}