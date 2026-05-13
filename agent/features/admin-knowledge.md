# Admin Knowledge Feature

## Purpose

This file defines the feature-specific context, rules, and checklist for the admin Knowledge Base management screen in `Appota_FE`.

The Frontend Agent must read this file before working on any task related to:

* Knowledge Base list
* Q&A create form
* Q&A edit form
* Q&A delete action
* `GET /api/knowledge`
* `POST /api/knowledge`
* `PUT /api/knowledge/:id`
* `DELETE /api/knowledge/:id`
* `knowledgeApi.js`
* `useKnowledge.js`
* `KnowledgePage.jsx`
* `KnowledgeTable.jsx`
* `KnowledgeModal.jsx`

## Feature Summary

The admin Knowledge Base feature allows an admin user to manage Q&A pairs used by the chatbot.

The backend uses these Q&A pairs when generating chatbot responses.

The frontend is responsible for:

* listing Knowledge Base entries
* creating a new Q&A pair
* editing an existing Q&A pair
* deleting an existing Q&A pair
* validating required fields before submit
* showing loading, empty, and error states
* keeping UI state synchronized after mutations

Authentication is out of scope for the 24-hour version.

Do not add login, permission, role checking, or route protection unless explicitly requested.

## Main User Goal

The admin should be able to:

* view all Q&A entries
* add a new Q&A pair quickly
* edit outdated answer content
* delete invalid or duplicated entries
* see clear feedback when an operation fails

## Backend Contract

List endpoint:

`GET /api/knowledge`

Expected successful response shape:

{
"success": true,
"data": [
{
"_id": "MongoDB ObjectId string",
"question": "question text",
"answer": "answer text",
"category": "payment",
"createdAt": "ISO date string",
"updatedAt": "ISO date string"
}
]
}

Create endpoint:

`POST /api/knowledge`

Request body:

{
"question": "question text",
"answer": "answer text",
"category": "optional category"
}

Expected successful response shape:

{
"success": true,
"data": {
"_id": "MongoDB ObjectId string",
"question": "question text",
"answer": "answer text",
"category": "optional category",
"createdAt": "ISO date string",
"updatedAt": "ISO date string"
}
}

Update endpoint:

`PUT /api/knowledge/:id`

Request body may include changed fields only:

{
"question": "updated question text",
"answer": "updated answer text",
"category": "updated category"
}

Delete endpoint:

`DELETE /api/knowledge/:id`

Expected successful response shape:

{
"success": true,
"data": null
}

Failure response shape:

{
"success": false,
"data": null,
"message": "error message"
}

The frontend must not assume the request succeeds.

The frontend must show readable errors for failed list, create, update, or delete operations.

## Required Fields

Required:

* `question`
* `answer`

Optional:

* `category`

Validation rules:

* `question` must not be empty.
* `answer` must not be empty.
* input should be trimmed before submit.
* `category` can be omitted or empty unless backend requires otherwise.

Do not submit invalid form data to backend if the frontend can detect it.

## Related Files

Common files for this feature:

`src/pages/admin/KnowledgePage.jsx`

`src/components/admin/KnowledgeTable.jsx`

`src/components/admin/KnowledgeModal.jsx`

`src/hooks/useKnowledge.js`

`src/api/knowledgeApi.js`

`src/api/baseApi.js`

`src/components/layout/AdminLayout.jsx`

`src/App.jsx`

Only modify files required by the current task.

## Page Responsibilities

## Knowledge Page

`KnowledgePage.jsx` should coordinate the Knowledge Base screen.

Expected responsibilities:

* fetch Knowledge Base list through hook or API wrapper
* manage page-level loading state
* manage page-level error state
* provide page title/context
* provide create action
* pass data and actions to table/modal components
* refresh or update local state after create, update, or delete

Do not put all table, modal, form, and API behavior into one large page if reusable components already exist.

## Knowledge Table

`KnowledgeTable.jsx` should render a practical list of Q&A entries.

Expected columns:

* question
* answer
* category
* updated time or created time if available
* actions

Actions:

* edit
* delete

Table must handle:

