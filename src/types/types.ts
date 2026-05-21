export type Column = {
  id: "TODO" | "IN_PROGRESS" | "DONE";
  title: "To do" | "In Progress" | "Done";
};

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignedBy: string;
}

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export type GroupedTasks = {
  TODO: Task[];
  IN_PROGRESS: Task[];
  DONE: Task[];
};
