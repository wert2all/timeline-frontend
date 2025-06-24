# Potential Bugs and Areas for Improvement

This document lists potential bugs, inconsistencies, and areas for improvement identified during a review of the codebase.

## NgRx Store and State Management

### 1. Images Store (`src/app/shared/store/images/`)

*   **[Medium] Incorrect Reducer Logic for `UploadActions.successUploadImage`**
    *   **File:** `images.reducer.ts`
    *   **Description:**
        1.  The action `UploadActions.successUploadImage` is handled by two separate `on` blocks. While functional, this can be confusing.
        2.  The first `on` block for this action has a problematic line: `const images = { ...Object.values(state.images) };`. This attempts to spread an array into an object, likely corrupting the `state.images` structure by creating numeric keys instead of using image IDs. It should probably be `const images = { ...state.images };`.
        3.  In the same reducer, if the incoming `status` is `Status.SUCCESS`, the image's status in the store is set to `Pending.PENDING`. This is counter-intuitive and could lead to UI showing a loading state for an image that has already been successfully processed.
    *   **Suggestion:** Consolidate the logic for `UploadActions.successUploadImage` into a single `on` block. Correct the images object copying. Ensure status updates are logical (e.g. SUCCESS should remain SUCCESS or move to a final loaded state).

*   **[Low] Inefficient Reducer Helper Functions (`updateQueque`, `updateImagesState`)**
    *   **File:** `images.reducer.ts`
    *   **Description:** Both functions rebuild the entire `queue` or `images` object from scratch on every update by using `[...Object.values(queue), image].reduce(...)` starting with an empty accumulator.
    *   **Suggestion:** For better performance, especially with larger state objects, update only the changed item immutably (e.g., `{ ...state, queue: { ...state.queue, [image.uuid]: newImage } }`).

*   **[Low] Generic Error Message in `uploadImage` Effect**
    *   **File:** `images.effects.ts`
    *   **Description:** If `apiClient.uploadImages` returns a structure where `data` or `data[0]` is missing, the effect dispatches `UploadActions.failedUploadImage` with a generic error: `'Failed to load uploaded image'`.
    *   **Suggestion:** Provide more specific error information if available from the API response or the nature of the failure.

*   **[Medium] Potential Missing Token Handling / Error Propagation in `createTaskForLoadImages` Effect**
    *   **File:** `images.effects.ts`
    *   **Description:** If the `token` is missing, the effect `throw new Error('No token');` inside a `map` operator. While this might be caught by global NgRx error handling, it's generally better to explicitly handle such errors within the effect stream, e.g., by dispatching a dedicated error action.
    *   **Suggestion:** Dispatch a specific error action (similar to `SharedActions.dispatchEmptyPreviewlyTokenError()`) instead of throwing an error directly in the `map`.

*   **[Medium] Incomplete `shouldDelete` Mechanism**
    *   **Files:** `images.types.ts`, `images.reducer.ts`
    *   **Description:** The `shouldDelete` array in `ImagesState` is populated on `DeleteEventActions.deleteEvent` but there's no visible effect or reducer logic that consumes this state to perform an API call for deletion or remove the image from `state.images`.
    *   **Suggestion:** Implement the corresponding effect and reducer logic to handle actual image deletion based on `state.shouldDelete`, or remove this state if it's unused.

*   **[Low] Fragile `selectCurrentUploadImage` Selector**
    *   **File:** `images.reducer.ts`
    *   **Description:** `selectCurrentUploadImage` uses `Object.values(queque).pop()` to get the "current" upload. This relies on object key insertion order, which is not always guaranteed and can be fragile.
    *   **Suggestion:** Use a more robust method, like a dedicated state field `currentlyProcessingUuid` or by relying on an explicit status property on queue items.

### 2. Shared Store (`src/app/shared/store/shared/`)

*   **[High] Potential Token Misuse in `dispatchTaskForLoadingImages` Effect**
    *   **File:** `shared.effects.ts`
    *   **Description:** The effect uses `environment.services.previewly.token` directly. Other parts of the application (e.g., `images.effects.ts`) correctly retrieve a user-specific `previewlyToken` from the active account state. Using a static environment token here could lead to authentication/authorization issues if a user-specific token is required for loading these images.
    *   **Suggestion:** Verify if a user-specific token (from `sharedFeature.selectActiveAccount`) should be used. If so, refactor the effect to use the correct token source.

*   **[Low] Performance of `selectLoadedImage` Function**
    *   **File:** `shared.functions.ts`
    *   **Description:** The `selectLoadedImage(imageId: number, store: Store)` function creates a *new* `createSelector` instance every time it's called. This defeats NgRx's selector memoization if the function is called multiple times (e.g., in component templates or frequently from logic).
    *   **Suggestion:** Refactor to use a parameterized selector factory that returns a memoized selector, e.g., `export const selectImageById = (imageId: number) => createSelector(...)`. The component would then call `store.select(selectImageById(id))`.

