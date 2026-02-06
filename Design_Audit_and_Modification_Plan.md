# Sentra Desktop: Design Audit & Modification Plan

**Based on:** Product Principles v1.0
**Audit Date:** February 4, 2026
**Mockup Repository:** github.com/niashwin/mockup-v0

---

## Executive Summary

This document audits the current Sentra mockup against the 10 Product Principles and provides a detailed modification plan. The current implementation has strong foundations but diverges significantly from the principles in several key areas—particularly around **single-focus attention**, **card structure consistency**, **memory-justified elevation**, and **action primitives**.

### Priority Classification
- **P0 (Critical):** Fundamental principle violations that must be fixed
- **P1 (High):** Important changes that significantly improve alignment
- **P2 (Medium):** Refinements that enhance the experience
- **P3 (Low):** Polish and delight elements

---

## Principle-by-Principle Audit

### 1. Single-Focus Attention

> *"At any moment, only one thing should occupy the user's full attention. When you click into something, it takes center stage. No 2/3-1/3 splits that divide cognitive load."*

#### Current State: ❌ VIOLATION

**Issues Found:**

1. **NowScreen uses 65%/35% split layout** (`NowScreen.tsx:134-297`)
   - Left side: Memory Bubbles (65%)
   - Right side: Meeting + Alerts + Commitments panels (35%)
   - This is exactly the "2/3-1/3 split" the principle rejects

2. **Multiple panels compete for attention simultaneously**
   - Meeting card, Alerts panel, and Commitments panel all visible at once
   - User must context-switch between areas

3. **Topic detail panel appears as slide-over, not full takeover**
   - `TopicDetailPanel` slides in from right
   - Memory bubbles remain visible (dimmed), creating split attention

#### Required Changes (P0):

| Change ID | Description | Files Affected |
|-----------|-------------|----------------|
| 1.1 | Redesign NowScreen as **single-column, full-width** layout. The attention pane (cards) should be the primary view. Memory bubbles become a secondary/exploration mode accessed via explicit toggle. | `NowScreen.tsx`, `App.tsx` |
| 1.2 | When clicking into any card (alert, commitment, meeting), it should **expand to full-screen focus mode** with previous context sliding away completely | `NowScreen.tsx`, new `FocusView.tsx` |
| 1.3 | Implement **modal takeover pattern**: when drilling into any item, it takes 100% of the viewport with clear "back" affordance | All detail panels |
| 1.4 | Remove simultaneous display of Meeting + Alerts + Commitments. Show **one primary attention stream** that users scroll through | `NowScreen.tsx` |

---

### 2. Only Surface What Demands Intervention

> *"Two categories belong in the attention pane: (1) Needs your attention: A risk or issue that could go wrong, (2) Needs your decision: Something blocked until you weigh in. Status updates, completed jobs, 'things going well'—none of these belong in prime real estate."*

#### Current State: ⚠️ PARTIAL VIOLATION

**Issues Found:**

1. **Memory Stream shows everything** (`MemoryBubblesEnhanced.tsx`)
   - Bubbles include: Vision, Q3 Goals, Mobile App, User Study, Design System, Docs, etc.
   - Many are informational/status items, not intervention-required

2. **Alerts include "info" severity** (`types.ts:1`)
   - `AlertSeverity = 'critical' | 'warning' | 'info'`
   - "Info" alerts don't demand intervention and shouldn't appear

3. **Commitments show completed items** (`NowScreen.tsx:84`)
   - `pendingCommitments = commitments.filter(c => c.status !== 'completed')`
   - Correct filtering, but completed items still exist in data and appear elsewhere

4. **Meeting card shows "next meeting" regardless of intervention need**
   - Not all meetings require prep or decisions
   - Should only surface meetings where user needs to do something

#### Required Changes (P0):

