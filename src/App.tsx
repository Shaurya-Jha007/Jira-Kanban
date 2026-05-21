import { useEffect, useMemo, useState } from "react";
import Columns from "./components/Columns";
import Modal from "./components/Modal";
import { STORAGE_KEY, EMPTY_FORM } from "./utils/data";
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

      {showModal && (
        <Modal
          editingTaskId={editingTaskId}
          formData={formData}
          setFormData={setFormData}
          closeModal={closeModal}
          handleSaveTask={handleSaveTask}
        />
      )}
    </main>
  );
}

export default App;
