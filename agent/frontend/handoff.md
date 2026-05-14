# Frontend Agent Handoff

## Status

Completed - 2026-05-14.

## Latest Task Summary

Updated the chat hook so the frontend recovers when backend returns `Session not found` for a session that was created but later deleted by conversation cleanup before the user sends a message.

## Task Source Prompt

"ở Frontend, nếu như có khi mới tạo một session mới (chưa kịp nhắn gì), nhưng ở backend lại mới gọi api get list conversation và xoá session cũ đi, nghĩa là session mới tạo ở frontend cũng bị xoá, gây ra lỗi \"Session not found \". Tôi cần bạn fix lỗi đó bằng cách nếu như có lỗi đó thì gọi tạo session mới luôn"

## Affected Area

- [x] Chat screen
- [x] Chat streaming
- [x] API integration
- [x] Build/lint

## Files Changed

- `src/hooks/useChat.js`
- `agent/frontend/current-plan.md`
- `agent/frontend/handoff.md`

## Files Inspected But Not Changed

- `agent/features/chat.md`
- `agent/features/api-integration.md`
- `src/api/chatApi.js`
- `src/utils/sseParser.js`
- `src/pages/ChatPage.jsx`

## Behavior Implemented

- `sendMessage` still appends one user message and one assistant placeholder before opening the stream.
- The stream send/read logic is retryable inside `useChat`.
- If the first chat attempt fails with `Session not found` before any token arrives:
  - frontend calls `POST /api/session` to create a new session,
  - updates local `sessionId`,
  - retries the same message once,
  - reuses the same assistant placeholder.
- If tokens already started arriving, retry is skipped to avoid mixing two assistant responses.
- Non-recoverable errors keep the existing behavior: show an error and remove the empty assistant placeholder when no token was received.

## API Contract Notes

- Chat still uses `POST /api/chat` with streaming response.
- Session recovery uses existing `POST /api/session`.
- No `EventSource`, polling, WebSocket, or fake typewriter behavior was added.

## UI/UX Notes

- No visual redesign.
- No duplicate user bubble is created during retry.
- The assistant response still streams into one assistant bubble.

## GitNexus Notes

- Pre-edit impact:
  - `useChat`: LOW, direct caller `ChatPage`, affected process `ChatPage`.
  - `sendChatMessage`: LOW, direct caller `sendMessage`.
  - `createSession`: LOW, direct callers `ensureSession` and `initSession`.
  - `sendMessage` was ambiguous in the index; scoped change is in `src/hooks/useChat.js`.
- Post-edit detect changes:
  - Risk level: medium.
  - Affected processes are expected chat processes: `ChatPage` and `SendMessage` API flows.

## Validation Commands Run

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run format:check`

## Validation Result

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run format:check`: failed due to existing repo-wide Prettier drift across many files. `src/hooks/useChat.js` was not listed in the format warnings.
- Build warning: Vite still reports the existing large `antd-vendor` chunk over 500 kB.

## Manual Testing

- Manual browser simulation of the `Session not found` path was not run in this turn.
- Behavior was validated by static flow inspection, lint, build, and GitNexus change detection.

## Known Issues

- Recovery depends on backend error text containing `Session not found`.
- Existing repo-wide Prettier drift remains.
- Existing large Ant Design vendor chunk warning remains unchanged.

## Backend/API Dependencies

- Backend must return or stream an error containing `Session not found` when a chat session was deleted.
- Backend `POST /api/session` must return a valid `sessionId`.
- Backend `POST /api/chat` must keep the current SSE contract.

## New Dependencies

No new dependencies.

## Suggested Commit Message

`fix(chat): recreate session when backend reports missing session`

## Suggested Next Step

Manually test by deleting the current session on the backend before sending the first chat message, then confirm the frontend creates a new session and streams the response without duplicating the user message.