| Change ID | Description | Files Affected |
|-----------|-------------|----------------|
| 2.1 | Create **strict filter** for attention pane: only show items where `needsIntervention: true` or `needsDecision: true` | `data.ts`, new `AttentionFilter.ts` |
| 2.2 | Remove "info" severity from attention pane. Info-level items go to exploration/search only | `Alert_Center.md`, `types.ts` |
| 2.3 | Add `requiresAction: boolean` field to MeetingBrief. Only show meetings in attention pane where user has prep tasks or pending decisions | `types.ts`, meeting components |
| 2.4 | Rename "Memory Stream" to "Exploration" or similar. It's not the attention pane—it's for discovery | `MemoryBubblesEnhanced.tsx` |

---

### 3. Weight by Probability × Impact

> *"Before surfacing anything, the system must answer: If this isn't addressed, what's the (qualitative) probability something goes wrong? And how severe would that be? High-high gets prioritized. Low-anything gets filtered out."*

#### Current State: ❌ VIOLATION

**Issues Found:**

1. **No probability/impact scoring in data model**
   - Alerts have `severity` but no probability assessment
   - Commitments have `priority` but no impact scoring
   - No combined weighting algorithm

2. **Current prioritization is simplistic**
   - Alerts: Just severity (critical > warning > info)
   - Commitments: Just priority (High > Medium > Low)
   - No cross-entity comparison

3. **All items of same category weighted equally**
   - A critical alert about a minor feature = critical alert about customer churn
   - No business context in weighting

#### Required Changes (P1):

| Change ID | Description | Files Affected |
|-----------|-------------|----------------|
| 3.1 | Add `probability: 'high' \| 'medium' \| 'low'` and `impact: 'high' \| 'medium' \| 'low'` to all attention-worthy entities | `types.ts` |
| 3.2 | Create `AttentionScore` utility: `score = probabilityWeight × impactWeight`. Filter out `score < threshold` | New `AttentionScore.ts` |
| 3.3 | Sort attention pane by score descending, not by type or time | `NowScreen.tsx` |
| 3.4 | Display probability/impact reasoning (used in Principle 8) but don't clutter with raw scores | Card components |

---

### 4. Trusted by Default, Verify When Needed

> *"No inline citations cluttering every sentence or artifact. Users should trust the synthesis. But if they want to drill into source material, it's one click away."*

#### Current State: ⚠️ PARTIAL VIOLATION

**Issues Found:**

1. **Evidence links shown inline on cards** (`NowScreen.tsx`, Alert items)
   - `📄 Evidence: [Exec Meeting Aug 15] [Pricing Doc]`
   - This clutters the card with verification details upfront

2. **Source badges visible by default**
   - Commitment cards show: `📄 From: Leadership Team Meeting (Aug 7)`
   - Alert cards show: `📄 Evidence: [Product Sync] [Sales Call] [Slack]`

3. **Good: Evidence IS one click away**
   - Clicking opens source (conceptually)
   - But shouldn't be visible until requested

#### Required Changes (P1):

| Change ID | Description | Files Affected |
|-----------|-------------|----------------|
| 4.1 | Hide evidence/source links by default. Show only on hover or via "Sources" expandable section | All card components |
| 4.2 | Replace inline evidence with subtle "verified" indicator (small icon) that expands on click | `AlertItem`, `CommitmentItem`, etc. |
| 4.3 | Create `SourceDrawer` component: slides in from right with full source material when user wants to verify | New `SourceDrawer.tsx` |
| 4.4 | Keep source data in model but don't render until explicitly requested | Card components |

---

### 5. Every Card Earns Its Real Estate

> *"A card is a fixed mental unit—consistent length, consistent structure. Five lines of context, a 'why' line (using memory to explain the rationale), and suggested actions."*

#### Current State: ❌ VIOLATION

**Issues Found:**

1. **Cards have inconsistent structures**
   - Alert cards: severity badge, title, description, timestamp, source
   - Commitment cards: checkbox, title, assignee, due date, priority badge
   - Meeting cards: icon, title, time, context block, attendees
   - No unified format

