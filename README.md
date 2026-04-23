# ODIN Observer

MVP del sistema de monitoreo ejecutivo de InnovaDataCO. Proporciona dashboard seguro con autenticación Google OAuth, persistencia en PostgreSQL y visualización de métricas clave en tiempo real.

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Backend | Node.js + Express + TypeScript |
| Frontend | React + Vite + Tailwind CSS |
| Base de datos | PostgreSQL |
| Auth | Google OAuth 2.0 |
| Procesos | PM2 |
| Proxy / SSL | Nginx |

## Estructura del Proyecto

```
code/
├── backend/      # API REST (Express + TypeScript)
├── frontend/     # SPA (React + Vite)
└── database/     # Esquemas, migraciones y seeds
```

## Setup Rápido

```bash
# 1. Clonar
git clone https://github.com/Innovadataco/ODIN-Observer.git
cd ODIN-Observer/code

# 2. Backend
cd backend
npm install
cp .env.example .env   # configurar variables
npm run dev

# 3. Frontend (otra terminal)
cd frontend
npm install
cp .env.example .env   # configurar VITE_API_URL
npm run dev
```

## Variables de Entorno Principales

- `DATABASE_URL` — PostgreSQL connection string
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — OAuth
- `JWT_SECRET` — Firma de tokens de sesión
- `PORT` — Puerto del backend (default 3000)

---
_Proyecto ODIN · InnovaDataCO · 2026_
