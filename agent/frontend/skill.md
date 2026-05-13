# Frontend Agent Skill

## Purpose

This file defines the working skill set and coding rules for the Frontend Agent in `Appota_FE`.

Use this file when implementing or reviewing frontend code.

The agent must produce small, functional, maintainable changes that fit the existing React + Vite frontend.

## Core Responsibilities

The Frontend Agent is responsible for:

* React page implementation.
* React component implementation.
* React hook behavior.
* API wrapper usage.
* SSE streaming client logic.
* Chat UI state.
* Admin table/form behavior.
* Loading, empty, and error states.
* Basic responsive layout.
* Tailwind CSS styling.
* Ant Design component usage.
* Frontend lint/build validation.

The Frontend Agent is not responsible for backend logic, MongoDB models, Grok API implementation, or Express route behavior.

## Required Workflow

Before coding:

1. Read `agent/frontend/context.md`.
2. Read the relevant feature file under `agent/features/`.
3. Convert the task prompt into `agent/frontend/current-plan.md`.
4. Identify files to inspect before editing.
5. Keep scope narrow.

During coding:

1. Modify only files required by the task.
2. Preserve existing folder structure.
3. Reuse existing components, hooks, and API wrappers.
4. Avoid adding new dependencies.
5. Keep code simple and readable.
6. Avoid large refactors unless explicitly requested.

After coding:

1. Run available validation commands.
2. Update `agent/frontend/handoff.md`.
3. Record changed files and validation result.
4. Record any backend/API dependency or unresolved issue.

## React Coding Rules

Use functional React components.

Prefer hooks over class components.

Keep components focused on one responsibility.

Avoid putting API logic directly inside presentational components.

Do not create deeply nested component trees unless necessary.

Do not introduce global state libraries unless explicitly requested.

Use clear variable names.

Avoid clever abstractions.

Avoid duplicate state when derived values can be computed from existing state.

Do not mutate state directly.

When updating arrays or objects, create new references.

Use `useMemo` or `useCallback` only when there is a clear reason. Do not optimize prematurely.

## Component Design Rules

Separate responsibilities:

* Page components handle layout and orchestration.
* UI components handle display.
* Hooks handle reusable stateful behavior.
* API files handle network calls.
* Utils handle pure parsing or formatting logic.

Preferred pattern:

* `pages/` calls hooks.
* `hooks/` calls API modules.
* `components/` receive props and render UI.
* `utils/` contains reusable parsing/formatting helpers.

Do not make one component responsible for API calls, parsing, state management, and UI rendering at the same time unless the task is very small and no reusable pattern exists.

## Hook Rules

Hooks should expose simple state and actions.

Example hook responsibilities:

* `useChat.js`: session state, message list, streaming state, send message action.
* `useKnowledge.js`: Knowledge Base list, loading state, create/update/delete actions.

Hooks should return predictable values:

* data
* loading state
* error state
* action functions
* refresh or reset functions when needed

Hooks must handle failure states.

Do not silently swallow API errors.

Do not trigger infinite loops in `useEffect`.

Keep dependency arrays correct.

## API Wrapper Rules

Use existing files under `src/api/`:

* `baseApi.js`
* `chatApi.js`
* `conversationApi.js`
* `knowledgeApi.js`

Do not hardcode API URLs inside pages or components.

Read `VITE_API_URL` through the existing API configuration pattern.

All non-stream JSON API calls should normalize or respect the backend response format:

`{ success, data, message }`

Frontend code must check failure responses and display a readable message.

Do not assume every response is successful.

Do not ignore HTTP status codes.

## Chat Streaming Rules

The chat API is streaming, not webhook, not WebSocket, and not polling.

The frontend sends one request:

`POST /api/chat`

The backend responds with:

`Content-Type: text/event-stream`

The frontend must use stream reading logic:

* Call `fetch()`.
* Read `response.body.getReader()`.
* Decode chunks with `TextDecoder`.
* Parse SSE `data:` events.
* Append each token to the current assistant message.
* Stop streaming when `{ done: true }` is received.
* Handle `{ error }` if provided by the backend.

Do not wait for the full backend response before rendering.

Do not create a new assistant message for every token.

Do not implement polling.

Do not implement WebSocket.

Do not implement webhook logic.

Do not use `EventSource` for the current contract because the current API requires `POST` with JSON body. Only use `EventSource` if the backend contract changes to GET-based SSE.

## SSE Parser Rules

The SSE parser must be resilient.

It should handle:

* one chunk containing multiple events
* one event split across multiple chunks
* empty lines
* `data:` prefix
* valid JSON event payloads
* invalid JSON without crashing the UI
* `{ token: string }`
* `{ done: true }`
* `{ error: string }`

The parser should not be coupled to React state.

Prefer a pure utility in:

`src/utils/sseParser.js`

The parser should provide parsed events to the hook or API stream callback.

## Chat State Rules

When user sends a message:

1. Validate message is not empty.
2. Ensure a valid `sessionId` exists, creating one if needed.
3. Append the user message immediately.
4. Add an assistant placeholder or prepare current assistant response.
5. Start streaming state.
6. Append tokens to the assistant message as they arrive.
7. End streaming state on `{ done: true }`.
8. Show error if the stream fails.

While streaming:

* Prevent duplicate submits.
* Either disable input or guard submit action.
* Keep partial assistant response visible.
* Preserve message order.
* Avoid flickering loading states.

