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
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in max-w-5xl mx-auto">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/admin/conversations')}
        className="mb-4 md:mb-6 hover:translate-x-[-4px] transition-transform"
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
          <div className="card mb-6 shadow-sm border border-slate-100">
            <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest font-bold">
                  Session ID
                </p>
                <code className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-mono break-all inline-block border border-blue-100">
                  {data.sessionId}
                </code>
              </div>

              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shrink-0">
                <p className="text-2xl font-black text-blue-600 leading-none text-center">
                  {data.messages.length}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 text-center">
                  Tin nhắn
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-6 mt-6 pt-4 border-t border-slate-50 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <ClockCircleOutlined className="text-blue-400" />
                <span className="font-medium text-slate-400">Tạo:</span>
                {new Date(data.createdAt).toLocaleString('vi-VN')}
              </span>
              <span className="flex items-center gap-2">
                <ClockCircleOutlined className="text-purple-400" />
                <span className="font-medium text-slate-400">Cập nhật:</span>
                {new Date(data.updatedAt).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>

          <div className="card !p-0 overflow-hidden shadow-sm border border-slate-100 rounded-2xl">
            <div className="px-4 md:px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Lịch sử trò chuyện chi tiết
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {data.messages.map((msg, idx) => {
                const isUser = msg.role === 'user'
                return (
                  <div
                    key={idx}
                    className={clsx(
                      'flex gap-3 md:gap-4 p-4 md:p-6 transition-colors',
                      isUser ? 'bg-white' : 'bg-slate-50/40'
                    )}
                  >
                    <div
                      className={clsx(
                        'flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center text-white text-sm md:text-base shadow-sm',
                        isUser
                          ? 'bg-gradient-to-br from-slate-500 to-slate-700'
                          : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      )}
                    >
                      {isUser ? <UserOutlined /> : <RobotOutlined />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${isUser ? 'text-slate-500' : 'text-blue-600'}`}
                        >
                          {isUser ? 'Người dùng' : 'AI Assistant'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(msg.timestamp).toLocaleTimeString('vi-VN')}
                        </span>
                      </div>
                      <div className="text-[14px] md:text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
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
