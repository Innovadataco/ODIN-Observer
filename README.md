# ODIN ENTERPRISE OPERATING SYSTEM

Sistema de monitoreo ejecutivo y generador de Morning Brief para InnovaDataCO.

## Arquitectura MVP (Fase A)

### Stack Tecnológico
- **Frontend:** HTML5 + CSS3 + Vanilla JS (dashboard responsive)
- **Backend:** Python (FastAPI) + SQLite (PostgreSQL en producción)
- **Data Sources:** Gmail API, Calendar API, GitHub API, Local Metrics
- **Despliegue:** Docker + systemd (24/7)

### Estructura
```
ODIN-Observer/
├── docs/                    # Documentación
│   └── CHARTER.md           # Acta de constitución
├── src/
│   ├── core/                # Motor principal
│   │   ├── __init__.py
│   │   ├── observer.py      # Motor de observación
│   │   └── brief_generator.py # Generador de Morning Brief
│   ├── collectors/          # Colectores de datos
│   │   ├── gmail_collector.py
│   │   ├── calendar_collector.py
│   │   ├── github_collector.py
│   │   └── metrics_collector.py
│   ├── api/                 # API REST
│   │   ├── main.py
│   │   └── routes.py
│   └── db/                  # Persistencia
│       ├── models.py
│       └── connection.py
├── web/                     # Frontend
│   ├── index.html
│   ├── css/
│   └── js/
├── config/                  # Configuración
│   └── settings.yaml
├── scripts/                 # Utilidades
│   └── deploy.sh
├── tests/                   # Pruebas
├── Dockerfile
├── requirements.txt
└── README.md
```

## Fases del Proyecto

### Fase A (Hoy - MVP)
- [ ] Charter del Proyecto
- [ ] Arquitectura base
- [ ] Colectores Gmail + Calendar
- [ ] Generador de Morning Brief
- [ ] Dashboard básico web
- [ ] Login de seguridad
- [ ] Primer Morning Brief real (08:00 AM)

### Fase B (Futuro)
- PostgreSQL persistente
- Analytics avanzada
- UI mobile nativa
- Inteligencia empresarial

---

**Founder:** Jelkin Zair Carrillo Franco  
**Project Manager:** ODIN (Enterprise Operating System)  
**Deadline:** 2026-04-23 08:00 AM COL