2. **No "why" line explaining memory-based rationale**
   - Missing: "Flagging this because..."
   - Cards present data, not reasoning

3. **Context length varies wildly**
   - Some cards: 1 line description
   - Some cards: Multi-line context blocks
   - No fixed 5-line constraint

4. **Suggested actions not standardized**
   - Alerts: [Escalate] [Assign Owner] [Mark Resolved]
   - Commitments: [Complete] [Snooze] [Delegate]
   - No consistent action vocabulary

#### Required Changes (P0):

| Change ID | Description | Files Affected |
|-----------|-------------|----------------|
| 5.1 | Create **unified `AttentionCard` component** with fixed structure | New `AttentionCard.tsx` |
| 5.2 | Card structure must be:<br>• Line 1: Category badge + timestamp<br>• Lines 2-3: Title (max 2 lines)<br>• Lines 4-5: Context (max 2 lines)<br>• Line 6: **WHY line** (memory-justified)<br>• Line 7: Actions row | `AttentionCard.tsx` |
| 5.3 | Add `why: string` field to all attention entities, populated by memory reasoning | `types.ts`, data layer |
| 5.4 | Standardize action vocabulary across all card types (see Principle 6) | All card components |
| 5.5 | Enforce max character counts in rendering, truncate with "..." | `AttentionCard.tsx` |

**Card Structure Template:**

```
┌────────────────────────────────────────────┐
│ 🔴 RISK · 2h ago                    [More] │  ← Category + Time + Overflow
│                                            │
│ Q3 Launch Blocked by Legal                 │  ← Title (2 lines max)
│                                            │
│ Contract review pending for 12 days.       │  ← Context (2 lines max)
│ Mentioned in 4 meetings, no resolution.    │
│                                            │
│ 💡 Flagging because you're closing         │  ← WHY line (memory-justified)
│    Series A and this affects timeline.     │
│                                            │
│ [View Context] [Draft Email] [Assign]      │  ← Actions (standardized)
└────────────────────────────────────────────┘
```

---

### 6. Actions Are Primitives, Not Features

> *"Three types: Context (view source, see thread), Execute (draft response, schedule meeting—completed in-product, deep-linked), Collaborate (bring someone else in, they see what you see)"*

#### Current State: ⚠️ PARTIAL COMPLIANCE

**Issues Found:**

1. **Action types not consistently categorized**
   - Current actions: Complete, Snooze, Delegate, Escalate, Assign Owner, Mark Resolved, View Details, Context
   - No clear Context / Execute / Collaborate taxonomy

2. **Execute actions don't deep-link**
   - "Draft response" doesn't pre-fill email
   - "Schedule meeting" doesn't open calendar
   - Actions are conceptual, not functional

3. **Collaborate pattern not implemented**
   - "Delegate" exists but doesn't share context
   - No "bring someone into this card" feature
   - No shared view of the same card

#### Required Changes (P0):

| Change ID | Description | Files Affected |
|-----------|-------------|----------------|
| 6.1 | Define action taxonomy:<br>• **Context**: View Source, See Thread, Show History<br>• **Execute**: Draft Email, Schedule Meeting, Create Task, Send Slack<br>• **Collaborate**: Share Card, Assign to Person, Add Watcher | New `ActionPrimitives.ts` |
| 6.2 | Implement deep-linking for Execute actions. Draft Email → opens mailto: with pre-filled subject/body. Schedule Meeting → opens calendar with pre-filled details | Action handlers |
| 6.3 | Build `ShareCard` flow: generates link, recipient sees exact same card context | New `CardSharing.tsx` |
| 6.4 | Actions should render as icon buttons with consistent styling:<br>• Context: Grey icons<br>• Execute: Primary/Blue icons<br>• Collaborate: Green icons | Action components |

---

### 7. Reward Bias Toward Action

> *"Don't gate satisfaction on full resolution. Taking a step forward is the win. Small actions get acknowledged—motion produces information."*

