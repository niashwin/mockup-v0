# UI Fixes Implementation Plan

## 1. Remove Blue Background from Briefs Page

**Problem:** `DynamicBackground` wraps `NowScreen` in `App.tsx:4009-4018`, applying time-of-day colored gradients (blue daytime, amber morning, violet evening, slate night).
**Fix:** Remove `<DynamicBackground>` wrapper entirely. Replace with a plain white container.
**Files:**

- [ ] `src/App.tsx:4009-4018` — Replace `<DynamicBackground className="h-full">` with `<div className="h-full bg-white dark:bg-neutral-950">`

## 2. Remove Red/Orange Effects from Meetings

**Problem:** Privacy toggle button in `MeetingComponents.tsx:122-126` uses orange styling (`bg-orange-50`, `text-orange-600`, `border-orange-100`). The left bar indicator (line 97) uses `bg-muted-foreground` for private meetings.
**Fix:** Replace all orange/red styling with neutral colors matching the non-private styling.
**Files:**

- [ ] `src/components/MeetingComponents.tsx:122-126` — Replace orange toggle with neutral colors
- [ ] `src/components/MeetingDetailModal.tsx` — Check for any orange border/ring/glow and remove

## 3. Make Meeting Profile Pictures Colorless (Neutral Gray)

**Problem:** Three color arrays across files define colored gradients for avatars:

- `MeetingComponents.tsx:22-31` — `PERSON_COLORS`
- `MeetingDetailModal.tsx:19-28` — `PERSON_COLORS`
- `App.tsx:2646-2655` — `MEETING_PERSON_COLORS`
  **Fix:** Replace all colored gradient arrays with a single neutral gray. Remove the hash-based color functions.
  **Files:**
- [ ] `src/components/MeetingComponents.tsx:22-38` — Replace `PERSON_COLORS` and `getPersonColor` with neutral
- [ ] `src/components/MeetingDetailModal.tsx:19-42` — Same
- [ ] `src/App.tsx:2646-2662` — Replace `MEETING_PERSON_COLORS` and `getMeetingPersonColor`

## 4. CRM-Style Popup for Meeting Person Clicks

**Problem:** Clicking a person in meetings opens `PersonDetailPanel` (a different, simpler panel) instead of the CRM `ContactDrawer` (which has relationship status, talking points, tags, notes, etc.).
**Fix:** Replace `PersonDetailPanel` in meetings with the CRM `ContactDrawer`. Generate a mock `Contact` object from the person name.
**Approach:**

1. Create a `generateMockContact(name: string): Contact` utility that produces realistic Contact data
2. In `MeetingsScreen`, import `ContactDrawer` from CRM and replace `PersonDetailPanel`
3. When a person is clicked, generate the mock Contact and open the CRM drawer
   **Files:**

- [ ] `src/App.tsx:2774-2775, 3237-3240` — Replace `PersonDetailPanel` with `ContactDrawer` + mock Contact generation
- [ ] Create utility or inline function for mock Contact generation

## 5. Bigger CRM Cards (2-3x) with Size Toggle

**Problem:** Cards have `min-h-[160px]`, `w-32` photo, grid constrained by `max-w-5xl`. Cards are too small.
**Fix:** Make cards 2-3x larger, rectangular (wider than tall), 3 per row edge-to-edge. Add size toggle.
**Approach:**

1. Remove `max-w-5xl` constraint from grid
2. Add card size state to CRM store: `cardSize: 'sm' | 'md' | 'lg'` (default 'lg')
3. Scale card dimensions based on size:
   - **sm** (current): `w-32` photo, `min-h-[160px]`
   - **md** (2x): `w-48` photo, `min-h-[280px]`, `p-7`
   - **lg** (3x): `w-64` photo, `min-h-[380px]`, `p-8`
4. Grid always `grid-cols-3` with wider gap
5. Profile pictures must be prominently visible
6. Keep description uncondensed — wider cards = more space, NOT narrower text
   **Files:**

- [ ] `src/components/crm/layouts/card-grid/card-grid-layout.tsx` — Remove max-w, dynamic gap
- [ ] `src/components/crm/layouts/card-grid/contact-card.tsx` — Size-responsive dimensions
- [ ] `src/stores/crm-store.ts` — Add `cardSize` state + setter
- [ ] `src/components/crm/crm-header.tsx` — Add size toggle control

## 6. Fix Ask Sentra Bar Click Behavior

**Problem:** Clicking the pill calls `expand()` changing state from `collapsed` to `expanded`, which swaps the arrow button for Auto/Attach/Voice buttons. This causes a visual jump.
**Fix:** Remove the expand-on-click behavior. The bar should stay visually identical whether focused or not. Only transition to chat mode when a message is sent.
**Approach:**

1. Remove `handleInputClick` that triggers `expand()`
2. Always show the collapsed-style arrow button (never show Auto/Attach/Voice in pill)
3. Allow typing directly in collapsed state — just focus the input
4. Only enter `chat` state via `sendMessage()`
5. Keep click-outside and Escape to collapse from chat mode
   **Files:**

- [ ] `src/components/chat/ask-sentra-chatbox.tsx` — Remove expand on click, keep visual stable

---

## Execution Order

```
1. Briefs background     (quick, isolated)
2. Meeting orange effects (quick, isolated)
3. Meeting avatar colors  (quick, isolated)       } All parallel
4. Sentra bar behavior    (quick, isolated)

5. CRM card sizing + toggle (medium complexity)
6. Meeting person → CRM drawer (medium complexity)
```
