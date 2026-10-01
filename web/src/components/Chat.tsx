"use client";
// Chat panel: sends the conversation to /chat and shows replies plus tool calls.

import { useState } from "react";
import { BROWSER_API as API } from "@/lib/api";

export type Message = { role: "user" | "assistant"; content: string };
type ToolCall = { name: string; input: Record<string, unknown> };

export default function Chat({
  initialMessages,
  onTasksChanged,
}: {
  initialMessages: Message[];
  onTasksChanged: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [busy, setBusy] = useState(false);

  async function send(formData: FormData) {
    const text = String(formData.get("text") ?? "").trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessages([
          ...next,
          { role: "assistant", content: `Error: ${data.detail ?? res.status}` },
        ]);
        return;
      }
      setMessages([...next, { role: "assistant", content: data.reply }]);
      setToolCalls(data.tool_calls ?? []);
      if ((data.tool_calls ?? []).length > 0) onTasksChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 rounded border p-4">
      <h2 className="text-sm font-semibold uppercase opacity-60">Assistant</h2>
      <div className="mt-3 space-y-2 text-sm">
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "text-right" : ""}>
            <span className="rounded bg-white/10 px-2 py-1">{m.content}</span>
          </p>
        ))}
        {toolCalls.map((c, i) => (
          <p key={`t${i}`} className="text-xs opacity-50">
            ran {c.name}({JSON.stringify(c.input)})
          </p>
        ))}
        {busy && <p className="text-xs opacity-50">thinking…</p>}
      </div>
      <form action={send} className="mt-3 flex gap-2">
        <input
          name="text"
          placeholder="Tell me what to do…"
          className="flex-1 rounded border bg-transparent px-3 py-2"
        />
        <button
          className="rounded bg-white px-4 py-2 text-black"
          disabled={busy}
        >
          Send
        </button>
      </form>
    </section>
  );
}
