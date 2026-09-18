# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Lazy Schedule

  Lazy Schedule is a React time-planning app built around a 24-hour FaceClock. Add tasks to the clock, adjust their time blocks, and manage them from the task manager and calendar views.

  ## Features

  - Create and schedule tasks on the FaceClock
  - Drag and resize task time blocks
  - Organize tasks by category
  - Mark tasks complete or delete them
  - Persist tasks in browser local storage
  - View saved tasks in a calendar overview

  ## Routes

  - `/` Home
  - `/lazy-schedule` FaceClock schedule
  - `/calendar` Calendar
  - `/tasks-manager` Task manager
  - `/productivity` Productivity

  ## Getting Started

  ```bash
  npm install
  npm run dev
  ```

  Open the local URL shown by Vite.

  ## Commands

  ```bash
  npm run build    # Type-check and create a production build
  npm run lint     # Run ESLint
  npm run preview  # Preview the production build
  ```

  ## Stack

  React, TypeScript, Vite, React Router, and Tailwind CSS.
      reactX.configs['recommended-typescript'],
