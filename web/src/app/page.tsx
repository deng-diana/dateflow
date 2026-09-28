// Home page: shows today's tasks. Hardcoded for now; the API comes later.

import TaskList, { type Task } from "@/components/TaskList";

async function getTasks(): Promise<Task[]> {
  try {
    const res = await fetch("http:localhost:8000/tasks", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getHealth(): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:8000/health", {
      cache: "no-store",
    });
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

export default async function Home() {
  const apiOk = await getHealth();
  const tasks = await getTasks();
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">DateFlow</h1>
      <p className="mt-1 text-sm opacity-60">
        API:{apiOk ? "online" : "offline"}
      </p>
      <TaskList initialTasks={tasks} />
    </main>
  );
}
