// Use environment variable if available, otherwise use production backend URL
const API_URL = import.meta.env.VITE_API_URL || "https://cheerful-amazement-production-c567.up.railway.app/api";

export interface GuiaItem {
  pos?: number;
  descricao: string;
  quantidade?: number;
  unidade?: string;
  tubos?: number;
  atados?: number;
  precoBruto?: number;
  desconto?: number;
  precoLiquido?: number;
  valorLiquido?: number;
  iva?: number;
  preco?: number;
  [key: string]: any;
}

export interface GuiaEntrada {
  id: string;
  titulo: string;
  descricao: string;
  conteudoCompleto: string;
  items: GuiaItem[];
  nomeFile: string;
  dataUpload: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Upload a PDF file and create a new Guia de Entrada
 */
export async function uploadGuia(file: File): Promise<GuiaEntrada> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/guias/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao fazer upload do arquivo");
  }

  const data = await response.json();
  return data.guia;
}

/**
 * Get all guias de entrada
 */
export async function getAllGuias(): Promise<GuiaEntrada[]> {
  const response = await fetch(`${API_URL}/guias`);

  if (!response.ok) {
    throw new Error("Erro ao buscar guias");
  }

  const data = await response.json();
  return data.guias || [];
}

/**
 * Get a single guia by ID
 */
export async function getGuiaById(id: string): Promise<GuiaEntrada> {
  const response = await fetch(`${API_URL}/guias/${id}`);

  if (!response.ok) {
    throw new Error("Guia não encontrada");
  }

  const data = await response.json();
  return data.guia;
}

/**
 * Delete a guia
 */
export async function deleteGuia(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/guias/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar guia");
  }
}

/**
 * Reprocess existing guia (re-runs parser on stored content)
 */
export async function reprocessGuia(id: string): Promise<GuiaEntrada> {
  const response = await fetch(`${API_URL}/guias/${id}/reprocess`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Erro ao reprocessar guia");
  }

  const data = await response.json();
  return data.guia;
}

/**
 * Update a guia
 */
export async function updateGuia(
  id: string,
  data: Partial<GuiaEntrada>
): Promise<GuiaEntrada> {
  const response = await fetch(`${API_URL}/guias/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar guia");
  }

  const result = await response.json();
  return result.guia;
}
