# Cookie Consent Integration Tests

> Test flow documentation for [`cookie-consent.spec.ts`](cookie-consent.spec.ts)

This document describes each integration test case for the cookie consent banner, including clear text flows and Mermaid diagrams illustrating user interactions, DOM state changes, and storage operations.

---

## Consent Data Model

| Property    | Type     | Description                                      |
| ----------- | -------- | ------------------------------------------------ |
| `version`   | `string` | Schema version, currently `"1.0"`                |
| `settings`  | `object` | Per-category boolean flags                       |
| `timestamp` | `string` | ISO 8601 date of when the user made their choice |

**localStorage key:** `viscalyx.se-cookie-consent`

**Settings shape:**

```jsonc
{
  "strictly-necessary": true,
  "analytics": true, // or false
  "preferences": true, // or false
}
```

`strictly-necessary` is always `true` and cannot be disabled by the user.

---

## Overview — Full Consent Flow

```mermaid
flowchart TD
    A[Page Load] --> B{Consent in localStorage?}
    B -- Yes --> C[No banner shown]
    B -- No --> D[Show Cookie Banner]
    D --> E{User Action}
    E -- Accept All --> F["Save all categories = true"]
    E -- Reject All --> G["Save analytics & preferences = false"]
    E -- Customize Settings --> H[Show Detailed Settings View]
    H --> I{Toggle Categories}
    I --> J[Save Preferences]
    J --> F2["Save selected categories"]
    H --> K[Close Settings]
    K --> D
    F --> L["Write to localStorage + cookie"]
    G --> L
    F2 --> L
    L --> M[Dismiss Banner]
    M --> N[Emit consent-changed event]
```

---

## Test Setup

### `beforeEach` Hook

Every test starts with a clean slate:

1. Navigate to `/` to establish a page context.
2. Clear `localStorage` key `viscalyx.se-cookie-consent`.
3. Clear all browser cookies.
4. Reload the page so the banner appears fresh.

### `waitForBanner` Helper

Waits for the banner to be ready for interaction:

1. Locate the element matching `[role="dialog"][aria-modal="true"]`.
2. Assert it is visible.
3. Wait **400 ms** for the Framer Motion entrance animation (`y: 100 → 0`, 300 ms, easeOut) to settle.
4. Return the banner locator for chaining.

---

## Test Cases

### 1. Should display cookie consent banner on main page

**Purpose:** Verify the banner appears on first visit with all expected UI elements.

**Flow:**

1. Navigate to `/`.
2. Wait for the banner to appear and animate in.
3. Assert the banner contains an `<h2>` heading ("We Use Cookies").
4. Assert "Accept All" button is visible.
5. Assert "Reject All" button is visible.
6. Assert "Customize Settings" text is visible.

```mermaid
sequenceDiagram
    participant U as User
    participant P as Page
    participant B as Banner

    U->>P: Navigate to /
    P->>P: Check localStorage (empty)
    P->>B: Render banner (role="dialog")
    B->>B: Animate in (y:100→0, 300ms)
    U->>B: Observe UI elements
    Note over B: ✓ h2 heading visible
    Note over B: ✓ "Accept All" button visible
    Note over B: ✓ "Reject All" button visible
    Note over B: ✓ "Customize Settings" visible
```

---

### 2. Should accept all cookies when clicking "Accept All"

**Purpose:** Confirm that accepting all cookies hides the banner and stores the correct consent data with all categories enabled.

**Flow:**

1. Navigate to `/`.
2. Wait for the banner.
3. Click "Accept All".
4. Assert the banner is no longer visible.
5. Read `localStorage` key `viscalyx.se-cookie-consent`.
6. Assert `settings` has `strictly-necessary: true`, `analytics: true`, `preferences: true`.
7. Assert `timestamp` is present.
8. Assert `version` is `"1.0"`.

```mermaid
sequenceDiagram
    participant U as User
    participant B as Banner
    participant LS as localStorage

    U->>B: Click "Accept All"
    B->>LS: Save consent data
    Note over LS: strictly-necessary: true<br/>analytics: true<br/>preferences: true<br/>version: "1.0"
    B->>B: Animate out (y:0→100)
    Note over B: Banner hidden
    U->>LS: Read stored data
    Note over U: ✓ All categories true<br/>✓ Timestamp present<br/>✓ Version "1.0"
```

