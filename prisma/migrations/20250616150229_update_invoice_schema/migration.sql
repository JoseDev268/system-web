/*
  Warnings:

  - Added the required column `subtotalBase` to the `Factura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "EstadoFactura" ADD VALUE 'PENDIENTE';

-- AlterTable
ALTER TABLE "Factura" ADD COLUMN     "descuento" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "subtotalBase" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "usuarioId" TEXT;

-- CreateIndex
CREATE INDEX "Factura_numeroFactura_idx" ON "Factura"("numeroFactura");

-- CreateIndex
CREATE INDEX "Factura_usuarioId_idx" ON "Factura"("usuarioId");

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
