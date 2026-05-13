# Admin Conversations Feature

## Purpose

This file defines the feature-specific context, rules, and checklist for the admin conversation log screens in `Appota_FE`.

The Frontend Agent must read this file before working on any task related to:

* conversation list
* conversation detail
* admin conversation table
* chat log display
* `GET /api/conversations`
* `GET /api/conversations/:id`
* `GET /api/chat/:sessionId`
* `conversationApi.js`
* `ConversationsPage.jsx`
* `ConversationDetailPage.jsx`
* `ConversationTable.jsx`

## Feature Summary

The admin conversations feature allows an admin user to review player chatbot sessions.

The feature has two main screens:

`/admin/conversations`

Shows a list of all conversation sessions.

`/admin/conversations/:id`

Shows the full message history of one conversation.

Authentication is out of scope for the 24-hour version.

Do not add login, permission, role checking, or route protection unless explicitly requested.

## Main User Goal

The admin should be able to:

* view all recorded conversations
* scan recent sessions quickly
* identify the latest message in a session
* open a session detail
* inspect full user and assistant message history

## Backend Contract

Conversation list endpoint:

`GET /api/conversations`

Expected successful response shape:

{
"success": true,
"data": [
{
"_id": "MongoDB ObjectId string",
"sessionId": "uuid",
"messageCount": 6,
"lastMessage": "latest message text",
"createdAt": "ISO date string"
}
]
}

Conversation detail endpoint:

`GET /api/conversations/:id`

Expected successful response shape:

{
"success": true,
"data": {
"_id": "MongoDB ObjectId string",
"sessionId": "uuid",
"messages": [
{
"role": "user",
"content": "message text",
"timestamp": "ISO date string"
},
{
"role": "assistant",
"content": "message text",
"timestamp": "ISO date string"
}
],
"createdAt": "ISO date string",
"updatedAt": "ISO date string"
}
}

Failure response shape:

{
"success": false,
"data": null,
"message": "error message"
}

The frontend must not assume the request succeeds.

The frontend must handle missing or partial optional fields safely.

## Related Files

Common files for this feature:

`src/pages/admin/ConversationsPage.jsx`

`src/pages/admin/ConversationDetailPage.jsx`

`src/components/admin/ConversationTable.jsx`

`src/components/layout/AdminLayout.jsx`

`src/api/conversationApi.js`

`src/api/baseApi.js`

`src/App.jsx`

Only modify files required by the current task.

## Page Responsibilities

## Conversations Page

`ConversationsPage.jsx` should coordinate the conversation list screen.

Expected responsibilities:

* call API or hook to fetch conversation list
* manage loading state
* manage error state
* pass data to table component
* provide page title/context
* handle navigation to detail page

Do not put complex table rendering directly in the page if `ConversationTable.jsx` exists.

## Conversation Table

`ConversationTable.jsx` should render a scan-friendly list.

Expected columns:

* session id
* last message
* message count
* created or updated time
* action to view detail

Column names can follow the existing UI language.

The table must handle:

* empty data
* long session ids
* long last message text
* loading state if passed from page
* navigation action

Do not make a separate API request inside every table row.

## Conversation Detail Page

`ConversationDetailPage.jsx` should display one conversation.

Expected responsibilities:

* read conversation id from route params
* fetch conversation detail
* show loading state
* show error state
* show not found or empty state
* display session id
* display full message history
* provide navigation back to conversation list

Do not display messages from a different session.

Do not assume messages are always non-empty.

## Message Display Rules

Conversation detail must show messages clearly.

Required behavior:

* preserve chronological order
* distinguish `user` from `assistant`
* show message content
* show timestamp when available
* wrap long text
* handle missing content safely

Do not reverse message order unless the whole app already uses newest-first and the UX is consistent.

Do not group unrelated sessions together.

Do not hide assistant messages.

Do not hide user messages.

## Loading State Rules

Conversation list:

* show loading indicator while fetching list
* do not show a blank page

Conversation detail:

* show loading indicator while fetching detail
* do not show stale detail for a different id

Use existing Ant Design or project loading pattern.

## Empty State Rules

Conversation list:

* if there are no conversations, show a clear empty state
* do not show an empty table without explanation

Conversation detail:

* if the conversation exists but has no messages, show a clear empty message state
* if the conversation does not exist, show a not found or API error message

