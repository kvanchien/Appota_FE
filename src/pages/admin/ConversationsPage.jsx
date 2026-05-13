import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, DatePicker, Button, message } from 'antd'
import { MessageOutlined, CalendarOutlined, BarChartOutlined } from '@ant-design/icons'
import { getConversations } from '../../api/conversationApi'
import { generateAIReport } from '../../api/reportApi'
import ConversationTable from '../../components/admin/ConversationTable'
import AIReportModal from '../../components/admin/AIReportModal'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

const { RangePicker } = DatePicker

export default function ConversationsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [dateRange, setDateRange] = useState(null)

  // AI Report state
  const [reportOpen, setReportOpen] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)

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

  const filteredData = data.filter((item) => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return true

    const itemDate = dayjs(item.createdAt)
    const startDate = dateRange[0].startOf('day')
    const endDate = dateRange[1].endOf('day')

    return itemDate.isBetween(startDate, endDate, null, '[]')
  })

  const handleGenerateReport = async () => {
    setReportOpen(true)
    setReportLoading(true)
    setReportData(null)
    try {
      const report = await generateAIReport()
      setReportData(report)
    } catch (err) {
      message.error(err.message || 'Không thể tạo báo cáo AI')
      setReportOpen(false)
    } finally {
      setReportLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
      {/* Header & Filter: Chuyển sang column trên màn hình dưới lg (tablet portrait), row trên laptop */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shrink-0">
            <MessageOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800">Conversation Logs</h1>
            <p className="text-xs md:text-sm text-slate-400">Lịch sử toàn bộ cuộc trò chuyện</p>
          </div>
        </div>

        {/* Khối Filter + AI Report */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <CalendarOutlined />
            <span className="hidden md:inline">Lọc theo ngày:</span>
          </div>
          <RangePicker
            onChange={(dates) => setDateRange(dates)}
            placeholder={['Từ ngày', 'Đến ngày']}
            className="rounded-lg h-10 border-slate-200 flex-1 md:flex-none min-w-[240px]"
            format="DD/MM/YYYY"
            allowClear
          />

          {!loading && (
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100 whitespace-nowrap">
              {filteredData.length} kết quả
            </div>
          )}

          <Button
            id="btn-ai-report"
            type="primary"
            icon={<BarChartOutlined />}
            onClick={handleGenerateReport}
            loading={reportLoading}
            className="rounded-xl h-10 shadow-md font-semibold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
          >
            Báo cáo AI
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} showIcon className="mb-6 rounded-xl" />}

      <div className="card !p-0 overflow-hidden shadow-sm border-slate-100">
        <ConversationTable
          data={filteredData}
          loading={loading}
          onRowClick={(record) => navigate(`/admin/conversations/${record._id}`)}
        />
      </div>

      {/* AI Report Modal */}
      <AIReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        report={reportData}
        loading={reportLoading}
      />
    </div>
  )
}
