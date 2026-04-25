-- CreateTable
CREATE TABLE "GuiasEntrada" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descricao" TEXT NOT NULL,
    "conteudoCompleto" TEXT NOT NULL,
    "items" JSONB NOT NULL DEFAULT '[]',
    "nomeFile" VARCHAR(255) NOT NULL,
    "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuiasEntrada_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuiasEntrada_dataUpload_idx" ON "GuiasEntrada"("dataUpload");

-- CreateIndex
CREATE INDEX "GuiasEntrada_titulo_idx" ON "GuiasEntrada"("titulo");
