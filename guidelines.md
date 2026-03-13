# Viruflow TaskManager – Guidelines

## Qué es este proyecto

Aplicación de productividad tipo Trello/Notion para gestionar espacios de trabajo, tareas, notas, chat, organigrama y perfil de usuario (Viruflow TaskManager).

## Tech stack

- **Frontend**: React + TypeScript + Vite.
- **Routing**: React Router v6+.
- **Estado global**: Zustand (`authStore`, `themeStore`, `toastStore`).
- **Formularios**: react-hook-form + Zod.
- **UI**: TailwindCSS + componentes propios (Button, Input, Modal, ConfirmModal, Loader, EmptyState, etc.).
- **Drag & drop**: @dnd-kit/core (vista tablero de Notas).
- **Iconos**: lucide-react.
- **Backend previsto**: Supabase/Postgres (integración futura con Stripe y otros servicios).

## Módulos obligatorios

- **Dashboard** (`/`)
- **Chat** (`/chat`) – con contador de mensajes no leídos en Sidebar
- **Notas** (`/notes`) – vistas: Canvas, Tablero (Kanban), Tarjetas
- **Tareas** (`/tasks`)
- **Espacios de trabajo** (`/workspaces`)
- **Organigrama** (`/organigrama`)
- **Perfil** (`/profile`)

## Reglas para agentes de IA

1. **Rutas y módulos**: Mantener siempre las rutas y módulos anteriores. No eliminar ni renombrar rutas sin documentar el motivo.
2. **Tema**: No romper el modo claro/oscuro. El store `themeStore` debe persistir en localStorage y aplicar la clase `dark` al `<html>`.
3. **Sidebar**: Mantener el contador de mensajes no leídos en el ícono de Chat (`chatService.getUnreadChatsCount(userId)` o equivalente).
4. **Stores**: Reutilizar `authStore`, `themeStore`, `toastStore` y patrones existentes siempre que sea posible.
5. **Validación**: Usar Zod para todas las entradas de usuario (formularios de notas, tareas, workspaces, perfil).
6. **Tipado**: Preferir tipado estricto en TypeScript. Evitar `any`.
7. **Comentarios**: Explicar en comentarios solo decisiones no obvias; evitar comentarios redundantes.
8. **Refactor**: Antes de refactorizar, describir el plan en pasos cortos.

## Flujo de trabajo recomendado

1. Crear/ajustar **tipos y validaciones** primero.
2. Conectar **servicios** (API/Supabase) y **stores**.
3. Implementar **componentes UI** a partir de datos tipados.
4. Añadir **tests** (unitarios y E2E) para partes críticas: Notas, Tareas, Chat.
5. Usar MCPs disponibles (GitHub, Supabase, Postgres, Semgrep, Stripe, Playwright, etc.) para automatizar análisis, pruebas y mantenimiento.

## Roadmap por fases

- **Fase 0**: Setup (Vite, React, TS, Tailwind, ESLint, rutas vacías).
- **Fase 1**: Theming + layout raíz (Sidebar, MainLayout).
- **Fase 2**: Routing completo + Sidebar con badge de no leídos.
- **Fase 3**: Modelo de datos y servicios (tipos, mocks/Supabase).
- **Fase 4**: Módulo de Notas (Canvas, Tablero, Tarjetas, CRUD, filtros).
- **Fase 5**: Workspaces + Tareas (CRUD, integración con Notas).
- **Fase 6**: Chat (UI + contador no leídos).
- **Fase 7**: Organigrama y Perfil.
- **Fase 8**: Tests, refactor y hardening.

## DO NOT

- No cambiar radicalmente la UX o el flujo de usuario sin explicarlo.
- No introducir dependencias pesadas innecesarias.
- No eliminar soporte para tema oscuro.
- No eliminar el contador de mensajes no leídos en la Sidebar.
- No omitir validación de formularios (Zod).
