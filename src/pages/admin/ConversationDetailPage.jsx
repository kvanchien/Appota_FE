import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spin, Alert, Button } from 'antd'
import {
  ArrowLeftOutlined,
  UserOutlined,
  RobotOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { getConversationById } from '../../api/conversationApi'
import clsx from 'clsx'

/**
 * Admin — Conversation detail page.
 * Route: /admin/conversations/:id
 */
export default function ConversationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const detail = await getConversationById(id)
        setData(detail)
      } catch (err) {
        setError(err.message || 'Không tìm thấy conversation')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return (
    <div className="p-8 animate-fade-in max-w-4xl">
      {/* ── Back button ─────────────────────────────── */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/admin/conversations')}
        className="mb-6"
      >
        Quay lại danh sách
      </Button>

      {loading && (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      )}

      {error && <Alert type="error" message={error} showIcon className="rounded-xl" />}

      {data && (
        <>
          {/* ── Header ─────────────────────────────────── */}
          <div className="card mb-6">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide font-semibold">
                  Session ID
                </p>
                <code className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-mono break-all">
                  {data.sessionId}
                </code>
              </div>
              <div className="flex gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">{data.messages.length}</p>
                  <p className="text-xs text-slate-400">Tin nhắn</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ClockCircleOutlined />
                Tạo: {new Date(data.createdAt).toLocaleString('vi-VN')}
              </span>
              <span className="flex items-center gap-1">
                <ClockCircleOutlined />
                Cập nhật: {new Date(data.updatedAt).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>

          {/* ── Chat Log ───────────────────────────────── */}
          <div className="card !p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <h2 className="font-semibold text-slate-700 text-sm">Lịch sử trò chuyện</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {data.messages.map((msg, idx) => {
                const isUser = msg.role === 'user'
                return (
                  <div
                    key={idx}
                    className={clsx('flex gap-3 p-4', isUser ? 'bg-white' : 'bg-blue-50/30')}
                  >
                    {/* Avatar */}
                    <div
                      className={clsx(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm',
                        isUser
                          ? 'bg-gradient-to-br from-slate-500 to-slate-600'
                          : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      )}
                    >
                      {isUser ? <UserOutlined /> : <RobotOutlined />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-600">
                          {isUser ? 'Người dùng' : 'Bot'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(msg.timestamp).toLocaleTimeString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