## Error Handling Rules

Use backend `message` when available.

Fallback messages:

* “Failed to load conversations.”
* “Failed to load conversation detail.”
* “Conversation not found.”

Do not expose stack traces.

Do not show raw JSON unless explicitly requested.

Do not leave loading state stuck after failure.

## Navigation Rules

Admin route list:

`/admin/conversations`

Admin route detail:

`/admin/conversations/:id`

From list to detail:

* use the conversation `_id` if backend detail endpoint expects MongoDB `_id`
* do not use `sessionId` for `/api/conversations/:id` unless backend contract says so

From detail back to list:

* provide a clear back action

Do not change route structure unless explicitly requested.

## ID Handling Rule

There are two identifiers:

`_id`

MongoDB ObjectId string. Used for `GET /api/conversations/:id`.

`sessionId`

UUID string. Used by chat session flow and may be displayed to admin.

Do not confuse `_id` with `sessionId`.

When opening detail from conversation list, use `_id` for route param if the route is designed around backend conversation detail.

## Data Formatting Rules

Timestamps:

* use a readable format if the project already has a formatter
* otherwise use simple local date/time formatting
* fallback to raw ISO string if needed
* show `N/A` only when date is missing

Long text:

* truncate last message in list view if needed
* show full message content in detail view
* ensure text wraps safely

Message count:

* display `0` if count is zero
* display fallback only if value is missing or invalid

## UI/UX Rules

The list screen should be scan-friendly.

Prefer:

* page title
* short description if useful
* table with clear actions
* readable spacing
* empty state
* error state

Avoid:

* dense layout
* excessive cards
* unnecessary charts
* filters unless explicitly requested
* authentication UI
* analytics dashboard

The detail screen should be readable like a log.

Prefer:

* session metadata at top
* message list below
* role distinction
* timestamp display
* back navigation

## API Integration Rules

Use `src/api/conversationApi.js`.

Do not call `fetch()` directly inside deeply nested UI components if an API wrapper exists.

API wrapper should use the configured base API behavior.

For list:

* return normalized data or raw `data` consistently according to existing API pattern

For detail:

* handle 404 responses clearly

Do not hardcode `http://localhost:5000` in page or component files.

## State Management Rules

Local page state is sufficient.

Do not add global state management.

Conversation list state should track:

* conversations
* loading
* error

Conversation detail state should track:

* conversation
* loading
* error

Do not persist admin conversation list in local storage unless explicitly requested.

## Do Not Implement

Do not implement:

* authentication
* admin user management
* role-based access control
* conversation delete
* conversation export
* search/filter/sort unless explicitly requested
* pagination unless backend supports it or task requests it
* WebSocket updates
* live polling for new conversations
* advanced analytics
* charts
* message moderation tools

## Manual Test Checklist

For conversation list changes:

* [ ] Open `/admin/conversations`.
* [ ] Confirm page renders.
* [ ] Confirm loading state appears during fetch.
* [ ] Confirm conversations display when API returns data.
* [ ] Confirm empty state displays when API returns empty list.
* [ ] Confirm error state displays when API fails.
* [ ] Confirm session id is visible.
* [ ] Confirm last message is visible where available.
* [ ] Confirm message count is visible where available.
* [ ] Confirm action opens detail page.
* [ ] Confirm long text does not break layout.

For conversation detail changes:

* [ ] Open `/admin/conversations/:id`.
* [ ] Confirm page renders.
* [ ] Confirm loading state appears during fetch.
* [ ] Confirm session id is visible.
* [ ] Confirm message history displays in order.
* [ ] Confirm user and assistant messages are visually distinct.
* [ ] Confirm timestamps display where available.
* [ ] Confirm empty messages are handled.
* [ ] Confirm not found or API error is handled.
* [ ] Confirm back navigation works.

## Completion Checklist

An admin conversations task is complete when:

* [ ] Current plan was updated before coding.
* [ ] Relevant API contract was preserved.
* [ ] List screen works if affected.
* [ ] Detail screen works if affected.
* [ ] Loading state is handled.
* [ ] Empty state is handled.
* [ ] Error state is handled.
* [ ] `_id` and `sessionId` are not confused.
* [ ] No authentication was added unless requested.
* [ ] No polling or realtime logic was introduced.
* [ ] Validation status is known.
* [ ] Handoff was updated after implementation.
