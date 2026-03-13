# Supuestos de API / Backend (Viruflow TaskManager)

Documento para integración futura con Supabase/Postgres. Los servicios pueden usar mocks o esta interfaz.

## Chat

- **`getUnreadChatsCount(userId: string): Promise<number>`**  
  Número de chats donde el usuario tiene `marked_unread_at` no nulo (tabla `chat_members`).

- Supabase: `chat_members.user_id = userId AND marked_unread_at IS NOT NULL` → count.

## Notas

- **Tabla `notes`**: id, workspace_id, created_by, assigned_to, title, content, color, priority, status, position, position_x, position_y, task_id, created_at, updated_at.
- **Estados**: `activa` | `archivada` | `completada`.
- **Prioridades**: `baja` | `media` | `alta`.
- **listNotes(filters)**: filtros opcionales workspace_id, task_id, search (title/content), status.
- **updateNoteCanvasPosition(id, position_x, position_y)** para vista Canvas.
- **updateNotePosition(id, position, status?)** para vista Tablero (drag entre columnas).
- **duplicateNote(note)** – crear copia con offset en position_x/position_y.

## Workspaces

- CRUD: listWorkspaces(), getWorkspace(id), createWorkspace(payload), updateWorkspace(id, payload), deleteWorkspace(id).
- Relación: workspace tiene muchos tasks y muchas notes (notes.workspace_id).

## Tasks

- CRUD por workspace. listTasks({ workspace_id }), getTask(id), createTask, updateTask, deleteTask.
- Notas pueden tener task_id opcional.

## Profiles

- getProfileByUserId(userId), listProfiles() (para roles jefe/ayudante).
- Campos: id, full_name, email, username, role (empleado | jefe | ayudante), job_title, avatar_url, is_active, created_at, updated_at.

## Auth (futuro)

- getSession(), signIn(email, password), signUp(...), signOut(), onAuthStateChange.
- Con Supabase Auth, user.id es el mismo que profile.id.
