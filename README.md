# Jira Style Kanban Board

A Jira-inspired Kanban board built using React, TypeScript, Vite, TailwindCSS, and dnd-kit.  
The application supports drag-and-drop task management, task filtering, task creation/editing, and persistent board state using localStorage.

---

# Features

- Three-column Kanban layout:
  - Todo
  - In Progress
  - Done

- Drag and drop task movement between columns
- Reordering tasks within the same column
- Create new tasks
- Edit existing tasks
- Delete tasks
- Filter tasks by:
  - Priority
  - Assignee
- Persistent board state using localStorage
- Responsive UI inspired by Jira boards

---

# Approach

## 1. Dynamic Column Rendering

Instead of creating separate components for each board column, all columns are rendered by traversing through a single `COLUMNS` array.

This approach provides:
- Better scalability
- Cleaner architecture
- Easier drag-and-drop management
- Easier tracking of task movement between columns

It also avoids unnecessary code duplication and keeps the rendering logic centralized.

---

## 2. Task Ordering and Reordering

Tasks are currently ordered based on their array indexes.

When a task is reordered within the same column:
- Its position changes according to the new index
- The task is inserted below the target task
- The updated order is immediately reflected in the UI

This approach was sufficient for the scope of the assignment and helped keep the implementation straightforward.

---

## 3. Unique Task Identification

Newly created tasks use the current timestamp (`Date.now()`) as their unique ID.

This ensures:
- Uniqueness for locally created tasks
- Simplicity in task tracking
- Reliable drag-and-drop identification

---

## 4. Task Movement Between Columns

Task movement works primarily using:
- Task IDs
- Current task status

The ID helps identify the exact task being moved, while the status helps determine:
- The source column
- The destination column

This made the drag-and-drop logic easier to manage and debug.

---

## 5. Filtering Logic

Filtering by:
- Priority
- Assignee

is handled using memoized derived state.

Whenever a filter changes:
- The filtered task list is recalculated
- Only matching tasks are rendered in the columns

This avoids unnecessary recalculations and keeps rendering efficient.

---

## 6. Persistent State with localStorage

The board state is synchronized with `localStorage`.

Whenever the task state changes:
- localStorage is updated automatically
- The latest board state is preserved

This ensures that:
- Refreshing the page does not reset tasks
- Changes are not lost when the browser tab is closed

---

# Trade-offs

## 1. Frontend-only Data Management

Since this assignment was implemented as a frontend-only application:
- Tasks are managed entirely on the client side
- Data persistence relies on localStorage

In a real full-stack application:
- Tasks would typically be fetched from an API
- State synchronization would involve backend persistence
- Pagination and optimized fetching strategies would likely be implemented

---

## 2. Centralized State Inside App.tsx

Currently, most state management logic exists inside `App.tsx`.

For a production-scale application, I would prefer:
- Context API
- Redux Toolkit
- Zustand

to better organize:
- Shared state
- Actions
- Task updates
- Drag-and-drop interactions

This would significantly improve scalability and maintainability.

---

## 3. Index-based Sorting

At the moment, task ordering depends on array indexes.

A better long-term solution would be introducing a dedicated ordering field such as:

```ts
position: number
```

This would:
- Improve sorting reliability
- Simplify drag-and-drop logic
- Prevent ordering inconsistencies
- Scale better for backend synchronization

---

# Improvements I Would Implement With More Time

## 1. More Advanced State Management

Given additional time, I would move the application state into:
- Context API
- Redux Toolkit

This would help:
- Reduce prop drilling
- Improve code organization
- Make state updates more predictable

---

## 2. Custom useLocalStorage Hook

I would extract all localStorage logic into a reusable custom hook such as:

```ts
useLocalStorage()
```

This would:
- Improve separation of concerns
- Reduce repeated logic
- Improve code readability
- Make persistence reusable across components

---

## 3. Undo / Revert Functionality

I would have explored implementing:
- Undo last task movement
- Undo delete
- Undo task edits

This would improve usability and provide a more production-like experience.

---

## 4. More Advanced Drag-and-Drop Handling

Although the current drag-and-drop implementation is functional, I would spend more time studying and refining the dnd-kit implementation to support:
- Smoother interactions
- Better animations
- Dropping into empty columns
- Improved drag overlays
- More accurate task positioning

---

## 5. Additional Time Constraints

I still had additional time available before the official submission deadline.

However, I decided to submit earlier because, based on past experiences, earlier submissions often receive faster consideration during screening processes.

Because of this, I focused on:
- Completing all required functionality
- Keeping the implementation stable
- Prioritizing maintainable code structure

instead of aggressively expanding the feature set.

---

# Tech Stack

- React
- TypeScript
- Vite
- TailwindCSS
- dnd-kit

---

# Local Setup Instructions

## 1. Clone the Repository

```bash
git clone <repository-url>
```

---

## 2. Navigate to the Project Folder

```bash
cd <project-folder>
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Start Development Server

```bash
npm run dev
```

---

## 5. Open in Browser

Visit:

```bash
http://localhost:5173
```

---

# Notes

- The project uses localStorage for persistence.
- No backend or database integration is included.
- The application is fully frontend-focused for the purpose of the assignment.
