# Frontend Current Plan

## Purpose

This file stores the current execution plan for the Frontend Agent.

The agent must update this file from the provided task prompt before changing source code.

This file is dynamic. It should reflect the latest frontend task only.

## Status

Completed.

## Current Task

Kết nối Frontend admin với AppotaBackend API — fix fallback URL sai, cập nhật agent docs, đảm bảo tất cả API calls đúng endpoint và response shape.

## Task Source Prompt

"Đọc cấu trúc Appota_FE và Appota_Backend. Backend đã hoàn thiện giờ tôi muốn cập nhật lại Frontend phần admin kết nối với api. Hiện chưa kết nối được api. Đọc các folder postman, docs trong backend và folder agents trong frontend tuân thủ các quy tắc đó"

## Affected Area

Mark all areas affected by the current task.

- [ ] Chat screen
- [ ] Chat streaming
- [ ] SSE parser
- [x] API integration
- [x] Admin conversations
- [x] Admin Knowledge Base
- [ ] UI/UX
- [ ] Routing
- [ ] Layout
- [x] Build/lint
- [x] Other: Agent doc update, vite.config.js proxy fix

## Related Agent Files To Read

Before coding, read the required files.

Required for every frontend task:

- [ ] `agent/frontend/context.md`
- [ ] `agent/frontend/skill.md`
- [ ] `agent/frontend/checklist.md`

Read when UI/UX is affected:

- [ ] `agent/frontend/ui-ux-rules.md`

Read feature-specific files when relevant:

- [ ] `agent/features/chat.md`
- [ ] `agent/features/admin-conversations.md`
- [ ] `agent/features/admin-knowledge.md`
- [ ] `agent/features/api-integration.md`

## Problem Summary

Hai vị trí fallback URL sai:

1. `baseApi.js` dùng `localhost:5000` làm fallback thay vì `localhost:3000` (backend chạy PORT=3000)
2. `vite.config.js` proxy target fallback cũng là `localhost:5000`
3. `api-integration.md` (agent doc) cũng ghi sai `localhost:5000`

Khi `.env` không được load đúng (ví dụ: môi trường CI/CD hoặc mở folder khác), cả proxy lẫn direct fetch đều trỏ sai port → API không kết nối được.

## Expected Behavior

Sau fix:

- Admin conversations list load được từ `GET /api/conversations`
- Admin conversation detail load được từ `GET /api/conversations/:id` (dùng MongoDB `_id`)
- Knowledge Base CRUD hoạt động với `GET/POST/PUT/DELETE /api/knowledge`
- Chat page tạo session `POST /api/session` và stream `POST /api/chat` đúng
- Fallback URL đúng `localhost:3000` ở mọi chỗ

## Current Behavior

API calls thất bại khi `.env` không được load — fallback trỏ sai port 5000 thay vì 3000.

## Scope

- Fix fallback URL trong `baseApi.js` từ `localhost:5000` → `localhost:3000`
- Fix fallback URL trong `vite.config.js` proxy từ `localhost:5000` → `localhost:3000`
- Cập nhật `api-integration.md` agent doc để ghi đúng port
- Xác minh tất cả API endpoints đúng với Postman collection
- Xác minh response shape handling đúng

## Out Of Scope

- Backend code.
- MongoDB schema.
- Grok API server integration.
- Authentication.
- New dependencies.
- Large folder restructuring.
- Unrelated UI redesign.
- Unrelated formatting across the codebase.
- Không refactor toàn bộ API layer.

## Files To Inspect

- `src/api/baseApi.js` — kiểm tra fallback URL
- `vite.config.js` — kiểm tra proxy target
- `src/api/conversationApi.js` — kiểm tra endpoint paths
- `src/api/knowledgeApi.js` — kiểm tra endpoint paths
- `src/api/chatApi.js` — kiểm tra session/chat endpoints
- `agent/features/api-integration.md` — kiểm tra doc có ghi đúng port không
- Backend `.env` — xác nhận PORT=3000
- Backend `src/app.ts` — xác nhận CORS origin
- Backend `src/routes/index.ts` — xác nhận prefix /api
- Postman collections — xác nhận endpoint shapes

## Files Likely To Modify

- `src/api/baseApi.js` — fix fallback URL
- `vite.config.js` — fix proxy target fallback
- `agent/features/api-integration.md` — fix doc URL
- `agent/frontend/current-plan.md` — (file này)
- `agent/frontend/handoff.md` — sau khi xong

## Implementation Steps

