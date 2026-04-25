# Comprador

A buying/procurement management system with automatic PDF guide processing.

## Features

- 📋 **Guias de Entrada**: Upload and process PDF guides
- 🔍 Automatic text extraction and parsing
- 📊 Structured data storage (title, description, items)
- 💾 PostgreSQL database with Prisma ORM
- 🎨 React-based responsive UI
- ⚡ Express.js REST API

## Stack

- **Backend**: Node.js + Express + TypeScript + Prisma 7
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: PostgreSQL (Railway)
- **PDF Processing**: pdf-parse
- **Hosting**: Railway

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic (PDF processing)
│   │   └── routes/         # API routes
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # SQL migrations
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/          # GuiasPage.tsx
│   │   ├── components/     # UI components
│   │   └── services/       # API client
│   └── package.json
│
└── README.md
```

## Setup

### Backend
```bash
cd backend
npm install
npm run build
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:3000`
Frontend runs on `http://localhost:5173`

## API Endpoints

### Guias de Entrada

- `POST /api/guias/upload` - Upload PDF and create guide
- `GET /api/guias` - List all guides
- `GET /api/guias/:id` - Get guide details
- `PATCH /api/guias/:id` - Update guide
- `DELETE /api/guias/:id` - Delete guide

## Database

Uses PostgreSQL with Prisma. Schema defined in `backend/prisma/schema.prisma`.

Key table: `GuiasEntrada`
- id (UUID)
- titulo (string)
- descricao (text)
- conteudoCompleto (text)
- items (JSON array)
- nomeFile (string)
- dataUpload (timestamp)

## Deployment

Push to GitHub → Railway auto-deploys both services.

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=3000
```

### Frontend (.env)
```
VITE_API_URL=https://backend-production.up.railway.app/api
```
