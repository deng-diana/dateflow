"use client";

import { useState } from "react";
import { addDays, addWeeks, format, isToday, startOfWeek } from "date-fns";
import type { Task } from "@/lib/types";

export default function WeekView({ tasks }: { tasks: Task[] }) {
  const [offset, setOffset] = useState(0); // 0 = this week, -1 = last week...
  const start = startOfWeek(addWeeks(new Date(), offset), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <section className="mt-8">
      <div className="flex items-center justify-betwwen">
        <button
          onClick={() => setOffset(offset - 1)}
          className="px-2 opacity-60 hover:opacity-100"
        >
          ‹
        </button>
        <h2 className="text-sm font-semibold uppercase opacity-60">
          Week of {format(start, "d MMM")}
        </h2>
        <button
          onClick={() => setOffset(offset + 1)}
          className="px-2 opacity-60 hover:opacity-100"
        >
          ›
        </button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayTasks = tasks.filter((t) => t.date === key);
          return (
            <div
              key={key}
              className={`rounded border p-2 text-xs ${isToday(day) ? "border-white" : "border-white/20"}`}
            >
              <div className="mt-1 font-semibold">{format(day, "EEE d")}</div>
              {dayTasks.map((t) => (
                <div
                  key={t.id}
                  className={t.done ? "line-through opacity-40" : ""}
                >
                  {t.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