#### Current State: ⚠️ PARTIAL COMPLIANCE

**Issues Found:**

1. **Good: Completion animations exist** (`CommitmentItemWithActions.tsx:105-116`)
   - Success ring effect on complete
   - "Completed!" message appears
   - Dopamine hit implemented

2. **Missing: Intermediate action acknowledgment**
   - Snooze shows toast but no celebration
   - Delegate shows generic toast
   - No "good job for taking action" messaging

3. **No progress tracking for partial completion**
   - Either done or not done
   - No "you've moved this forward" state

4. **Missing: Motivational quotes on completion**
   - Principle mentions "a quote from an operator when you finish something"
   - Not implemented

#### Required Changes (P2):

| Change ID | Description | Files Affected |
|-----------|-------------|----------------|
| 7.1 | Add celebratory feedback for ALL actions, not just complete:<br>• Snooze: "Smart move. We'll remind you."<br>• Delegate: "Passed the baton. They're on it."<br>• Draft: "Words are half the battle." | Toast messages, action handlers |
| 7.2 | Implement **operator quotes** on significant completions. Curated list of motivational quotes from real operators | New `OperatorQuotes.ts` |
| 7.3 | Add haptic feedback (via Electron API) on action completion | Action handlers |
| 7.4 | Consider subtle sound effects on completion (optional, toggle in settings) | Settings, action handlers |

---

### 8. Memory Justifies Elevation

> *"When something surfaces in the attention pane, there should be a 'why' grounded in memory. 'Flagging this because you're closing Series A and this term sheet expires in 15 days.'"*

#### Current State: ❌ VIOLATION

**Issues Found:**

1. **No "why" reasoning on any card**
   - Alert cards: just show the alert
   - Commitment cards: just show the task
   - No memory-grounded justification

2. **Context field exists but isn't "why"**
   - Commitments have `context: string` but it's task description
   - Not: "why is this surfaced now"

3. **No temporal reasoning displayed**
   - "Term sheet expires in 15 days" type reasoning missing
   - No connection to user's priorities/state

#### Required Changes (P0):

| Change ID | Description | Files Affected |
|-----------|-------------|----------------|
| 8.1 | Add `memoryRationale: string` field to all attention entities | `types.ts` |
| 8.2 | Display "why" prominently on every card. Format: "💡 Flagging because [memory-grounded reason]" | `AttentionCard.tsx` |
| 8.3 | Generate sample "why" statements for mock data:<br>• "Flagging because you discussed this in 3 meetings without resolution"<br>• "Flagging because Marcus mentioned this is a blocker for Q3"<br>• "Flagging because similar issues caused problems last quarter" | `data.ts` |
| 8.4 | "Why" should reference: temporal context, related entities, past patterns, user priorities | Data model |

---

### 9. Cards Persist Context Through Collaboration

> *"When Ashwin joins a card, he sees what you see. The conversation happens inside the card. When resolved, the card dissolves—but memory retains everything."*

#### Current State: ❌ NOT IMPLEMENTED

**Issues Found:**

1. **No card sharing/collaboration feature exists**
   - Cards are single-user
   - No "join this card" functionality

2. **No in-card conversation**
   - Comments/discussion not possible
   - Collaboration requires leaving context (going to Slack, etc.)

3. **No "card dissolves, memory retains" pattern**
   - Resolved items just get filtered out
   - No explicit memory capture on resolution

#### Required Changes (P1):

| Change ID | Description | Files Affected |
|-----------|-------------|----------------|
| 9.1 | Add `collaborators: string[]` field to cards | `types.ts` |
| 9.2 | Build **card sharing UI**: "Add Ashwin to this card" → Ashwin sees identical card in their attention pane | New `CardCollaboration.tsx` |
| 9.3 | Add **in-card comment thread**. Simple linear discussion that lives on the card | `AttentionCard.tsx`, new `CardThread.tsx` |
| 9.4 | On card resolution, show: "Resolved. Memory captured. We'll resurface if needed." | Resolution flow |
| 9.5 | Store resolution context in memory: who resolved, when, what was the outcome | Data layer |

