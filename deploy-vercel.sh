#!/bin/bash

# カラー定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                        ║${NC}"
echo -e "${CYAN}║     🚀 Vercelへデプロイ（Supabaseで動かす）           ║${NC}"
echo -e "${CYAN}║                                                        ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}このスクリプトは、あなたのアプリをVercelにデプロイします。${NC}"
echo -e "${BLUE}デプロイ後は、localhostサーバー不要でSupabaseだけで動きます！${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Vercel CLIが存在するか確認
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLIがインストールされていません${NC}"
    echo -e "${GREEN}インストールしますか？ (y/n)${NC}"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo -e "${BLUE}Vercel CLIをインストール中...${NC}"
        npm install -g vercel
        echo ""
    else
        echo -e "${RED}Vercel CLIが必要です。終了します。${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Vercel CLIが利用可能です${NC}"
echo ""

# Gitリポジトリが初期化されているか確認
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Gitリポジトリが初期化されていません${NC}"
    echo -e "${BLUE}Gitを初期化しますか？ (y/n)${NC}"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo -e "${BLUE}Gitリポジトリを初期化中...${NC}"
        git init
        git add .
        git commit -m "Initial commit for Vercel deployment"
        echo -e "${GREEN}✅ Gitリポジトリを初期化しました${NC}"
        echo ""
    fi
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}準備完了！Vercelにデプロイします。${NC}"
echo ""
echo -e "${YELLOW}📝 注意事項:${NC}"
echo -e "  1. Vercelアカウントが必要です（無料で作成可能）"
echo -e "  2. ブラウザでログイン画面が開きます"
echo -e "  3. 質問には基本的にEnterで進めばOK"
echo ""
echo -e "${GREEN}デプロイを開始しますか？ (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo -e "${BLUE}🚀 Vercelにデプロイ中...${NC}"
    echo ""
    
    # Vercelログイン（必要な場合）
    echo -e "${YELLOW}Vercelにログインします...${NC}"
    vercel login
    
    echo ""
    echo -e "${YELLOW}プロジェクトをデプロイします...${NC}"
    echo ""
    
    # デプロイ実行
    vercel --prod
    
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${GREEN}✅ デプロイ完了！${NC}"
    echo ""
    echo -e "${BLUE}デプロイされたURL:${NC}"
    echo -e "${CYAN}  https://your-project.vercel.app${NC}"
    echo ""
    echo -e "${YELLOW}📝 次のステップ:${NC}"
    echo -e "  1. 表示されたURLにアクセス"
    echo -e "  2. /room/test-room でルームページを開く"
    echo -e "  3. URLを共有して複数人でテスト"
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
else
    echo ""
    echo -e "${YELLOW}キャンセルしました。${NC}"
    echo -e "${BLUE}準備ができたら './deploy-vercel.sh' を実行してください。${NC}"
    echo ""
fi
