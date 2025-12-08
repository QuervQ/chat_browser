#!/bin/bash

echo "🔧 環境構築チェック"
echo "===================="
echo ""

# Node.jsのチェック
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.jsがインストールされていません"
    echo "   インストール: brew install node"
fi

# npmのチェック
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: v$NPM_VERSION"
else
    echo "❌ npmがインストールされていません"
fi

# ngrokのチェック
if command -v ngrok &> /dev/null; then
    NGROK_VERSION=$(ngrok version 2>&1 | head -n 1)
    echo "✅ ngrok: $NGROK_VERSION"
    
    # Authtokenが設定されているか確認
    if ngrok config check &> /dev/null; then
        echo "   ✅ Authtoken設定済み"
    else
        echo "   ⚠️  Authtokenが未設定"
        echo "   設定方法:"
        echo "   1. https://dashboard.ngrok.com/signup でアカウント作成"
        echo "   2. Authtokenをコピー"
        echo "   3. 'ngrok config add-authtoken YOUR_TOKEN' を実行"
    fi
else
    echo "❌ ngrokがインストールされていません"
    echo "   インストール: brew install ngrok/ngrok/ngrok"
fi

echo ""

# node_modulesのチェック
if [ -d "node_modules" ]; then
    echo "✅ 依存関係インストール済み"
else
    echo "⚠️  依存関係が未インストール"
    echo "   実行: npm install"
fi

echo ""
echo "===================="

# 全て問題なければ起動方法を表示
if command -v node &> /dev/null && command -v npm &> /dev/null && [ -d "node_modules" ]; then
    echo "✅ 準備完了！"
    echo ""
    echo "起動方法:"
    echo "  npm run serve    # ローカルのみ"
    echo "  npm run share    # 外部公開（ngrok）"
    echo ""
else
    echo "⚠️  環境構築が必要です"
    echo ""
    if ! command -v node &> /dev/null; then
        echo "1. Node.jsをインストール: brew install node"
    fi
    if [ ! -d "node_modules" ]; then
        echo "2. 依存関係をインストール: npm install"
    fi
    if ! command -v ngrok &> /dev/null; then
        echo "3. ngrokをインストール（オプション）: brew install ngrok/ngrok/ngrok"
    fi
    echo ""
fi
