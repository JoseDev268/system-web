"use server"

import { prisma } from "@/lib/prisma"

export async function createAuditoria(
  entidad: string,
  entidadId: string,
  accion: string,
  descripcion: string,
  usuarioId?: string,
) {
  try {
    await prisma.auditoria.create({
      data: {
        entidad,
        entidadId,
        accion,
        descripcion,
        usuarioId,
      },
    })
  } catch (error) {
    console.error("Error creating audit log:", error)
  }
}

export async function getAuditorias(page = 1, limit = 50) {
  const skip = (page - 1) * limit

  const [auditorias, total] = await Promise.all([
    prisma.auditoria.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        usuario: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.auditoria.count(),
  ])

  return {
    auditorias,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  }
}

export async function getAuditoriasPorEntidad(entidad: string, entidadId: string) {
  return await prisma.auditoria.findMany({
    where: {
      entidad,
      entidadId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      usuario: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })
}
