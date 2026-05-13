# 🤖 Appota Chatbot QA — Frontend

<div align="center">
  <h3>Chatbot QA System — Appota NextGen 2026</h3>
  <p>React + Vite + Tailwind CSS + Ant Design | SSE Streaming | Player Chat + Admin Dashboard</p>

  ![Version](https://img.shields.io/badge/version-0.1.0-blue?style=flat-square)
  ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&style=flat-square)
  ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&style=flat-square)
  ![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&style=flat-square)
</div>

---

## 🗂️ Project Structure

```
src/
├── api/
│   ├── baseApi.js          ← Generic fetch wrapper
│   ├── chatApi.js          ← Session + SSE chat endpoints
│   ├── conversationApi.js  ← Admin conversation list/detail
│   └── knowledgeApi.js     ← Knowledge Base CRUD
│
├── components/
│   ├── chat/
│   │   ├── ChatBubble.jsx       ← Message bubble UI
│   │   ├── ChatInput.jsx        ← Input + send button
│   │   └── TypingIndicator.jsx  ← Animated dots
│   ├── admin/
│   │   ├── ConversationTable.jsx
│   │   ├── KnowledgeTable.jsx
│   │   └── KnowledgeModal.jsx
│   └── layout/
│       └── AdminLayout.jsx      ← Sidebar layout
│
├── hooks/
│   ├── useChat.js        ← SSE streaming state management
│   └── useKnowledge.js   ← Knowledge Base CRUD state
│
├── pages/
│   ├── ChatPage.jsx                          ← /
│   └── admin/
│       ├── ConversationsPage.jsx             ← /admin/conversations
│       ├── ConversationDetailPage.jsx        ← /admin/conversations/:id
│       └── KnowledgePage.jsx                 ← /admin/knowledge
│
├── utils/
│   └── sseParser.js      ← Parse SSE text/event-stream chunks
│
├── App.jsx               ← React Router v6
├── main.jsx              ← Entry point (Ant Design ConfigProvider)
└── index.css             ← Tailwind + custom styles
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 + Ant Design 5 |
| Routing | React Router DOM v6 |
| AI Streaming | SSE (text/event-stream) via Fetch API ReadableStream |
| Backend | Express.js + MongoDB (TypeScript) — port `5000` |
| Deploy | Vercel |

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000

# 3. Start dev server
npm run dev
# → http://localhost:5173

# 4. Open admin dashboard
# → http://localhost:5173/admin/conversations
# → http://localhost:5173/admin/knowledge
```

---

## 📡 Routes

| Path | Description |
|------|-------------|
| `/` | Player chat (SSE streaming) |
| `/admin/conversations` | Admin — list all sessions |
| `/admin/conversations/:id` | Admin — full chat log detail |
| `/admin/knowledge` | Admin — CRUD Knowledge Base |

---

## 🔧 Scripts

```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run format:check # Prettier check (CI)
```

---

## 🛡️ Security Notes

> **Không bao giờ commit:**
> - `.env` files
> - API keys, secrets
> - `.claude/settings.local.json`

---

## 🏗️ Backend API Contract

Backend chạy tại `http://localhost:5000` với các endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/session` | Tạo session mới |
| `POST` | `/api/chat` | Gửi message (SSE stream) |
| `GET` | `/api/chat/:sessionId` | Lấy lịch sử chat |
| `GET` | `/api/conversations` | Danh sách conversations (admin) |
| `GET` | `/api/conversations/:id` | Chi tiết conversation (admin) |
| `GET` | `/api/knowledge` | Danh sách Q&A |
| `POST` | `/api/knowledge` | Tạo Q&A mới |
| `PUT` | `/api/knowledge/:id` | Cập nhật Q&A |
| `DELETE` | `/api/knowledge/:id` | Xóa Q&A |
