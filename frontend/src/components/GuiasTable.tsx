import React from "react";
import type { GuiaEntrada } from "../services/guiasService";

interface GuiasTableProps {
  guias: GuiaEntrada[];
  onView: (guia: GuiaEntrada) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function GuiasTable({
  guias,
  onView,
  onDelete,
  isLoading,
}: GuiasTableProps) {
  if (isLoading) {
    return <div className="loading-message">Carregando guias...</div>;
  }

  if (guias.length === 0) {
    return (
      <div className="empty-message">
        <p>Nenhuma guia de entrada foi criada ainda.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="guias-table-container">
      <table className="guias-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Ficheiro</th>
            <th>Data Upload</th>
            <th>Items</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {guias.map((guia) => (
            <tr key={guia.id}>
              <td className="titulo">{guia.titulo}</td>
              <td className="nome-file">{guia.nomeFile}</td>
              <td className="data-upload">{formatDate(guia.dataUpload)}</td>
              <td className="items-count">{guia.items.length}</td>
              <td className="acoes">
                <button
                  className="btn btn-view"
                  onClick={() => onView(guia)}
                  title="Ver detalhes"
                >
                  👁️ Ver
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => {
                    if (
                      confirm(
                        `Tem a certeza que deseja deletar a guia "${guia.titulo}"?`
                      )
                    ) {
                      onDelete(guia.id);
                    }
                  }}
                  title="Deletar"
                >
                  🗑️ Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .guias-table-container {
          overflow-x: auto;
          margin-top: 20px;
        }

        .guias-table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .guias-table thead {
          background-color: #f3f4f6;
          border-bottom: 2px solid #e5e7eb;
        }

        .guias-table th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .guias-table tbody tr {
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s;
        }

        .guias-table tbody tr:hover {
          background-color: #f9fafb;
        }

        .guias-table td {
          padding: 12px;
          color: #6b7280;
          font-size: 14px;
        }

        .guias-table td.titulo {
          font-weight: 500;
          color: #1f2937;
          max-width: 300px;
          word-break: break-word;
        }

        .guias-table td.nome-file {
          font-size: 12px;
          color: #9ca3af;
        }

        .guias-table td.items-count {
          text-align: center;
          font-weight: 500;
          color: #2563eb;
        }

        .guias-table td.acoes {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
          font-weight: 500;
        }

        .btn-view {
          background-color: #3b82f6;
          color: white;
        }

        .btn-view:hover {
          background-color: #2563eb;
          transform: translateY(-1px);
        }

        .btn-delete {
          background-color: #ef4444;
          color: white;
        }

        .btn-delete:hover {
          background-color: #dc2626;
          transform: translateY(-1px);
        }

        .loading-message,
        .empty-message {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
          font-size: 16px;
        }

        .loading-message {
          font-style: italic;
        }

        @media (max-width: 768px) {
          .guias-table {
            font-size: 12px;
          }

          .guias-table th,
          .guias-table td {
            padding: 8px;
          }

          .btn {
            padding: 4px 8px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
