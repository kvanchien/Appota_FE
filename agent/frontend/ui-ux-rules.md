# Frontend UI/UX Rules

## Purpose

This file defines the UI/UX rules for the Frontend Agent working inside `Appota_FE`.

These rules are adapted and simplified for a small 24-hour React frontend project.

Do not apply a heavy design system.

Do not introduce complex style generators, palette systems, font systems, animation systems, or layout frameworks.

The goal is a functional, clean, readable, responsive UI for:

* Player chat.
* Admin conversation logs.
* Admin Knowledge Base CRUD.

## Design Priority

Prioritize in this order:

1. Functional clarity.
2. Correct API state.
3. Readable layout.
4. Clear user actions.
5. Loading, empty, and error states.
6. Basic responsive behavior.
7. Visual polish.

Do not prioritize decorative design over product behavior.

## UI Scope

The frontend UI only needs to support:

* Player chat screen.
* Admin conversations list.
* Admin conversation detail.
* Admin Knowledge Base list.
* Knowledge Base create/edit/delete flow.
* Basic admin layout.

Do not build:

* marketing landing page
* complex dashboard analytics
* chart system
* theme switcher
* advanced animation system
* multi-theme palette selector
* font pairing system
* design token engine

## General Layout Rules

Use simple layouts.

Prefer:

* clear page title
* short description when useful
* primary content area
* obvious primary action
* consistent spacing
* readable width constraints

Avoid:

* crowded screens
* too many cards
* nested panels without purpose
* decorative sections that do not support the task
* excessive shadows or borders
* unnecessary gradients

For admin pages, prefer a practical dashboard layout.

For chat, prefer a focused conversation layout.

## Spacing Rules

Use consistent spacing.

Recommended Tailwind spacing:

* page padding: `p-4`, `p-6`, or responsive equivalent
* section gap: `gap-4` or `gap-6`
* card padding: `p-4` or `p-6`
* button/form spacing: `gap-2` or `gap-3`

Do not use random spacing values unless required.

Do not create cramped forms or tables.

## Typography Rules

Use the existing project font setup.

Do not introduce new web fonts unless explicitly requested.

Use clear hierarchy:

* page title: visually strongest
* section title: secondary
* body text: readable
* metadata: smaller and muted

Avoid very small text for important content.

Avoid using too many font sizes in one component.

Do not use emoji as a substitute for functional icons or labels.

## Color Rules

Use the existing visual style from Tailwind CSS and Ant Design.

Do not introduce a large custom palette.

Use color with restraint:

* primary actions should be clear
* destructive actions should be visually distinct
* error states should be readable
* disabled states should be obvious
* metadata can use muted color

Do not rely on color alone to communicate meaning.

For example, an error should include readable text, not just a red border.

## Ant Design Rules

Use Ant Design for practical UI:

* `Table`
* `Form`
* `Input`
* `Button`
* `Modal`
* `Popconfirm`
* `Spin`
* `Empty`
* `Alert`
* `message` or notification if already used
* layout primitives when helpful

Do not over-customize Ant Design.

Do not fight Ant Design defaults unless the result is clearly better.

Use Ant Design validation for admin forms when appropriate.

Prefer Ant Design table behavior over hand-built tables for admin screens.

## Tailwind CSS Rules

Use Tailwind for layout and minor visual adjustments:

* flex
* grid
* spacing
* width
* height
* borders
* background
* rounded corners
* responsive behavior
* chat bubble alignment

Keep Tailwind classes readable.

Avoid long class strings when a simpler layout is enough.

Do not create complex custom CSS files for simple layout problems.

## Player Chat UI Rules

The chat screen must make the conversation easy to follow.

Required behavior:

* User messages align separately from assistant messages.
* Assistant streamed response is visible while being generated.
* Partial response should update progressively.
* Input should be easy to find.
* Send action should be obvious.
* Loading or typing state should appear while waiting.
* Error state should be readable.

Do not render one assistant bubble per token.

Do not hide the assistant message until the full response finishes.

Do not fake token rendering after receiving a full completed response.

The visible UI must reflect actual stream progress from the backend.

## Chat Bubble Rules

Chat bubbles should be readable.

User bubble:

* visually distinct from assistant bubble
* aligned consistently
* should not take the full width on desktop unless content requires it

Assistant bubble:

* readable text width
* supports progressive text append
* should not flicker during streaming
* should preserve whitespace reasonably

Both:

* handle long messages
* wrap text correctly
* keep chronological order
* avoid layout shift where possible

## Chat Input Rules

The chat input must support fast usage.

Required:

* prevent empty submit
* trim message before sending
* send by button
* support Enter-to-send if existing behavior supports it
* disable or guard while streaming to prevent duplicate submits
* show loading state on send button if appropriate

Do not let users submit multiple messages while one stream is still unresolved unless the hook is explicitly designed to queue messages.

## Streaming UX Rules

Streaming is the central interaction of the chat feature.

The UX must show:

* immediate user message
* assistant placeholder or typing indicator
* progressive assistant content
* completion when stream ends
* clear error if stream fails

When first token arrives:

* typing indicator can be replaced by assistant text
* loading state should continue until done

When done event arrives:

* stop streaming state
* re-enable input
* keep final assistant message visible

On stream error:

* stop streaming state
* show readable error
* do not delete the user's message
* preserve partial assistant content if it exists

## Admin Conversations UI Rules

The conversation list must be scan-friendly.

Show key fields:

* session id
* last message
* message count
* created or updated time
* action to open detail

Use table layout unless the existing design uses cards.

Handle:

