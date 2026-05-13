# Frontend Task Plan Template

## Purpose

Use this template to update:

`agent/frontend/current-plan.md`

The Frontend Agent must convert every provided task prompt into a concrete execution plan before changing source code.

Do not code before the current plan is updated.

## Status

Not started.

## Current Task

TODO: Write the task name in one clear sentence.

Example:

Fix chat streaming so the assistant response renders progressively token-by-token.

## Task Source Prompt

TODO: Paste or summarize the exact task prompt that triggered this plan.

Example:

User requested fixing chat display because the client screen must render each streamed token from the agent API response.

## Affected Area

Mark all affected areas.

- [ ] Chat screen
- [ ] Chat streaming
- [ ] SSE parser
- [ ] API integration
- [ ] Admin conversations
- [ ] Admin Knowledge Base
- [ ] UI/UX
- [ ] Routing
- [ ] Layout
- [ ] Build/lint
- [ ] Other: TODO

## Required Agent Files To Read

Required for every frontend task:

- [ ] `agent/README.md`
- [ ] `agent/frontend/context.md`
- [ ] `agent/frontend/skill.md`
- [ ] `agent/frontend/checklist.md`

Read when relevant:

- [ ] `agent/frontend/ui-ux-rules.md`
- [ ] `agent/features/chat.md`
- [ ] `agent/features/admin-conversations.md`
- [ ] `agent/features/admin-knowledge.md`
- [ ] `agent/features/api-integration.md`

## Problem Summary

TODO: Summarize the problem in 2–5 lines.

Include:

- what is wrong or missing
- where it appears
- why it matters
- expected user-facing result

## Expected Behavior

TODO: Describe expected behavior after completion.

For chat tasks, explicitly state:

The assistant response must render progressively from backend stream tokens/chunks. The frontend must not wait for the full response before rendering.

## Current Behavior

TODO: Describe current behavior if known.

If unknown, write:

Current behavior must be verified by inspecting the relevant source files and running the affected screen.

## Scope

TODO: Define what is allowed to change.

Example:

- Update chat stream reading logic.
- Update SSE event parsing.
- Update chat hook state handling.
- Update chat loading/error UI.
- Preserve backend API contract.

## Out Of Scope

Default out-of-scope items:

- Backend code.
- MongoDB schema.
- Grok API server integration.
- Authentication.
- New dependencies.
- Large folder restructuring.
- Unrelated UI redesign.
- Unrelated formatting across the codebase.
- API contract changes unless explicitly requested.

Add task-specific out-of-scope items here:

TODO.

## Files To Inspect

List relevant files before editing.

Common options:

- [ ] `src/App.jsx`
- [ ] `src/api/baseApi.js`
- [ ] `src/api/chatApi.js`
- [ ] `src/api/conversationApi.js`
- [ ] `src/api/knowledgeApi.js`
- [ ] `src/hooks/useChat.js`
- [ ] `src/hooks/useKnowledge.js`
- [ ] `src/utils/sseParser.js`
- [ ] `src/pages/ChatPage.jsx`
- [ ] `src/pages/admin/ConversationsPage.jsx`
- [ ] `src/pages/admin/ConversationDetailPage.jsx`
- [ ] `src/pages/admin/KnowledgePage.jsx`
- [ ] `src/components/chat/ChatBubble.jsx`
- [ ] `src/components/chat/ChatInput.jsx`
- [ ] `src/components/chat/TypingIndicator.jsx`
- [ ] `src/components/admin/ConversationTable.jsx`
- [ ] `src/components/admin/KnowledgeTable.jsx`
- [ ] `src/components/admin/KnowledgeModal.jsx`
- [ ] `src/components/layout/AdminLayout.jsx`

Task-specific files:

TODO.

## Files Likely To Modify

TODO: List expected files to modify.

Rules:

- Keep the list narrow.
- Do not modify unrelated files.
- If a new file is needed, explain why.

Example:

- `src/hooks/useChat.js` — update assistant message state while streaming.
- `src/api/chatApi.js` — ensure stream events are passed progressively.
- `src/utils/sseParser.js` — handle split SSE chunks.

## Implementation Steps

TODO: Convert the task into concrete steps.

Suggested structure:

1. Inspect relevant source files.
2. Confirm current behavior and existing data flow.
3. Identify the smallest safe change.
4. Implement the change.
5. Verify affected UI flow manually.
6. Run validation commands.
7. Update `agent/frontend/handoff.md`.

