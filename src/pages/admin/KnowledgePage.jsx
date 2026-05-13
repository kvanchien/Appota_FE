import { useEffect, useState } from 'react'
import { Button, Input, Alert, Select, Badge } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  DatabaseOutlined,
  SettingOutlined,
  FilterOutlined,
} from '@ant-design/icons'
import { useKnowledge } from '../../hooks/useKnowledge'
import KnowledgeTable from '../../components/admin/KnowledgeTable'
import KnowledgeModal from '../../components/admin/KnowledgeModal'
import CategoryManageModal from '../../components/admin/CategoryManageModal'
import KnowledgeDetailModal from '../../components/admin/KnowledgeDetailModal'

const { Option } = Select

export default function KnowledgePage() {
  const {
    items,
    loading,
    fetchAll,
    create,
    update,
    remove,
    categories,
    addCategory,
    renameCategory,
    removeCategory,
  } = useKnowledge()

  const [modalOpen, setModalOpen] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [viewItem, setViewItem] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const filteredItems = items.filter((item) => {
    const matchSearch =
      !searchText.trim() ||
      item.question.toLowerCase().includes(searchText.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchText.toLowerCase())

    const matchCategory = !selectedCategory || item.category === selectedCategory

    return matchSearch && matchCategory
  })

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
  const openView = (item) => setViewItem(item)
  const closeView = () => setViewItem(null)

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

  const displayCategories = categories || [...new Set(items.map((i) => i.category).filter(Boolean))]

  return (
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
      <div className="mb-6 md:mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200 shrink-0">
          <DatabaseOutlined className="text-white text-2xl" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
              Knowledge Base
            </h1>
            <Badge count={items.length} style={{ backgroundColor: '#e2e8f0', color: '#475569' }} />
          </div>
          <p className="text-xs md:text-sm text-slate-500">Quản lý kho Q&A huấn luyện cho Bot</p>
        </div>
      </div>

      {/* Toolbar Layout: Cho phép wrap trên Tablet, giữ 1 hàng trên màn hình lớn xl */}
      <div className="mb-6 bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        {/* Bộ lọc Search & Select */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto xl:flex-1">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Tìm theo câu hỏi, câu trả lời..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            // Mở rộng Full trên Tablet dọc, max-w trên Laptop
            className="rounded-xl w-full md:w-auto md:max-w-[350px] lg:max-w-[400px] h-10 border-slate-200 hover:border-purple-400 focus:border-purple-500"
          />
          <Select
            placeholder={
              <div className="flex items-center gap-2 text-slate-400">
                <FilterOutlined /> <span>Lọc danh mục</span>
              </div>
            }
            allowClear
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            className="w-full md:w-[200px] h-10 custom-select"
          >
            {displayCategories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </div>

        {/* Bộ Nút hành động */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <Button
            icon={<SettingOutlined />}
            onClick={() => setCategoryModalOpen(true)}
            className="h-10 rounded-xl font-medium text-slate-600 border-slate-200 hover:bg-slate-50 flex-1 md:flex-none"
          >
            Quản lý danh mục
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
            className="h-10 rounded-xl font-medium bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 flex-1 md:flex-none"
          >
            Thêm Q&A mới
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          closable
          onClose={() => setError(null)}
          className="mb-6 rounded-xl"
        />
      )}

      {/* ── Table ──────────────────────────────────────── */}
      <div className="card !p-0 overflow-hidden shadow-sm border border-slate-100 rounded-2xl">
        <KnowledgeTable
          data={filteredItems}
          loading={loading}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* ── Modals ──────────────────────────────────────── */}
      <KnowledgeDetailModal open={!!viewItem} item={viewItem} onClose={closeView} />

      <KnowledgeModal
        open={modalOpen}
        editItem={editItem}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={submitting}
        categories={displayCategories}
      />

      <CategoryManageModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={displayCategories}
        onAdd={addCategory}
        onRename={renameCategory}
        onDelete={removeCategory}
      />
    </div>
  )
}