---

### 3. Should reject all cookies when clicking "Reject All"

**Purpose:** Confirm that rejecting all cookies hides the banner and stores consent with only strictly-necessary enabled.

**Flow:**

1. Navigate to `/`.
2. Wait for the banner.
3. Click "Reject All".
4. Assert the banner is no longer visible.
5. Read `localStorage` key `viscalyx.se-cookie-consent`.
6. Assert `settings` has `strictly-necessary: true`, `analytics: false`, `preferences: false`.
7. Assert `timestamp` is present.
8. Assert `version` is `"1.0"`.

```mermaid
sequenceDiagram
    participant U as User
    participant B as Banner
    participant LS as localStorage

    U->>B: Click "Reject All"
    B->>LS: Save consent data
    Note over LS: strictly-necessary: true<br/>analytics: false<br/>preferences: false<br/>version: "1.0"
    B->>B: Animate out (y:0→100)
    Note over B: Banner hidden
    U->>LS: Read stored data
    Note over U: ✓ strictly-necessary: true<br/>✓ analytics: false<br/>✓ preferences: false
```

---

### 4. Should open detailed cookie settings when clicking "Customize Settings"

**Purpose:** Verify the detailed settings panel opens with the correct toggle states and UI elements.

**Flow:**

1. Navigate to `/`.
2. Wait for the banner.
3. Click "Customize Settings" text (not the link, to avoid aria-label collision).
4. Assert "Cookie Settings" heading (`<h2>`) is visible.
5. Assert three toggle checkboxes exist in the DOM:
   - `#toggle-strictly-necessary` — checked and **disabled** (cannot be changed).
   - `#toggle-analytics` — unchecked and **enabled**.
   - `#toggle-preferences` — unchecked and **enabled**.
6. Assert "Save Preferences" button is visible.

```mermaid
sequenceDiagram
    participant U as User
    participant B as Banner
    participant D as Detailed View

    U->>B: Click "Customize Settings"
    B->>D: Switch to detailed view
    Note over D: "Cookie Settings" heading visible
    U->>D: Inspect toggles
    Note over D: ✓ #toggle-strictly-necessary<br/>  checked + disabled
    Note over D: ✓ #toggle-analytics<br/>  unchecked + enabled
    Note over D: ✓ #toggle-preferences<br/>  unchecked + enabled
    Note over D: ✓ "Save Preferences" button visible
```

---

### 5. Should allow toggling individual cookie categories

**Purpose:** Verify users can toggle categories on/off individually and that the saved data reflects the final toggle states.

**Flow:**

1. Navigate to `/`.
2. Wait for the banner.
3. Click "Customize Settings" to open detailed view.
4. Verify initial state: only `strictly-necessary` is checked.
5. Click the label wrapping `#toggle-analytics` → analytics becomes **checked**.
6. Click the label wrapping `#toggle-preferences` → preferences becomes **checked**.
7. Click the label wrapping `#toggle-analytics` again → analytics becomes **unchecked**.
8. Click "Save Preferences".
9. Assert the banner is hidden.
10. Read `localStorage` and verify:
    - `strictly-necessary: true`
    - `analytics: false` (toggled back off)
    - `preferences: true` (left on)

```mermaid
sequenceDiagram
    participant U as User
    participant D as Detailed View
    participant LS as localStorage

    U->>D: Open "Customize Settings"
    Note over D: Initial: SN=✓ AN=✗ PR=✗

    U->>D: Toggle analytics ON
    Note over D: SN=✓ AN=✓ PR=✗

    U->>D: Toggle preferences ON
    Note over D: SN=✓ AN=✓ PR=✓

    U->>D: Toggle analytics OFF
    Note over D: SN=✓ AN=✗ PR=✓

    U->>D: Click "Save Preferences"
    D->>LS: Save consent data
    Note over LS: strictly-necessary: true<br/>analytics: false<br/>preferences: true

    D->>D: Banner hidden
    U->>LS: Read stored data
    Note over U: ✓ Final state matches
```

