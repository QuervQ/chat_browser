#!/bin/bash

# カラー定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}🚀 Supabase Realtime 起動スクリプト${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# サーバーが既に起動しているか確認
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  ポート3000は既に使用中です${NC}"
    echo -e "${YELLOW}既存のプロセスを停止します...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
fi

echo -e "${GREEN}✅ サーバーを起動しています...${NC}"
echo ""

# バックグラウンドでサーバー起動
node server.js &
SERVER_PID=$!

# サーバーが起動するまで待機
sleep 2

if ps -p $SERVER_PID > /dev/null; then
    echo -e "${GREEN}✅ サーバーが起動しました！${NC}"
    echo -e "${BLUE}📍 ローカルURL: http://localhost:3000${NC}"
    echo -e "${BLUE}📍 Room URL: http://localhost:3000/room/test-room${NC}"
    echo ""
    
    # ngrokがインストールされているか確認
    if command -v ngrok &> /dev/null; then
        echo -e "${GREEN}🌐 ngrokで外部公開しますか？ (y/n)${NC}"
        read -r response
        
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo ""
            echo -e "${YELLOW}📡 ngrokトンネルを作成中...${NC}"
            echo -e "${YELLOW}※ 初回の場合は https://dashboard.ngrok.com/signup でアカウント作成が必要です${NC}"
            echo ""
            
            # ngrokを起動
            ngrok http 3000
        else
            echo ""
            echo -e "${GREEN}✅ ローカルで起動中です${NC}"
            echo -e "${BLUE}停止する場合は Ctrl+C を押してください${NC}"
            wait $SERVER_PID
        fi
    else
        echo -e "${YELLOW}💡 外部公開したい場合は ngrok をインストールしてください:${NC}"
        echo -e "${YELLOW}   brew install ngrok/ngrok/ngrok${NC}"
        echo ""
        echo -e "${GREEN}✅ ローカルで起動中です${NC}"
        echo -e "${BLUE}停止する場合は Ctrl+C を押してください${NC}"
        wait $SERVER_PID
    fi
else
    echo -e "${RED}❌ サーバーの起動に失敗しました${NC}"
    exit 1
fi

# クリーンアップ
trap "kill $SERVER_PID 2>/dev/null" EXIT
