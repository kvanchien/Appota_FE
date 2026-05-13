import { Table, Tag, Tooltip } from 'antd'
import { MessageOutlined, ClockCircleOutlined } from '@ant-design/icons'

/**
 * Admin conversations table.
 *
 * @param {{ data: ConversationSummary[], loading: boolean, onRowClick: (record) => void }} props
 */
export default function ConversationTable({ data, loading, onRowClick }) {
  const columns = [
    {
      title: <div className="text-center">Session ID</div>,
      dataIndex: 'sessionId',
      key: 'sessionId',
      width: 280,
      render: (id) => (
        <Tooltip title={id}>
          <code className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-mono">
            {id.slice(0, 8)}…{id.slice(-4)}
          </code>
        </Tooltip>
      ),
    },
    {
      title: <div className="text-center">Tin nhắn cuối</div>,
      dataIndex: 'lastMessage',
      key: 'lastMessage',
      ellipsis: true,
      render: (text) => <span className="text-slate-600 text-sm">{text || '—'}</span>,
    },
    {
      title: 'Số tin nhắn',
      dataIndex: 'messageCount',
      key: 'messageCount',
      width: 120,
      align: 'center',
      render: (count) => (
        <Tag icon={<MessageOutlined />} color="blue" className="font-semibold">
          {count}
        </Tag>
      ),
    },
    {
      title: 'Hoạt động gần nhất',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (ts) => (
        <span className="text-slate-500 text-xs flex items-center gap-1">
          <ClockCircleOutlined />
          {new Date(ts).toLocaleString('vi-VN')}
        </span>
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
        pageSize: 15,
        showTotal: (total) => `Tổng ${total} conversations`,
        showSizeChanger: false,
      }}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
        className: 'cursor-pointer hover:bg-blue-50/60 transition-colors',
      })}
      scroll={{ x: 700 }}
      className="rounded-xl overflow-hidden"
    />
  )
}
