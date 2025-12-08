"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const roomId = params.roomId;
  const router = useRouter();
  const [user] = useState(() => {
    // 簡易匿名ユーザー（localStorage に保存）
    const key = `anon-user`;
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (raw) return JSON.parse(raw);
    const u = { id: uuidv4(), name: `User-${Math.random().toString(36).slice(2,7)}` };
    localStorage.setItem(key, JSON.stringify(u));
    return u;
  });

  const [members, setMembers] = useState<Record<string, any>>({});
  const [messages, setMessages] = useState<any[]>([]);
  const channelRef = useRef<any>(null);
  const messagesChannelRef = useRef<any>(null);
  const [text, setText] = useState("");
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const cursorsRef = useRef<Record<string, {x:number,y:number,name:string}>>({});
  const [, forceRerender] = useState(0);

  useEffect(() => {
    // チャンネル作成
    const channel = supabase.channel(`room-${roomId}`);
    channelRef.current = channel;

    // presence sync
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      setMembers(state);
    });

    // broadcast でカーソル受け取り
    channel.on("broadcast", { event: "cursor" }, (payload) => {
      const p = payload.payload; // { user_id, x, y, name }
      cursorsRef.current[p.user_id] = { x: p.x, y: p.y, name: p.name };
      forceRerender((n) => n + 1);
    });

    // subscribe -> track presence
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ user_id: user.id, name: user.name });
      }
    });

    // Realtime DB の messages 挿入を受け取る
    const msgChannel = supabase
      .channel(`public:messages:room-${roomId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` }, (payload) => {
        setMessages((m) => [...m, payload.new]);
      })
      .subscribe();

    messagesChannelRef.current = msgChannel;

    // 初期メッセージ読み込み
    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    })();

    return () => {
      // cleanup
      channel.unsubscribe();
      msgChannel.unsubscribe();
    };
  }, [roomId, user.id, user.name]);

  // マウス移動でカーソルを broadcast
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 1000;
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 1000;
      channelRef.current?.send({ type: "broadcast", event: "cursor", payload: { user_id: user.id, x, y, name: user.name } });
      // local update for instant
      cursorsRef.current[user.id] = { x, y, name: user.name };
      forceRerender((n) => n + 1);
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, [user.id, user.name]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await supabase.from("messages").insert({ room_id: roomId, user_id: user.id, name: user.name, content: text });
    setText("");
  };

  return (
    <div style={{ display: "flex", gap: 20, padding: 20 }}>
      <div style={{ width: 520 }}>
        <h2>Room: {roomId}</h2>
        <div style={{ marginBottom: 8 }}>あなた: {user.name} ({user.id.slice(0,6)})</div>

        <div style={{ border: "1px solid #ccc", height: 360, position: "relative" }} ref={canvasRef}>
          {/* cursors */}
          {Object.entries(cursorsRef.current).map(([id, c]) => {
            const cursor = c as {x:number, y:number, name:string};
            return (
              <div key={id} style={{ position: "absolute", left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%`, transform: "translate(-50%,-100%)", pointerEvents: "none" }}>
                <div style={{ background: "rgba(0,0,0,0.7)", color: "white", padding: "2px 6px", borderRadius: 6, fontSize: 12 }}>{cursor.name}</div>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: "black" }} />
              </div>
            );
          })}
        </div>

        <h3>参加者</h3>
        <ul>
          {Object.entries(members).map(([key, meta]) => (
            <li key={key}>{key} — {JSON.stringify(meta)}</li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <h3>チャット</h3>
        <div style={{ height: 300, overflow: "auto", border: "1px solid #ddd", padding: 8 }}>
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 8 }}>
              <strong>{m.name ?? m.user_id}</strong> <span style={{ color: "#666", fontSize: 12 }}>{new Date(m.created_at).toLocaleTimeString()}</span>
              <div>{m.content}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input value={text} onChange={(e) => setText(e.target.value)} style={{ flex: 1 }} placeholder="メッセージを入力" />
          <button onClick={sendMessage}>送信</button>
        </div>
      </div>
    </div>
  );
}