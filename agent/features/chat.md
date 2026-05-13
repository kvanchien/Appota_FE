# Chat Feature

## Purpose

This file defines the feature-specific context, rules, and checklist for the player-facing chat screen in `Appota_FE`.

The Frontend Agent must read this file before working on any task related to:

* chat page
* chat input
* chat bubbles
* chat message state
* session creation
* `POST /api/chat`
* SSE streaming
* token-by-token rendering
* `useChat.js`
* `chatApi.js`
* `sseParser.js`

## Feature Summary

The chat feature allows a player to send a question and receive a chatbot response.

The backend generates the response using:

* existing Knowledge Base data
* recent conversation context
* Grok API

The frontend is responsible for:

* creating or using a session id
* sending the player message
* reading the streamed backend response
* rendering assistant output progressively
* preserving chat history on screen
* handling loading and error states

## Critical Rule: Chat Is Streaming

Chat is not webhook-based.

Chat is not WebSocket-based.

Chat is not polling-based.

Chat is not a normal JSON response that completes before rendering.

Chat uses:

`POST /api/chat`

The backend returns:

`Content-Type: text/event-stream`

The frontend must render the assistant response progressively as stream data arrives.

The user should see the assistant response appear token-by-token or chunk-by-chunk.

Do not wait for the full assistant response before displaying it.

## Why Not EventSource

Do not use `EventSource` for the current contract.

Reason:

The current API requires a `POST /api/chat` request with JSON body:

* `sessionId`
* `message`

Browser `EventSource` is designed for GET-based SSE and does not support sending a JSON POST body in the required way.

Use `fetch()` with `ReadableStream`.

Only consider `EventSource` if the backend contract changes to a GET-based stream endpoint.

## Expected Request

Endpoint:

`POST /api/chat`

Body:

{
"sessionId": "uuid",
"message": "player message"
}

The frontend must validate:

* `sessionId` exists or can be created before sending
* `message` is not empty
* `message` is trimmed before sending

## Expected Stream Response

The backend sends SSE-style events.

Example events:

`data: {"token":"Xin"}`

`data: {"token":" chào"}`

`data: {"token":"!"}`

`data: {"done":true}`

Possible event types:

Token event:

{ "token": "text chunk" }

Done event:

{ "done": true }

Error event:

{ "error": "error message" }

## Required Client Behavior

When the player sends a message:

1. Trim and validate the message.
2. Ensure a valid session exists.
3. Append the user message to the UI immediately.
4. Create an assistant placeholder or prepare a streaming assistant message.
5. Start loading or streaming state.
6. Send `POST /api/chat`.
7. Read the response stream progressively.
8. Parse SSE `data:` events.
9. Append every received `token` to the current assistant message.
10. Stop streaming when `{ done: true }` is received.
11. Show error if stream fails.
12. Re-enable input after done or error.

## Rendering Rule

The assistant message must be rendered progressively.

Correct behavior:

* one user message bubble appears immediately
* one assistant message bubble appears for the response
* incoming tokens are appended to that assistant bubble
* final assistant response remains in the same bubble

Incorrect behavior:

* creating one assistant bubble per token
* hiding assistant response until the whole stream completes
* faking typewriter effect after receiving full response
* using polling to simulate streaming
* using WebSocket
* using webhook logic

## State Management Requirements

The chat state should track:

* `sessionId`
* message list
* input value if handled in hook or page
* loading state
* streaming state
* error state
* current assistant response being streamed

Recommended message shape:

* `role`: `user` or `assistant`
* `content`: message text
* `timestamp`: optional if available
* temporary local id if needed for rendering

The frontend should not require backend persistence to complete before showing the local message.

## Message Order

Message order must remain chronological.

Expected order:

1. user message
2. assistant response
3. next user message
4. next assistant response

Do not insert streamed tokens as separate messages.

Do not reorder messages after stream completion unless syncing with backend history explicitly requires it.

## Session Rule

The frontend should use `POST /api/session` to create a session if no session exists.

The session id should be reused for the current chat session.

Do not create a new session for every message unless explicitly required.

Do not hardcode a fake session id.

## Files Usually Involved

Common files for this feature:

`src/pages/ChatPage.jsx`

`src/hooks/useChat.js`

`src/api/chatApi.js`

`src/utils/sseParser.js`

`src/components/chat/ChatBubble.jsx`

`src/components/chat/ChatInput.jsx`

`src/components/chat/TypingIndicator.jsx`

Only modify files required by the task.

## `useChat.js` Rules

`useChat.js` should coordinate the chat flow.

Expected responsibilities:

* manage messages
* manage session id
* expose send message action
* manage loading and streaming states
* call chat API functions
* append streamed tokens to assistant message
* handle done event
* handle stream error