1. Đọc backend `.env`, `src/app.ts`, `src/routes/index.ts`, Postman collections để xác nhận API contract.
2. Đọc `baseApi.js`, `vite.config.js`, `api-integration.md` để xác nhận vấn đề fallback URL.
3. Fix `baseApi.js`: đổi fallback `localhost:5000` → `localhost:3000`.
4. Fix `vite.config.js` proxy: đổi fallback `localhost:5000` → `localhost:3000`.
5. Cập nhật `agent/features/api-integration.md`: fix URL doc.
6. Xác minh tất cả API endpoint paths trong `conversationApi.js`, `knowledgeApi.js`, `chatApi.js` đúng với Postman.
7. Run lint và build.
8. Update `handoff.md`.

## Chat Streaming Requirements

Use this section only if the task affects chat, `useChat.js`, `chatApi.js`, or `sseParser.js`.

- [ ] Confirm chat uses `POST /api/chat`.
- [ ] Confirm frontend reads `response.body.getReader()`.
- [ ] Confirm frontend decodes stream chunks with `TextDecoder`.
- [ ] Confirm frontend parses SSE `data:` events.
- [ ] Confirm `{ token }` appends to the current assistant message.
- [ ] Confirm `{ done: true }` stops loading state.
- [ ] Confirm stream error is handled.
- [ ] Confirm no WebSocket, webhook, polling, or fake delayed rendering is introduced.
- [ ] Confirm one assistant bubble is not created per token.

## API Contract Requirements

Use this section if the task affects API calls.

- [ ] Preserve `VITE_API_URL` usage.
- [ ] Preserve API wrapper pattern under `src/api/`.
- [ ] Preserve JSON response format handling: `{ success, data, message }`.
- [ ] Preserve chat stream exception for `text/event-stream`.
- [ ] Handle backend error messages.
- [ ] Handle network failures.

## UI/UX Requirements

Use this section if the task affects visible UI.

- [ ] Main action is clear.
- [ ] Loading state is visible.
- [ ] Empty state exists where needed.
- [ ] Error state is readable.
- [ ] Layout remains usable on mobile.
- [ ] Layout remains readable on desktop.
- [ ] No unnecessary redesign is introduced.

## Validation Plan

Run available commands when possible:

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run format:check` if available

Manual validation to perform:

- [ ] Open affected route.
- [ ] Trigger affected user action.
- [ ] Confirm success path.
- [ ] Confirm error or empty state if relevant.
- [ ] Confirm no unrelated screen is broken.

For chat tasks:

- [ ] Send a message.
- [ ] Confirm user message appears immediately.
- [ ] Confirm assistant response streams progressively.
- [ ] Confirm input is guarded while streaming.
- [ ] Confirm done event ends loading state.

For admin conversations:

- [ ] Load conversation list.
- [ ] Open conversation detail.
- [ ] Confirm message order and readable layout.

For admin Knowledge Base:

- [ ] Load KB list.
- [ ] Create entry.
- [ ] Edit entry.
- [ ] Delete entry with confirmation.

## Risk Notes

TODO: List risks before coding.

Examples:

- Backend endpoint may not match expected response contract.
- Stream parser may fail when JSON is split across chunks.
- API may return error shape different from `{ success, data, message }`.
- Ant Design table may overflow on mobile.
- Existing code may not have validation scripts.

## Backend/API Dependencies

TODO: Record dependencies on backend behavior.

Examples:

- Requires `POST /api/chat` to return `text/event-stream`.
- Requires stream events in `data: {"token":"..."}` format.
- Requires final event `data: {"done":true}`.
- Requires REST endpoints to return `{ success, data, message }`.

If no backend dependency is involved, write:

No backend/API dependency beyond existing contract.

## Definition Of Done

The current task is done when:

- [ ] Implementation matches task prompt.
- [ ] Scope stayed narrow.
- [ ] Affected UI works.
- [ ] Affected API flow works.
- [ ] Loading, empty, and error states are handled where relevant.
- [ ] Chat streaming contract is preserved if chat is affected.
- [ ] No unrelated backend code was changed.
- [ ] No unnecessary dependency was added.
- [ ] Validation status is known.
- [ ] `agent/frontend/handoff.md` is updated.

## Final Result

TODO: Fill after implementation.

Status:

- [ ] Not started
- [ ] In progress
- [ ] Completed
- [ ] Blocked
- [ ] Partially completed

Summary:

TODO.

Validation result:

TODO.

Known issues:

TODO.