---

### 10. Delight Through Restraint

> *"Clean > cluttered. More shadow on cards so they pop. Blue hues aligned with brand. Dynamic wallpaper tied to time of day. Haptic/sound on completion."*

#### Current State: ⚠️ PARTIAL COMPLIANCE

**Issues Found:**

1. **Good: Clean aesthetic foundation**
   - Tailwind styling is minimal and clean
   - Dark/light modes exist
   - Rounded corners, subtle shadows

2. **Cards don't "pop" enough**
   - Current: `shadow-sm`, `border-zinc-200`
   - Need: More pronounced elevation on focus cards

3. **No dynamic wallpaper**
   - Background is static
   - No time-of-day variation

4. **No haptic/sound feedback**
   - Electron can support this
   - Not implemented

5. **Color palette not strictly blue-aligned**
   - Uses: emerald, amber, red, blue, zinc
   - Should lean more into brand blue hues

#### Required Changes (P2):

| Change ID | Description | Files Affected |
|-----------|-------------|----------------|
| 10.1 | Increase card elevation: `shadow-lg` or custom shadow with more depth | Card components, `index.css` |
| 10.2 | Implement **dynamic wallpaper**: morning (warm), day (bright), evening (cool), night (dark). Gradients shift based on system time | `App.tsx`, new `DynamicBackground.tsx` |
| 10.3 | Add haptic feedback via Electron: light tap on actions, stronger on completion | `electron/main.js`, action handlers |
| 10.4 | Add optional completion sounds: subtle, professional. Toggle in settings | Settings, action handlers |
| 10.5 | Audit color usage: reduce amber/emerald, increase blue spectrum for brand alignment | `index.css`, all components |
| 10.6 | Implement **operator quotes** on completion (also in Principle 7) | `OperatorQuotes.ts` |

---

## Implementation Roadmap

### Phase 1: Core Architecture (Week 1-2)

**P0 Changes:**

1. **Single-Focus Layout Redesign** (Changes 1.1-1.4)
   - Remove split layout
   - Create full-width attention stream
   - Implement focus mode for drill-down

2. **Unified Card Structure** (Changes 5.1-5.5)
   - Build `AttentionCard` component
   - Enforce consistent structure
   - Add "why" line placeholder

3. **Memory-Justified Elevation** (Changes 8.1-8.4)
   - Add `memoryRationale` to data model
   - Update mock data with "why" statements
   - Display prominently on cards

4. **Action Primitives** (Changes 6.1-6.4)
   - Define Context/Execute/Collaborate taxonomy
   - Update all action buttons
   - Implement deep-linking stubs

### Phase 2: Filtering & Prioritization (Week 3)

**P0/P1 Changes:**

5. **Intervention Filter** (Changes 2.1-2.4)
   - Add `needsIntervention` / `needsDecision` fields
   - Filter attention pane strictly
   - Rename Memory Stream to Exploration

6. **Probability × Impact Scoring** (Changes 3.1-3.4)
   - Add probability/impact fields
   - Implement scoring algorithm
   - Sort by attention score

7. **Trust by Default** (Changes 4.1-4.4)
   - Hide evidence links by default
   - Add subtle "verified" indicator
   - Build source drawer

### Phase 3: Collaboration & Delight (Week 4)

**P1/P2 Changes:**

8. **Card Collaboration** (Changes 9.1-9.5)
   - Add collaborators field
   - Build sharing UI
   - Implement in-card comments

9. **Delight Elements** (Changes 7.1-7.4, 10.1-10.6)
   - Enhanced action feedback
   - Operator quotes
   - Dynamic wallpaper
   - Haptic/sound feedback
   - Elevated card shadows

---

## File Change Summary

### New Files to Create

