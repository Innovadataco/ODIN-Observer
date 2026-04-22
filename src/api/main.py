#!/usr/bin/env python3
"""
ODIN Observer API
API REST para dashboard y generación de briefs
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Dict, List, Any
import sqlite3
import json
from datetime import datetime
import os
import sys

# Añadir src al path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.observer import ODINObserver
from core.brief_generator import MorningBriefGenerator

app = FastAPI(title="ODIN Observer", version="1.0.0")

# Servir archivos estáticos
app.mount("/static", StaticFiles(directory="web"), name="static")

# Instancias
observer = ODINObserver()
generator = MorningBriefGenerator()

class ActivityCreate(BaseModel):
    action: str
    category: str
    reason: str = ""
    result: str = ""
    ceo_notified: bool = False
    autonomous: bool = False

@app.get("/", response_class=HTMLResponse)
async def dashboard():
    """Sirve el dashboard principal"""
    with open("web/index.html", "r") as f:
        return f.read()

@app.get("/api/stats")
async def get_stats() -> Dict[str, Any]:
    """Obtiene estadísticas del sistema"""
    return observer.get_stats()

@app.get("/api/activities")
async def get_activities(hours: int = 24) -> List[Dict]:
    """Obtiene actividades recientes"""
    return observer.get_recent_activities(hours)

@app.post("/api/activities")
async def create_activity(activity: ActivityCreate):
    """Registra nueva actividad"""
    observer.log_activity(
        action=activity.action,
        category=activity.category,
        reason=activity.reason,
        result=activity.result,
        ceo_notified=activity.ceo_notified,
        autonomous=activity.autonomous
    )
    return {"status": "success", "message": "Actividad registrada"}

@app.get("/api/brief/generate")
async def generate_brief() -> Dict[str, Any]:
    """Genera nuevo Morning Brief"""
    brief = generator.generate_brief()
    return brief

@app.get("/api/brief/latest")
async def get_latest_brief() -> Dict[str, Any]:
    """Obtiene último Morning Brief"""
    conn = sqlite3.connect("odin_observer.db")
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM morning_briefs 
        ORDER BY generated_at DESC 
        LIMIT 1
    ''')
    
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="No hay briefs generados")
    
    return json.loads(row[3])  # content column

@app.get("/api/health")
async def health_check() -> Dict[str, str]:
    """Health check del sistema"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "uptime": "24/7"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
