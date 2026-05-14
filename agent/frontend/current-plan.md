# Frontend Current Plan

## Purpose

This file stores the current execution plan for the Frontend Agent.

The agent must update this file from the provided task prompt before changing source code.

## Status

Completed.

## Current Task

Recover chat automatically when backend reports `Session not found`.

## Task Source Prompt

"ở Frontend, nếu như có khi mới tạo một session mới (chưa kịp nhắn gì), nhưng ở backend lại mới gọi api get list conversation và xoá session cũ đi, nghĩa là session mới tạo ở frontend cũng bị xoá, gây ra lỗi \"Session not found \". Tôi cần bạn fix lỗi đó bằng cách nếu như có lỗi đó thì gọi tạo session mới luôn"

## Affected Area

- [x] Chat screen
- [x] Chat streaming
- [ ] SSE parser
- [x] API integration
- [ ] Admin conversations
- [ ] Admin Knowledge Base
- [ ] UI/UX
- [ ] Routing
- [ ] Layout
- [x] Build/lint
- [ ] Other

## Related Agent Files Read

- [x] `agent/features/chat.md`
- [x] `agent/features/api-integration.md`
- [x] `agent/frontend/current-plan.md`
- [x] `vercel-react-best-practices` skill quick reference

## Out Of Scope

- Backend changes.
- Admin conversations cleanup behavior.
- Changing chat transport away from `POST /api/chat` streaming.
- New dependencies.
- UI redesign.
- Rewriting the SSE parser.

## Files Inspected

- `src/hooks/useChat.js`
- `src/api/chatApi.js`
- `src/utils/sseParser.js`
- `src/pages/ChatPage.jsx`

## Files Likely To Modify

- `src/hooks/useChat.js`
- `agent/frontend/current-plan.md`
- `agent/frontend/handoff.md`

## GitNexus Impact

- `useChat`: LOW risk, direct caller `ChatPage`, affected process `ChatPage`.
- `sendMessage`: ambiguous symbol in index; scoped implementation is inside `src/hooks/useChat.js`.
- `sendChatMessage`: LOW risk, direct caller `sendMessage`.
- `createSession`: LOW risk, direct callers `ensureSession` and `initSession`, affected processes `ChatPage` and `sendMessage`.

## Implementation Steps

1. Add a helper to identify `Session not found` errors.
2. In `sendMessage`, keep the current behavior of appending one user message and one assistant placeholder.
3. Extract the stream send/read loop into a local retryable function inside `sendMessage`.
4. If the first attempt fails with `Session not found` before receiving tokens, create a new session, update `sessionId`, and retry the same message once.
5. Preserve existing error cleanup behavior for non-recoverable errors.
6. Run validation commands and update handoff.

## API Contract Requirements

- `POST /api/session` still creates session.
- `POST /api/chat` still uses streaming response.
- Stream tokens still append progressively to the same assistant message.
- No duplicate user message should be added during retry.
- Retry only handles the `Session not found` case.

## UI/UX Requirements

- Keep current chat UI unchanged.
- Existing user message remains visible.
- Assistant placeholder should be reused for the retry.
- If retry fails, show readable error and remove empty assistant placeholder as before.

## Validation Plan

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run format:check` if script exists

Manual validation target:

- [ ] Simulate or trigger `Session not found` and confirm frontend creates a new session.
- [ ] Confirm no duplicate user message appears.
- [ ] Confirm successful retry streams into one assistant bubble.

## Risk Notes

- If backend sends `Session not found` after partial tokens, retry is skipped to avoid mixing two assistant responses.
- Retry is single-attempt only to avoid loops if session creation or backend chat remains broken.

## Backend/API Dependencies

- Backend error text must include `Session not found` for the automatic recovery path.
- Backend `POST /api/session` must return `{ data: { sessionId } }`.

## Definition Of Done

- [x] `Session not found` creates a new session and retries the message.
- [x] Existing chat streaming behavior remains progressive.
- [x] No duplicate user bubble is created during retry.
- [x] Validation status is known.
- [x] `agent/frontend/handoff.md` is updated.

## Final Result

Status:

- [ ] Not started
- [ ] In progress
- [x] Completed
- [ ] Blocked
- [ ] Partially completed

Summary:

Updated `useChat` so a `Session not found` error before any streamed token creates a new session and retries the same message once using the existing assistant placeholder.

Validation result:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run format:check`: failed due to existing repo-wide Prettier drift.
- GitNexus detect changes: medium risk, expected affected chat processes.

Known issues:

Manual browser simulation of `Session not found` was not run in this turn.
