# Renamer Program: React Data Grid Integration Plan

This document outlines the plan and rules for integrating `react-data-grid` into the Renamer application
to display imported files in a compact, high-performance data grid.

## 1. Objectives
- Replace the current file list display with `react-data-grid`.
- Display imported files in small rows for clear overview and quick navigation.
- Enable sorting, filtering, and inline editing of file names.

## 2. Implementation Plan
1. Dependency Installation
   - Install `react-data-grid` and TypeScript types:
     ```bash
     yarn add react-data-grid
     yarn add -D @types/react-data-grid
     ```
2. Column Definitions
   - Define a `Column<FileRow>[]` with columns: Index, Original Name, New Name, Status.
   - Use a strict `interface FileRow { id: number; originalName: string; newName: string; status: string; }`.
3. DataGrid Component
   - Create `FileGrid` component under `src/pages/programs/renamer/components/FileGrid.tsx`.
   - Props: `rows: FileRow[]`, `onRowsChange: (newRows) => void`, optional `onSort`, `onFilter`.
4. State Management
   - Manage `rows` in the parent Renamer page using `useState<FileRow[]>`.
   - Populate `rows` when files are imported via the preload IPC bridge.
5. Styling and Layout
   - Set `rowHeight={32}` for compact display.
   - Apply theming via CSS modules or styled-components to match the app.
6. Performance
   - Enable virtualization: `<ReactDataGrid enableVirtualization />`.
   - Memoize column definitions with `useMemo`.
7. Feature Enhancements
   - Column sorting and optional filtering UI.
   - Inline editing in the “New Name” column with validation.
   - Custom cell renderer for the Status column (e.g., badge or icon).
8. Testing
   - Unit tests for `FileGrid` using Jest + React Testing Library.
   - Mock row updates and verify callback invocations.
9. Documentation
   - Document the new component API in code comments.
   - Add examples to Storybook or a demo page if available.

## 3. Development Rules
- Adhere to existing ESLint / Prettier configuration; no eslint warnings.
- Use strict TypeScript types; avoid `any` or unchecked casts.
- All file operations must go through the context-isolated preload bridge.
- Ensure accessibility: proper ARIA roles, keyboard navigation, focus management.
- Write tests covering at least 80% of new component code.
- Components should follow Single Responsibility Principle; separate grid logic from business logic.
- Commit messages must follow Conventional Commits.
- Peer review is required: all PRs must be approved by at least one other developer.
