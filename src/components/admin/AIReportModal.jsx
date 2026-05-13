import { useRef } from 'react'
import { Modal, Tag, Button, Spin } from 'antd'
import {
  PrinterOutlined,
  FireOutlined,
  BulbOutlined,
  ToolOutlined,
  CalendarOutlined,
  MessageOutlined,
  FileTextOutlined,
} from '@ant-design/icons'

const priorityColor = { high: 'red', medium: 'orange', low: 'green' }
const priorityLabel = { high: 'Cao', medium: 'Trung bình', low: 'Thấp' }

const PRINT_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#1e293b;padding:40px;line-height:1.6}
.report-header{text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:3px solid #2563eb}
.report-header h1{font-size:22px;color:#1e293b;margin-bottom:4px}
.report-header p{font-size:13px;color:#64748b;margin-top:4px}
.stats-row{display:flex;gap:14px;margin-bottom:24px;justify-content:center;flex-wrap:wrap}
.stat-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 20px;text-align:center;min-width:140px}
.stat-box .lbl{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px}
.stat-box .val{font-size:20px;font-weight:700;color:#2563eb}
.stat-box .val.sm{font-size:14px}
.summary-box{background:linear-gradient(135deg,#eff6ff,#f0f9ff);border-left:4px solid #2563eb;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;font-size:14px;line-height:1.7}
.section-title{font-size:17px;font-weight:700;margin:24px 0 12px;color:#1e293b}
.issue-card,.solution-card,.rec-box{page-break-inside:avoid;break-inside:avoid;margin-bottom:12px;border-radius:8px;padding:16px}
.issue-card{background:#fff;border:1px solid #e2e8f0}
.solution-card{background:#fffbeb;border:1px solid #fde68a}
.rec-box{background:#f0fdf4;border:1px solid #bbf7d0;padding:16px 16px 16px 20px}
.rank-badge{background:#2563eb;color:#fff;width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700}
.row-between{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.row-start{display:flex;align-items:center;gap:10px}
.topic-name{font-size:15px;font-weight:600}
.pct-label{font-size:13px;color:#2563eb;font-weight:600}
.sample-q{font-size:12px;color:#64748b;padding:3px 0 3px 14px;border-left:2px solid #e2e8f0;margin:3px 0}
.sol-topic{font-size:14px;font-weight:600}
.priority-tag{display:inline-block;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600}
.priority-high{background:#fee2e2;color:#dc2626}
.priority-medium{background:#ffedd5;color:#ea580c}
.priority-low{background:#dcfce7;color:#16a34a}
.root-cause{font-size:13px;color:#92400e;margin:8px 0}
.two-col{display:flex;gap:16px;flex-wrap:wrap}
.two-col>div{flex:1;min-width:200px}
.col-title{font-size:12px;font-weight:600;color:#1e293b;margin-bottom:4px}
ul,ol{padding-left:18px;font-size:13px}
li{margin:4px 0}
.report-footer{text-align:center;margin-top:28px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8}
@media print{
  body{padding:20px}
  @page{margin:12mm 15mm}
  .issue-card,.solution-card,.rec-box,.summary-box{page-break-inside:avoid;break-inside:avoid}
  .section-title{page-break-after:avoid;break-after:avoid}
}
`

export default function AIReportModal({ open, onClose, report, loading }) {
  const printRef = useRef(null)

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return

    const printWindow = window.open('', '_blank')
    printWindow.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Báo cáo phân tích AI</title><style>${PRINT_CSS}</style></head><body>`
    )
    printWindow.document.write(content.innerHTML)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 400)
  }

  /* ── Modal title bar with print button ── */
  const modalTitle = loading ? (
    <span className="text-base font-bold text-slate-700">📊 Báo cáo AI</span>
  ) : report ? (
    <div className="flex items-center justify-between pr-8">
      <span className="text-base font-bold text-slate-700">📊 Báo cáo AI</span>
      <Button
        type="primary"
        icon={<PrinterOutlined />}
        onClick={handlePrint}
        className="rounded-xl shadow-md"
      >
        Xuất PDF / In báo cáo
      </Button>
    </div>
  ) : (
    <span className="text-base font-bold text-slate-700">📊 Báo cáo AI</span>
  )

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={860}
      footer={null}
      destroyOnClose
      title={modalTitle}
      className="ai-report-modal"
      styles={{
        body: {
          maxHeight: 'calc(85vh - 80px)',
          overflowY: 'auto',
          padding: '20px 24px',
        },
      }}
      style={{ top: 40 }}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spin size="large" />
          <div className="text-center">
            <p className="text-base font-semibold text-slate-700">Đang phân tích dữ liệu...</p>
            <p className="text-sm text-slate-400 mt-1">
              AI đang tổng hợp và phân tích các cuộc hội thoại
            </p>
          </div>
        </div>
      ) : report ? (
        <div ref={printRef} id="report-print-area">
          {/* Header */}
          <div
            className="report-header"
            style={{
              textAlign: 'center',
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: '3px solid #2563eb',
            }}
          >
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0 }}>
              📊 Báo cáo phân tích AI
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
              Tổng hợp vấn đề người dùng hỏi nhiều nhất &amp; phương hướng giải quyết
            </p>
          </div>

          {/* Stats */}
          <div
            className="stats-row"
            style={{
              display: 'flex',
              gap: 12,
              marginBottom: 24,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <StatCard
              icon={<MessageOutlined />}
              label="Cuộc hội thoại"
              value={report.totalConversations}
            />
            <StatCard
              icon={<FileTextOutlined />}
              label="Tin nhắn user"
              value={report.totalUserMessages}
            />
            <StatCard
              icon={<CalendarOutlined />}
              label="Khoảng thời gian"
              value={report.analysisWindow}
              small
            />
          </div>

          {/* Summary */}
          <div
            className="summary-box"
            style={{
              background: 'linear-gradient(135deg,#eff6ff,#f0f9ff)',
              borderLeft: '4px solid #2563eb',
              padding: '16px 20px',
              borderRadius: '0 10px 10px 0',
              marginBottom: 24,
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            <strong>Tổng quan:</strong> {report.summary}
          </div>

          {/* Top Issues */}
          <h3
            className="section-title"
            style={{
              fontSize: 17,
              fontWeight: 700,
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <FireOutlined style={{ color: '#ef4444' }} /> Top vấn đề được hỏi nhiều nhất
          </h3>
          {report.topIssues?.map((issue) => (
            <div
              key={issue.rank}
              className="issue-card"
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: 16,
                marginBottom: 10,
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      background: '#2563eb',
                      color: '#fff',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {issue.rank}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{issue.topic}</span>
                </div>
                <span style={{ fontSize: 13, color: '#2563eb', fontWeight: 600 }}>
                  {issue.percentage} ({issue.count} lượt)
                </span>
              </div>
              {issue.sampleQuestions?.map((q, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 12,
                    color: '#64748b',
                    padding: '3px 0 3px 14px',
                    borderLeft: '2px solid #e2e8f0',
                    margin: '3px 0',
                  }}
                >
                  &ldquo;{q}&rdquo;
                </div>
              ))}
            </div>
          ))}

          {/* Solutions */}
          <h3
            className="section-title"
            style={{
              fontSize: 17,
              fontWeight: 700,
              margin: '24px 0 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ToolOutlined style={{ color: '#f59e0b' }} /> Phương hướng giải quyết
          </h3>
          {report.solutions?.map((sol, idx) => (
            <div
              key={idx}
              className="solution-card"
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 10,
                padding: 16,
                marginBottom: 10,
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600 }}>{sol.topic}</span>
                <Tag color={priorityColor[sol.priority]}>{priorityLabel[sol.priority]}</Tag>
              </div>
              <div style={{ fontSize: 13, color: '#92400e', marginBottom: 8 }}>
                <strong>Nguyên nhân gốc:</strong> {sol.rootCause}
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>
                    ⚡ Ngắn hạn
                  </div>
                  <ul style={{ paddingLeft: 18, fontSize: 13 }}>
                    {sol.shortTermActions?.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>
                    🎯 Dài hạn
                  </div>
                  <ul style={{ paddingLeft: 18, fontSize: 13 }}>
                    {sol.longTermActions?.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          {/* Recommendations */}
          <h3
            className="section-title"
            style={{
              fontSize: 17,
              fontWeight: 700,
              margin: '24px 0 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <BulbOutlined style={{ color: '#22c55e' }} /> Khuyến nghị chung
          </h3>
          <div
            className="rec-box"
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 10,
              padding: '16px 16px 16px 20px',
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
            }}
          >
            <ol style={{ paddingLeft: 18, fontSize: 14, lineHeight: 1.8 }}>
              {report.recommendations?.map((rec, i) => (
                <li key={i} style={{ marginBottom: 4 }}>
                  {rec}
                </li>
              ))}
            </ol>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              marginTop: 28,
              paddingTop: 14,
              borderTop: '1px solid #e2e8f0',
              fontSize: 11,
              color: '#94a3b8',
            }}
          >
            Báo cáo được tạo bởi AI Grok · {new Date(report.generatedAt).toLocaleString('vi-VN')}
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

function StatCard({ icon, label, value, small }) {
  return (
    <div
      className="stat-box"
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        padding: '12px 20px',
        textAlign: 'center',
        minWidth: small ? 160 : 120,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '.5px',
          marginBottom: 4,
        }}
      >
        {icon} {label}
      </div>
      <div style={{ fontSize: small ? 14 : 22, fontWeight: 700, color: '#2563eb' }}>{value}</div>
    </div>
  )
}
