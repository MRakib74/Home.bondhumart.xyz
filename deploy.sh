#!/bin/bash
# =====================================================
# Bondhu Command Center — Auto Deploy Script
# Frontend: Port 8086 | Backend: Port 8087
# Domain: command.bondhumart.cloud
# =====================================================

set -e  # কোনো error হলে থেমে যাবে

echo "🚀 Bondhu Command Center Deploy শুরু হচ্ছে..."
echo "================================================"

# ---- কনফিগারেশন ----
DOMAIN="command.bondhumart.cloud"
FRONTEND_PORT=8086
BACKEND_PORT=8087
INSTALL_DIR="/home/bondhumart/htdocs/command.bondhumart.cloud"
REPO_URL="https://github.com/MRakib74/bondhu-command-center.git"

# ---- ধাপ ১: ডিরেক্টরি তৈরি ----
echo ""
echo "📁 ধাপ ১: ডিরেক্টরি তৈরি করা হচ্ছে..."
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# ---- ধাপ ২: Node.js চেক/ইনস্টল ----
echo ""
echo "⚙️  ধাপ ২: Node.js চেক করা হচ্ছে..."
if ! command -v node &> /dev/null; then
    echo "Node.js নেই, ইনস্টল করা হচ্ছে..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo "✅ Node.js: $(node --version)"

# ---- ধাপ ৩: PM2 ইনস্টল ----
echo ""
echo "⚙️  ধাপ ৩: PM2 চেক করা হচ্ছে..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
echo "✅ PM2 ইনস্টল আছে"

# ---- ধাপ ৪: Git Clone ----
echo ""
echo "📥 ধাপ ৪: কোড ডাউনলোড করা হচ্ছে..."
if [ -d ".git" ]; then
    echo "আগে থেকে আছে, আপডেট করা হচ্ছে..."
    git pull origin main
else
    git clone $REPO_URL .
fi
echo "✅ কোড রেডি"

# ---- ধাপ ৫: Backend (FastAPI) সেটআপ ----
echo ""
echo "🐍 ধাপ ৫: FastAPI Backend সেটআপ (Port: $BACKEND_PORT)..."
cd $INSTALL_DIR/backend

# Virtual Environment
python3 -m venv venv
source venv/bin/activate

# Dependencies
pip install --quiet fastapi uvicorn python-dotenv httpx requests

# .env ফাইল চেক
if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: backend/.env ফাইল নেই!"
    echo "    SSH দিয়ে ম্যানুয়ালি তৈরি করুন: nano $INSTALL_DIR/backend/.env"
fi

# PM2 দিয়ে Backend রান
pm2 delete bcc-api 2>/dev/null || true
pm2 start venv/bin/python \
    --name "bcc-api" \
    --cwd $INSTALL_DIR/backend \
    -- -m uvicorn main:app --host 127.0.0.1 --port $BACKEND_PORT

echo "✅ FastAPI Backend চালু: http://127.0.0.1:$BACKEND_PORT"

# ---- ধাপ ৬: Frontend (Next.js) সেটআপ ----
echo ""
echo "⚛️  ধাপ ৬: Next.js Frontend সেটআপ (Port: $FRONTEND_PORT)..."
cd $INSTALL_DIR/frontend

# .env.local তৈরি
cat > .env.local << EOF
BACKEND_PORT=$BACKEND_PORT
BACKEND_URL=http://127.0.0.1:$BACKEND_PORT
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
EOF

# Install & Build
npm install --silent
npm run build

# PM2 দিয়ে Frontend রান
pm2 delete bcc-frontend 2>/dev/null || true
pm2 start "npm start -- -p $FRONTEND_PORT" \
    --name "bcc-frontend" \
    --cwd $INSTALL_DIR/frontend

echo "✅ Next.js Frontend চালু: http://127.0.0.1:$FRONTEND_PORT"

# ---- ধাপ ৭: PM2 Save ----
echo ""
echo "💾 ধাপ ৭: PM2 সেভ করা হচ্ছে (রিবুটেও চলবে)..."
pm2 save
pm2 startup 2>/dev/null || true

# ---- সম্পন্ন ----
echo ""
echo "================================================"
echo "🎉 Deploy সম্পন্ন!"
echo "================================================"
echo ""
echo "✅ Backend API  → http://127.0.0.1:$BACKEND_PORT"
echo "✅ Frontend     → http://127.0.0.1:$FRONTEND_PORT"
echo ""
echo "📋 এরপর CloudPanel-এ করতে হবে:"
echo "   + ADD SITE → Reverse Proxy → $DOMAIN → Port $FRONTEND_PORT"
echo "   তারপর SSL/TLS → Let's Encrypt"
echo ""
echo "📋 PM2 Status চেক করুন:"
pm2 list
echo ""
echo "📋 Test করুন:"
echo "   curl http://127.0.0.1:$BACKEND_PORT"
echo "   curl http://127.0.0.1:$FRONTEND_PORT"
