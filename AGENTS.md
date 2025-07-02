 # AGENTS.md

 This file outlines the architecture and conventions for the MIC Platform 2 project. All agents (human and automated) working on this project should adhere to these guidelines.

 ## Project Overview

 MIC Platform 2 is a desktop-first Electron application that hosts a suite of internal tools. It leverages modern web technologies to provide a fast, type-safe, and highly maintainable codebase.

 ## Key Technologies

 - Electron (via electron-vite)
 - Vite
 - React 18+ and React DOM
 - TypeScript with strict typing
 - Tailwind CSS for styling
 - ESLint & Prettier for linting and formatting
 - electron-builder for packaging and distribution
 - electron-updater for auto-updates
 - Additional libraries: @radix-ui/react-slot, class-variance-authority, clsx, lucide-react, tailwind-merge

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

 ## Security

 - Renderer is context-isolated; no direct Node.js access.
 - IPC handled via typed preload bridge.
 - Keep secrets out of the renderer process.

 ## Commits & Pull Requests

 - Use Conventional Commits.
 - Pull Requests require at least one approving review.
 - All CI checks (lint, format, type-check, build) must pass.