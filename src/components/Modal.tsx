import { type ModalProps } from "../types/types";
import { type Task } from "../types/types";
export default function Modal({
  closeModal,
  editingTaskId,
  formData,
  handleSaveTask,
  setFormData,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {editingTaskId ? "Edit Task" : "Create New Task"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Manage your workflow efficiently
            </p>
          </div>

          <button
            onClick={closeModal}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Task Title *
            </label>

            <input
              type="text"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#1e293b] px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Enter task description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full resize-none rounded-xl border border-white/10 bg-[#1e293b] px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Assignee
            </label>

            <input
              type="text"
              placeholder="Assign task"
              value={formData.assignedBy}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  assignedBy: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#1e293b] px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Priority
              </label>

              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: e.target.value as Task["priority"],
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-[#1e293b] px-4 py-3 outline-none"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Status
              </label>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as Task["status"],
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-[#1e293b] px-4 py-3 outline-none"
              >
                <option value="TODO">TODO</option>

                <option value="IN_PROGRESS">IN PROGRESS</option>

                <option value="DONE">DONE</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={closeModal}
              className="rounded-xl border border-white/10 px-5 py-3 transition hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveTask}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
            >
              {editingTaskId ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