* loading state if passed from page
* empty data
* long question text
* long answer text
* missing category
* delete confirmation

Do not delete immediately without confirmation.

## Knowledge Modal

`KnowledgeModal.jsx` should handle create/edit form UI if the project uses modal form.

Expected fields:

* question
* answer
* category

Expected behavior:

* show empty form for create
* prefill form for edit
* validate required fields
* trim values before submit
* show submit loading
* allow cancel
* reset stale form state when closed or switched between create/edit
* keep form behavior predictable

Do not close modal before the API request succeeds unless explicitly using optimistic UI with rollback.

## `useKnowledge.js` Rules

`useKnowledge.js` should coordinate Knowledge Base data behavior if present.

Expected responsibilities:

* load entries
* create entry
* update entry
* delete entry
* manage loading state
* manage mutation state if needed
* manage error state
* expose refresh function if needed

Do not silently swallow API errors.

Do not leave loading state stuck after failure.

Do not duplicate the same fetch/mutation logic across multiple components.

## `knowledgeApi.js` Rules

`knowledgeApi.js` should contain Knowledge Base API functions.

Expected functions may include:

* get knowledge entries
* create knowledge entry
* update knowledge entry
* delete knowledge entry

Use existing base API configuration.

Do not hardcode backend URL inside page or component files.

Respect backend response format:

`{ success, data, message }`

Handle non-OK HTTP responses consistently with the existing API wrapper pattern.

## Create Flow

Expected create behavior:

1. Admin clicks create action.
2. Create form opens.
3. Admin enters question and answer.
4. Optional category can be entered.
5. Frontend validates required fields.
6. Submit button shows loading or is guarded.
7. Frontend calls `POST /api/knowledge`.
8. On success, list updates.
9. Form resets.
10. Modal closes or create UI exits.
11. On failure, error is shown and entered values are preserved.

Do not clear form values after failed submit unless explicitly requested.

## Edit Flow

Expected edit behavior:

1. Admin clicks edit on an entry.
2. Edit form opens with current values.
3. Admin updates fields.
4. Frontend validates required fields.
5. Submit button shows loading or is guarded.
6. Frontend calls `PUT /api/knowledge/:id`.
7. On success, list updates.
8. Modal closes or edit UI exits.
9. On failure, error is shown and entered values are preserved.

Do not accidentally create a new entry when editing.

Do not lose the target entry `_id`.

## Delete Flow

Expected delete behavior:

1. Admin clicks delete.
2. UI asks for confirmation.
3. Admin confirms.
4. Frontend calls `DELETE /api/knowledge/:id`.
5. On success, item is removed from visible list or list is refreshed.
6. On failure, item remains visible and error is shown.

Do not delete immediately without confirmation.

Do not remove item from UI before backend success unless optimistic update with rollback is explicitly implemented.

## ID Handling Rule

Knowledge entries use `_id` as backend identifier.

Use `_id` for update and delete calls.

Do not use array index as identifier for update or delete.

Do not generate fake `_id` for real backend data.

## Data Display Rules

Question:

* show enough text for admin to identify the entry
* wrap or truncate safely in table

Answer:

* may be longer than question
* truncate in table if needed
* show full answer in edit modal or detail area if present

Category:

* show category when available
* show neutral fallback when missing if table requires a value
* do not make category required unless backend requires it

Dates:

* show readable date if existing formatter exists
* otherwise show simple local date/time or raw ISO safely

## Loading State Rules

List loading:

* show loading indicator while fetching entries
* do not show blank page without explanation

Mutation loading:

* create/update/delete should prevent duplicate submit
* submit button should show loading when possible
* delete action should be guarded while request is running if practical

Do not leave loading state stuck after failure.

## Empty State Rules

If Knowledge Base has no entries:

* show a clear empty state
* keep create action available
* do not show a confusing blank table

Example meaning:

No Knowledge Base entries yet. Create the first Q&A pair.

## Error Handling Rules

Use backend `message` when available.

Fallback messages:

* “Failed to load Knowledge Base.”
* “Failed to create Knowledge Base entry.”
* “Failed to update Knowledge Base entry.”
* “Failed to delete Knowledge Base entry.”