## Chat Streaming Requirements

Use this section if the task affects chat, `useChat.js`, `chatApi.js`, or `sseParser.js`.

- [ ] Preserve `POST /api/chat`.
- [ ] Preserve `Content-Type: text/event-stream` expectation.
- [ ] Use `fetch()` stream reading.
- [ ] Use `response.body.getReader()`.
- [ ] Decode stream chunks progressively.
- [ ] Parse SSE `data:` events.
- [ ] Append `{ token }` to the current assistant message.
- [ ] Stop streaming on `{ done: true }`.
- [ ] Handle `{ error }`.
- [ ] Do not introduce WebSocket.
- [ ] Do not introduce webhook.
- [ ] Do not introduce polling.
- [ ] Do not fake typewriter effect after receiving full response.
- [ ] Do not create one assistant bubble per token.

Notes:

TODO.

## API Contract Requirements

Use this section if the task affects API integration.

- [ ] Use existing API base URL configuration.
- [ ] Do not hardcode backend URL in components.
- [ ] Use API wrapper files under `src/api/`.
- [ ] Preserve REST response handling for `{ success, data, message }`.
- [ ] Keep chat stream handling separate from JSON API handling.
- [ ] Use backend `message` when available.
- [ ] Handle network failures.

Notes:

TODO.

## UI/UX Requirements

Use this section if the task affects visible UI.

- [ ] Main action is clear.
- [ ] Loading state is visible.
- [ ] Empty state exists where needed.
- [ ] Error state is readable.
- [ ] Layout remains usable on mobile.
- [ ] Layout remains readable on desktop.
- [ ] Focus state remains visible.
- [ ] No unnecessary redesign is introduced.

Notes:

TODO.

## Admin Conversations Requirements

Use this section if the task affects admin conversations.

- [ ] `GET /api/conversations` is preserved.
- [ ] `GET /api/conversations/:id` is preserved.
- [ ] Conversation list handles loading.
- [ ] Conversation list handles empty state.
- [ ] Conversation list handles error state.
- [ ] Conversation detail handles loading.
- [ ] Conversation detail handles error or not found state.
- [ ] `_id` and `sessionId` are not confused.

Notes:

TODO.

## Admin Knowledge Requirements

Use this section if the task affects Knowledge Base CRUD.

- [ ] `GET /api/knowledge` is preserved.
- [ ] `POST /api/knowledge` is preserved.
- [ ] `PUT /api/knowledge/:id` is preserved.
- [ ] `DELETE /api/knowledge/:id` is preserved.
- [ ] `question` is required.
- [ ] `answer` is required.
- [ ] `category` remains optional.
- [ ] `_id` is used for update/delete.
- [ ] Delete requires confirmation.

Notes:

TODO.

## Validation Plan

Commands to run when possible:

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run format:check` if available

Manual validation:

- [ ] Open affected route.
- [ ] Trigger affected user action.
- [ ] Confirm success path.
- [ ] Confirm loading state.
- [ ] Confirm error or empty state where relevant.
- [ ] Confirm no unrelated route is broken.

Task-specific manual checks:

TODO.

## Risk Notes

TODO: List known risks before coding.

Examples:

- Backend endpoint may differ from documented contract.
- SSE stream may split JSON across chunks.
- Existing API wrapper may return full response instead of `data`.
- Existing lint errors may be unrelated to this task.
- Admin table may overflow on small screens.

## Backend/API Dependencies

TODO: Record backend behavior required by this task.

Examples:

- `POST /api/chat` must return `text/event-stream`.
- Stream must send `data: {"token":"..."}` events.
- Stream must end with `data: {"done":true}`.
- REST APIs must return `{ success, data, message }`.

If none, write:

No new backend/API dependency beyond existing contract.

## Definition Of Done

The task is done when:

- [ ] Current plan is filled before coding.
- [ ] Implementation matches task prompt.
- [ ] Scope stays narrow.
- [ ] Affected UI works.
- [ ] Affected API flow works.
- [ ] Loading state is handled where relevant.
- [ ] Empty state is handled where relevant.
- [ ] Error state is handled where relevant.
- [ ] Chat streaming contract is preserved if chat is affected.
- [ ] No unrelated backend code is changed.
- [ ] No unnecessary dependency is added.
- [ ] Validation status is known.
- [ ] `agent/frontend/handoff.md` is updated.

## Final Result

Fill this section after implementation.

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
