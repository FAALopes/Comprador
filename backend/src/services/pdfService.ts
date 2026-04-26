// pdf-parse v2 uses the PDFParse class
import { PDFParse } from "pdf-parse";

export interface ParsedItem {
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
  [key: string]: any;
}

export interface ParsedPdfContent {
  titulo: string;
  descricao: string;
  conteudoCompleto: string;
  items: ParsedItem[];
}

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: new Uint8Array(pdfBuffer) });
    const result = await parser.getText();
    await parser.destroy();
    return result.text || "";
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Falha ao extrair texto do PDF");
  }
}

/**
 * Parse Portuguese number format: "1.234,56" -> 1234.56
 */
function parsePortugueseNumber(str: string): number {
  if (!str) return NaN;
  // Remove thousand separators (.) and replace decimal comma with dot
  const normalized = str.trim().replace(/\./g, "").replace(",", ".");
  return parseFloat(normalized);
}

/**
 * Parse extracted text to find title, description, and items
 */
export function parseContent(text: string): ParsedPdfContent {
  const linhas = text.split("\n").map((line) => line.trim()).filter(Boolean);

  // Extract title (look for document type like "CONFIRMAÇÃO DE ORDEM", "GUIA", "FATURA")
  const titulo = extractTitulo(text, linhas);

  // Extract description (cliente, fornecedor, ordem number, data)
  const descricao = extractDescricao(text);

  // Extract items
  const items = extractItems(linhas);

  return {
    titulo: titulo || "Documento sem título",
    descricao: descricao || "",
    conteudoCompleto: text,
    items,
  };
}

/**
 * Extract title - look for known document types
 */
function extractTitulo(fullText: string, linhas: string[]): string {
  // Specific document types
  const docTypes = [
    "CONFIRMAÇÃO DE ORDEM",
    "GUIA DE REMESSA",
    "GUIA DE TRANSPORTE",
    "FATURA",
    "FACTURA",
    "ENCOMENDA",
    "ORÇAMENTO",
    "PROPOSTA",
    "COTAÇÃO",
  ];

  for (const docType of docTypes) {
    const regex = new RegExp(docType, "i");
    if (regex.test(fullText)) {
      // Try to find associated number
      const ordemMatch = fullText.match(/Ordem\s+(?:de\s+vendas)?\s*:?\s*([A-Z0-9]+)/i);
      const nrMatch = fullText.match(/(?:N[ºo]\.?|Nr|Num|Número)\s*:?\s*([A-Z0-9\-\/]+)/i);
      const num = ordemMatch?.[1] || nrMatch?.[1];
      return num ? `${docType} ${num}` : docType;
    }
  }

  // Fallback: first substantial line
  for (const line of linhas) {
    if (line.length > 5 && line.length < 100 && !line.startsWith("www.")) {
      return line;
    }
  }

  return "";
}

/**
 * Extract descricao - capture metadata: cliente, fornecedor, data, ordem
 */
function extractDescricao(fullText: string): string {
  const parts: string[] = [];

  // Extract cliente
  const clienteMatch = fullText.match(/Cliente[\s\S]{0,200}?\n([A-Z][^\n]+(?:LDA|S\.A\.|S\.A|SA|LIMITADA))/i);
  if (clienteMatch) {
    parts.push(`Cliente: ${clienteMatch[1].trim()}`);
  }

  // Extract ordem number
  const ordemMatch = fullText.match(/Ordem\s+de\s+vendas\s*:?\s*([A-Z0-9]+)/i);
  if (ordemMatch) {
    parts.push(`Ordem: ${ordemMatch[1]}`);
  }

  // Extract data
  const dataMatch = fullText.match(/Data\s+da\s+ordem\s*:?\s*(\d{2}[-\/]\d{2}[-\/]\d{4})/i);
  if (dataMatch) {
    parts.push(`Data: ${dataMatch[1]}`);
  }

  // Extract NIF
  const nifMatch = fullText.match(/NIF\s*:?\s*(PT?\d{9})/i);
  if (nifMatch) {
    parts.push(`NIF: ${nifMatch[1]}`);
  }

  // Extract total value
  const totalMatch = fullText.match(/Total\s+EUR[\s\S]{0,200}?([\d.]+,\d{2})\s*$/im);
  if (totalMatch) {
    parts.push(`Total: ${totalMatch[1]} EUR`);
  }

  return parts.join(" | ");
}

/**
 * Extract items from a tabular structure like "Pos. Descrição Quantidade ... Pr.Bruto Desconto Pr.Líq. Valor"
 */
function extractItems(linhas: string[]): ParsedItem[] {
  const items: ParsedItem[] = [];

  // Match item lines: starts with position number, has a quantity in format "NNN,NNNN" or "N.NNN,NNNN", and unit
  // Pattern: pos descricao quantidade unidade [tubos atados] precoBruto [desconto%] precoLiquido valorLiquido [iva]
  const itemRegex =
    /^(\d{1,4})\s+(.+?)\s+(\d{1,3}(?:\.\d{3})*,\d{4})\s+(m|kg|un|und|l|ton|m²|m³|pç|cm|mm|t)\s+(.*)$/i;

  // Pattern for trailing numbers after unit
  // matches optional: tubos(int) atados(decimal), then mandatory: precoBruto, optional: desconto%, then precoLiq, valorLiq, iva
  const trailingRegex =
    /^(?:(\d+)\s+(\d+(?:[.,]\d+)?)\s+)?([\d.]+,\d+|[\d]+,\d+)(?:\s+([\d.]+,\d+|\d+(?:,\d+)?)\s*%)?\s+([\d.]+,\d+|[\d]+(?:,\d+)?)\s+([\d.]+,\d{2})(?:\s+(\d+))?\s*$/;

  for (const linha of linhas) {
    const match = linha.match(itemRegex);
    if (!match) continue;

    const [, posStr, descricao, qtdStr, unidade, rest] = match;
    const item: ParsedItem = {
      pos: parseInt(posStr, 10),
      descricao: descricao.trim(),
      quantidade: parsePortugueseNumber(qtdStr),
      unidade: unidade.toLowerCase(),
    };

    // Try to parse trailing numbers
    const trailingMatch = rest.match(trailingRegex);
    if (trailingMatch) {
      const [
        ,
        tubosStr,
        atadosStr,
        precoBrutoStr,
        descontoStr,
        precoLiqStr,
        valorLiqStr,
        ivaStr,
      ] = trailingMatch;

      if (tubosStr) item.tubos = parseInt(tubosStr, 10);
      if (atadosStr) item.atados = parsePortugueseNumber(atadosStr);
      if (precoBrutoStr) item.precoBruto = parsePortugueseNumber(precoBrutoStr);
      if (descontoStr) item.desconto = parsePortugueseNumber(descontoStr);
      if (precoLiqStr) item.precoLiquido = parsePortugueseNumber(precoLiqStr);
      if (valorLiqStr) item.valorLiquido = parsePortugueseNumber(valorLiqStr);
      if (ivaStr) item.iva = parseInt(ivaStr, 10);
    } else {
      // Fallback: try to extract just price patterns
      const valueMatch = rest.match(/([\d.]+,\d{2})\s*$/);
      if (valueMatch) {
        item.valorLiquido = parsePortugueseNumber(valueMatch[1]);
      }
    }

    items.push(item);
  }

  return items;
}
