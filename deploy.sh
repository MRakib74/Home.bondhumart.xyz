#!/bin/bash
# =====================================================
# BondhuOS AI Command Center — Auto Deploy Script
# Frontend & Backend (Next.js App Router)
# Domain: command.bondhumart.cloud
# Port: 8086
# =====================================================

set -e

echo "🚀 BondhuOS Deploy শুরু হচ্ছে..."
echo "================================================"

INSTALL_DIR="/home/bondhumart-command/htdocs/command.bondhumart.cloud"
PORT=8086

echo "📁 ডিরেক্টরি চেক করা হচ্ছে..."
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

echo "⚙️  Node.js এবং PM2 চেক করা হচ্ছে..."
if ! command -v node &> /dev/null; then
    echo "Node.js ইনস্টল করা হচ্ছে..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

echo "📦 Dependencies ইনস্টল করা হচ্ছে..."
npm install --silent

echo "🗄️  Prisma Database Generate & Migrate..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "🧹 Clearing Next.js Cache..."
rm -rf .next

echo "🏗️  Next.js Build করা হচ্ছে..."
npm run build

echo "🔄 PM2 রিস্টার্ট করা হচ্ছে..."
pm2 delete bondhu-os 2>/dev/null || true
pm2 start "npm start -- -p $PORT" --name "bondhu-os" --cwd $INSTALL_DIR

echo "💾 PM2 সেভ করা হচ্ছে..."
pm2 save

echo "================================================"
echo "🎉 Deploy সম্পন্ন! BondhuOS চালু হয়েছে।"
echo "✅ Local: http://127.0.0.1:$PORT"
echo "================================================"
