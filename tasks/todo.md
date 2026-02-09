# Meetings Page Rebuild — Implementation Plan

## Overview

Rebuild the Meetings page to match the reference image (Granola-style meeting list), replacing the current card-based layout with a clean, minimal list view. Maintain the existing white/blue (`--accent: #00a6f5`) design system. When clicking a meeting row, open a detail modal matching the second reference image.

---

## Current State

- **MeetingsScreen** lives inline in `App.tsx` (lines ~2907–3397) — a 490-line component
- Uses `MeetingBrief` type from `src/types.ts` with `MeetingDetailCard`, `PreMeetingBriefOverlay`, `MeetingDetailModal` components
- Current layout: scrollable page with "Scroll for History" → past meetings → "UP NEXT" divider → hero card → "Later" cards
- Meeting data comes from `meetingBriefs` in `src/data.ts`
- Design system: Figtree font, accent `#00a6f5`, warm neutrals, `rounded-[7px]` radius

## Target State (from reference images)

### Image 1 — Meeting List View

- **"Coming up" header** (large, left-aligned) with "Show more" link on the right
- **Meeting rows** displayed as clean list items:
  - **Left badge**: Icon showing meeting type (Video icon for Zoom/virtual, MapPin icon for in-person) — replaces the date badge from the reference
  - **Center**: Meeting title (bold), date & time below (muted text)
  - **Right side**: Public/Private toggle badge + chevron arrow (`>`)
- **Past meetings section**: Grouped by date headers ("Tue, Dec 9, 2025", "Mon, Dec 8, 2025")
  - Same row layout: icon badge, title + subtitle, time on right
- Clean, minimal, no cards — just rows with subtle hover states

### Image 2 — Meeting Detail Modal (on click)

- **Header**: Status badge ("COMPLETED") + "PUBLIC" badge, close button + Public toggle (top right)
- **Title**: Large, bold
- **Metadata row**: Calendar date, clock time, location (In Person/Zoom)
- **Action buttons**: "Transcript" (blue/accent), "Share" (neutral)
- **Divider line**
- **Sections**: PURPOSE, ATTENDEES (count), KEY DECISIONS (bullet list), COMMITMENTS (checklist with assignee + due date + completion state)
- Clean white card with rounded corners, light shadow

---

## Implementation Steps

### Phase 1: Extract MeetingsScreen to its own file

- [ ] Create `src/components/MeetingsPage.tsx`
- [ ] Move `MeetingsScreen` component from `App.tsx` into new file
- [ ] Move helper functions (`getMeetingTypeIcon`, `AttendeeAvatarStack`, `getMeetingPersonColor`, `getMeetingInitials`, `formatMeetingTime`, `getDateLabel`) into the new file
- [ ] Update `App.tsx` imports to reference new file
- [ ] Verify app still renders correctly

### Phase 2: Build the new Meeting List UI

- [ ] **Remove** all existing MeetingsScreen JSX (hero cards, "UP NEXT" divider, history section, later section)
- [ ] **Create "Coming up" section**:
  - Large heading "Coming up" with "Show more" link
  - Filter upcoming meetings (`status === "scheduled"`)
  - Render each as a clean row:
    - Left: 40×40 rounded-lg icon badge (Video for zoom/meet/teams, MapPin for in-person, MessageSquare for phone)
    - Center: Title (font-semibold), Date + Time below (text-muted-foreground, text-sm)
    - Right: Public/Private toggle badge (clickable, styled with accent colors) + ChevronRight arrow
  - Subtle hover state (bg-muted/50)
  - Click anywhere on row → open detail modal

- [ ] **Create "Past meetings" section**:
  - Group completed meetings by date
  - Date header labels (e.g., "Tue, Dec 9, 2025")
  - Same row layout as "Coming up"
  - Past meetings show document/note icon instead of meeting type icon (matching reference)
  - Time displayed on right side

### Phase 3: Rebuild the Meeting Detail Modal

- [ ] **Rewrite `MeetingDetailModal.tsx`** to match the second reference image:
  - **Header area**:
    - Status dot + "COMPLETED"/"SCHEDULED" label + "PUBLIC"/"PRIVATE" pill badge
    - Top right: Public/Private toggle button + X close button
    - Title (text-2xl, font-semibold)
    - Metadata row: Calendar icon + date, Clock icon + time, MapPin/Video icon + location
    - Action buttons: "Transcript" (accent styled), "Share" (neutral)
  - **Divider**: Simple horizontal line
  - **Content sections** (scrollable):
    - **PURPOSE**: Bold uppercase label, purpose text, italic human recognition line
    - **ATTENDEES (count)**: Horizontal row of attendee pills (avatar circle with initials + name)
    - **KEY DECISIONS**: Bullet list of decision text
    - **COMMITMENTS**: Checklist items with:
      - Checkbox (empty or filled circle for completed)
      - Task text (strikethrough if completed)
      - Assignee name + "Due [date]" below
      - Comment icon on far right
  - Spring animation on open/close (scale + fade)
  - Backdrop blur

### Phase 4: Wire everything together

- [ ] Connect the new list rows to open the detail modal on click
- [ ] Ensure privacy toggle works on both list badges and modal toggle
- [ ] Keep existing person click → ContactDrawer flow
- [ ] Keep existing transcript modal flow
- [ ] Keep email compose flow
- [ ] Remove unused imports and dead code from App.tsx

### Phase 5: Polish & Verify

- [ ] Ensure animations are smooth (motion/framer-motion)
- [ ] Verify light mode styling matches white/blue theme
- [ ] Verify dark mode still works
- [ ] Test all interactive elements (toggle privacy, open modal, close modal, view transcript)
- [ ] Clean up any console.log statements
- [ ] Verify no TypeScript errors

---

## Files to Create/Modify

| File                                    | Action                                                               |
| --------------------------------------- | -------------------------------------------------------------------- |
| `src/components/MeetingsPage.tsx`       | **CREATE** — New meetings list page component                        |
| `src/components/MeetingDetailModal.tsx` | **REWRITE** — Rebuild to match reference image 2                     |
| `src/App.tsx`                           | **MODIFY** — Replace inline MeetingsScreen with import from new file |

## Files to Keep (no changes)

- `src/types.ts` — MeetingBrief interface is sufficient
- `src/data.ts` — Meeting data stays the same
- `src/components/MeetingComponents.tsx` — May keep PreMeetingBriefOverlay or remove if superseded
- `src/components/TranscriptModal.tsx` — Keep as-is
- `src/styles/globals.css` — Design tokens stay the same

## Design Decisions

- **Font**: Figtree (existing) — matches the clean sans-serif in the reference
- **Colors**: Keep `--accent: #00a6f5` for blue accents, warm neutrals for text
- **Radius**: `rounded-lg` for icon badges, `rounded-[2rem]` for modal, `rounded-[7px]` for buttons
- **Spacing**: Clean, generous whitespace matching reference
- **Icons**: Lucide React (already in use) — Video, MapPin, MessageSquare, Lock, UsersRound, ChevronRight
