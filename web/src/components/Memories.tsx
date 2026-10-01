"use client";
import { useState } from "react";
import { BROWSER_API as API } from "@/lib/api";
export type Memory = { id: number; content: string; created_at: string };
export default function Memories({
  initialMemories,
}: {
  initialMemories: Memory[];
}) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  async function remove(memory: Memory) {
    const res = await fetch(`${API}/memories/${memory.id}`, {
      method: "DELETE",
    });
    if (!res.ok) return;
    setMemories((prep) => prep.filter((m) => m.id !== memory.id));
  }
  return (
    <div className="mt-8 rounded border p-4">
      <h2 className="text-sm font-semibold uppercase opacity-60">
        What I remember
      </h2>
      {memories.length === 0 && <p>No memories yet.</p>}
      <ul>
        {memories.map((m) => (
          <li key={m.id} className="flex gap-2">
            <span>{m.content}</span>
            <button
              onClick={() => remove(m)}
              className="text-sm opacity-40 hover:opacity-100"
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
