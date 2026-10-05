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
- `/login` Sign-in UI preview (not functional)
- `/register` Registration UI preview (not functional)
- `/lazy-schedule` FaceClock schedule
- `/calendar` Calendar
- `/tasks-manager` Task manager
- `/productivity` Productivity
- `/settings` Settings

All pages are accessible during development. Authentication is not implemented; the login and registration screens are visual previews only. Their fields and actions are disabled, and no credentials are collected or sent. Authentication and account-based access controls can be added later.

## Getting started

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
