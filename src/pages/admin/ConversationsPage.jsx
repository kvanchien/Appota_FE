import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert } from 'antd'
import { MessageOutlined } from '@ant-design/icons'
import { getConversations } from '../../api/conversationApi'
import ConversationTable from '../../components/admin/ConversationTable'

/**
 * Admin — Conversations list page.
 * Route: /admin/conversations
 */
export default function ConversationsPage() {
  const navigate = useNavigate()
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const list = await getConversations()
        setData(list ?? [])
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách conversations')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="p-8 animate-fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
            <MessageOutlined className="text-white text-base" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Conversation Logs</h1>
            <p className="text-sm text-slate-400">Lịch sử toàn bộ cuộc trò chuyện</p>
          </div>
        </div>

        {/* Stats badge */}
        {!loading && (
          <div className="mt-4 flex gap-3">
            <div className="card !p-4 flex items-center gap-3 min-w-[140px]">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <MessageOutlined className="text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{data.length}</p>
                <p className="text-xs text-slate-400">Tổng sessions</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Error ──────────────────────────────────────── */}
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          className="mb-6 rounded-xl"
        />
      )}

      {/* ── Table ──────────────────────────────────────── */}
      <div className="card !p-0 overflow-hidden">
        <ConversationTable
          data={data}
          loading={loading}
          onRowClick={(record) => navigate(`/admin/conversations/${record._id}`)}
        />
      </div>
    </div>
  )
}