Do not expose stack traces.

Do not show raw JSON unless explicitly requested.

Do not silently fail.

## UI/UX Rules

The Knowledge Base screen should prioritize CRUD efficiency.

Prefer:

* clear page title
* visible create button
* readable table
* concise action buttons
* confirmation before delete
* simple modal form
* clear validation messages

Avoid:

* complex filters unless requested
* advanced search unless requested
* bulk actions unless requested
* import/export unless requested
* analytics or charts
* over-designed card layouts

## Form UX Rules

Forms must be predictable.

Required:

* labels for question and answer
* required validation for question
* required validation for answer
* category as optional
* clear submit and cancel actions
* loading state on submit
* readable error on failure

Question field:

* can be single-line input or textarea depending on existing design
* should not accept whitespace-only value

Answer field:

* should usually be textarea
* should not accept whitespace-only value

Category field:

* can be simple text input
* do not force predefined categories unless task requests it

## State Synchronization Rules

After successful create:

* append new item to list or refresh list

After successful update:

* update item in list or refresh list

After successful delete:

* remove item from list or refresh list

Choose the approach consistent with existing code.

Do not leave stale data visible after successful mutation.

Do not over-cache Knowledge Base entries because backend changes should affect subsequent chat behavior.

## Backend Dependency Notes

This feature depends on backend behavior:

* `GET /api/knowledge` returns an array.
* `POST /api/knowledge` creates an entry.
* `PUT /api/knowledge/:id` updates an entry.
* `DELETE /api/knowledge/:id` deletes an entry.
* required fields are `question` and `answer`.
* response format is `{ success, data, message }`.

If backend contract differs, record the mismatch in:

`agent/frontend/handoff.md`

Do not silently change frontend expectations without documenting the API mismatch.

## Do Not Implement

Do not implement:

* authentication
* role-based admin permissions
* bulk import
* bulk delete
* CSV export
* semantic search
* vector search
* AI-powered KB generation
* category taxonomy manager
* advanced filters unless requested
* pagination unless backend supports it or task requests it
* optimistic delete without rollback
* new UI library
* new state management library

## Manual Test Checklist

For Knowledge Base list:

* [ ] Open `/admin/knowledge`.
* [ ] Confirm page renders.
* [ ] Confirm loading state appears during fetch.
* [ ] Confirm entries display when API returns data.
* [ ] Confirm empty state displays when API returns empty list.
* [ ] Confirm error state displays when API fails.
* [ ] Confirm long question and answer text do not break layout.

For create:

* [ ] Open create form.
* [ ] Submit empty form and confirm validation.
* [ ] Submit whitespace-only question and confirm validation.
* [ ] Submit whitespace-only answer and confirm validation.
* [ ] Create valid entry.
* [ ] Confirm list updates.
* [ ] Confirm form resets or closes after success.
* [ ] Confirm failed create shows error and preserves values.

For edit:

* [ ] Open edit form.
* [ ] Confirm existing values are prefilled.
* [ ] Submit invalid values and confirm validation.
* [ ] Submit valid update.
* [ ] Confirm list updates.
* [ ] Confirm failed update shows error and preserves values.

For delete:

* [ ] Click delete.
* [ ] Confirm confirmation appears.
* [ ] Cancel delete and confirm item remains.
* [ ] Confirm delete.
* [ ] Confirm item is removed or list refreshes.
* [ ] Confirm failed delete shows error and item remains visible.

## Completion Checklist

An admin Knowledge Base task is complete when:

* [ ] Current plan was updated before coding.
* [ ] Required fields are validated.
* [ ] List behavior works if affected.
* [ ] Create behavior works if affected.
* [ ] Edit behavior works if affected.
* [ ] Delete behavior works if affected.
* [ ] Loading state is handled.
* [ ] Empty state is handled.
* [ ] Error state is handled.
* [ ] `_id` is used for update/delete.
* [ ] No authentication was added unless requested.
* [ ] No unrelated advanced KB feature was added.
* [ ] Validation status is known.
* [ ] Handoff was updated after implementation.
