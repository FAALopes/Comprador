import React, { useState } from "react";
import { GuiasPage } from "./pages/GuiasPage";

function App() {
  const [currentPage, setCurrentPage] = useState("guias");

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1>📦 Comprador</h1>
          <p>Sistema de Gestão de Guias de Entrada</p>
        </div>
        <nav className="app-nav">
          <button
            className={`nav-btn ${currentPage === "guias" ? "active" : ""}`}
            onClick={() => setCurrentPage("guias")}
          >
            📋 Guias de Entrada
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentPage === "guias" && <GuiasPage />}
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .app {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f3f4f6;
        }

        .app-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 40px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .app-title {
          margin-bottom: 15px;
        }

        .app-title h1 {
          margin: 0 0 5px 0;
          font-size: 28px;
        }

        .app-title p {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .app-nav {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .nav-btn {
          padding: 10px 16px;
          background-color: rgba(255, 255, 255, 0.2);
          border: 2px solid transparent;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .nav-btn:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .nav-btn.active {
          background-color: white;
          color: #667eea;
          border-color: white;
        }

        .app-main {
          flex: 1;
          padding: 20px;
        }

        @media (max-width: 768px) {
          .app-header {
            padding: 15px 20px;
          }

          .app-title h1 {
            font-size: 22px;
          }

          .app-main {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