On error:

* Stop streaming state.
* Show readable error message.
* Preserve already received partial content if useful.
* Do not wipe the entire conversation unless explicitly requested.

## Admin Conversations Rules

Conversation list should show enough information for quick review:

* session id
* last message
* message count
* created or updated time

Conversation detail should show full message history in correct order.

Use readable message layout.

Handle empty conversation list.

Handle loading state.

Handle API failure.

Do not add authentication or permission logic unless explicitly requested.

## Admin Knowledge Rules

Knowledge Base management must support:

* list entries
* create entry
* edit entry
* delete entry

Required fields:

* question
* answer

Optional field:

* category

Validation:

* question must not be empty
* answer must not be empty
* trim user input before submit
* show readable validation messages

After create/update/delete:

* refresh list or update local state consistently
* close modal only after successful request
* show error message if request fails

Do not cache Knowledge Base data in a way that hides backend changes.

## Ant Design Usage Rules

Use Ant Design for:

* tables
* forms
* inputs
* buttons
* modals
* confirmation dialogs
* empty states
* loading indicators
* message notifications when already used by the project

Do not over-customize Ant Design components unless necessary.

Prefer built-in Ant Design validation for forms.

Keep table columns readable.

Avoid dense tables on small screens.

Use modal forms for create/edit when that is already the project pattern.

## Tailwind CSS Usage Rules

Use Tailwind CSS for:

* layout
* spacing
* width and height
* flex/grid
* responsive behavior
* simple typography
* simple backgrounds
* chat bubble alignment

Do not create complex custom CSS unless Tailwind and Ant Design are insufficient.

Do not introduce a new CSS methodology.

Keep class names readable.

Avoid excessive styling that makes components hard to maintain.

## Routing Rules

Use React Router DOM v6.

Do not introduce a new routing library.

Routes must match project context:

`/`

`/admin/conversations`

`/admin/conversations/:id`

`/admin/knowledge`

Admin layout should be reused for admin pages.

Do not add auth guard unless explicitly requested.

## Loading, Empty, and Error State Rules

Every API-backed page or component must handle:

* initial loading
* empty data
* error response
* successful data display

For chat:

* show typing/loading state while waiting for first token
* show progressive response while streaming
* stop loading after done or error

For admin tables:

* show loading while fetching
* show empty state if no data
* show readable error if fetch fails

Do not leave users with a blank screen.

## Form Rules

Forms must be simple and predictable.

Required fields should be clearly validated.

Submit buttons should indicate loading when request is running.

Prevent duplicate submits.

Trim text fields before sending.

Do not send empty strings for required fields.

After successful submit:

* close modal or reset form as appropriate
* refresh or update visible data
* show success state only if already used by project conventions

## Error Handling Rules

Always surface user-readable errors.

Prefer backend `message` field when available.

Fallback to a generic message only when backend message is unavailable.

Do not expose technical stack traces in the UI.

Do not ignore rejected promises.

Do not leave loading state stuck after failure.

## Code Style Rules

Use existing project style.

Prefer `const` over `let` when reassignment is not needed.

Use early returns to reduce nesting.

Keep functions short.

Use descriptive names.

Avoid magic strings where a local constant improves clarity.

Avoid unnecessary comments.

Comment only when logic is non-obvious, especially SSE parsing or stream handling.

## Dependency Rules

Do not add dependencies unless explicitly required.

Before adding a dependency, verify the feature cannot be implemented reasonably with existing stack.

For this project, prefer:

* React built-ins
* Fetch API
* Ant Design
* Tailwind CSS
* existing utilities

Do not add state management libraries, animation libraries, UI kits, or SSE libraries unless explicitly requested.

## Performance Rules

Do not optimize prematurely.

For streaming chat, avoid excessive state updates that create duplicate messages.

Appending token-by-token is expected, but state update logic must target only the active assistant message.

Avoid re-fetching admin data unnecessarily.

Avoid large computations in render.

## Accessibility Rules

Interactive elements must be keyboard-accessible.

Buttons must have clear labels.

Inputs must have labels or accessible placeholders.

Focus state should remain visible.

Do not use color alone to communicate errors or status.

Text contrast must remain readable.

Clickable icons should have accessible labels when used.

## Responsive Rules

The frontend must be usable on common desktop and mobile widths.

Minimum expectation:

* chat screen works on mobile
* admin tables remain usable or horizontally scrollable
* forms fit small screens
* sidebar/layout does not block content

Do not build complex responsive systems.

Use simple Tailwind responsive utilities where needed.

## Validation Rules

Before completing a task, run available commands when possible:

`npm run lint`

`npm run build`

If available:

`npm run format:check`

Do not claim a command passed unless it was actually run.

If validation cannot be run, record the reason in `agent/frontend/handoff.md`.

## Git and Change Scope Rules

Keep changes reviewable.

Do not mix unrelated tasks.

Do not format the whole codebase unless the task is formatting.

Do not rename files unless necessary.

Do not move folders unless explicitly requested.

Do not change backend contract from frontend code.

## Completion Checklist

Before marking a frontend task complete, confirm:

* Task scope is implemented.
* Affected feature file was considered.
* `current-plan.md` was updated before coding.
* UI loading state is handled.
* UI error state is handled.
* API response format is respected.
* Chat stream logic remains token-by-token if chat is affected.
* No unrelated source files were changed.
* Validation result is known.
* `handoff.md` was updated.
