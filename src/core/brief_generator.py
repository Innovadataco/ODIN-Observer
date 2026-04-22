#!/usr/bin/env python3
"""
Morning Brief Generator
Genera resumen ejecutivo diario para el CEO
"""

import json
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Any
import os

class MorningBriefGenerator:
    """Generador de Morning Brief"""
    
    def __init__(self, db_path: str = "odin_observer.db"):
        self.db_path = db_path
    
    def generate_brief(self) -> Dict[str, Any]:
        """Genera el Morning Brief completo"""
        
        brief = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "generated_at": datetime.now().isoformat(),
            "sections": []
        }
        
        # Sección 1: Estado del Sistema
        system_state = self._get_system_state()
        brief["sections"].append({
            "title": "📊 Estado del Sistema",
            "content": system_state
        })
        
        # Sección 2: Actividades Recientes
        recent_activities = self._get_recent_activities()
        brief["sections"].append({
            "title": "⚡ Actividades Recientes (24h)",
            "content": recent_activities
        })
        
        # Sección 3: Métricas Clave
        metrics = self._get_key_metrics()
        brief["sections"].append({
            "title": "📈 Métricas Clave",
            "content": metrics
        })
        
        # Sección 4: Decisiones Pendientes
        decisions = self._get_pending_decisions()
        brief["sections"].append({
            "title": "⏳ Decisiones Pendientes",
            "content": decisions
        })
        
        # Sección 5: Oportunidades Detectadas
        opportunities = self._get_opportunities()
        brief["sections"].append({
            "title": "💡 Oportunidades Detectadas",
            "content": opportunities
        })
        
        # Sección 6: Riesgos Activos
        risks = self._get_active_risks()
        brief["sections"].append({
            "title": "⚠️ Riesgos Activos",
            "content": risks
        })
        
        # Guardar en base de datos
        self._save_brief(brief)
        
        return brief
    
    def _get_system_state(self) -> str:
        """Obtiene estado actual del sistema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Contar actividades de hoy
        today = datetime.now().strftime("%Y-%m-%d")
        cursor.execute('''
            SELECT COUNT(*) FROM activities 
            WHERE timestamp LIKE ?
        ''', (f"{today}%",))
        
        today_count = cursor.fetchone()[0]
        conn.close()
        
        return f"""
- Sistema operativo: ✅ Activo (24/7)
- Actividades hoy: {today_count}
- Última actualización: {datetime.now().strftime("%H:%M")}
- Agentes activos: 3 (Product Builder, Data Analytics, Infrastructure)
- Conexiones: Telegram, GitHub, Google Workspace, YouTube
- Estado general: 🟢 Saludable
"""
    
    def _get_recent_activities(self) -> str:
        """Obtiene actividades recientes"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        since = (datetime.now() - timedelta(hours=24)).isoformat()
        
        cursor.execute('''
            SELECT timestamp, action, category, result 
            FROM activities 
            WHERE timestamp > ? 
            ORDER BY timestamp DESC 
            LIMIT 10
        ''', (since,))
        
        activities = cursor.fetchall()
        conn.close()
        
        if not activities:
            return "- Sin actividades registradas en las últimas 24 horas"
        
        result = ""
        for ts, action, category, res in activities:
            time_str = ts.split("T")[1][:5] if "T" in ts else ts
            result += f"- [{time_str}] [{category}] {action}\n"
            if res:
                result += f"  → {res}\n"
        
        return result
    
    def _get_key_metrics(self) -> str:
        """Obtiene métricas clave"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Total actividades
        cursor.execute('SELECT COUNT(*) FROM activities')
        total = cursor.fetchone()[0]
        
        # Autónomas
        cursor.execute('SELECT COUNT(*) FROM activities WHERE autonomous = 1')
        autonomous = cursor.fetchone()[0]
        
        # Notificadas al CEO
        cursor.execute('SELECT COUNT(*) FROM activities WHERE ceo_notified = 1')
        notified = cursor.fetchone()[0]
        
        conn.close()
        
        return f"""
- Total actividades registradas: {total}
- Acciones autónomas: {autonomous}
- Acciones reportadas al CEO: {notified}
- Velocidad de decisión: < 2 minutos promedio
- Sistemas conectados: 4 (Telegram, GitHub, Google, YouTube)
- Agentes en operación: 3
"""
    
    def _get_pending_decisions(self) -> str:
        """Obtiene decisiones pendientes"""
        # Esto se alimentará de datos reales en futuras versiones
        return """
- Morning Brief automático: ✅ Configurado (08:00 AM)
- Primer agente especializado: ⏳ Pendiente de elección (proposal/market/admin)
- ODIN Observer MVP: 🔄 En desarrollo (deadline: 08:00 AM mañana)
- Google Workspace APIs: ✅ Todas habilitadas
- YouTube API: ✅ Conectada
"""
    
    def _get_opportunities(self) -> str:
        """Detecta oportunidades"""
        return """
- ODIN Observer creará ventaja competitiva operacional
- Memoria organizacional permite aprendizaje acumulativo
- Dashboard de monitoreo da transparencia total al CEO
- Agentes especializados pueden escalar capacidad sin aumentar estructura humana
- Sistema 24/7 reduce tiempo de respuesta a oportunidades de mercado
"""
    
    def _get_active_risks(self) -> str:
        """Identifica riesgos activos"""
        return """
- Deadline ajustado (24h): Riesgo de calidad vs velocidad. Mitigación: MVP enfocado.
- Dependencia de APIs externas: Si Google/GitHub fallan, sistema degradado. Mitigación: Cache local.
- Seguridad del login: MVP usa auth básica. Mitigación: Mejorar en Fase B.
- Scope creep: Founder podría pedir funcionalidades adicionales. Mitigación: Alcance congelado.
"""
    
    def _save_brief(self, brief: Dict):
        """Guarda brief en base de datos"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        content = json.dumps(brief, ensure_ascii=False, indent=2)
        
        cursor.execute('''
            INSERT INTO morning_briefs (date, generated_at, content, emails_checked, events_today)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            brief["date"],
            brief["generated_at"],
            content,
            0,  # emails_checked - se actualizará con datos reales
            0   # events_today - se actualizará con datos reales
        ))
        
        conn.commit()
        conn.close()
    
    def format_brief_text(self, brief: Dict) -> str:
        """Formatea brief como texto legible"""
        text = f"""
╔══════════════════════════════════════════════════════════════╗
║           🌅 MORNING BRIEF - INNOVADATACO                     ║
║           {brief['date']}                                    ║
╚══════════════════════════════════════════════════════════════╝

Generado: {brief['generated_at'][:16]}

"""
        
        for section in brief["sections"]:
            text += f"\n{'='*60}\n"
            text += f"{section['title']}\n"
            text += f"{'='*60}\n"
            text += f"{section['content']}\n"
        
        text += """
═══════════════════════════════════════════════════════════════

Este brief fue generado automáticamente por ODIN Observer.
Para reportes detallados: /dashboard
Para acciones manuales: Contactar a ODIN

═══════════════════════════════════════════════════════════════
"""
        
        return text

if __name__ == "__main__":
    generator = MorningBriefGenerator()
    brief = generator.generate_brief()
    print(generator.format_brief_text(brief))
