 # AGENTS.md

 This file outlines the architecture and conventions for the MIC Platform 2 project. All agents (human and automated) working on this project should adhere to these guidelines.

 ## Project Overview

 MIC Platform 2 is a desktop-first Electron application that hosts a suite of internal tools. It leverages modern web technologies to provide a fast, type-safe, and highly maintainable codebase.

 ## Key Technologies

 - Electron (via electron-vite)
 - Vite
 - React 19+ and React DOM
 - react-data-grid (https://github.com/adazzle/react-data-grid/blob/main/README.md)
 - TypeScript with strict typing
 - Tailwind CSS for styling
 - ESLint & Prettier for linting and formatting
 - electron-builder for packaging and distribution
 - electron-updater for auto-updates
 - Additional libraries: @radix-ui/react-slot, class-variance-authority, clsx, lucide-react, tailwind-merge
  - shadcn/ui: a collection of pre-built, accessible React blocks and components (https://ui.shadcn.com/)

 ## Folder Structure

 - build: macOS entitlements and icon files for packaging
 - resources: static resources included in the packaged app
 - src
   - main: Electron main process entry point (`src/main/index.ts`)
   - preload: Context-isolated preload scripts (`src/preload/index.ts`)
   - renderer: Renderer process code
     - index.html: HTML template
     - src
       - main.tsx: React entry point
       - App.tsx: Root React component
       - assets: Static assets (CSS, images, SVGs)
       - components: Reusable UI components
       - lib: Shared utility functions
       - env.d.ts: Environment type declarations
       - pages: Application pages
         - programs
           - renamer
             - components: Presentation components (Toolbar, PreviewPanel, FilesTable, TagsPanel, RenamePreviewSheet)
             - hooks: Custom hooks (useRenamer)
             - types.ts: Shared TypeScript types for Renamer
             - Renamer.tsx: Main Renamer page entry
 - out: Build output directory (compiled code)
 - node_modules: Project dependencies
 - Configuration files: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `tsconfig.web.json`, `vite.config.ts`, `electron-builder.yml`, `eslint.config.mjs`

 ## Development Workflow

 1. Create a feature/fix branch.
 2. Install dependencies: `npm install`
 3. Lint: `npm run lint`
 4. Format: `npm run format`
 5. Type-check: `npm run typecheck`
 6. Run in development: `npm run dev`
 7. Build application: `npm run build`
 8. Package for platforms:
    - macOS: `npm run build:mac`
    - Windows: `npm run build:win`
    - Linux: `npm run build:linux`
 9. Write tests (future).
 10. Ensure all checks pass before opening a Pull Request.

 ## Code Style

 - Follow ESLint configuration in `eslint.config.mjs`.
 - Format with Prettier.
 - Use strict TypeScript.
 - Keep code readable and self-documented.

## UI Conventions

 - Prefer shadcn/ui blocks and components to build consistent, accessible, and themeable UI at speed.
 - Leverage shadcn patterns and utilities alongside Tailwind CSS to reduce custom styling and ensure a cohesive design system.
 - Extend or customize shadcn components only when necessary, adhering to the project's theming and accessibility guidelines.

## Data Persistence / Database Interface
We will implement a unified data access interface to abstract underlying storage and enable a smooth transition from local (SQLite) to remote (PostgreSQL) backends.

### Technical Approach
- Define a TypeScript interface (e.g., `IDataStore`) in `src/common/interfaces/db.ts` to encapsulate CRUD operations and data models.
- Provide implementations for different environments:
  - `LocalJsonDataStore` for local user preferences and tags, backed by a JSON file in `userData` (no native builds required).
  - `SQLiteDataStore` for local relational storage (optional), using `better-sqlite3` or `sqlite3`.
  - `PostgresDataStore` for production, using `pg` or an ORM (e.g., Prisma, TypeORM) configured via environment variables.
- Use a factory or dependency injection at startup to select the appropriate implementation based on environment or build flags.
- Manage schema migrations with tools like Prisma Migrate, TypeORM Migrations, or Umzug, and store migration scripts in `src/main/storage/migrations/`.
- Expose data operations through the typed preload IPC bridge, ensuring context isolation and type safety for renderer processes.
- Write unit tests for each store implementation to guarantee consistent behavior and catch regressions early.

### Suggested Folder Organization
- `src/common/interfaces/db.ts` – defines `IDataStore` and shared TypeScript types for entities.
- `src/main/storage/` – contains concrete implementations (`LocalJsonDataStore.ts`, `SQLiteDataStore.ts`, `PostgresDataStore.ts`), migration scripts, and factory logic.
- `src/preload/db.ts` – exposes a thin, typed IPC API (e.g., `ipcRenderer.invoke('db:get', key)`) for safe data access from the renderer.
  
### Renderer Data Access Patterns
- Use the exposed `window.api.db` functions in React components to fetch and persist data (e.g., preferences, tags).
- Wrap your renderer root in a TanStack Query `QueryClientProvider` to manage async state and caching:

  ```tsx
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  const queryClient = new QueryClient()
  // in src/renderer/src/main.tsx render:
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
  ```
- Use `useQuery` to read data and `useMutation` to write:

  ```ts
  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

  export function useThemePreference(defaultTheme: string) {
    const qc = useQueryClient()
    const { data: pref, isLoading } = useQuery(['preferences', 1], () =>
      window.api.db.getById('preferences', 1)
    )
    const theme = pref?.theme ?? defaultTheme
    const mutation = useMutation(
      (newTheme: string) =>
        pref
          ? window.api.db.update('preferences', 1, { theme: newTheme })
          : window.api.db.create('preferences', { id: 1, theme: newTheme }),
      { onSuccess: () => qc.invalidateQueries(['preferences', 1]) }
    )
    return { theme, setTheme: mutation.mutate, isLoading }
  }
  ```

 ## Security

 - Renderer is context-isolated; no direct Node.js access.
 - IPC handled via typed preload bridge.
 - Keep secrets out of the renderer process.

 ## Commits & Pull Requests

 - Use Conventional Commits.
 - Pull Requests require at least one approving review.
 - All CI checks (lint, format, type-check, build) must pass.