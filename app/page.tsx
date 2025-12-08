"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const router = useRouter();

  const createRoom = () => {
    const newRoomId = uuidv4();
    router.push(`/room/${newRoomId}`);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column", gap: 20 }}>
      <h1>Supabase Realtime Room</h1>
      <button onClick={createRoom} style={{ padding: "10px 20px", fontSize: 16, cursor: "pointer" }}>
        新しいルームを作成
      </button>
    </div>
  );
}