### 3. Dashboard Operations Store (`src/app/feature/dashboard/store/operations/`)

*   **[High] Incorrect API Type Mapping in `fromEventTypeStateToApiType`**
    *   **File:** `edit-event.effects.ts`
    *   **Description:** The function maps `EventType.celebrate` to `GQLTimelineType.selebrate` but maps all other `EventType` values (including presumably `EventType.default`) to `null`. The corresponding `fromApiTypeToState` correctly maps `GQLTimelineType.default` to `EventType.default`. This asymmetry suggests `EventType.default` should map to `GQLTimelineType.default` instead of `null`. Sending `null` could be an API error or lead to unintended behavior if the API expects a concrete type.
    *   **Suggestion:** Correct the mapping: `case EventType.default: return GQLTimelineType.default;`. Verify API requirements for the event type.

*   **[Medium] Inconsistent Error Handling in Effects**
    *   **File:** `edit-event.effects.ts`
    *   **Description:** `pushNewEventToApi` and `pushExistEventToApi` effects handle errors by directly dispatching `SharedActions.sendNotification` with the raw error object/string. `loadEditEventData` dispatches a specific `EditEventActions.apiException`, which is then handled by another effect that provides a formatted user message.
    *   **Suggestion:** Standardize error handling. The pattern of dispatching a specific error action (`apiException`) and handling it centrally is generally more robust and maintainable. Ensure raw error objects are not directly passed as user-facing messages.

*   **[Low] Potential Null Reference with `extractApiData`**
    *   **File:** `edit-event.effects.ts`
    *   **Description:** In `pushNewEventToApi` and `pushExistEventToApi`, the code `map(result => apiAssertNotNull(extractApiData(result), 'Empty event')), map(data => fromApiEventToState(data.event))` assumes `data.event` will exist if `extractApiData(result)` is not null. If `extractApiData` returns an object but `event` property is missing, it could lead to an error. `loadEditEventData` effect uses safer `extractApiData(result)?.event`.
    *   **Suggestion:** Consistently use optional chaining (`?.event`) before asserting or ensure `apiAssertNotNull` can check for nested properties if needed.

*   **[Low] Redundant Reducer Logic for `AddTimelineActions.successAddTimeline`**
    *   **File:** `operations.reducers.ts`
    *   **Description:** `AddTimelineActions.successAddTimeline` is handled in two separate `on` blocks. While functional, this makes the reducer harder to read and understand the complete state transition for that action.
    *   **Suggestion:** Combine the logic into a single `on` block for `AddTimelineActions.successAddTimeline` for clarity.

## Components and UI

### 1. EditEventComponent (`src/app/feature/dashboard/edit-event/edit-event.component.ts`)

*   **[Low] Repeated `selectLoadedImage` Calls in `computed` Signal**
    *   **Description:** The `previewImage` computed signal calls `selectLoadedImage(updatedEvent.imageId, this.store)`. As `selectLoadedImage` creates a new selector instance each time (see Shared Store issue), this can lead to inefficient recomputations of the `previewImage` signal if `updatedEvent` changes for reasons other than `imageId`.
    *   **Suggestion:** Address the `selectLoadedImage` implementation in `shared.functions.ts`.

*   **[Low] Fragile Time Prepending and Defaulting in `updatePreviewEvent`**
    *   **Description:**
        1.  `const time = value.time?.match('^\\d:') ? '0' + value.time : value.time;` prepends '0' to time. This is a bit fragile.
        2.  `date: (date.isValid ? date : DateTime.now()).toJSDate()` defaults to current time on invalid input, which might silently overwrite user input.
    *   **Suggestion:**
        1.  Consider using Luxon's formatting options for time output from the form component or more robust parsing.
        2.  For invalid dates, provide user feedback (validation error) rather than silently defaulting.

### 2. EditEventFormComponent (`src/app/feature/dashboard/edit-event/edit-event-form/edit-event-form.component.ts`)

*   **[Low] Frequent `valuesChanged` Emissions**
    *   **Description:** The form emits `valuesChanged` on every keystroke due to `this.editForm.valueChanges.subscribe(...)`. If the parent component (`EditEventComponent`) performed expensive operations in `updatePreviewEvent`, this could cause performance issues. (Currently, `updatePreviewEvent` updates a signal, which is efficient, but this pattern can be risky).
    *   **Suggestion:** If performance becomes an issue, consider debouncing the `valuesChanged` emission for certain fields or the entire form.

## General Code Quality / Other

*   **[Low] Complex Regular Expressions**
    *   **File:** `src/app/feature/dashboard/edit-event/edit-event-form/edit-event-form.component.ts`
    *   **Description:** `URL_REGEXP` is noted as complex. While often necessary, very complex regexes can be hard to maintain and debug.
    *   **Suggestion:** Ensure it's well-tested. If issues arise, consider simpler validation or library-based URL validation if appropriate.

This list is not exhaustive but covers several areas where potential bugs might exist or where code could be made more robust, maintainable, or performant.
