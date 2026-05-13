import { useState } from 'react'
import { Table, Tag, Button, Popconfirm, Tooltip } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'

const CATEGORY_COLORS = {
  payment:  'blue',
  account:  'purple',
  gameplay: 'green',
  default:  'default',
}

/**
 * Knowledge Base table with edit / delete actions.
 *
 * @param {{
 *   data: KnowledgeEntry[],
 *   loading: boolean,
 *   onEdit: (item: KnowledgeEntry) => void,
 *   onDelete: (id: string) => Promise<void>
 * }} props
 */
export default function KnowledgeTable({ data, loading, onEdit, onDelete }) {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 52,
      align: 'center',
      render: (_, __, idx) => (
        <span className="text-slate-400 text-xs font-mono">{idx + 1}</span>
      ),
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true,
      width: '30%',
      render: (text) => (
        <span className="font-medium text-slate-800 text-sm">{text}</span>
      ),
    },
    {
      title: 'Câu trả lời',
      dataIndex: 'answer',
      key: 'answer',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <span className="text-slate-600 text-sm">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 130,
      align: 'center',
      render: (cat) =>
        cat ? (
          <Tag
            icon={<TagOutlined />}
            color={CATEGORY_COLORS[cat] || CATEGORY_COLORS.default}
            className="font-medium"
          >
            {cat}
          </Tag>
        ) : (
          <span className="text-slate-300 text-xs">—</span>
        ),
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (ts) => (
        <span className="text-slate-400 text-xs flex items-center gap-1">
          <ClockCircleOutlined />
          {new Date(ts).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 110,
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              size="small"
            />
          </Tooltip>

          <Popconfirm
            title="Xóa Q&A này?"
            description="Hành động này không thể hoàn tác."
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record._id)}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                loading={deletingId === record._id}
                className="text-red-400 hover:text-red-600 hover:bg-red-50"
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <Table
      dataSource={data}
      columns={columns}
      loading={loading}
      rowKey="_id"
      pagination={{
        pageSize: 10,
        showTotal: (total) => `Tổng ${total} Q&A pairs`,
        showSizeChanger: false,
      }}
      scroll={{ x: 800 }}
      className="rounded-xl overflow-hidden"
    />
  )
}
