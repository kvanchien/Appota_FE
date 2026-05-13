# API Integration Feature

## Purpose

This file defines the feature-specific context, rules, and checklist for frontend API integration in `Appota_FE`.

The Frontend Agent must read this file before working on any task related to:

- API wrapper files
- API base URL
- REST response handling
- chat streaming request
- SSE stream parsing
- error handling
- `baseApi.js`
- `chatApi.js`
- `conversationApi.js`
- `knowledgeApi.js`
- `sseParser.js`

## Feature Summary

The frontend communicates with `AppotaBackend` through:

- standard REST JSON endpoints
- one streaming chat endpoint

Most endpoints return JSON with this structure:

`{ success, data, message }`

The chat endpoint is different. It returns `text/event-stream` and must be read progressively from the response body.

The frontend must keep these two API styles clearly separated.

## Backend Base URL

Local backend default:

`http://localhost:3000`

Frontend env variable:

`VITE_API_URL=http://localhost:3000`

The frontend must use the existing API base configuration pattern.

Do not hardcode backend URLs inside pages, components, or hooks.

Do not duplicate base URL logic in multiple files.

## API File Responsibilities

Expected API files:

`src/api/baseApi.js`

General fetch wrapper or shared request utility.

`src/api/chatApi.js`

Session creation and chat streaming API functions.

`src/api/conversationApi.js`

Admin conversation list/detail API functions.

`src/api/knowledgeApi.js`

Knowledge Base CRUD API functions.

Do not mix unrelated API logic into one file unless the existing codebase is intentionally minimal.

## REST Response Contract

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

Frontend API logic must:

- check HTTP status
- parse JSON safely
- check `success`
- return `data` consistently if that is the existing pattern
- expose readable error messages
- preserve backend `message` when available
- handle network failures

Do not assume all responses are successful.

Do not ignore the backend `message` field.

## Chat Stream Contract

Chat uses:

`POST /api/chat`

Request body:

{
"sessionId": "uuid",
"message": "player message"
}

Response:

`Content-Type: text/event-stream`

Example stream events:

`data: {"token":"Bạn"}`

`data: {"token":" vui"}`

`data: {"token":" lòng"}`

`data: {"done":true}`

The frontend must read the stream progressively.

Do not treat this response as normal JSON.

Do not call `response.json()` for `POST /api/chat`.

## Critical Transport Rule

Chat is streaming over HTTP.

It is not:

- webhook
- WebSocket
- polling
- normal REST JSON
- fake typewriter after full response

The client screen must render the assistant response progressively as the backend stream sends tokens or chunks.

Use:

- `fetch()`
- `response.body.getReader()`
- `TextDecoder`
- SSE `data:` event parsing

Do not use `EventSource` for the current contract because the chat endpoint requires POST with JSON body.

## `baseApi.js` Rules

`baseApi.js` should centralize standard JSON request behavior.

Expected responsibilities:

- compose API base URL
- set JSON headers when needed
- perform `fetch`
- parse JSON response
- detect non-OK HTTP status
- detect backend `success: false`
- throw or return errors consistently
- preserve backend error `message`

Do not include chat streaming parser logic in `baseApi.js` unless the existing project intentionally centralizes all network logic there.

Streaming behavior is better kept in `chatApi.js` and `sseParser.js`.

## `chatApi.js` Rules

`chatApi.js` should handle chat-specific API behavior.

Expected responsibilities:

- create session through `POST /api/session`
- send message through `POST /api/chat`
- read streaming response
- decode chunks
- pass parsed events to caller
- expose errors clearly

For `POST /api/session`, use normal JSON response handling.

For `POST /api/chat`, use streaming response handling.

Do not parse chat stream as JSON response.

Do not mix conversation admin APIs into `chatApi.js`.

## `conversationApi.js` Rules

`conversationApi.js` should handle admin conversation APIs.

Expected functions:

- fetch all conversations
- fetch one conversation detail

Endpoints:

`GET /api/conversations`

`GET /api/conversations/:id`

Rules:

- use base API wrapper if available
- preserve backend response format
- handle 404 for missing conversation
- do not confuse `_id` with `sessionId`

## `knowledgeApi.js` Rules

`knowledgeApi.js` should handle Knowledge Base APIs.

Expected functions:

- fetch all entries
- create entry
- update entry
- delete entry

Endpoints:

`GET /api/knowledge`

`POST /api/knowledge`

`PUT /api/knowledge/:id`

`DELETE /api/knowledge/:id`

Rules:

- use `_id` for update/delete
- validate payload before sending when practical
- preserve backend error messages
- do not hardcode base URL
- keep API function names clear

## SSE Parser Rules

`src/utils/sseParser.js` should parse stream text safely.

The parser must handle:

- chunk split in the middle of an SSE event
- chunk split in the middle of JSON
- one chunk containing multiple events
- empty lines between events
- `data:` prefix
- malformed JSON
- token event
- done event
- error event

