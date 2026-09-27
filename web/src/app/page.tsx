// Home page: shows today's tasks. Hardcoded for now; the API comes later.

type Task = {
  id: number;
  title: string;
  date: string;
  done: boolean;
};

const tasks: Task[] = [
  { id: 1, title: "Send Claren take-home", date: "2026-09-28", done: false },
  {
    id: 2,
    title: "Reply to Isabella at Clera",
    date: "2026-09-28",
    done: true,
  },
  {
    id: 3,
    title: "DateFlow: connect the API",
    date: "2026-09-29",
    done: false,
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">DateFlow</h1>
      <ul className="mt-4 space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 rounded border p-3"
          >
            <input type="checkbox" checked={task.done} readOnly />
            <span className={task.done ? "line-through opacity-50" : ""}>
              {task.title}
            </span>
            <span className="ml-auto text-sm opacity-60">{task.date}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
