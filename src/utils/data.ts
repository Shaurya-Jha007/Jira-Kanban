import { type Column, type Task } from "../types/types";

export const COLUMNS: Column[] = [
  { id: "TODO", title: "To do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

export const STORAGE_KEY = "jira-board-tasks";

export const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "LOW" as Task["priority"],
  status: "TODO" as Task["status"],
  assignedBy: "",
};

export const tasks: Task[] = [
  {
    id: 1,
    title: "Fix Login Bug",
    description:
      "Resolve the issue where users are unable to log in using Google authentication.",
    priority: "HIGH",
    assignedBy: "Rahul Sharma",
    status: "TODO",
  },
  {
    id: 2,
    title: "Update Landing Page",
    description:
      "Redesign the hero section with updated branding and CTA buttons.",
    priority: "MEDIUM",
    assignedBy: "Ananya Verma",
    status: "TODO",
  },
  {
    id: 3,
    title: "Optimize Images",
    description:
      "Compress and optimize all homepage images for better performance.",
    priority: "LOW",
    assignedBy: "Priya Singh",
    status: "TODO",
  },
  {
    id: 4,
    title: "Implement Dark Mode",
    description:
      "Add dark mode support with theme persistence using localStorage.",
    priority: "MEDIUM",
    assignedBy: "Vikas Mehta",
    status: "IN_PROGRESS",
  },
  {
    id: 5,
    title: "API Error Handling",
    description:
      "Improve error handling and loading states for all API requests.",
    priority: "HIGH",
    assignedBy: "Sneha Kapoor",
    status: "IN_PROGRESS",
  },
  {
    id: 6,
    title: "Setup Unit Tests",
    description:
      "Write unit tests for authentication and dashboard components.",
    priority: "HIGH",
    assignedBy: "Amit Joshi",
    status: "IN_PROGRESS",
  },
  {
    id: 7,
    title: "Create User Profile Page",
    description:
      "Build a responsive profile page with editable user information.",
    priority: "MEDIUM",
    assignedBy: "Neha Gupta",
    status: "DONE",
  },
  {
    id: 8,
    title: "Refactor Navbar",
    description: "Clean up navbar component code and improve accessibility.",
    priority: "LOW",
    assignedBy: "Karan Malhotra",
    status: "DONE",
  },
];
