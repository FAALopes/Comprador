import React, { useState } from "react";
import type { GuiaEntrada } from "../services/guiasService";
import { updateGuia } from "../services/guiasService";

interface GuiaDetailProps {
  guia: GuiaEntrada;
  onClose: () => void;
  onUpdate: (guia: GuiaEntrada) => void;
}

export function GuiaDetail({ guia, onClose, onUpdate }: GuiaDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    titulo: guia.titulo,
    descricao: guia.descricao,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateGuia(guia.id, editData);
      onUpdate(updated);
      setIsEditing(false);
    } catch (error) {
      alert("Erro ao atualizar guia");
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Editar Guia" : "Detalhes da Guia"}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <label>Título</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.titulo}
                onChange={(e) =>
                  setEditData({ ...editData, titulo: e.target.value })
                }
                className="input-field"
              />
            ) : (
              <p className="detail-value">{guia.titulo}</p>
            )}
          </div>

          <div className="detail-section">
            <label>Descrição</label>
            {isEditing ? (
              <textarea
                value={editData.descricao}
                onChange={(e) =>
                  setEditData({ ...editData, descricao: e.target.value })
                }
                className="input-field textarea"
                rows={4}
              />
            ) : (
              <p className="detail-value">{guia.descricao || "N/A"}</p>
            )}
          </div>

          <div className="detail-grid">
            <div className="detail-section">
              <label>Ficheiro</label>
              <p className="detail-value">{guia.nomeFile}</p>
            </div>
            <div className="detail-section">
              <label>Data Upload</label>
              <p className="detail-value">{formatDate(guia.dataUpload)}</p>
            </div>
            <div className="detail-section">
              <label>Items</label>
              <p className="detail-value">{guia.items.length}</p>
            </div>
          </div>

          <div className="detail-section">
            <label>Items Extraídos</label>
            {guia.items.length > 0 ? (
              <div className="items-list">
                {guia.items.map((item, idx) => (
                  <div key={idx} className="item-card">
                    <div className="item-descricao">{item.descricao}</div>
                    {item.quantidade && (
                      <div className="item-meta">
                        Qtd: {item.quantidade}{" "}
                        {item.unidade ? item.unidade : ""}
                      </div>
                    )}
                    {item.preco && (
                      <div className="item-meta">Preço: €{item.preco}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="detail-value">Nenhum item extraído</p>
            )}
          </div>

          <div className="detail-section">
            <label>Conteúdo Completo (Preview)</label>
            <div className="content-preview">
              {guia.conteudoCompleto.substring(0, 500)}
              {guia.conteudoCompleto.length > 500 ? "..." : ""}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {isEditing ? (
            <>
              <button
                className="btn btn-cancel"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                className="btn btn-save"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Guardando..." : "Guardar"}
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-edit"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Editar
              </button>
              <button className="btn btn-close" onClick={onClose}>
                Fechar
              </button>
            </>
          )}
        </div>

        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background-color: white;
            border-radius: 8px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
          }

          .modal-header h2 {
            margin: 0;
            color: #1f2937;
            font-size: 20px;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #9ca3af;
            transition: color 0.2s;
          }

          .close-btn:hover {
            color: #374151;
          }

          .modal-body {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
          }

          .detail-section {
            margin-bottom: 20px;
          }

          .detail-section label {
            display: block;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            font-size: 14px;
          }

          .detail-value {
            margin: 0;
            color: #6b7280;
            line-height: 1.5;
          }

          .detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
          }

          .input-field {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
          }

          .input-field:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }

          .input-field.textarea {
            resize: vertical;
          }

          .items-list {
            display: grid;
            gap: 10px;
          }

          .item-card {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 12px;
            font-size: 13px;
          }

          .item-descricao {
            font-weight: 500;
            color: #1f2937;
            margin-bottom: 6px;
            word-break: break-word;
          }

          .item-meta {
            color: #6b7280;
            font-size: 12px;
          }

          .content-preview {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 12px;
            font-size: 12px;
            color: #6b7280;
            line-height: 1.5;
            max-height: 200px;
            overflow-y: auto;
            font-family: "Courier New", monospace;
            white-space: pre-wrap;
            word-break: break-word;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 20px;
            border-top: 1px solid #e5e7eb;
            background-color: #f9fafb;
          }

          .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
          }

          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .btn-edit {
            background-color: #f59e0b;
            color: white;
          }

          .btn-edit:hover {
            background-color: #d97706;
          }

          .btn-save {
            background-color: #10b981;
            color: white;
          }

          .btn-save:hover {
            background-color: #059669;
          }

          .btn-cancel {
            background-color: #9ca3af;
            color: white;
          }

          .btn-cancel:hover {
            background-color: #6b7280;
          }

          .btn-close {
            background-color: #3b82f6;
            color: white;
          }

          .btn-close:hover {
            background-color: #2563eb;
          }
        `}</style>
      </div>
    </div>
  );
}