Avoid placing stream state logic directly in `ChatPage.jsx` unless the existing project is intentionally simple.

Do not put low-level SSE parsing logic inside the hook if `sseParser.js` exists.

## `chatApi.js` Rules

`chatApi.js` should handle chat-related API calls.

Expected responsibilities:

* create session
* send chat message
* read stream response
* pass parsed stream events to callbacks or return stream events through a clean interface

Do not hardcode backend URL.

Do not ignore non-OK HTTP responses.

Do not treat chat stream as normal JSON.

For `POST /api/chat`, expect a streaming response.

## `sseParser.js` Rules

`sseParser.js` should parse SSE-style data safely.

It should handle:

* one chunk containing one event
* one chunk containing multiple events
* one event split across multiple chunks
* JSON split across chunks
* empty lines
* `data:` prefix
* malformed JSON
* token event
* done event
* error event

The parser should not crash the UI on bad data.

The parser should not directly modify React state.

It should be reusable and testable as a utility.

## Chat Bubble Rules

Chat bubbles should clearly distinguish:

* user messages
* assistant messages
* streaming assistant message
* error message if shown inline

The assistant bubble must support incremental content updates.

Long text should wrap correctly.

Whitespace should remain readable.

Avoid layout flicker during streaming.

Do not use one bubble per token.

## Chat Input Rules

The input should:

* prevent empty submit
* trim user message
* allow normal typing
* provide a clear send action
* be disabled or guarded while streaming
* avoid duplicate submit while stream is active
* clear after successful submit starts

If Enter-to-send exists, preserve it.

If Shift+Enter behavior exists, do not break it unless explicitly requested.

## Typing Indicator Rules

Typing indicator is useful before the first token arrives.

When token content starts arriving, the assistant bubble should show actual streamed content.

Do not keep a typing indicator forever after tokens arrive.

Stop typing/loading state on:

* `{ done: true }`
* stream error
* request failure

## Error Handling

Handle these cases:

* session creation fails
* chat request fails before stream opens
* stream connection is interrupted
* backend sends `{ error: "..." }`
* SSE parser receives malformed event
* browser does not support `ReadableStream`
* backend response is not `text/event-stream`

Error behavior:

* stop loading state
* stop streaming state
* show readable error message
* preserve user message
* preserve partial assistant message if useful
* do not clear the full chat unnecessarily

## Loading States

The chat feature should distinguish:

* idle
* creating session
* sending message
* waiting for first token
* streaming response
* completed
* error

The UI does not need separate visual states for all of these, but the logic should not confuse them.

At minimum:

* show loading or typing while waiting
* show progressive text while streaming
* stop loading after done or error

## Backend Contract Dependency

This feature depends on backend behavior:

* `POST /api/session` returns a valid `sessionId`
* `POST /api/chat` accepts `{ sessionId, message }`
* `POST /api/chat` returns `text/event-stream`
* stream sends `data: {"token":"..."}` events
* stream ends with `data: {"done":true}`
* stream may send `data: {"error":"..."}` on failure

If backend does not follow this contract, record the mismatch in:

`agent/frontend/handoff.md`

Do not silently patch around backend contract changes without documenting them.

## Do Not Implement

Do not implement:

* WebSocket chat
* webhook listener
* polling loop
* fake typewriter effect after full response
* mock-only chat flow if real API is expected
* new chat transport library
* new state management library
* authentication
* multi-user presence
* chat room logic
* file upload
* voice input
* markdown renderer unless explicitly requested

## Manual Test Checklist

For chat changes, manually verify:

* [ ] Open `/`.
* [ ] Chat page renders.
* [ ] Input is visible.
* [ ] Empty message cannot be submitted.
* [ ] User message appears immediately after submit.
* [ ] Assistant placeholder or typing indicator appears.
* [ ] Assistant response appears progressively from stream tokens.
* [ ] One assistant bubble is used for one assistant response.
* [ ] Input is disabled or guarded while streaming.
* [ ] `{ done: true }` ends loading state.
* [ ] Error state is readable if request fails.
* [ ] Long messages wrap correctly.
* [ ] Mobile layout remains usable.

## Completion Checklist

A chat task is complete when:

* [ ] Current plan was updated before coding.
* [ ] Chat transport remains `POST /api/chat` with streaming response.
* [ ] No webhook, WebSocket, or polling logic was introduced.
* [ ] Stream tokens render progressively.
* [ ] Done event ends streaming state.
* [ ] Error path is handled.
* [ ] No duplicate assistant bubble per token.
* [ ] Relevant validation commands were run or failure reason was recorded.
* [ ] Handoff was updated after implementation.
