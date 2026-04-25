import { Request, Response } from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { extractTextFromPdf, parseContent } from "../services/pdfService.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "postgresql://user:password@localhost/db",
});

const prisma = new PrismaClient({ adapter });

/**
 * Upload and process PDF file
 * POST /api/guias/upload
 */
export async function uploadGuia(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
    }

    const pdfBuffer = req.file.buffer;
    const nomeFile = req.file.originalname;

    // Extract text from PDF
    const conteudoExtraido = await extractTextFromPdf(pdfBuffer);

    // Parse content to extract structured data
    const parsed = parseContent(conteudoExtraido);

    // Save to database
    const guia = await prisma.guiasEntrada.create({
      data: {
        titulo: parsed.titulo,
        descricao: parsed.descricao,
        conteudoCompleto: parsed.conteudoCompleto,
        items: parsed.items,
        nomeFile: nomeFile,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Guia de Entrada criada com sucesso",
      guia,
    });
  } catch (error) {
    console.error("Error uploading guia:", error);
    return res.status(500).json({
      error: "Erro ao processar o arquivo PDF",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * Get all guias
 * GET /api/guias
 */
export async function getAllGuias(req: Request, res: Response) {
  try {
    const guias = await prisma.guiasEntrada.findMany({
      orderBy: {
        dataUpload: "desc",
      },
    });

    return res.json({
      success: true,
      count: guias.length,
      guias,
    });
  } catch (error) {
    console.error("Error fetching guias:", error);
    return res.status(500).json({
      error: "Erro ao buscar guias de entrada",
    });
  }
}

/**
 * Get guia by ID
 * GET /api/guias/:id
 */
export async function getGuiaById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const guia = await prisma.guiasEntrada.findUnique({
      where: { id },
    });

    if (!guia) {
      return res.status(404).json({
        error: "Guia de Entrada não encontrada",
      });
    }

    return res.json({
      success: true,
      guia,
    });
  } catch (error) {
    console.error("Error fetching guia:", error);
    return res.status(500).json({
      error: "Erro ao buscar guia de entrada",
    });
  }
}

/**
 * Delete guia by ID
 * DELETE /api/guias/:id
 */
export async function deleteGuia(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const guia = await prisma.guiasEntrada.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Guia de Entrada removida com sucesso",
      guia,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        error: "Guia de Entrada não encontrada",
      });
    }

    console.error("Error deleting guia:", error);
    return res.status(500).json({
      error: "Erro ao remover guia de entrada",
    });
  }
}

/**
 * Update guia by ID
 * PATCH /api/guias/:id
 */
export async function updateGuia(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { titulo, descricao, items } = req.body;

    const guia = await prisma.guiasEntrada.update({
      where: { id },
      data: {
        ...(titulo && { titulo }),
        ...(descricao && { descricao }),
        ...(items && { items }),
      },
    });

    return res.json({
      success: true,
      message: "Guia de Entrada atualizada com sucesso",
      guia,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        error: "Guia de Entrada não encontrada",
      });
    }

    console.error("Error updating guia:", error);
    return res.status(500).json({
      error: "Erro ao atualizar guia de entrada",
    });
  }
}
