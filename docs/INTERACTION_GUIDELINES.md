# Mosaic Interaction Guidelines

> [!IMPORTANT]
> **The Interaction Constitution**
> This document is the definitive behavioral specification for Mosaic. It supersedes personal preference. Every interaction must reinforce a single principle: **Mosaic reduces the distance between a question and trustworthy evidence.** 
> 
> Our aesthetic is the precision of a scalpel. Calm, fast, predictable, evidence-first, keyboard-first, and analyst-first.

---

## 1. Navigation Philosophy

**Instantaneous and Flat.**
Users should never feel "buried" inside a hierarchy. Movement is lateral, not nested. 

- **Global Navigation:** The App Shell contains a persistent, collapsed left sidebar for inter-project context switching. It behaves as a command center, rarely expanded.
- **Project Navigation:** All workflows (Data Room, Questions, Memo) coexist in parallel. Switching between them happens in `<16ms` without full page reloads.
- **Deep Linking:** Every single state—down to the exact sentence highlighted in a specific PDF—has a unique URL. Sharing a link must recreate the exact viewport and scroll position.
- **Breadcrumbs:** Breadcrumbs act as a functional timeline, not just a folder structure. Clicking a breadcrumb node opens a popover to laterally shift to siblings.
- **History:** The browser back button is sacred. Never hijack it. Closing a modal is a pop state; changing a tab is a push state.

---

## 2. Focus Management

**Never lose the user's cursor.**

- **Keyboard Focus:** The application is 100% navigable without a mouse. Tabbing cycles strictly through actionable zones (Sidebar → Toolbar → Canvas → Inspector).
- **Selection:** Selected items retain a distinct persistent state (e.g., a faint primary background) even when the panel loses focus, so context is never lost.
- **Command Palette:** Summoned via `Cmd + K`. It steals focus immediately, dims the background by 30%, and on `Esc`, focus returns *exactly* to the previously focused element.
- **Escape Behavior:** `Esc` always does the safest local action: clears a search input → closes a popover → deselects an item → closes a modal.

---

## 3. Motion Language

**Motion communicates state, never decoration.**

- **Sidebar (Collapse/Expand):** `150ms`, `cubic-bezier(0.16, 1, 0.3, 1)`. Content inside cross-fades rather than reflowing jarringly.
- **Command Palette:** Scales in from `0.98` to `1.0` while fading opacity in `100ms`.
- **Loading:** No bouncing dots. A deterministic, ultra-thin 1px top progress bar (like linear/github) moving left-to-right.
- **Hover/Selection:** `50ms` opacity transition. It must feel strictly instantaneous, almost mechanical.
- **Drag & Drop:** The dragged item snaps to a 90% scale to feel dense. Valid drop zones highlight with a 2px inner border.
- **Maximum Animation Time:** No animation in Mosaic may exceed `150ms`. Wait times feel like lag to an analyst.

---

## 4. Component States

For every component, states must be visually distinct and instantly recognizable.

- **Default:** High contrast text on `bg-surface`. Borders are `border-subtle`.
- **Hover:** The surface brightens (`bg-surface-hover`). Borders do not change to prevent layout shift.
- **Focused:** A crisp `2px` outer ring in `accent-primary`, offset by `2px` from the component.
- **Pressed:** Scale shrinks to `0.98`, background shifts to `bg-surface-active`.
- **Selected:** Background tint is a low-opacity `accent-primary`. Left border adopts a `2px` solid `accent-primary` strip.
- **Disabled:** Opacity `0.4`. `cursor-not-allowed`. Never use tooltips on disabled items unless explaining *why* it's disabled.
- **Empty:** Deeply muted text `text-tertiary`. Always includes a keyboard shortcut hint to populate it.

---

## 5. Loading Philosophy

**Every millisecond of latency must be acknowledged.**

- **Skeletons:** Used only for initial layout mounts. They must perfectly match the geometry of the incoming data to prevent layout shift.
- **Progressive Loading:** Always render the UI shell instantly. Paint the data as it arrives. 
- **Streaming Responses:** AI generations stream into view chunk-by-chunk. No cursor blinking, just smooth text accretion.
- **Long-running AI Jobs:** AI parsing tasks (e.g., indexing 50 PDFs) run in the background. A non-blocking status indicator in the bottom-right displays "Indexing 42/50..."
- **Optimistic Updates:** Creating a memo or adding a folder happens instantly in the UI. Network requests resolve silently.

---

## 6. Empty States

**Never display dead ends.**

