import { type Column } from "../types/types";
import { COLUMNS } from "../utils/data";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";
import type { ColumnsProps } from "../types/types";

export default function Columns({
  groupedTasks,
  deleteTask,
  openEditModal,
}: ColumnsProps) {
  return (
    <section className="mx-auto grid max-w-400 grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      {COLUMNS.map((column: Column) => {
        const columnTasks =
          groupedTasks[column.id as keyof typeof groupedTasks];

        return (
          <div
            key={column.id}
            className="flex h-[82vh] flex-col rounded-2xl border border-white/10 bg-[#111827]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold">{column.title}</h2>

                <p className="text-sm text-slate-400">
                  {columnTasks.length} Tasks
                </p>
              </div>

              <div className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                {column.id}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <SortableContext
                items={columnTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={openEditModal}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          </div>
        );
      })}
    </section>
  );
}
