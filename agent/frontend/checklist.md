# Frontend Agent Checklist

## Purpose

This file defines the required checklist for the Frontend Agent before completing any task in `Appota_FE`.

Use this checklist after implementation and before updating `agent/frontend/handoff.md`.

## Required Pre-Coding Checklist

Before changing source code, confirm:

* [ ] Read `agent/frontend/context.md`.
* [ ] Read `agent/frontend/skill.md`.
* [ ] Read relevant feature file in `agent/features/`.
* [ ] Converted the task prompt into `agent/frontend/current-plan.md`.
* [ ] Identified affected feature area.
* [ ] Identified files to inspect.
* [ ] Identified files likely to modify.
* [ ] Defined out-of-scope items.
* [ ] Confirmed no backend code should be modified.

## Scope Checklist

Before editing, confirm the task belongs to one or more frontend areas:

* [ ] Chat screen.
* [ ] Chat streaming.
* [ ] SSE parser.
* [ ] API integration.
* [ ] Admin conversations.
* [ ] Admin Knowledge Base.
* [ ] UI/UX polish.
* [ ] Routing.
* [ ] Layout.
* [ ] Build/lint fix.

If the task requires backend changes, stop and record the dependency in `handoff.md` instead of editing backend code.

## Source Structure Checklist

Confirm changes respect existing structure:

* [ ] API calls stay under `src/api/`.
* [ ] Reusable state stays under `src/hooks/`.
* [ ] Chat UI components stay under `src/components/chat/`.
* [ ] Admin UI components stay under `src/components/admin/`.
* [ ] Layout components stay under `src/components/layout/`.
* [ ] Page-level orchestration stays under `src/pages/`.
* [ ] Parsing helpers stay under `src/utils/`.
* [ ] Routes stay in the existing routing structure.
* [ ] No unnecessary folder restructuring was introduced.

## API Integration Checklist

For non-stream API calls:

* [ ] Uses existing API wrapper pattern.
* [ ] Uses configured API base URL.
* [ ] Does not hardcode backend URL inside components.
* [ ] Handles `{ success, data, message }` response format.
* [ ] Handles HTTP error responses.
* [ ] Handles network errors.
* [ ] Shows readable error message.
* [ ] Does not assume every response succeeds.

For mutation calls:

* [ ] Prevents duplicate submit.
* [ ] Shows loading state.
* [ ] Updates or refreshes visible data after success.
* [ ] Keeps UI consistent after failure.

## Chat Streaming Checklist

Use this checklist for any task touching chat, `useChat.js`, `chatApi.js`, or `sseParser.js`.

* [ ] Chat uses `POST /api/chat`.
* [ ] Chat expects `Content-Type: text/event-stream`.
* [ ] Client reads `response.body.getReader()`.
* [ ] Client decodes stream chunks progressively.
* [ ] Client parses SSE `data:` events.
* [ ] Client handles `{ token: string }`.
* [ ] Client handles `{ done: true }`.
* [ ] Client handles `{ error: string }` if provided.
* [ ] User message appears immediately after submit.
* [ ] Assistant message is rendered progressively.
* [ ] Tokens append to the current assistant message.
* [ ] One assistant bubble is not created per token.
* [ ] UI does not wait for the full response before rendering.
* [ ] Input is disabled or guarded while streaming.
* [ ] Loading state stops after done or error.
* [ ] Stream failure shows readable error.
* [ ] Partial content is not unnecessarily deleted on stream failure.
* [ ] No WebSocket implementation was added.
* [ ] No webhook implementation was added.
* [ ] No polling implementation was added.
* [ ] `EventSource` was not used unless backend contract changed to GET-based SSE.

## SSE Parser Checklist

Use this checklist for `src/utils/sseParser.js`.

* [ ] Handles chunk split in the middle of an event.
* [ ] Handles chunk split in the middle of JSON.
* [ ] Handles multiple events in one chunk.
* [ ] Handles empty lines.
* [ ] Handles `data:` prefix.
* [ ] Ignores or reports invalid JSON safely.
* [ ] Does not crash the whole UI on malformed event.
* [ ] Recognizes token event.
* [ ] Recognizes done event.
* [ ] Recognizes error event.
* [ ] Parser logic is not tightly coupled to React state.
* [ ] Complex parsing logic has concise comments if needed.

## Chat UI Checklist

Use this checklist for chat screen changes.

* [ ] Chat page renders without data.
* [ ] User can type a message.
* [ ] Empty message cannot be submitted.
* [ ] Message is trimmed before submit.
* [ ] User message appears immediately.
* [ ] Assistant loading or placeholder appears.
* [ ] Assistant content streams progressively.
* [ ] Chat order is correct.
* [ ] Long messages wrap correctly.
* [ ] Chat input remains accessible.
* [ ] Send button state is clear.
* [ ] Error message is readable.
* [ ] Mobile layout remains usable.

## Admin Conversations Checklist

Use this checklist for conversation list/detail changes.

Conversation list:

* [ ] Fetches conversations from API.
* [ ] Shows loading state.
* [ ] Shows empty state.
* [ ] Shows error state.
* [ ] Displays session id.
* [ ] Displays last message where available.
* [ ] Displays message count where available.
* [ ] Displays created or updated time where available.
* [ ] Provides action to open detail.
* [ ] Handles long text safely.

