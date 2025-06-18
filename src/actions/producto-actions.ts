"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getProductos() {
    try {
        const productos = await prisma.producto.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: { nombre: "asc" },
        })

        return { success: true, data: productos }
    } catch (error) {
        console.error("Error fetching productos:", error)
        return { success: false, error: "Error al obtener los productos" }
    }
}

export async function createProducto(data: {
    nombre: string
    descripcion: string
    precio: number
    stock: number
}) {
    try {
        const producto = await prisma.producto.create({
            data: {
                ...data,

            },
        })

        revalidatePath("/productos")
        return { success: true, data: producto }
    } catch (error) {
        console.error("Error creating producto:", error)
        return { success: false, error: "Error al crear el producto" }
    }
}

export async function updateProducto(
    id: string,
    data: {
        nombre?: string
        descripcion?: string
        precio?: number
        stock?: number
        activo?: boolean
    },
) {
    try {
        const producto = await prisma.producto.update({
            where: { id },
            data,
        })

        revalidatePath("/productos")
        return { success: true, data: producto }
    } catch (error) {
        console.error("Error updating producto:", error)
        return { success: false, error: "Error al actualizar el producto" }
    }
}
