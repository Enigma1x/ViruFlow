import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '../components/layout/MainLayout'
import { Dashboard } from '../features/dashboard/Dashboard'
import { Chat } from '../features/chat/Chat'
import { Notes } from '../features/notes/Notes'
import { Tasks } from '../features/tasks/Tasks'
import { Workspaces } from '../features/workspaces/Workspaces'
import { Organigrama } from '../features/orgchart/Organigrama'
import { Profile } from '../features/profile/Profile'
import { NotFound } from '../features/NotFound'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="notes" element={<Notes />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="workspaces" element={<Workspaces />} />
          <Route path="organigrama" element={<Organigrama />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
