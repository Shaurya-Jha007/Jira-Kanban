import { useEffect, useMemo, useState } from "react";
import Columns from "./components/Columns";
import type { GroupedTasks } from "./types/types";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { arrayMove } from "@dnd-kit/sortable";

import { tasks as initialTasks } from "./utils/data";
import type { Task } from "./types/types";
import Header from "./components/Header";

const STORAGE_KEY = "jira-board-tasks";

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "LOW" as Task["priority"],
  status: "TODO" as Task["status"],
  assignedBy: "",
};

export interface ColumnsProps {
  groupedTasks: GroupedTasks;

  openEditModal: (task: Task) => void;

  deleteTask: (taskId: number) => void;
}

export interface HeaderProps {
  priorityFilter: "ALL" | Task["priority"];

  setPriorityFilter: React.Dispatch<
    React.SetStateAction<"ALL" | Task["priority"]>
  >;

  assigneeFilter: string;

  setAssigneeFilter: React.Dispatch<React.SetStateAction<string>>;

  assignees: string[];

  openCreateModal: () => void;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem(STORAGE_KEY);

    if (storedTasks) {
      return JSON.parse(storedTasks);
    }

    return initialTasks;
  });

  const [showModal, setShowModal] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const [priorityFilter, setPriorityFilter] = useState<
    "ALL" | Task["priority"]
  >("ALL");

  const [assigneeFilter, setAssigneeFilter] = useState("ALL");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );

  const assignees = useMemo(() => {
    return [...new Set(tasks.map((task) => task.assignedBy))];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesPriority =
        priorityFilter === "ALL" || task.priority === priorityFilter;

      const matchesAssignee =
        assigneeFilter === "ALL" || task.assignedBy === assigneeFilter;

      return matchesPriority && matchesAssignee;
    });
  }, [tasks, priorityFilter, assigneeFilter]);

  const groupedTasks = useMemo(() => {
    return {
      TODO: filteredTasks.filter((task) => task.status === "TODO"),
      IN_PROGRESS: filteredTasks.filter(
        (task) => task.status === "IN_PROGRESS",
      ),
      DONE: filteredTasks.filter((task) => task.status === "DONE"),
    };
  }, [filteredTasks]);

  const openCreateModal = () => {
    setEditingTaskId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);

    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assignedBy: task.assignedBy,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTaskId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSaveTask = () => {
    if (!formData.title.trim()) {
      return;
    }

    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                ...formData,
              }
            : task,
        ),
      );
    } else {
      const newTask: Task = {
        id: Date.now(),
        ...formData,
      };

      setTasks((prev) => [newTask, ...prev]);
    }

    closeModal();
  };

  const deleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const findTaskById = (id: number) => {
    return tasks.find((task) => task.id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = Number(active.id);
    const overTaskId = Number(over.id);

    if (activeTaskId === overTaskId) return;

    const activeTask = findTaskById(activeTaskId);
    const overTask = findTaskById(overTaskId);

    if (!activeTask || !overTask) return;

    // Moving inside same column
    if (activeTask.status === overTask.status) {
      const columnTasks = tasks.filter(
        (task) => task.status === activeTask.status,
      );

      const oldIndex = columnTasks.findIndex(
        (task) => task.id === activeTaskId,
      );

      const newIndex = columnTasks.findIndex((task) => task.id === overTaskId);

      const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);

      const remainingTasks = tasks.filter(
        (task) => task.status !== activeTask.status,
      );

      setTasks([...remainingTasks, ...reorderedColumnTasks]);

      return;
    }

    // Moving to another column
    setTasks((prev) =>
      prev.map((task) =>
        task.id === activeTaskId
          ? {
              ...task,
              status: overTask.status,
            }
          : task,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-[#0b1120] text-white">
      <Header
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        assignees={assignees}
        openCreateModal={openCreateModal}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Columns
          groupedTasks={groupedTasks}
          openEditModal={openEditModal}
          deleteTask={deleteTask}
        />
      </DndContext>

      {/* Modal */}
      {showModal && (
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
              {/* Title */}
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

              {/* Description */}
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

              {/* Assignee */}
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

              {/* Selects */}
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

              {/* Actions */}
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
      )}
    </main>
  );
}

export default App;
