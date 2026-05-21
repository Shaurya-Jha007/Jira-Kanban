import { type HeaderProps } from "../types/types";
export default function Header({
  assigneeFilter,
  assignees,
  openCreateModal,
  priorityFilter,
  setAssigneeFilter,
  setPriorityFilter,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111827]/95 backdrop-blur">
      <div className="mx-auto flex max-w-400 flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Jira Kanban Board
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Drag, manage and organize your workflow.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#1e293b] px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#1e293b] px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          >
            <option value="ALL">All Assignees</option>

            {assignees.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>

          {/* Add Task */}
          <button
            onClick={openCreateModal}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition-all duration-300 hover:bg-blue-500"
          >
            + Create Task
          </button>
        </div>
      </div>
    </header>
  );
}
