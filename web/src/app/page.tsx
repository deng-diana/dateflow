// Home page: shows today's tasks. Hardcoded for now; the API comes later.
import { SERVER_API } from "@/lib/api";
import TaskList, { type Task } from "@/components/TaskList";
import { type Message } from "@/components/Chat";
import Memories, { type Memory } from "@/components/Memories";
async function getTasks(): Promise<Task[]> {
  try {
    const res = await fetch(`${SERVER_API}/tasks`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getMessages(): Promise<Message[]> {
  try {
    const res = await fetch(`${SERVER_API}/messages`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${SERVER_API}/health`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

async function getMomories(): Promise<Memory[]> {
  try {
    const res = await fetch(`${SERVER_API}/memories`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const apiOk = await getHealth();
  const tasks = await getTasks();
  const messages = await getMessages();
  const memories = await getMomories();
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">DateFlow</h1>
      <p className="mt-1 text-sm opacity-60">
        API:{apiOk ? "online" : "offline"}
      </p>
      <TaskList
        initialTasks={tasks}
        initialMessages={messages}
        initialMemories={memories}
      />
    </main>
  );
}
