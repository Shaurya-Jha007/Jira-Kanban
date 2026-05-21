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

export interface TaskFormData {
  title: string;
  description: string;
  priority: Task["priority"];
  status: Task["status"];
  assignedBy: string;
}

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

export interface ModalProps {
  editingTaskId: number | null;

  formData: TaskFormData;

  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;

  closeModal: () => void;

  handleSaveTask: () => void;
}
