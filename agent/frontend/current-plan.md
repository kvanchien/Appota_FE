# Frontend Current Plan

## Purpose

This file stores the current execution plan for the Frontend Agent.

The agent must update this file from the provided task prompt before changing source code.

## Status

Completed.

## Current Task

Update frontend admin Knowledge and Conversations screens to consume the new paginated backend list responses.

## Task Source Prompt

"Rất tốt, bây giờ bạn sang repo D:\Workspace\personal\Appota_FE, chỉnh sửa 2 phần liên quan đến 2 API có dùng pagination mới này"

## Affected Area

- [ ] Chat screen
- [ ] Chat streaming
- [ ] SSE parser
- [x] API integration
- [x] Admin conversations
- [x] Admin Knowledge Base
- [x] UI/UX
- [ ] Routing
- [ ] Layout
- [x] Build/lint
- [ ] Other

## Related Agent Files Read

- [x] `agent/README.md`
- [x] `agent/frontend/context.md`
- [x] `agent/frontend/skill.md`
- [x] `agent/features/admin-conversations.md`
- [x] `agent/features/admin-knowledge.md`
- [x] `agent/features/api-integration.md`
- [x] `agent/frontend/checklist.md`
- [x] `agent/frontend/ui-ux-rules.md`

## Out Of Scope

- Backend code.
- Chat streaming behavior.
- Authentication or permissions.
- New dependencies.
- Search/filter API implementation.
- Large UI redesign.
- Unrelated formatting across the codebase.

## Files Inspected

- `src/api/knowledgeApi.js`
- `src/hooks/useKnowledge.js`
- `src/pages/admin/KnowledgePage.jsx`
- `src/components/admin/KnowledgeTable.jsx`
- `src/api/conversationApi.js`
- `src/pages/admin/ConversationsPage.jsx`
- `src/components/admin/ConversationTable.jsx`

## Files Likely To Modify

- `src/api/knowledgeApi.js`
- `src/hooks/useKnowledge.js`
- `src/pages/admin/KnowledgePage.jsx`
- `src/components/admin/KnowledgeTable.jsx`
- `src/api/conversationApi.js`
- `src/pages/admin/ConversationsPage.jsx`
- `src/components/admin/ConversationTable.jsx`
- `agent/frontend/current-plan.md`
- `agent/frontend/handoff.md`

## GitNexus Impact

- `getKnowledge`: LOW risk, direct caller `fetchAll`, affected process `KnowledgePage`.
- `useKnowledge`: LOW risk, direct caller `KnowledgePage`.
- `KnowledgePage`: LOW risk, 0 upstream callers.
- `KnowledgeTable`: LOW risk, 0 upstream callers.
- `getConversations`: LOW risk, direct caller `load`, affected process `ConversationsPage`.
- `ConversationsPage`: LOW risk, 0 upstream callers.
- `ConversationTable`: LOW risk, 0 upstream callers.

## Implementation Steps

1. Update `knowledgeApi.getKnowledge` to send `page` and `limit` query params.
2. Update `useKnowledge` to store backend pagination metadata and expose `pagination`.
3. Update `KnowledgePage` and `KnowledgeTable` so Ant Design table pagination triggers backend fetches.
4. Update `conversationApi.getConversations` to send `page` and `limit` query params.
5. Update `ConversationsPage` and `ConversationTable` so Ant Design table pagination triggers backend fetches.
6. Run validation commands.
7. Update handoff.

## API Contract Requirements

- Preserve `VITE_API_URL` and existing `apiFetch` pattern.
- `GET /api/knowledge` now returns `data.entries` and `data.pagination`.
- `GET /api/conversations` now returns `data.conversations` and `data.pagination`.
- Keep REST error handling through `apiFetch`.
- Do not touch chat stream handling.

## UI/UX Requirements

- Keep existing table layout and styling.
- Use Ant Design controlled table pagination.
- Keep loading and error state behavior.
- Keep current client-side search/date filters scoped to the current page only unless backend adds server-side filter support.

## Validation Plan

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run format:check` if script exists

Manual validation target:

- [ ] `/admin/knowledge` loads page 1 with backend pagination metadata.
- [ ] Knowledge table page changes request the matching backend page.
- [ ] `/admin/conversations` loads page 1 with backend pagination metadata.
- [ ] Conversation table page changes request the matching backend page.

## Risk Notes

- Existing search/category/date filters are client-side and will only filter the currently loaded backend page.
- Create/update/delete currently mutate the visible page locally; if an operation affects another page, a full refetch may be needed later.

## Backend/API Dependencies

- Backend must support:
  - `GET /api/knowledge?page=<number>&limit=<number>`
  - `GET /api/conversations?page=<number>&limit=<number>`
- Backend must return:
  - `data.entries` for knowledge list.
  - `data.conversations` for conversation list.
  - `data.pagination.total`, `page`, and `limit`.

## Definition Of Done

- [x] Frontend consumes paginated knowledge API response.
- [x] Frontend consumes paginated conversations API response.
- [x] Tables use server-side page changes.
- [x] Loading/error behavior remains intact.
- [x] No unrelated backend or chat code changed.
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

Updated admin Knowledge and Conversations to call paginated backend APIs and drive Ant Design table pagination from backend metadata.

Validation result:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run format:check`: failed because the repository already has broad Prettier drift across many files.
- GitNexus detect changes: medium risk, affected expected Knowledge and Conversations API flows.

Known issues:

Current search/category/date filters still apply client-side to the currently loaded backend page only.
