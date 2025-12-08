#!/bin/bash

# カラー定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                        ║${NC}"
echo -e "${CYAN}║          🚀 Vercel デプロイスクリプト 🚀               ║${NC}"
echo -e "${CYAN}║                                                        ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# ステップ1: Git初期化チェック
echo -e "${BLUE}[1/5] Gitリポジトリの確認...${NC}"
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Gitリポジトリが存在します${NC}"
else
    echo -e "${YELLOW}⚠️  Gitリポジトリが見つかりません。初期化します...${NC}"
    git init
    echo -e "${GREEN}✅ Gitリポジトリを初期化しました${NC}"
fi
echo ""

# ステップ2: ファイルをコミット
echo -e "${BLUE}[2/5] ファイルをコミット...${NC}"
git add .
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  コミットする変更がありません${NC}"
else
    git commit -m "Deploy to Vercel" 2>/dev/null || git commit -m "Deploy to Vercel"
    echo -e "${GREEN}✅ ファイルをコミットしました${NC}"
fi
echo ""

# ステップ3: Vercel CLIの確認
echo -e "${BLUE}[3/5] Vercel CLIの確認...${NC}"
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✅ Vercel CLIがインストールされています${NC}"
else
    echo -e "${RED}❌ Vercel CLIがインストールされていません${NC}"
    echo -e "${YELLOW}インストール中...${NC}"
    npm install -g vercel
fi
echo ""

# ステップ4: デプロイ
echo -e "${BLUE}[4/5] Vercelにデプロイ...${NC}"
echo -e "${YELLOW}※ 初回の場合はVercelアカウントへのログインが必要です${NC}"
echo -e "${YELLOW}※ ブラウザが開くので、Vercelにログインしてください${NC}"
echo ""
echo -e "${GREEN}デプロイを開始しますか？ (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo -e "${CYAN}🚀 デプロイ中...${NC}"
    echo ""
    
    # Vercelにデプロイ
    vercel --prod
    
    echo ""
    echo -e "${GREEN}✅ デプロイが完了しました！${NC}"
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📝 次のステップ:${NC}"
    echo ""
    echo -e "  1. 表示されたURLにアクセス"
    echo -e "  2. ルームページ: https://your-app.vercel.app/room/test-room"
    echo -e "  3. URLを他の人と共有"
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
else
    echo ""
    echo -e "${YELLOW}デプロイをキャンセルしました${NC}"
    echo ""
    echo -e "手動でデプロイする場合:"
    echo -e "  ${GREEN}vercel${NC}          # テストデプロイ"
    echo -e "  ${GREEN}vercel --prod${NC}   # 本番デプロイ"
    echo ""
fi

echo ""
echo -e "${BLUE}[5/5] 完了！${NC}"
