import { type TaskCardProps } from "../types/types";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

const PRIORITY_STYLES = {
  LOW: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  MEDIUM: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  HIGH: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group cursor-grab rounded-2xl border border-white/10 bg-[#1e293b] p-4 shadow-lg transition-all duration-300 active:cursor-grabbing ${
        isDragging
          ? "scale-[1.02] border-blue-500 opacity-70"
          : "hover:border-blue-500/40 hover:bg-[#243244]"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-6">{task.title}</h3>

        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
            PRIORITY_STYLES[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
        {task.description}
      </p>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Assigned By</p>

          <p className="text-sm font-medium text-slate-300">
            {task.assignedBy || "Unassigned"}
          </p>
        </div>

        <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-xs transition hover:bg-slate-700"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/25"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
