import { useEffect, useState } from 'react'
import { Button, Input, Alert } from 'antd'
import { PlusOutlined, SearchOutlined, DatabaseOutlined } from '@ant-design/icons'
import { useKnowledge } from '../../hooks/useKnowledge'
import KnowledgeTable from '../../components/admin/KnowledgeTable'
import KnowledgeModal from '../../components/admin/KnowledgeModal'

/**
 * Admin — Knowledge Base management page.
 * Route: /admin/knowledge
 */
export default function KnowledgePage() {
  const { items, loading, fetchAll, create, update, remove } = useKnowledge()

  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null) // null = create mode
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [searchText, setSearchText] = useState('')

  // Load on mount
  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // ── Filtered list for search ────────────────────────────────────────────
  const filteredItems = items.filter((item) => {
    if (!searchText.trim()) return true
    const q = searchText.toLowerCase()
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q)
    )
  })

  // ── Handlers ────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditItem(null)
    setModalOpen(true)
  }
  const openEdit = (item) => {
    setEditItem(item)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setEditItem(null)
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setError(null)
    try {
      if (editItem) {
        await update(editItem._id, values)
      } else {
        await create(values)
      }
      closeModal()
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setError(null)
    try {
      await remove(id)
    } catch (err) {
      setError(err.message || 'Không thể xóa Q&A')
    }
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
            <DatabaseOutlined className="text-white text-base" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Knowledge Base</h1>
            <p className="text-sm text-slate-400">Quản lý Q&A để bot học và trả lời</p>
          </div>
        </div>

        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} size="large">
          Thêm Q&A mới
        </Button>
      </div>

      {/* ── Stats ──────────────────────────────────────── */}
      {!loading && (
        <div className="flex gap-3 mb-6">
          <div className="card !p-4 flex items-center gap-3 min-w-[140px]">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <DatabaseOutlined className="text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{items.length}</p>
              <p className="text-xs text-slate-400">Q&A pairs</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Search ─────────────────────────────────────── */}
      <div className="mb-4">
        <Input
          prefix={<SearchOutlined className="text-slate-400" />}
          placeholder="Tìm kiếm theo câu hỏi, câu trả lời hoặc danh mục..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          size="large"
          className="rounded-xl max-w-lg"
        />
      </div>

      {/* ── Error ──────────────────────────────────────── */}
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          closable
          onClose={() => setError(null)}
          className="mb-4 rounded-xl"
        />
      )}

      {/* ── Table ──────────────────────────────────────── */}
      <div className="card !p-0 overflow-hidden">
        <KnowledgeTable
          data={filteredItems}
          loading={loading}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* ── Modal ──────────────────────────────────────── */}
      <KnowledgeModal
        open={modalOpen}
        editItem={editItem}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  )
}
