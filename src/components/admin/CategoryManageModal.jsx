import { useState } from 'react'
import { Modal, Input, Button, Space, Typography } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const { confirm } = Modal
const { Text } = Typography

export default function CategoryManageModal({
  open,
  onClose,
  categories = [],
  onAdd,
  onRename,
  onDelete,
}) {
  const [newCatName, setNewCatName] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [tempCategoryName, setTempCategoryName] = useState('')

  const handleAdd = () => {
    if (!newCatName.trim()) return
    onAdd(newCatName.trim())
    setNewCatName('')
  }

  const startEdit = (cat) => {
    setEditingCategory(cat)
    setTempCategoryName(cat)
  }

  const handleSaveEdit = async (oldName) => {
    if (tempCategoryName.trim() && tempCategoryName !== oldName) {
      await onRename(oldName, tempCategoryName.trim())
    }
    setEditingCategory(null)
  }

  const confirmDelete = (catName) => {
    confirm({
      title: `Bạn có chắc chắn muốn xóa danh mục "${catName}"?`,
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: (
        <div className="mt-2 text-slate-600">
          <p>
            Hành động này sẽ <b>xóa vĩnh viễn</b> toàn bộ các câu hỏi và câu trả lời (Q&A) thuộc
            danh mục này.
          </p>
          <p className="text-red-500 mt-1 font-medium">Lưu ý: Dữ liệu không thể khôi phục!</p>
        </div>
      ),
      okText: 'Xóa toàn bộ',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        await onDelete(catName)
      },
    })
  }

  return (
    <Modal
      title={<span className="font-bold text-lg text-slate-800">Quản lý danh mục</span>}
      open={open}
      onCancel={() => {
        setEditingCategory(null)
        onClose()
      }}
      footer={null}
      width={500}
    >
      <div className="py-4">
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {categories.map((cat) => (
            <div
              key={cat}
              className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 group hover:border-blue-300 transition-colors"
            >
              {editingCategory === cat ? (
                <Space className="w-full">
                  <Input
                    value={tempCategoryName}
                    onChange={(e) => setTempCategoryName(e.target.value)}
                    size="small"
                    autoFocus
                    onPressEnter={() => handleSaveEdit(cat)}
                  />
                  <Button
                    size="small"
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => handleSaveEdit(cat)}
                  />
                  <Button
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={() => setEditingCategory(null)}
                  />
                </Space>
              ) : (
                <>
                  <Text className="font-semibold text-slate-700">{cat}</Text>
                  <Space className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => startEdit(cat)}
                    />
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => confirmDelete(cat)}
                    />
                  </Space>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
