# Appota FE Agent

## Purpose

This folder contains operating context, rules, feature notes, task planning templates, and handoff templates for the Frontend Agent working inside `Appota_FE`.

The goal is to help an AI coding agent or developer work safely and consistently on the frontend codebase within a small 24-hour project scope.

The agent must use these files to:

* understand the frontend project context
* plan before coding
* keep implementation scope narrow
* preserve API contracts
* preserve chat streaming behavior
* validate changes
* record handoff notes after each task

## Project Scope

This agent is only for the frontend codebase:

`Appota_FE`

It must not modify backend source code.

Backend work belongs to a separate backend agent inside the backend project.

## Frontend Product Scope

The frontend includes:

* Player-facing chat screen
* Streaming chatbot response rendering
* Admin conversation list
* Admin conversation detail
* Admin Knowledge Base CRUD
* API integration with AppotaBackend
* Basic responsive and usable UI

The frontend does not include:

* backend controllers
* backend services
* MongoDB schemas
* Grok API server integration
* authentication
* role-based permission
* advanced analytics
* vector search
* model fine-tuning

## Required Folder Structure

Expected agent folder structure:

Appota_FE/agent/
├── README.md
├── frontend/
│   ├── context.md
│   ├── skill.md
│   ├── ui-ux-rules.md
│   ├── checklist.md
│   ├── current-plan.md
│   └── handoff.md
├── features/
│   ├── chat.md
│   ├── admin-conversations.md
│   ├── admin-knowledge.md
│   └── api-integration.md
└── templates/
├── task-plan-template.md
└── handoff-template.md

## Required Reading Order

Before any frontend coding task, the agent must read files in this order:

1. `agent/README.md`
2. `agent/frontend/context.md`
3. `agent/frontend/skill.md`
4. Relevant feature file under `agent/features/`
5. `agent/frontend/checklist.md`
6. `agent/frontend/ui-ux-rules.md` if the task affects visible UI

Relevant feature files:

For chat, streaming, chat page, `useChat.js`, `chatApi.js`, or `sseParser.js`:

`agent/features/chat.md`

For conversation list/detail:

`agent/features/admin-conversations.md`

For Knowledge Base CRUD:

`agent/features/admin-knowledge.md`

For API wrappers, response handling, stream parsing, base URL, or fetch behavior:

`agent/features/api-integration.md`

## Required Workflow

The agent must follow this workflow for every frontend task.

## 1. Read Context

Read the required agent files before changing source code.

Do not rely only on the user prompt.

Do not start coding without checking the relevant feature rules.

## 2. Update Current Plan

Before editing source code, update:

`agent/frontend/current-plan.md`

The current plan must be generated from the provided task prompt.

It must include:

* current task
* task source prompt
* affected area
* problem summary
* expected behavior
* scope
* out-of-scope items
* files to inspect
* files likely to modify
* implementation steps
* validation plan
* backend/API dependencies

The agent must not code before updating `current-plan.md`.

## 3. Inspect Before Editing

Inspect relevant files before making changes.

Do not guess the existing implementation.

Common files to inspect depending on task:

`src/pages/ChatPage.jsx`

`src/hooks/useChat.js`

`src/api/chatApi.js`

`src/utils/sseParser.js`

`src/components/chat/ChatBubble.jsx`

`src/components/chat/ChatInput.jsx`

`src/pages/admin/ConversationsPage.jsx`

`src/pages/admin/ConversationDetailPage.jsx`

`src/components/admin/ConversationTable.jsx`

`src/pages/admin/KnowledgePage.jsx`

`src/components/admin/KnowledgeTable.jsx`

`src/components/admin/KnowledgeModal.jsx`

`src/hooks/useKnowledge.js`

`src/api/baseApi.js`

`src/api/conversationApi.js`

`src/api/knowledgeApi.js`

`src/App.jsx`

## 4. Implement Narrowly

Modify only files required by the task.

Do not perform unrelated refactors.

Do not format the whole project unless the task is formatting.

Do not add dependencies unless explicitly requested.

Do not change route structure unless explicitly requested.

Do not change backend API contract from the frontend side.

## 5. Validate

Run available commands when possible:

`npm run lint`

`npm run build`

`npm run format:check`

Only report a command as passed if it was actually run.

If validation cannot be run, record the reason in `agent/frontend/handoff.md`.

## 6. Update Handoff

After implementation, update:

`agent/frontend/handoff.md`

The handoff must include:

* latest task summary
* task source prompt
* affected area
* files changed
* files inspected but not changed
* behavior implemented
* validation commands run
* validation result
* manual testing
* known issues
* backend/API dependencies
* suggested commit message
* suggested next step

## Critical Chat Rule

