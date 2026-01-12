# Helpdesk System (MVP)

Sistema de gerenciamento de chamados integrado a patrimônio.

## 🚀 Como Rodar

### 1. Banco de Dados (Docker)
Na raiz do projeto:
docker-compose up -d

### 2. Backend (API)
cd backend
npm install (apenas na primeira vez)
npx prisma migrate dev (se houver mudanças no banco)
node server.js

### 3. Frontend (React)
cd frontend
npm install (apenas na primeira vez)
npm run dev