Conversation detail:

* [ ] Fetches one conversation by id.
* [ ] Shows loading state.
* [ ] Shows empty or missing data state.
* [ ] Shows error state.
* [ ] Shows session id.
* [ ] Shows full message history.
* [ ] Keeps message order correct.
* [ ] Distinguishes user and assistant messages.
* [ ] Provides navigation back to list.

## Admin Knowledge Checklist

Use this checklist for Knowledge Base CRUD changes.

List:

* [ ] Fetches Knowledge Base entries.
* [ ] Shows loading state.
* [ ] Shows empty state.
* [ ] Shows error state.
* [ ] Displays question.
* [ ] Displays answer.
* [ ] Displays category when available.
* [ ] Provides create action.
* [ ] Provides edit action.
* [ ] Provides delete action.

Create:

* [ ] Question is required.
* [ ] Answer is required.
* [ ] Category is optional.
* [ ] Input is trimmed.
* [ ] Duplicate submit is prevented.
* [ ] Loading state is shown.
* [ ] List updates after success.
* [ ] Error is shown after failure.

Edit:

* [ ] Existing values are loaded into form.
* [ ] Partial or full update follows backend contract.
* [ ] Required fields remain valid.
* [ ] Loading state is shown.
* [ ] List updates after success.
* [ ] Error is shown after failure.

Delete:

* [ ] Delete requires confirmation.
* [ ] Loading or disabled state is handled if applicable.
* [ ] List updates after success.
* [ ] Error is shown after failure.
* [ ] No item is removed from UI before confirmed successful delete unless optimistic update is intentionally implemented with rollback.

## UI/UX Checklist

General UI:

* [ ] Main action is visible.
* [ ] Page title or context is clear.
* [ ] Layout is readable.
* [ ] Spacing is consistent.
* [ ] Text contrast is readable.
* [ ] No unnecessary visual complexity was added.
* [ ] No heavy design system was introduced.
* [ ] No unrelated redesign was introduced.

States:

* [ ] Loading state exists.
* [ ] Empty state exists where needed.
* [ ] Error state exists.
* [ ] Disabled state is clear where used.
* [ ] Destructive action requires confirmation.

Responsive:

* [ ] Chat screen is usable on mobile width.
* [ ] Admin table does not break layout.
* [ ] Modal or form fits smaller screens.
* [ ] Long text wraps or truncates safely.

Accessibility:

* [ ] Buttons have clear labels.
* [ ] Inputs have labels or clear form context.
* [ ] Focus state remains visible.
* [ ] Errors are displayed as text.
* [ ] Color is not the only status indicator.

## React Code Checklist

* [ ] Uses functional components.
* [ ] State is not mutated directly.
* [ ] Effects have correct dependency arrays.
* [ ] No infinite render or fetch loop.
* [ ] API logic is not buried in presentational components.
* [ ] Reusable state logic is placed in hooks when appropriate.
* [ ] Props are clear and minimal.
* [ ] Components remain focused.
* [ ] No unnecessary global state was added.
* [ ] No unnecessary dependency was added.

## Routing Checklist

* [ ] `/` works for player chat.
* [ ] `/admin/conversations` works for conversation list.
* [ ] `/admin/conversations/:id` works for conversation detail.
* [ ] `/admin/knowledge` works for Knowledge Base management.
* [ ] Admin layout is reused where appropriate.
* [ ] No auth guard was added unless explicitly requested.
* [ ] Unknown routes are handled if existing project supports it.

## Dependency Checklist

* [ ] No new dependency was added unless explicitly required.
* [ ] Existing React, Fetch API, Tailwind, and Ant Design capabilities were preferred.
* [ ] No new state management library was added.
* [ ] No new animation library was added.
* [ ] No new UI kit was added.
* [ ] No backend package files were changed.

## Validation Checklist

Run available commands where possible:

* [ ] `npm run lint`
* [ ] `npm run build`
* [ ] `npm run format:check` if available

Record result:

* [ ] Validation passed.
* [ ] Validation failed with known cause.
* [ ] Validation could not be run, reason recorded.

Do not claim validation passed unless the command was actually run.

## Handoff Checklist

Before finishing the task, update:

`agent/frontend/handoff.md`

The handoff must include:

* [ ] Task summary.
* [ ] Affected feature.
* [ ] Files changed.
* [ ] Behavior implemented.
* [ ] Validation commands run.
* [ ] Validation result.
* [ ] Known issues.
* [ ] Backend/API dependencies.
* [ ] Suggested next step if needed.

## Final Completion Checklist

A frontend task can be marked complete only if:

* [ ] `current-plan.md` was updated before coding.
* [ ] Implementation matches the task prompt.
* [ ] Scope stayed narrow.
* [ ] Related UI states are handled.
* [ ] Related API errors are handled.
* [ ] Chat streaming contract is preserved if chat is affected.
* [ ] No unrelated backend files were changed.
* [ ] No unnecessary dependencies were added.
* [ ] Validation status is known.
* [ ] `handoff.md` was updated.
