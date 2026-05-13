import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import './index.css'
import App from './App.jsx'

const antdTheme = {
  token: {
    colorPrimary: '#2563eb',
    colorLink: '#2563eb',
    borderRadius: 10,
    fontFamily: 'Inter, system-ui, sans-serif',
    colorBgContainer: '#ffffff',
  },
  components: {
    Button: {
      borderRadius: 10,
      controlHeight: 38,
    },
    Input: {
      borderRadius: 10,
      controlHeight: 38,
    },
    Table: {
      borderRadius: 12,
    },
    Modal: {
      borderRadius: 20,
    },
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={antdTheme} locale={viVN}>
      <App />
    </ConfigProvider>
  </StrictMode>
)
