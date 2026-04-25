// Dynamic import for pdf-parse (CommonJS module)
let pdfParse: any;

async function initPdfParse() {
  if (!pdfParse) {
    const module = await import("pdf-parse");
    pdfParse = module.default;
  }
  return pdfParse;
}

export interface ParsedPdfContent {
  titulo: string;
  descricao: string;
  conteudoCompleto: string;
  items: Array<{
    descricao: string;
    quantidade?: number;
    unidade?: string;
    preco?: number;
    [key: string]: any;
  }>;
}

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
  try {
    const pdfParseFunc = await initPdfParse();
    const data = await pdfParseFunc(pdfBuffer);
    return data.text || "";
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Falha ao extrair texto do PDF");
  }
}

/**
 * Parse extracted text to find title, description, and items
 */
export function parseContent(text: string): ParsedPdfContent {
  const linhas = text.split("\n").filter((line) => line.trim());

  // Try to find titulo (usually first non-empty lines or marked with "Documento:", "Título:", etc)
  let titulo = extractTitulo(linhas);

  // Try to find descricao
  let descricao = extractDescricao(linhas, titulo);

  // Try to find items
  let items = extractItems(text, linhas);

  return {
    titulo: titulo || "Sem Título",
    descricao: descricao || "",
    conteudoCompleto: text,
    items,
  };
}

/**
 * Extract titulo from document
 */
function extractTitulo(linhas: string[]): string {
  // Look for common title patterns
  const titlePatterns = [
    /^(Encomenda|Oferta|Cotação|Proposta|Guia|Relatório)[\s:]+(.*?)$/i,
    /^(TÍTULO|DOCUMENT|ORDER|QUOTE):?\s*(.*?)$/i,
    /Nº[\s:]*(\d+).*?(Encomenda|Oferta|Proposta)/i,
  ];

  for (const line of linhas.slice(0, 20)) {
    for (const pattern of titlePatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[2] || match[1] || line;
      }
    }
  }

  // If no pattern match, use first substantial line
  for (const line of linhas) {
    if (line.length > 10 && line.length < 200) {
      return line;
    }
  }

  return "";
}

/**
 * Extract descricao from document
 */
function extractDescricao(linhas: string[], titulo: string): string {
  const descricaoPatterns = [
    /^(Descrição|Description|Detalhes|Details):?\s*(.*?)$/i,
    /^(CLIENTE|FORNECEDOR|EMPRESA):?\s*(.*?)$/i,
  ];

  let descricao = "";
  let foundTitulo = false;

  for (let i = 0; i < linhas.length; i++) {
    if (linhas[i].includes(titulo)) {
      foundTitulo = true;
      continue;
    }

    if (foundTitulo && !descricao) {
      for (const pattern of descricaoPatterns) {
        const match = linhas[i].match(pattern);
        if (match) {
          descricao = match[2] || linhas[i];
          break;
        }
      }

      // If no pattern found, use next few lines as description
      if (!descricao && i + 1 < linhas.length) {
        const candidates = linhas.slice(i, Math.min(i + 3, linhas.length));
        descricao = candidates
          .filter(
            (l) =>
              l.length > 5 &&
              !l.match(/^\d+/) &&
              !l.includes("Item") &&
              !l.includes("Quantidade")
          )
          .join(" ")
          .substring(0, 300);
      }
    }
  }

  return descricao;
}

/**
 * Extract items/lines from document (tables or lists)
 */
function extractItems(
  fullText: string,
  linhas: string[]
): ParsedPdfContent["items"] {
  const items: ParsedPdfContent["items"] = [];

  // Pattern for table rows with items
  // Matches: quantity, description, unit, price patterns
  const itemPatterns = [
    // Quantidade | Descrição | Unidade | Preço
    /(\d+(?:[.,]\d+)?)\s+\|\s+([^|]+)\s+\|\s+([^|]+)\s+\|\s+([\d.,]+)/,
    // More flexible: starts with number
    /^(\d+(?:[.,]\d+)?)\s+(.{10,100}?)(?:\s+([a-zA-Z]{1,5}))?(?:\s+([\d.,]+))?$/,
  ];

  const itemLines = linhas.filter((line) => {
    return (
      /^\d/.test(line) &&
      line.length > 15 &&
      !line.match(
        /(página|page|total|subtotal|impostos|taxes|assinatura|signature)/i
      )
    );
  });

  for (const linha of itemLines) {
    let item: ParsedPdfContent["items"][0] = {
      descricao: linha,
    };

    // Try to extract structured data
    const numberMatch = linha.match(/^([\d.,]+)\s+/);
    if (numberMatch) {
      item.quantidade = parseFloat(numberMatch[1].replace(",", "."));
    }

    const unitMatch = linha.match(
      /\s(kg|l|m|un|pç|pc|unidade|litro|metro|quilograma|und)\s/i
    );
    if (unitMatch) {
      item.unidade = unitMatch[1];
    }

    const priceMatch = linha.match(/([\d.,]+)\s*€|R\$\s*([\d.,]+)/);
    if (priceMatch) {
      item.preco = parseFloat(
        (priceMatch[1] || priceMatch[2]).replace(",", ".")
      );
    }

    items.push(item);
  }

  return items.length > 0
    ? items
    : [
        {
          descricao: fullText.substring(0, 500),
        },
      ];
}
