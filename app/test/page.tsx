"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function TestPage() {
  const [status, setStatus] = useState<string>("テスト中...");
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // 接続テスト
        const { data, error } = await supabase.from("messages").select("*").limit(1);
        
        if (error) {
          setStatus(`❌ エラー: ${error.message}`);
          console.error("Supabase接続エラー:", error);
        } else {
          setStatus("✅ Supabase接続成功!");
          console.log("接続成功:", data);
        }

        // テーブル一覧を取得（試み）
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .limit(5);

        if (messagesData) {
          setTables(messagesData);
        }
      } catch (err) {
        setStatus(`❌ 例外エラー: ${err}`);
        console.error("例外エラー:", err);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1>Supabase接続テスト</h1>
      
      <div style={{ padding: 20, background: "#f0f0f0", borderRadius: 8, marginBottom: 20 }}>
        <h2>ステータス</h2>
        <p style={{ fontSize: 18 }}>{status}</p>
      </div>

      <div style={{ padding: 20, background: "#f0f0f0", borderRadius: 8, marginBottom: 20 }}>
        <h2>環境変数</h2>
        <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || "未設定"}</p>
        <p><strong>Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "設定済み" : "未設定"}</p>
      </div>

      <div style={{ padding: 20, background: "#f0f0f0", borderRadius: 8 }}>
        <h2>messagesテーブルのデータ（最新5件）</h2>
        {tables.length === 0 ? (
          <p>データがありません</p>
        ) : (
          <pre style={{ background: "white", padding: 10, overflow: "auto" }}>
            {JSON.stringify(tables, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
          ← ホームに戻る
        </a>
      </div>
    </div>
  );
}
