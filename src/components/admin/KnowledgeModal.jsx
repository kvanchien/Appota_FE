import { useEffect } from 'react'
import { Modal, Form, Input, Select, Button } from 'antd'
import { PlusOutlined, SaveOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select

const CATEGORIES = ['payment', 'account', 'gameplay', 'technical', 'general']

/**
 * Modal form for creating or editing a Knowledge Base Q&A entry.
 *
 * @param {{
 *   open: boolean,
 *   editItem: KnowledgeEntry | null,   — null means "create mode"
 *   onClose: () => void,
 *   onSubmit: (values) => Promise<void>,
 *   loading: boolean
 * }} props
 */
export default function KnowledgeModal({ open, editItem, onClose, onSubmit, loading }) {
  const [form] = Form.useForm()
  const isEdit = !!editItem

  // Populate form when editing
  useEffect(() => {
    if (open && editItem) {
      form.setFieldsValue({
        question: editItem.question,
        answer: editItem.answer,
        category: editItem.category || undefined,
      })
    } else if (open) {
      form.resetFields()
    }
  }, [open, editItem, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    await onSubmit(values)
    form.resetFields()
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-2 pb-1">
          {isEdit ? (
            <SaveOutlined className="text-blue-500" />
          ) : (
            <PlusOutlined className="text-blue-500" />
          )}
          <span className="font-semibold text-slate-800">
            {isEdit ? 'Chỉnh sửa Q&A' : 'Thêm Q&A mới'}
          </span>
        </div>
      }
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4" onFinish={handleOk}>
        {/* Question */}
        <Form.Item
          label={<span className="font-semibold text-slate-700">Câu hỏi</span>}
          name="question"
          rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
        >
          <Input
            placeholder="Ví dụ: Làm sao để nạp tiền vào game?"
            size="large"
            maxLength={300}
            showCount
          />
        </Form.Item>

        {/* Answer */}
        <Form.Item
          label={<span className="font-semibold text-slate-700">Câu trả lời</span>}
          name="answer"
          rules={[{ required: true, message: 'Vui lòng nhập câu trả lời' }]}
        >
          <TextArea
            placeholder="Nhập câu trả lời chi tiết..."
            rows={4}
            maxLength={1000}
            showCount
          />
        </Form.Item>

        {/* Category */}
        <Form.Item
          label={<span className="font-semibold text-slate-700">Danh mục (tùy chọn)</span>}
          name="category"
        >
          <Select placeholder="Chọn danh mục..." allowClear size="large">
            {CATEGORIES.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={onClose} size="large">
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            icon={isEdit ? <SaveOutlined /> : <PlusOutlined />}
          >
            {isEdit ? 'Lưu thay đổi' : 'Thêm mới'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
