# Frontend Current Plan

## Purpose

This file stores the current execution plan for the Frontend Agent.

The agent must update this file from the provided task prompt before changing source code.

This file is dynamic. It should reflect the latest frontend task only.

## Status

No active frontend task yet.

## Current Task

TODO: Convert the next provided task prompt into a clear frontend task.

## Task Source Prompt

TODO: Paste or summarize the user/Codex task prompt here.

## Affected Area

Mark all areas affected by the current task.

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

TODO: Summarize the problem in 2–5 lines.

The summary must explain:

- What is wrong or missing.
- What expected behavior should be.
- Which frontend area is likely affected.

## Expected Behavior

TODO: Describe the expected user-visible behavior after the task is completed.

For chat-related tasks, explicitly state whether the stream must render progressively token-by-token.

## Current Behavior

TODO: Describe the current observed behavior, if known.

If unknown, write:

Current behavior must be verified by inspecting the source code and running the relevant screen.

## Scope

TODO: Define what the agent is allowed to change.

Example:

- Modify chat hook logic.
- Modify SSE parsing utility.
- Modify chat API wrapper.
- Adjust chat loading state.
- Keep backend contract unchanged.

## Out Of Scope

TODO: Define what the agent must not change.

Default out-of-scope items:

- Backend code.
- MongoDB schema.
- Grok API server integration.
- Authentication.
- New dependencies.
- Large folder restructuring.
- Unrelated UI redesign.
- Unrelated formatting across the codebase.

## Files To Inspect

TODO: List files to inspect before editing.

Common frontend files:

- `src/App.jsx`
- `src/api/baseApi.js`
- `src/api/chatApi.js`
- `src/api/conversationApi.js`
- `src/api/knowledgeApi.js`
- `src/hooks/useChat.js`
- `src/hooks/useKnowledge.js`
- `src/utils/sseParser.js`
- `src/pages/ChatPage.jsx`
- `src/pages/admin/ConversationsPage.jsx`
- `src/pages/admin/ConversationDetailPage.jsx`
- `src/pages/admin/KnowledgePage.jsx`
- `src/components/chat/ChatBubble.jsx`
- `src/components/chat/ChatInput.jsx`
- `src/components/chat/TypingIndicator.jsx`
- `src/components/admin/ConversationTable.jsx`
- `src/components/admin/KnowledgeTable.jsx`
- `src/components/admin/KnowledgeModal.jsx`
- `src/components/layout/AdminLayout.jsx`

Keep only files relevant to the actual task.

## Files Likely To Modify

TODO: List expected files to modify.

Rules:

- Keep this list narrow.
- Do not modify files not related to the task.
- If a new file is needed, explain why.

## Implementation Steps

TODO: Convert the task into concrete implementation steps.

Suggested format:

1. Inspect relevant files and confirm current behavior.
2. Identify the smallest safe change.
3. Implement the change.
4. Verify affected screen or flow.
5. Run validation commands.
6. Update `agent/frontend/handoff.md`.

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
