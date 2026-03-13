# Viruflow TaskManager

Aplicación de productividad tipo Trello/Notion: espacios de trabajo, tareas, notas (canvas/tablero/tarjetas), chat, organigrama y perfil.

## Stack

- React 19 + TypeScript + Vite
- React Router v7
- Zustand (auth, theme, toast)
- react-hook-form + Zod
- TailwindCSS v4 + componentes propios
- @dnd-kit/core (drag & drop en notas)
- lucide-react

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173).

## Scripts

- `npm run dev` – servidor de desarrollo
- `npm run build` – compilación de producción
- `npm run preview` – vista previa del build
- `npm run lint` – ESLint

## Estructura (objetivo)

- `src/app/` – App, providers, router
- `src/features/` – dashboard, chat, notes, tasks, workspaces, orgchart, profile
- `src/components/` – layout (Sidebar, Header, MainLayout), shared (Toaster), ui
- `src/store/` – authStore, themeStore, toastStore
- `src/services/` – chat, notes, tasks, workspaces, profiles
- `src/types/` – tipado compartido
- `src/utils/` – cn, validaciones

## Rutas

- `/` – Dashboard
- `/chat` – Chat (badge de no leídos en Sidebar)
- `/notes` – Notas (canvas, tablero, tarjetas)
- `/tasks` – Tareas
- `/workspaces` – Espacios de trabajo
- `/organigrama` – Organigrama
- `/profile` – Perfil

## Tema

Modo claro/oscuro con persistencia en `localStorage` (clave `viruflow-taskmanager-theme`). Clase `dark` en `<html>` para Tailwind.

## Roadmap

Ver `guidelines.md`. Fases 0–2 completadas (setup, theming, layout, routing, Sidebar con badge). Siguiente: Fase 3 (tipos y servicios), Fase 4 (módulo Notas completo).
