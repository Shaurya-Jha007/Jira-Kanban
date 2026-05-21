import { useEffect, useMemo, useState } from "react";
import TaskCard from "./components/TaskCard";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { COLUMNS, tasks as initialTasks } from "./utils/data";
import type { Column, Task } from "./types/types";

const STORAGE_KEY = "jira-board-tasks";

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "LOW" as Task["priority"],
  status: "TODO" as Task["status"],
  assignedBy: "",
};

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

  const [priorityFilter, setPriorityFilter] = useState("ALL");

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
      {/* Header */}
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

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <section className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          {COLUMNS.map((column: Column) => {
            const columnTasks =
              groupedTasks[column.id as keyof typeof groupedTasks];

            return (
              <div
                key={column.id}
                className="flex h-[82vh] flex-col rounded-2xl border border-white/10 bg-[#111827]"
              >
                {/* Column Header */}
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

                {/* Tasks */}
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
      </DndContext>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
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
