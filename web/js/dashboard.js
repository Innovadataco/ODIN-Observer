// ODIN Observer Dashboard - Frontend JavaScript

const API_BASE = '';

// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        // Cargar datos según la pestaña
        if (tabId === 'dashboard') loadStats();
        if (tabId === 'activities') loadActivities();
        if (tabId === 'metrics') loadMetrics();
    });
});

// Load Statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats`);
        const stats = await response.json();
        
        document.getElementById('total-activities').textContent = stats.total_activities || 0;
        document.getElementById('autonomous-actions').textContent = stats.autonomous_actions || 0;
        document.getElementById('briefs-count').textContent = stats.briefs_generated || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Activities
async function loadActivities() {
    const hours = document.getElementById('hours-filter')?.value || 24;
    const container = document.getElementById('activities-list');
    
    container.innerHTML = '<div class="loading">Cargando actividades...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/api/activities?hours=${hours}`);
        const activities = await response.json();
        
        if (activities.length === 0) {
            container.innerHTML = '<div class="placeholder">No hay actividades en el período seleccionado</div>';
            return;
        }
        
        let html = '';
        activities.forEach(act => {
            const time = act.timestamp ? act.timestamp.split('T')[1].substring(0, 5) : '--:--';
            const categoryColor = getCategoryColor(act.category);
            
            html += `
                <div class="activity-item" style="border-left: 3px solid ${categoryColor}; padding: 12px; margin: 8px 0; background: #1a1a2e; border-radius: 6px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold;">[${time}] ${act.action}</span>
                        <span style="background: ${categoryColor}20; color: ${categoryColor}; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">${act.category}</span>
                    </div>
                    ${act.reason ? `<div style="color: #aaa; font-size: 0.9rem; margin-top: 4px;">${act.reason}</div>` : ''}
                    ${act.result ? `<div style="color: #00d9ff; font-size: 0.85rem; margin-top: 4px;">→ ${act.result}</div>` : ''}
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = '<div class="placeholder">Error cargando actividades</div>';
        console.error('Error:', error);
    }
}

function getCategoryColor(category) {
    const colors = {
        'AGENT': '#e94560',
        'DATA': '#00d9ff',
        'COMM': '#ffc107',
        'RESEARCH': '#9b59b6',
        'CONFIG': '#2ecc71',
        'EXEC': '#e74c3c'
    };
    return colors[category] || '#aaa';
}

// Generate Brief
async function generateBrief() {
    const btn = event.target;
    btn.innerHTML = '🔄 Generando...';
    btn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/api/brief/generate`);
        const brief = await response.json();
        
        alert('✅ Morning Brief generado exitosamente');
        loadStats();
    } catch (error) {
        alert('❌ Error generando brief');
        console.error('Error:', error);
    } finally {
        btn.innerHTML = '🌅 Generar Morning Brief';
        btn.disabled = false;
    }
}

async function generateNewBrief() {
    const container = document.getElementById('brief-content');
    container.innerHTML = '<div class="loading">Generando Morning Brief...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/api/brief/generate`);
        const brief = await response.json();
        
        let html = `<div style="white-space: pre-wrap; font-family: monospace; line-height: 1.6;">`;
        html += `╔══════════════════════════════════════════════════════════════╗\n`;
        html += `║           🌅 MORNING BRIEF - INNOVADATACO                     ║\n`;
        html += `║           ${brief.date}                                    ║\n`;
        html += `╚══════════════════════════════════════════════════════════════╝\n\n`;
        html += `Generado: ${brief.generated_at.substring(0, 16)}\n\n`;
        
        brief.sections.forEach(section => {
            html += `${'='.repeat(60)}\n`;
            html += `${section.title}\n`;
            html += `${'='.repeat(60)}\n`;
            html += `${section.content}\n\n`;
        });
        
        html += `═══════════════════════════════════════════════════════════════\n`;
        html += `Este brief fue generado automáticamente por ODIN Observer.\n`;
        html += `═══════════════════════════════════════════════════════════════\n`;
        html += `</div>`;
        
        container.innerHTML = html;
        loadStats();
    } catch (error) {
        container.innerHTML = '<div class="placeholder">Error generando brief</div>';
        console.error('Error:', error);
    }
}

async function loadLatestBrief() {
    const container = document.getElementById('brief-content');
    container.innerHTML = '<div class="loading">Cargando último brief...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/api/brief/latest`);
        const brief = await response.json();
        
        let html = `<div style="white-space: pre-wrap; font-family: monospace; line-height: 1.6;">`;
        html += `╔══════════════════════════════════════════════════════════════╗\n`;
        html += `║           🌅 MORNING BRIEF - INNOVADATACO                     ║\n`;
        html += `║           ${brief.date}                                    ║\n`;
        html += `╚══════════════════════════════════════════════════════════════╝\n\n`;
        
        brief.sections.forEach(section => {
            html += `${'='.repeat(60)}\n`;
            html += `${section.title}\n`;
            html += `${'='.repeat(60)}\n`;
            html += `${section.content}\n\n`;
        });
        
        html += `</div>`;
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = '<div class="placeholder">No hay briefs generados aún. Genera uno nuevo.</div>';
    }
}

// Export Data
function exportData() {
    alert('📊 Función de exportación en desarrollo. Próximamente: CSV, PDF, JSON.');
}

// Refresh Stats
function refreshStats() {
    loadStats();
    alert('🔄 Estadísticas actualizadas');
}

// Load Metrics
async function loadMetrics() {
    const container = document.getElementById('metrics-grid');
    
    try {
        const response = await fetch(`${API_BASE}/api/stats`);
        const stats = await response.json();
        
        let html = '';
        
        // Métricas principales
        html += `<div class="stat-card"><div class="stat-icon">📊</div><div class="stat-value">${stats.total_activities || 0}</div><div class="stat-label">Total Actividades</div></div>`;
        html += `<div class="stat-card"><div class="stat-icon">🤖</div><div class="stat-value">${stats.autonomous_actions || 0}</div><div class="stat-label">Acciones Autónomas</div></div>`;
        html += `<div class="stat-card"><div class="stat-icon">📧</div><div class="stat-value">${stats.briefs_generated || 0}</div><div class="stat-label">Briefs Generados</div></div>`;
        
        // Categorías
        if (stats.categories) {
            html += '<div style="grid-column: 1 / -1; margin-top: 20px;"><h3 style="color: #00d9ff; margin-bottom: 15px;">📈 Distribución por Categoría</h3></div>';
            Object.entries(stats.categories).forEach(([cat, count]) => {
                const color = getCategoryColor(cat);
                html += `<div class="stat-card" style="border-left: 3px solid ${color}"><div class="stat-value" style="font-size: 1.5rem;">${count}</div><div class="stat-label">${cat}</div></div>`;
            });
        }
        
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = '<div class="placeholder">Error cargando métricas</div>';
        console.error('Error:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    console.log('🜏 ODIN Observer Dashboard initialized');
});