The parser should not directly update React state.

The parser should return parsed events or call a callback.

The parser should preserve leftover incomplete text between chunks.

Do not crash the UI on malformed JSON.

## Recommended Stream Reading Flow

The API stream function should follow this logic:

1. Send `fetch()` request to `POST /api/chat`.
2. Check `response.ok`.
3. Confirm `response.body` exists.
4. Create `reader` from `response.body.getReader()`.
5. Create `TextDecoder`.
6. Loop through `reader.read()`.
7. Decode each chunk with streaming mode.
8. Pass decoded text to SSE parser.
9. For each parsed event:
   - if `{ token }`, notify caller to append token
   - if `{ done }`, notify caller stream is complete
   - if `{ error }`, notify caller error occurred

10. Release reader when complete if needed.
11. Propagate errors to caller.

Do not buffer the full response before rendering.

## Error Handling Rules

API integration must handle:

- network failure
- non-OK HTTP status
- invalid JSON response
- backend `success: false`
- missing `response.body` for stream
- stream interruption
- malformed SSE event
- backend stream error event

Error message priority:

1. backend `message`
2. backend stream `{ error }`
3. HTTP status summary
4. generic fallback

Generic fallbacks:

- “Request failed.”
- “Failed to send message.”
- “Streaming connection was interrupted.”
- “Failed to load conversations.”
- “Failed to load Knowledge Base.”

Do not expose stack traces to users.

## Hook Integration Rules

Hooks should call API functions, not duplicate request logic.

Expected:

- `useChat.js` calls `chatApi.js`
- `useKnowledge.js` calls `knowledgeApi.js`
- conversation pages or hooks call `conversationApi.js`

Do not copy `fetch()` logic into multiple page components.

Do not duplicate SSE parsing logic in `useChat.js` if `sseParser.js` exists.

## API State Rules

For each API-backed flow, track:

- loading
- error
- data
- mutation state if needed

For chat streaming, track:

- sending or waiting
- streaming
- error
- messages

Do not leave loading state stuck after request failure.

Do not clear valid data unnecessarily after a failed refresh.

## Validation Before Request

Perform frontend validation before request when obvious.

For chat:

- message must not be empty
- session id must exist or be created

For Knowledge Base:

- question is required
- answer is required
- category is optional

For conversation detail:

- id route param must exist

Do not rely only on backend validation when the frontend can prevent an invalid request cheaply.

## Response Normalization Rule

Keep response handling consistent.

A good pattern is:

- API layer extracts `data` from successful `{ success, data, message }`
- API layer throws an error with readable message on failure
- UI layer handles loading/error/data

If existing code returns the full response object, preserve that pattern unless the task is specifically to normalize API behavior.

Do not create mixed patterns where some API functions return `data` and others return `{ success, data, message }` without reason.

## Do Not Implement

Do not implement:

- WebSocket client
- webhook listener
- polling loop for chat
- fake typewriter effect after full response
- GraphQL client
- Axios migration unless requested
- React Query or SWR unless requested
- global API state library
- retry framework
- offline cache
- authentication token handling unless requested
- API mock layer unless requested

## Manual Test Checklist

For REST API changes:

- [ ] API base URL is read from existing config.
- [ ] Successful response is handled.
- [ ] Backend `success: false` is handled.
- [ ] Non-OK HTTP status is handled.
- [ ] Network failure is handled.
- [ ] UI receives readable error.

For chat streaming:

- [ ] `POST /api/chat` is used.
- [ ] `response.json()` is not used for chat stream.
- [ ] `response.body.getReader()` is used.
- [ ] Stream chunks are decoded progressively.
- [ ] SSE `data:` events are parsed.
- [ ] `{ token }` events reach the chat hook/UI.
- [ ] `{ done: true }` ends the stream state.
- [ ] `{ error }` is handled.
- [ ] UI renders assistant content progressively.
- [ ] No webhook, WebSocket, or polling logic was added.

For Knowledge Base API:

- [ ] `GET /api/knowledge` works.
- [ ] `POST /api/knowledge` works.
- [ ] `PUT /api/knowledge/:id` works.
- [ ] `DELETE /api/knowledge/:id` works.
- [ ] `_id` is used for update/delete.

For conversation API:

- [ ] `GET /api/conversations` works.
- [ ] `GET /api/conversations/:id` works.
- [ ] `_id` is used for conversation detail route/API when required.

## Completion Checklist

An API integration task is complete when:

- [ ] Current plan was updated before coding.
- [ ] Existing API wrapper pattern is preserved.
- [ ] API base URL is not hardcoded in components.
- [ ] REST response format is handled.
- [ ] Chat stream exception is handled correctly.
- [ ] Stream rendering remains progressive if chat is affected.
- [ ] Errors are surfaced clearly.
- [ ] No unrelated API files were modified.
- [ ] No new API dependency was added unnecessarily.
- [ ] Validation status is known.
- [ ] Handoff was updated after implementation.
