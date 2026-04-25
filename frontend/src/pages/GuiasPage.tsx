import React, { useState, useEffect } from "react";
import { GuiasUploadForm } from "../components/GuiasUploadForm";
import { GuiasTable } from "../components/GuiasTable";
import { GuiaDetail } from "../components/GuiaDetail";
import {
  getAllGuias,
  deleteGuia,
  type GuiaEntrada,
} from "../services/guiasService";

export function GuiasPage() {
  const [guias, setGuias] = useState<GuiaEntrada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGuia, setSelectedGuia] = useState<GuiaEntrada | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadGuias();
  }, []);

  const loadGuias = async () => {
    setIsLoading(true);
    try {
      const data = await getAllGuias();
      setGuias(data);
    } catch (error) {
      setErrorMessage("Erro ao carregar guias de entrada");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (guia: GuiaEntrada) => {
    setGuias([guia, ...guias]);
    setSuccessMessage(
      `Guia "${guia.titulo}" criada com sucesso!`
    );
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleUploadError = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGuia(id);
      setGuias(guias.filter((g) => g.id !== id));
      setSuccessMessage("Guia deletada com sucesso");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Erro ao deletar guia");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleUpdateGuia = (updatedGuia: GuiaEntrada) => {
    setGuias(guias.map((g) => (g.id === updatedGuia.id ? updatedGuia : g)));
    setSelectedGuia(updatedGuia);
    setSuccessMessage("Guia atualizada com sucesso");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="guias-page">
      <div className="page-header">
        <h1>📋 Guias de Entrada</h1>
        <p>Faça upload de PDFs para extrair automaticamente estrutura e items</p>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="alert alert-error">{errorMessage}</div>
      )}

      <div className="upload-section">
        <h2>Upload de Guia</h2>
        <GuiasUploadForm
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
        />
      </div>

      <div className="guias-section">
        <h2>Guias Criadas ({guias.length})</h2>
        <GuiasTable
          guias={guias}
          onView={setSelectedGuia}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {selectedGuia && (
        <GuiaDetail
          guia={selectedGuia}
          onClose={() => setSelectedGuia(null)}
          onUpdate={handleUpdateGuia}
        />
      )}

      <style>{`
        .guias-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header h1 {
          margin: 0 0 10px 0;
          color: #1f2937;
          font-size: 28px;
        }

        .page-header p {
          margin: 0;
          color: #6b7280;
          font-size: 16px;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 20px;
          animation: slideIn 0.3s ease;
        }

        .alert-success {
          background-color: #d1fae5;
          color: #065f46;
          border-left: 4px solid #10b981;
        }

        .alert-error {
          background-color: #fee2e2;
          color: #991b1b;
          border-left: 4px solid #ef4444;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .upload-section {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .upload-section h2 {
          margin-top: 0;
          color: #1f2937;
          font-size: 18px;
        }

        .guias-section {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .guias-section h2 {
          margin-top: 0;
          color: #1f2937;
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .guias-page {
            padding: 15px;
          }

          .page-header h1 {
            font-size: 24px;
          }

          .upload-section,
          .guias-section {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}
