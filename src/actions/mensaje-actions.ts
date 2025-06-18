"use server"

import { prisma } from "@/lib/prisma"
import { createMensajeSchema, type CreateMensajeInput } from "@/lib/validations"
import { EstadoMensaje, CanalMensaje } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function enviarMensaje(data: CreateMensajeInput, remitenteUserId: string) {
  try {
    const validatedData = createMensajeSchema.parse(data)

    const mensaje = await prisma.mensaje.create({
      data: {
        ...validatedData,
        remitenteUserId,
        estado: EstadoMensaje.PENDIENTE,
      },
    })

    // Aquí se integraría con servicios externos (WhatsApp, Email, etc.)
    await procesarEnvioMensaje(mensaje)

    revalidatePath("/mensajes")
    return { success: true, data: mensaje }
  } catch (error) {
    console.error("Error sending mensaje:", error)
    return { success: false, error: "Error al enviar el mensaje" }
  }
}

async function procesarEnvioMensaje(mensaje: any) {
  try {
    // Simular envío según el canal
    switch (mensaje.canal) {
      case CanalMensaje.EMAIL:
        // Integración con servicio de email (SendGrid, etc.)
        await simularEnvioEmail(mensaje)
        break
      case CanalMensaje.WHATSAPP:
        // Integración con WhatsApp Business API
        await simularEnvioWhatsApp(mensaje)
        break
      case CanalMensaje.SMS:
        // Integración con servicio SMS
        await simularEnvioSMS(mensaje)
        break
      default:
        // Mensaje interno
        break
    }

    await prisma.mensaje.update({
      where: { id: mensaje.id },
      data: { estado: EstadoMensaje.ENVIADO },
    })
  } catch (error) {
    await prisma.mensaje.update({
      where: { id: mensaje.id },
      data: {
        estado: EstadoMensaje.ERROR,
        errorMensaje: error instanceof Error ? error.message : "Error desconocido",
      },
    })
  }
}

async function simularEnvioEmail(mensaje: any) {
  // Simular delay de envío
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Email enviado:", mensaje.contenido)
}

async function simularEnvioWhatsApp(mensaje: any) {
  // Simular delay de envío
  await new Promise((resolve) => setTimeout(resolve, 1500))
  console.log("WhatsApp enviado:", mensaje.contenido)
}

async function simularEnvioSMS(mensaje: any) {
  // Simular delay de envío
  await new Promise((resolve) => setTimeout(resolve, 800))
  console.log("SMS enviado:", mensaje.contenido)
}

export async function getMensajes() {
  try {
    const mensajes = await prisma.mensaje.findMany({
      where: { deletedAt: null },
      include: {
        remitenteUser: true,
        destinatarioUser: true,
        remitenteHuesped: true,
        destinatarioHuesped: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: mensajes }
  } catch (error) {
    console.error("Error fetching mensajes:", error)
    return { success: false, error: "Error al obtener los mensajes" }
  }
}

export async function marcarMensajeComoLeido(id: string) {
  try {
    const mensaje = await prisma.mensaje.update({
      where: { id },
      data: { estado: EstadoMensaje.LEIDO },
    })

    revalidatePath("/mensajes")
    return { success: true, data: mensaje }
  } catch (error) {
    console.error("Error marking mensaje as read:", error)
    return { success: false, error: "Error al marcar el mensaje como leído" }
  }
}
