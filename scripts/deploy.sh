#!/bin/bash
# ODIN Observer Deployment Script

set -e

echo "🜏 ODIN Observer - Deployment Script"
echo "===================================="

# Check dependencies
echo "📋 Checking dependencies..."
command -v python3 >/dev/null 2>&1 || { echo "❌ python3 required"; exit 1; }
command -v pip3 >/dev/null 2>&1 || { echo "❌ pip3 required"; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install -r requirements.txt --quiet

# Initialize database
echo "🗄️ Initializing database..."
python3 -c "from src.core.observer import ODINObserver; o = ODINObserver(); print('✅ Database initialized')"

# Generate first brief
echo "🌅 Generating first Morning Brief..."
python3 -c "from src.core.brief_generator import MorningBriefGenerator; g = MorningBriefGenerator(); b = g.generate_brief(); print('✅ First brief generated')"

# Create systemd service (if root)
if [ "$EUID" -eq 0 ]; then
    echo "🔧 Creating systemd service..."
    cat > /etc/systemd/system/odin-observer.service << 'EOF'
[Unit]
Description=ODIN Observer - Enterprise Monitoring System
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/.openclaw/workspace/ODIN-Observer
ExecStart=/usr/bin/python3 -m uvicorn src.api.main:app --host 0.0.0.0 --port 8080
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable odin-observer
    systemctl start odin-observer
    echo "✅ Service created and started"
else
    echo "⚠️ Run as root to create systemd service"
    echo "🚀 Starting in foreground mode..."
    python3 -m uvicorn src.api.main:app --host 0.0.0.0 --port 8080 &
fi

echo ""
echo "🎉 ODIN Observer deployed successfully!"
echo "📊 Dashboard: http://localhost:8080"
echo "🔌 API: http://localhost:8080/api/health"
echo ""
echo "🜏 InnovaDataCO - Enterprise Operating System"
