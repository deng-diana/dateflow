"use client";
// Interactive task list. Runs in the browser so it can handle clicks.

import { useState } from "react";
export type Task = {
  id: number;
  title: string;
  date: string;
  done: boolean;
  created_at: string;
};

const API = "http://localhost:8000";

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  async function toggle(task: Task) {
    const res = await fetch(`${API}/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ done: !task.done }),
    });
    if (!res.ok) return;
    const updated: Task = await res.json();
    setTasks((prep) => prep.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function addTask(formData: FormData) {
    const title = String(formData.get("title") ?? "").trim();
    const date = String(formData.get("date") ?? "");
    if (!title || !date) return;
    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date }),
    });
    if (!res.ok) return;
    const created: Task = await res.json();
    setTasks((prev) => [...prev, created]);
  }

  return (
    <div>
      <form action={addTask} className="mt-4 flex gap-2">
        <input
          name="title"
          placeholder="New Task"
          required
          className="flex-1 rounded border bg-transparent px-3 py-2"
        />
        <input
          name="date"
          type="date"
          required
          className="rounded border bg-transparent px-2"
        />
        <button type="submit" className="rounded bg-white px-4 py-2 text-black">
          Add
        </button>
      </form>
      <ul className="mt-4 space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 rounder border p-3"
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggle(task)}
            />
            <span className={task.done ? "line-through opacity-50" : ""}>
              {task.title}
            </span>
            <span className="ml-auto text-sm opacity-60">{task.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
