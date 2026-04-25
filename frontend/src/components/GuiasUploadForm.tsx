import React, { useState } from "react";
import { uploadGuia } from "../services/guiasService";
import type { GuiaEntrada } from "../services/guiasService";

interface GuiasUploadFormProps {
  onSuccess: (guia: GuiaEntrada) => void;
  onError: (error: string) => void;
}

export function GuiasUploadForm({ onSuccess, onError }: GuiasUploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.includes("pdf")) {
      onError("Por favor, selecione um arquivo PDF");
      return;
    }

    setIsLoading(true);
    try {
      const guia = await uploadGuia(file);
      onSuccess(guia);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Erro ao fazer upload");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-form">
      <div
        className={`drop-zone ${isDragging ? "dragging" : ""} ${
          isLoading ? "loading" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-zone-content">
          <h3>📄 Arrastar PDF aqui</h3>
          <p>ou</p>
          <label htmlFor="file-input" className="btn-primary">
            {isLoading ? "Processando..." : "Selecionar Ficheiro"}
          </label>
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={isLoading}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <style>{`
        .upload-form {
          margin: 20px 0;
        }

        .drop-zone {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: #fafafa;
        }

        .drop-zone:hover {
          border-color: #2563eb;
          background-color: #f0f7ff;
        }

        .drop-zone.dragging {
          border-color: #2563eb;
          background-color: #dbeafe;
          transform: scale(1.02);
        }

        .drop-zone.loading {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .drop-zone-content h3 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 18px;
        }

        .drop-zone-content p {
          margin: 10px 0;
          color: #666;
        }

        .btn-primary {
          display: inline-block;
          padding: 10px 20px;
          background-color: #2563eb;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .btn-primary:hover {
          background-color: #1d4ed8;
        }

        .drop-zone.loading .btn-primary {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
