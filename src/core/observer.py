#!/usr/bin/env python3
"""
ODIN Observer - Core Engine
Monitorea actividades y genera Morning Brief
"""

import json
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Any
import os

class ODINObserver:
    """Motor principal de observación"""
    
    def __init__(self, db_path: str = "odin_observer.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Inicializa base de datos SQLite"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Tabla de actividades
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                action TEXT NOT NULL,
                category TEXT NOT NULL,
                reason TEXT,
                result TEXT,
                ceo_notified INTEGER DEFAULT 0,
                autonomous INTEGER DEFAULT 0
            )
        ''')
        
        # Tabla de métricas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                total_interactions INTEGER DEFAULT 0,
                voice_notes INTEGER DEFAULT 0,
                systems_connected INTEGER DEFAULT 0,
                agent_actions INTEGER DEFAULT 0,
                ceo_approvals INTEGER DEFAULT 0
            )
        ''')
        
        # Tabla de briefs
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS morning_briefs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                generated_at TEXT NOT NULL,
                content TEXT NOT NULL,
                emails_checked INTEGER DEFAULT 0,
                events_today INTEGER DEFAULT 0,
                drive_files_changed INTEGER DEFAULT 0,
                opportunities_detected INTEGER DEFAULT 0,
                risks_active INTEGER DEFAULT 0
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def log_activity(self, action: str, category: str, reason: str = "", 
                     result: str = "", ceo_notified: bool = False, 
                     autonomous: bool = False):
        """Registra actividad en base de datos"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO activities (timestamp, action, category, reason, result, ceo_notified, autonomous)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            datetime.now().isoformat(),
            action,
            category,
            reason,
            result,
            1 if ceo_notified else 0,
            1 if autonomous else 0
        ))
        
        conn.commit()
        conn.close()
    
    def get_recent_activities(self, hours: int = 24) -> List[Dict]:
        """Obtiene actividades recientes"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        since = (datetime.now() - timedelta(hours=hours)).isoformat()
        
        cursor.execute('''
            SELECT * FROM activities 
            WHERE timestamp > ? 
            ORDER BY timestamp DESC
        ''', (since,))
        
        columns = [description[0] for description in cursor.description]
        activities = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        conn.close()
        return activities
    
    def get_stats(self) -> Dict[str, Any]:
        """Obtiene estadísticas del sistema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Total actividades
        cursor.execute('SELECT COUNT(*) FROM activities')
        total_activities = cursor.fetchone()[0]
        
        # Actividades autónomas
        cursor.execute('SELECT COUNT(*) FROM activities WHERE autonomous = 1')
        autonomous_count = cursor.fetchone()[0]
        
        # Actividades por categoría
        cursor.execute('''
            SELECT category, COUNT(*) as count 
            FROM activities 
            GROUP BY category 
            ORDER BY count DESC
        ''')
        categories = {row[0]: row[1] for row in cursor.fetchall()}
        
        # Briefs generados
        cursor.execute('SELECT COUNT(*) FROM morning_briefs')
        briefs_count = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            "total_activities": total_activities,
            "autonomous_actions": autonomous_count,
            "categories": categories,
            "briefs_generated": briefs_count,
            "last_updated": datetime.now().isoformat()
        }

if __name__ == "__main__":
    observer = ODINObserver()
    print("✅ ODIN Observer inicializado")
    print(f"📊 Estadísticas: {observer.get_stats()}")
