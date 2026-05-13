import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import AdminLayout from './components/layout/AdminLayout'
import ConversationsPage from './pages/admin/ConversationsPage'
import ConversationDetailPage from './pages/admin/ConversationDetailPage'
import KnowledgePage from './pages/admin/KnowledgePage'

/**
 * Root application router.
 *
 * Routes:
 *   /                           → ChatPage (player-facing)
 *   /admin                      → redirect → /admin/conversations
 *   /admin/conversations        → ConversationsPage
 *   /admin/conversations/:id    → ConversationDetailPage
 *   /admin/knowledge            → KnowledgePage
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Player-facing */}
        <Route path="/" element={<ChatPage />} />

        {/* Admin — protected by URL path (no auth per spec) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/conversations" replace />} />
          <Route path="conversations" element={<ConversationsPage />} />
          <Route path="conversations/:id" element={<ConversationDetailPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