* loading state
* empty state
* error state
* long session ids
* long messages

Long text should be truncated or wrapped in a controlled way.

Do not make the table visually dense without need.

## Conversation Detail UI Rules

Conversation detail must show full message history clearly.

Required:

* session identifier visible
* messages ordered chronologically
* user and assistant roles visually distinguishable
* timestamps if available
* back navigation to conversation list

Do not mix messages from different sessions.

Do not reverse order unless intentionally designed and clearly consistent.

## Admin Knowledge UI Rules

The Knowledge Base page must prioritize CRUD efficiency.

Required:

* list all Q&A entries
* create new entry
* edit existing entry
* delete entry with confirmation
* show loading state
* show empty state
* show error state

Form fields:

* question
* answer
* category if supported

Question and answer are required.

Category is optional.

Use modal or inline edit depending on existing implementation. Do not introduce both patterns unless explicitly requested.

## Knowledge Form UX Rules

The form must be simple.

Required:

* clear labels
* required validation for question
* required validation for answer
* trim input
* submit loading state
* cancel action
* readable error message on API failure

After successful create or update:

* close modal or exit edit mode
* refresh list or update local state
* clear stale form state

For delete:

* use confirmation
* do not delete immediately without user confirmation
* refresh list or remove item from local state after success

## Loading State Rules

Every async screen must have loading state.

For page-level loading:

* use spinner or skeleton only if already used
* avoid blank screens

For button-level loading:

* show submit in progress
* prevent duplicate submits

For chat streaming:

* distinguish between waiting for first token and actively rendering streamed content when possible

Do not leave loading state stuck after error.

## Empty State Rules

Every list page must handle empty data.

Admin conversations empty state:

* indicate that no conversations exist yet

Knowledge Base empty state:

* indicate no Q&A entries exist yet
* keep create action available

Chat empty state:

* show a simple starting point or neutral blank conversation area

Do not show confusing empty tables without explanation.

## Error State Rules

Errors must be readable and actionable.

Use backend `message` when available.

Fallback examples:

* “Failed to load conversations.”
* “Failed to load Knowledge Base.”
* “Failed to send message.”
* “Streaming connection was interrupted.”

Do not expose stack traces.

Do not show raw JSON errors unless useful for debugging and explicitly requested.

Do not silently fail.

## Responsive Rules

The frontend must remain usable on:

* mobile width around 375px
* tablet width around 768px
* desktop width around 1024px and above

Minimum expectations:

* chat screen works on mobile
* input remains accessible
* messages wrap correctly
* admin tables do not break layout
* modals fit smaller screens
* admin navigation does not block content

For admin tables on small screens:

* allow horizontal scroll if needed
* reduce non-essential columns if already supported
* avoid forcing unreadable compressed columns

Do not spend excessive time on perfect responsive polish in the 24-hour scope.

## Accessibility Rules

Interactive elements must be understandable and keyboard-accessible.

Required:

* buttons have clear labels
* form fields have labels
* focus state remains visible
* clickable icons have accessible labels if used without text
* error messages are text-based
* disabled state is visually clear

Do not remove outlines unless a clear replacement focus style exists.

Do not use only placeholder text as the sole label for important forms if Ant Design label can be used.

## Interaction Rules

User actions should have predictable feedback.

For create/update/delete:

* show loading or disabled submit while request is running
* show success or updated data after completion
* show confirmation before delete
* show error if failed

For chat send:

* immediate user message feedback
* visible stream progress
* guarded input while streaming

Do not trigger destructive actions without confirmation.

Do not make users guess whether a click worked.

## Visual Consistency Rules

Use consistent naming and layout across admin pages.

For admin pages:

* consistent page header
* consistent table style
* consistent action button placement
* consistent modal form style
* consistent loading/error display

For chat:

* consistent bubble spacing
* consistent role alignment
* consistent input placement

Avoid one-off styling unless required by the feature.

## Motion and Animation Rules

Keep animation minimal.

Acceptable:

* typing dots if already implemented
* simple hover states
* standard Ant Design transitions
* basic loading spinner

Avoid:

* large page transitions
* complex motion libraries
* animated backgrounds
* decorative micro-interactions that do not improve clarity

Do not add Framer Motion or similar libraries unless explicitly requested.

## Data Display Rules

Display backend data honestly.

Do not invent missing values.

If a field is missing:

* show a safe fallback such as “N/A”
* or hide optional metadata if not required

For timestamps:

* use readable format if existing utility exists
* otherwise keep ISO or simple local format

For long text:

* truncate in list view
* show full content in detail view or modal

## Copywriting Rules

UI text should be direct and concise.

Use consistent English or Vietnamese depending on current project language.

Do not mix languages randomly inside the same screen.

Avoid decorative copy.

Prefer clear labels:

* “Send”
* “Create”
* “Edit”
* “Delete”
* “Cancel”
* “Save”
* “Load conversations failed”
* “No conversations yet”

## Small Project Constraint

This project is time-limited.

Do not over-engineer UI.

Do not create a full design system.

Do not create theme builders.

Do not create reusable abstractions before there are at least two real use cases.

Do not spend time polishing unused states or unsupported features.

Build only what supports the acceptance criteria.

## Acceptance-Oriented UI Checklist

A UI change is acceptable when:

* The target screen works.
* Main action is clear.
* Loading state exists.
* Empty state exists where needed.
* Error state exists.
* Form validation works where needed.
* Layout is readable on desktop.
* Layout is usable on mobile.
* Chat streaming renders progressively if chat is affected.
* No unrelated visual changes were introduced.
* Lint/build status is known.