The chat feature is streaming.

It is not:

* webhook
* WebSocket
* polling
* normal REST JSON
* fake typewriter after full response

The frontend sends:

`POST /api/chat`

The backend responds with:

`Content-Type: text/event-stream`

The frontend must read `response.body.getReader()` and render assistant output progressively as stream tokens arrive.

Expected event format:

`data: {"token":"Xin"}`

`data: {"token":" chào"}`

`data: {"done":true}`

Do not replace this with `EventSource` unless the backend contract changes to GET-based SSE.

Do not create one assistant bubble per token.

Do not wait for the full response before rendering.

## API Contract Rule

Most backend endpoints return:

{
"success": true,
"data": {},
"message": "optional message"
}

Failed response:

{
"success": false,
"data": null,
"message": "error message"
}

The chat stream endpoint is the exception because it returns `text/event-stream`.

The frontend must keep standard JSON API handling and chat streaming handling separate.

## Frontend Code Rules

Use the existing stack:

* React 18
* Vite 5
* JavaScript
* Tailwind CSS 3
* Ant Design 5
* React Router DOM v6
* Fetch API

Do not introduce:

* TypeScript migration
* new frontend framework
* new state management library
* new UI library
* WebSocket client
* polling framework
* authentication layer
* advanced design system

unless explicitly requested.

## Feature Ownership

## Chat

Feature file:

`agent/features/chat.md`

Main source areas:

* `src/pages/ChatPage.jsx`
* `src/hooks/useChat.js`
* `src/api/chatApi.js`
* `src/utils/sseParser.js`
* `src/components/chat/`

Main risk:

Streaming must render progressively from backend response.

## Admin Conversations

Feature file:

`agent/features/admin-conversations.md`

Main source areas:

* `src/pages/admin/ConversationsPage.jsx`
* `src/pages/admin/ConversationDetailPage.jsx`
* `src/components/admin/ConversationTable.jsx`
* `src/api/conversationApi.js`

Main risk:

Do not confuse MongoDB `_id` with `sessionId`.

## Admin Knowledge

Feature file:

`agent/features/admin-knowledge.md`

Main source areas:

* `src/pages/admin/KnowledgePage.jsx`
* `src/components/admin/KnowledgeTable.jsx`
* `src/components/admin/KnowledgeModal.jsx`
* `src/hooks/useKnowledge.js`
* `src/api/knowledgeApi.js`

Main risk:

CRUD must validate required fields and keep visible list synchronized.

## API Integration

Feature file:

`agent/features/api-integration.md`

Main source areas:

* `src/api/baseApi.js`
* `src/api/chatApi.js`
* `src/api/conversationApi.js`
* `src/api/knowledgeApi.js`
* `src/utils/sseParser.js`

Main risk:

Do not parse chat stream as normal JSON.

## UI/UX

Rules file:

`agent/frontend/ui-ux-rules.md`

Main source areas:

* visible pages
* reusable components
* layout components
* form/table/chat UI

Main risk:

Do not over-engineer visual design for the 24-hour project.

## Task Types

## Fix Task

For a bug fix:

* reproduce or inspect the issue
* identify smallest affected area
* modify only necessary files
* validate affected flow
* record test result

## Feature Task

For a feature:

* confirm it fits acceptance criteria
* check relevant API contract
* implement minimal working behavior
* include loading/error states
* validate route or flow
* record handoff

## UI Task

For UI polish:

* preserve existing behavior
* avoid unrelated redesign
* check responsive behavior
* check accessibility basics
* validate lint/build

## Integration Task

For FE-BE integration:

* confirm endpoint
* confirm request shape
* confirm response shape
* handle failure path
* record backend mismatch if found
* do not silently change contract

## Done Definition

A frontend task is done only when:

* `agent/frontend/current-plan.md` was updated before coding
* task scope was implemented
* no unrelated backend files were changed
* no unnecessary dependencies were added
* relevant loading/error/empty states were handled
* chat streaming contract was preserved if chat was affected
* validation status is known
* `agent/frontend/handoff.md` was updated

## Suggested Commit Style

Use Conventional Commit format.

Examples:

`fix(chat): render streamed assistant response progressively`

`feat(knowledge): add validation for qna form`

`fix(api): handle failed conversation response`

`chore(agent): add frontend agent context`

`refactor(chat): simplify streaming state update`

Do not make one large commit for unrelated tasks.

## Notes For Human Reviewer

Review these files first when checking an agent-generated frontend change:

1. `agent/frontend/current-plan.md`
2. source files changed by the task
3. `agent/frontend/handoff.md`

For chat-related changes, also review:

`agent/features/chat.md`

For API-related changes, also review:

`agent/features/api-integration.md`