The toggle decision flow:

```mermaid
flowchart LR
    A["Open Settings"] --> B["SN=✓ AN=✗ PR=✗"]
    B --> C["Toggle AN → ON"]
    C --> D["SN=✓ AN=✓ PR=✗"]
    D --> E["Toggle PR → ON"]
    E --> F["SN=✓ AN=✓ PR=✓"]
    F --> G["Toggle AN → OFF"]
    G --> H["SN=✓ AN=✗ PR=✓"]
    H --> I["Save Preferences"]
```

---

### 6. Should persist cookie consent choice across page reloads

**Purpose:** Verify that once the user makes a consent choice, the banner stays hidden across page reloads and navigation.

**Flow:**

1. Navigate to `/`.
2. Wait for the banner.
3. Click "Accept All" → banner hides.
4. Reload the page.
5. Assert the banner dialog is **not** visible (consent persisted).
6. Navigate to `/privacy`.
7. Navigate back to `/`.
8. Assert the banner dialog is still **not** visible.

```mermaid
sequenceDiagram
    participant U as User
    participant P as Page
    participant LS as localStorage

    U->>P: Navigate to /
    P->>P: Banner visible (no consent)
    U->>P: Click "Accept All"
    P->>LS: Save consent
    Note over P: Banner hidden

    U->>P: Reload page
    P->>LS: Read consent (exists)
    Note over P: ✓ No banner shown

    U->>P: Navigate to /privacy
    U->>P: Navigate to /
    P->>LS: Read consent (exists)
    Note over P: ✓ No banner shown
```

Persistence decision flow:

```mermaid
flowchart TD
    A["Accept All → Save"] --> B["Reload Page"]
    B --> C{Consent in localStorage?}
    C -- Yes --> D["✓ No banner"]
    D --> E["Navigate to /privacy"]
    E --> F["Navigate to /"]
    F --> G{Consent in localStorage?}
    G -- Yes --> H["✓ No banner"]
```

---

### 7. Should close detailed settings and return to simple banner view

**Purpose:** Verify that the Close button in the detailed settings view returns the user to the simple banner without dismissing it entirely.

**Flow:**

1. Navigate to `/`.
2. Wait for the banner.
3. Click "Customize Settings" to open detailed view.
4. Assert "Cookie Settings" heading is visible.
5. Click the "Close" button (`aria-label="Close"`).
6. Assert "Cookie Settings" heading is **no longer** visible.
7. Assert "Accept All" button is visible (back to simple view).

```mermaid
sequenceDiagram
    participant U as User
    participant B as Banner
    participant D as Detailed View

    U->>B: Click "Customize Settings"
    B->>D: Switch to detailed view
    Note over D: "Cookie Settings" heading visible

    U->>D: Click "Close" button
    D->>B: Switch back to simple view

    Note over B: ✓ "Cookie Settings" hidden
    Note over B: ✓ "Accept All" visible
    Note over B: Banner still open
```

---

### 8. Should handle keyboard navigation and focus management

**Purpose:** Verify the banner supports keyboard navigation with a focus trap and that Escape focuses the Reject All button (cancel action).

**Flow:**

1. Navigate to `/`.
2. Wait for the banner.
3. Press `Tab` to move focus to the first interactive element.
4. Press `Escape`.
5. Assert the "Reject All" button is still visible (Escape focuses it, does not dismiss the banner).
6. Assert the "Accept All" button is still visible.

**Accessibility features under test:**

- **Focus trap:** Tab/Shift+Tab cycles through focusable elements within the banner.
- **Escape key:** Focuses the "Reject All" button, treating Escape as a "deny/cancel" action.
- **Auto-focus:** On banner show, focus moves to "Accept All" after 100 ms.

```mermaid
sequenceDiagram
    participant U as User
    participant K as Keyboard
    participant B as Banner

    U->>K: Press Tab
    K->>B: Move focus to first interactive element
    U->>K: Press Escape
    K->>B: Focus "Reject All" button
    Note over B: ✓ "Reject All" visible + focused
    Note over B: ✓ "Accept All" visible
    Note over B: ✓ Banner remains open
```