- **No Documents:** "Upload documents to begin analysis. `Cmd + U`"
- **No Evidence:** "No claims detected yet. Ask a question or highlight text in the Data Room."
- **No Questions:** "Draft your first diligence question. `Cmd + N`"
- **Philosophy:** Every empty state must have a primary action button and its associated keyboard shortcut prominently displayed.

---

## 7. Error Philosophy

**Radical transparency.**

- **AI Unavailable:** "Reasoning Engine disconnected. Reconnecting in 3s."
- **Parsing Failed:** "Failed to parse [Filename.pdf]. The document is encrypted." (Provides a clear 'Replace File' action).
- **Contradiction Detected (Logical Error):** "Warning: Q2 Revenue claim conflicts with Appendix B." 
- **Design:** Errors use `accent-danger` strictly for destructive/unrecoverable failures, and `accent-warning` for recoverable data anomalies.

---

## 8. Keyboard Language

**The keyboard is the analyst's primary tool.**

- **Global:**
  - `Cmd + K`: Command Palette (Omni-search, actions)
  - `Cmd + ,`: Settings
  - `Cmd + \`: Toggle Sidebar
- **Project:**
  - `1`, `2`, `3`: Switch between Workspace, Data Room, Memo
- **Evidence / Questions:**
  - `J` / `K`: Move selection down/up the evidence list
  - `Enter`: Expand selected evidence card
  - `Space`: Quick-preview the source document in a modal
  - `Cmd + C`: Copy citation in memo-ready format

---

## 9. Evidence Language

**The core atomic unit of Mosaic.**

- **Hover:** Hovering an evidence card gently highlights the source document in the adjacent panel.
- **Click:** Clicking locks the source document to that exact page and sentence, briefly flashing the sentence background in yellow (`bg-accent-warning`).
- **Trace:** Every piece of evidence has a visible path (Document -> Page -> Paragraph -> Claim).
- **Contradictions:** If two pieces of evidence disagree, they visually snap together under a red "Contradiction" header, forcing the analyst to resolve them.
- **Confidence:** A subtle pill indicator (High/Med/Low) sits at the top right of the card. Low confidence dims the text slightly to visually downgrade its authority.

---

## 10. Questions Language

**A linear, forensic progression.**

1. **Question:** The user types a question.
2. **Reasoning:** A subdued, italicized block where the AI "thinks out loud" (e.g., *Scanning Q3 transcripts for EBITDA adjustments...*).
3. **Evidence:** Concrete quotes appear as cards. 
4. **Missing Information:** If evidence is lacking, a gray dotted-border card appears stating exactly what is missing.
5. **Recommendation:** A synthesized, copy-pasteable finding. 
6. **Add to Memo:** A single button `[Add to Memo]` floats at the bottom.

---

## 11. Memo Language

**A living document wired to the truth.**

- **Inline Citations:** Rendered as small, interactive chips (e.g., `[1]`). 
- **Hover Previews:** Hovering `[1]` opens a `250px` popover displaying the exact source quote and page number without leaving the editor.
- **Dragging:** Dragging an evidence card from the left panel into the Memo automatically converts it into synthesized text + an inline citation.
- **Source Tracking:** Deleting the underlying document flags the citation in the Memo in red, breaking the chain of evidence visibly.

---

## 12. Signature Interaction: "The Evidence Trace"

**The interaction that makes Mosaic iconic.**

Whenever an analyst holds down the **`Option` (⌥)** key, the UI enters **Trace Mode**. 
- The background slightly dims.
- Every claim, metric, and synthesized finding in the Memo or Questions panel illuminates.
- Faint, glowing bezier curves draw themselves across the screen, physically connecting the claims on the left to their exact source paragraphs in the PDF viewer on the right. 
- Clicking any highlighted claim while holding `Option` instantly teleports the PDF viewer to that exact page and sentence, completely bypassing traditional navigation.
- **Purpose:** It physically manifests the core product principle: *One click to truth.*

---

## 13. Product Personality

**Mosaic is a Senior Investment Professional.**

- **Tone:** Precise, unembellished, highly calibrated. 
- **Voice:** Never conversational. Never says "I think", "I'm sorry", or "Here is what I found!". 
- **Uncertainty:** It does not guess. If it doesn't know, it states: *"Insufficient evidence to determine market share."*
- **Warnings:** *"Discrepancy detected: Management presentation states $4M; Audited financials state $3.2M."*
- **Confirmation:** Silent. Success is the absence of friction. No "Success!" toast when saving—just the visual reflection of the saved state.
