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
echo -e "${CYAN}║     🚀 Supabase Realtime Communication App 🚀         ║${NC}"
echo -e "${CYAN}║                                                        ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}環境構築が完了しました！${NC}"
echo ""
echo -e "${GREEN}✅ Node.js インストール済み${NC}"
echo -e "${GREEN}✅ 依存関係インストール済み${NC}"
echo -e "${GREEN}✅ ngrok インストール済み${NC}"
echo -e "${GREEN}✅ サーバー起動可能${NC}"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📖 使い方${NC}"
echo ""
echo -e "${BLUE}【方法1】ローカルのみで使う${NC}"
echo -e "  ${GREEN}npm run serve${NC}"
echo -e "  → http://localhost:3000 でアクセス"
echo ""
echo -e "${BLUE}【方法2】他の人と共有する（ngrok）${NC}"
echo -e "  ${GREEN}npm run share${NC}"
echo -e "  → 公開URLが表示されます（例: https://xxx.ngrok.io）"
echo ""
echo -e "  ${YELLOW}※初回のみ: ngrok Authtoken設定が必要${NC}"
echo -e "    1. https://dashboard.ngrok.com/signup でアカウント作成"
echo -e "    2. Authtokenをコピー"
echo -e "    3. 'ngrok config add-authtoken YOUR_TOKEN' を実行"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}🎯 主要URL${NC}"
echo ""
echo -e "  ${GREEN}トップページ:${NC}       http://localhost:3000"
echo -e "  ${GREEN}ルームページ:${NC}       http://localhost:3000/room/test-room"
echo -e "  ${GREEN}接続テスト:${NC}         http://localhost:3000/test.html"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📦 チームメンバー向け${NC}"
echo ""
echo -e "  ${GREEN}コアモジュール:${NC}     src/supabaseRealtime.js"
echo -e "  ${GREEN}React Hook:${NC}        examples/useSupabaseRealtime.jsx"
echo -e "  ${GREEN}Electron例:${NC}        examples/electron-*.js"
echo -e "  ${GREEN}APIドキュメント:${NC}   README_REALTIME.md"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}🔧 便利なコマンド${NC}"
echo ""
echo -e "  ${GREEN}./check-env.sh${NC}     環境チェック"
echo -e "  ${GREEN}npm run serve${NC}      サーバー起動（ローカル）"
echo -e "  ${GREEN}npm run share${NC}      サーバー起動 + ngrok公開"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}それでは、サーバーを起動しますか？ (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo -e "${BLUE}サーバーを起動しています...${NC}"
    npm run serve
else
    echo ""
    echo -e "${YELLOW}準備ができたら 'npm run serve' を実行してください！${NC}"
    echo ""
fi
