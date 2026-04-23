# ODIN Observer

**MVP del sistema de monitoreo ejecutivo de InnovaDataCO.** Dashboard seguro con autenticación Google OAuth, persistencia en PostgreSQL y visualización de métricas clave en tiempo real.

**Proyecto:** IDC-ODIN-OBS-001  
**Repo:** https://github.com/Innovadataco/ODIN-Observer  
**Licencia:** MIT · InnovaDataCO 2026

---

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Backend | Node.js + Express + TypeScript |
| Frontend | React + Vite + Tailwind CSS |
| Base de datos | PostgreSQL 16 (Docker) |
| Auth | Google OAuth 2.0 + JWT |
| Procesos | PM2 |
| Proxy / SSL | Nginx |

---

## Estructura de Archivos

```
code/
├── backend/                  # API REST (Express + TypeScript)
│   ├── src/
│   │   ├── server.ts         # Entry point
│   │   ├── config/
│   │   ├── middleware/
│   │   └── routes/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/                 # SPA (React + Vite)
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
├── database/                 # PostgreSQL via Docker
│   ├── docker-compose.yml
│   └── init.sql
├── nginx/                    # Configuración Nginx
│   ├── odin-observer.conf
│   └── odin-observer-locations.conf
├── ecosystem.config.js       # PM2 orchestration
├── logs/                     # Logs de PM2 (auto-creado)
└── README.md                 # Este documento
```

---

## Setup (Desarrollo)

### 1. Clonar repositorio

```bash
git clone https://github.com/Innovadataco/ODIN-Observer.git
cd ODIN-Observer/code
```

### 2. Iniciar PostgreSQL (Docker)

```bash
cd database
docker-compose up -d
# Verificar que está saludable:
docker-compose ps
```

### 3. Backend

```bash
cd backend
cp .env.example .env   # Configurar variables (ver tabla abajo)
npm install
npm run build           # Compila TypeScript → dist/
npm run dev             # Modo desarrollo (nodemon)
```

### 4. Frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm install
npm run dev             # Vite dev server en :5173 (con proxy /api)
```

El frontend estará disponible en `http://localhost:5173` con proxy automático de `/api` al backend `:3000`.

---

## Variables de Entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del API | `3000` |
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://odin_user:odin_pass@localhost:5432/odin_observer` |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID | `800039801840-xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret | `GOCSPX-xxx` |
| `SESSION_SECRET` | Firma de sesiones Express | `cambiar-en-produccion-min-32-chars` |
| `JWT_SECRET` | Firma de tokens JWT | `cambiar-en-produccion-min-32-chars` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL del API (Vite proxy en dev) | `http://localhost:3000` |

> ⚠️ **Nunca commitear archivos `.env` reales.** Están en `.gitignore` por defecto.

---

## Deploy (Producción)

### Requisitos previos

- Node.js 20+
- PM2 (`npm install -g pm2`)
- Nginx
- Docker + Docker Compose (para PostgreSQL)
- Certbot (para SSL con Let's Encrypt)

### 1. Preparar entorno

```bash
git clone https://github.com/Innovadataco/ODIN-Observer.git
cd ODIN-Observer/code

# Crear directorio de logs
mkdir -p logs

# Instalar dependencias y compilar
npm install --prefix backend
npm install --prefix frontend
npm run build --prefix backend
npm run build --prefix frontend
```

### 2. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
# Editar backend/.env con valores de producción
```

### 3. Iniciar PostgreSQL

```bash
cd database
docker-compose up -d
```

### 4. Iniciar con PM2

```bash
# Desde la raíz code/
pm2 start ecosystem.config.js

# Verificar estado
pm2 status
pm2 logs

# Guardar configuración para reinicio automático
pm2 save
pm2 startup systemd
```

### 5. Configurar Nginx

```bash
# Copiar configuración
sudo cp nginx/odin-observer-locations.conf /etc/nginx/
sudo cp nginx/odin-observer.conf /etc/nginx/sites-available/odin-observer

# Activar sitio
sudo ln -sf /etc/nginx/sites-available/odin-observer /etc/nginx/sites-enabled/

# Quitar default si existe conflicto
sudo rm -f /etc/nginx/sites-enabled/default

# Verificar configuración y recargar
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL con Certbot (Let's Encrypt)

```bash
# Instalar Certbot si no está disponible
sudo apt install certbot python3-certbot-nginx

# Obtener certificado (modifica server_name primero en odin-observer.conf)
sudo certbot --nginx -d odin.innovadataco.com

# Certbot modificará automáticamente la config. Para revertir:
# sudo certbot rollback
```

### 7. Operaciones diarias

```bash
# Ver estado
pm2 status
pm2 monit

# Ver logs en tiempo real
pm2 logs odin-backend
pm2 logs odin-frontend

# Rotar logs
pm2 flush

# Reiniciar
pm2 restart all
pm2 restart odin-backend

# Detener todo
pm2 stop all
pm2 delete all
```

---

## Morning Brief — Reporte Diario 8:00 AM

El Morning Brief es el ritual de apertura operativa del día. ODIN-Observer genera automáticamente:

### Template de Reporte

```
📊 ODIN MORNING BRIEF — [FECHA] 08:00 AM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 SISTEMA
  • Estado API:        [UP/DOWN] — último ping: [ms]
  • Auth OAuth:        [OK/FAIL] — sesiones activas: [N]
  • DB PostgreSQL:     [OK/FAIL] — conexiones: [N/M]
  • PM2 Procesos:      backend=[status] frontend=[status]
  • Certificado SSL:   [días restantes] días

📈 MÉTRICAS (24h)
  • Logins exitosos:   [N]
  • Errores 5xx:       [N]
  • Latencia media:    [N] ms
  • Uptime:            [N.N]%

⚠️ ALERTAS ACTIVAS
  [ ] Ninguna / [N] alertas pendientes

🎯 ACCIONES DEL DÍA
  [ ] Revisar logs de error
  [ ] Verificar backup de BD
  [ ] Revisar certificados SSL (< 7 días)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generado por ODIN-Observer v1.0.0
```

### Automatización (opcional — cron)

```bash
# Añadir al crontab del servidor
0 8 * * * cd /path/to/ODIN-Observer/code && node scripts/morning-brief.js
```

---

## Troubleshooting

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| `ECONNREFUSED :5432` | PostgreSQL no está corriendo | `docker-compose up -d` en `database/` |
| `500` en `/api/*` | Backend crash / DB no inicializada | Revisar `pm2 logs odin-backend` |
| Blank page en `/` | Frontend no compilado | `npm run build` en `frontend/` |
| OAuth redirect error | GOOGLE_CLIENT_ID mal configurado | Verificar credenciales en `.env` |
| Nginx 502 Bad Gateway | PM2 procesos detenidos | `pm2 restart all` |

---

## Desarrollo

```bash
# Modo desarrollo backend (hot reload)
cd backend && npm run dev

# Modo desarrollo frontend (hot reload + proxy)
cd frontend && npm run dev

# Lint
npm run lint --prefix backend
```

---

_Proyecto ODIN · InnovaDataCO · 2026_  
*"Don't worry. Even if the world forgets, I'll remember for you."*
