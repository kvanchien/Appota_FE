import { Modal, Tag, Typography } from 'antd'
import {
  ClockCircleOutlined,
  TagOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

const { Paragraph, Text } = Typography

export default function KnowledgeDetailModal({ open, item, onClose }) {
  if (!item) return null

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={<span className="font-bold text-lg text-slate-800">Chi tiết Q&A</span>}
      width={650}
      centered
    >
      <div className="py-4 space-y-6">
        {/* Phần Câu hỏi */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-start gap-3">
            <QuestionCircleOutlined className="text-blue-500 text-xl mt-1" />
            <div>
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                Câu hỏi
              </Text>
              <Paragraph className="text-base font-semibold text-slate-800 mb-0">
                {item.question}
              </Paragraph>
            </div>
          </div>
        </div>

        {/* Phần Câu trả lời */}
        <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-50">
          <div className="flex items-start gap-3">
            <InfoCircleOutlined className="text-green-500 text-xl mt-1" />
            <div className="flex-1">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                Câu trả lời
              </Text>
              <div className="text-[15px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin Meta (Category & Thời gian) */}
        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Text className="text-xs font-semibold text-slate-500">Danh mục:</Text>
            {item.category ? (
              <Tag icon={<TagOutlined />} color="blue" className="m-0 border-blue-200">
                {item.category}
              </Tag>
            ) : (
              <span className="text-slate-400 text-xs italic">Không có</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Text className="text-xs font-semibold text-slate-500">Cập nhật lần cuối:</Text>
            <span className="text-slate-500 text-xs flex items-center gap-1">
              <ClockCircleOutlined />
              {new Date(item.updatedAt).toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