| File | Purpose |
|------|---------|
| `AttentionCard.tsx` | Unified card component with standard structure |
| `AttentionFilter.ts` | Filtering logic for intervention-required items |
| `AttentionScore.ts` | Probability × Impact scoring utility |
| `ActionPrimitives.ts` | Context/Execute/Collaborate action definitions |
| `SourceDrawer.tsx` | Slide-in panel for verification/evidence |
| `CardCollaboration.tsx` | Sharing and collaboration UI |
| `CardThread.tsx` | In-card comment thread |
| `FocusView.tsx` | Full-screen focus mode for single item |
| `DynamicBackground.tsx` | Time-based wallpaper component |
| `OperatorQuotes.ts` | Curated quotes for completion moments |

### Files to Modify

| File | Changes |
|------|---------|
| `types.ts` | Add: probability, impact, memoryRationale, needsIntervention, needsDecision, collaborators |
| `data.ts` | Add "why" statements, probability/impact, intervention flags to mock data |
| `NowScreen.tsx` | Complete redesign: single-column, unified attention stream |
| `App.tsx` | Layout changes, dynamic background integration |
| `CommitmentItemWithActions.tsx` | Replace with AttentionCard usage |
| `index.css` | Enhanced shadows, blue color palette |
| `electron/main.js` | Haptic feedback support |

### Files to Remove/Deprecate

| File | Reason |
|------|--------|
| `AlertItem` (in App.tsx) | Replaced by unified AttentionCard |
| `CommitmentItem` (in App.tsx) | Replaced by unified AttentionCard |
| `MeetingCard` (in App.tsx) | Replaced by unified AttentionCard |

---

## Success Criteria

After implementation, verify:

- [ ] Opening app shows **single attention stream**, not split panels
- [ ] Every card has exactly 7 structural lines (category, title, context, why, actions)
- [ ] Every card displays "Flagging because..." with memory reasoning
- [ ] Only intervention-required items appear (no info alerts, no status updates)
- [ ] Cards are sorted by probability × impact score
- [ ] Evidence is hidden until user clicks "verify" indicator
- [ ] Actions are categorized as Context/Execute/Collaborate
- [ ] Execute actions deep-link to actual destinations
- [ ] Cards can be shared; recipients see identical context
- [ ] Completing actions shows celebration + operator quote
- [ ] Background shifts based on time of day
- [ ] Haptic feedback on actions (if enabled)

---

## Appendix: Mock Data Updates

### Example Updated Alert

```typescript
{
  id: 'alert-1',
  type: 'risk',
  title: 'Q3 Launch Blocked by Legal',
  context: 'Contract review pending for 12 days. Mentioned in 4 meetings, no resolution.',
  memoryRationale: 'Flagging because you\'re closing Series A and this term sheet expiration could delay the timeline by 3 weeks.',
  probability: 'high',
  impact: 'high',
  needsIntervention: true,
  needsDecision: false,
  timestamp: '2h ago',
  collaborators: [],
  evidence: [
    { type: 'meeting', title: 'Exec Meeting Aug 15', url: '...' },
    { type: 'slack', title: '#legal channel', url: '...' }
  ]
}
```

### Example Updated Commitment

```typescript
{
  id: 'commit-1',
  type: 'commitment',
  title: 'Send Q3 budget proposal to CFO',
  context: 'Requested by Sarah in Leadership meeting. Original deadline was Aug 10.',
  memoryRationale: 'Flagging because this is 3 days overdue and Sarah mentioned it affects board deck preparation.',
  probability: 'high',
  impact: 'medium',
  needsIntervention: true,
  needsDecision: false,
  assignee: 'Me',
  dueDate: 'Aug 10 (3 days overdue)',
  collaborators: ['Sarah Chen'],
  source: { type: 'meeting', title: 'Leadership Team Meeting', timestamp: 'Aug 7' }
}
```

---

*Document prepared for Sentra Desktop redesign initiative. All changes should be implemented iteratively with user testing at each phase.*
