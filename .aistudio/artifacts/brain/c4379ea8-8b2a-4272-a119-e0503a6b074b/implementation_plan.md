# KBridge Built-In Guides & Documentation Engine

A comprehensive built-in documentation and guide system integrated into the KBridge Institutional Portal. It provides an Admin Guide Management Console (blog-style CMS to create, edit, delete, tag, and publish guides with live Markdown preview) alongside a clean, dedicated public Guides & Docs experience with category sidebar navigation and clean technical typography.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design choices were confirmed during Phase 1 clarification:

- **Typography & Font Strategy**: Uses **Inter** for clean body text and UI labels, paired with **JetBrains Mono** for technical code snippets, Hedera addresses, dates, and tabular metadata.
- **Admin CMS Capabilities**: Full-featured Markdown editor with real-time side-by-side preview, category & tag assignment, and a Draft vs. Published status workflow.
- **Navigation & Access**: Integrated as a dedicated **"Guides & Docs"** top-level navigation tab for all portal roles, with an interactive category sidebar and instant full-text search.

---

## 1. Overview & Core Concept

### What It Does
1. **Public / Partner Guides View**: A dedicated documentation center accessible to Capital Partners, Originating Partners, and Protocol Governance. Allows partners to browse operational guides, institutional onboarding steps, smart contract specifications, and redemption workflows structured by category with live search.
2. **KBridge Admin Guide Console**: A blog-style CMS available inside the KBridge Admin workspace. Admins can create new guides, edit existing drafts or published guides, organize categories, delete outdated guides, and toggle publishing state.

### Key Value
Institutional partners gain instant, in-app access to verified protocol documentation and legal operating procedures, while KBridge Administrators gain full control over protocol guides directly within the portal without external CMS dependencies.

---

## 2. User Experience & Visual Design

### Key User Flows

#### Flow A: Admin Managing Guides (CMS Blog Admin)
1. **Access**: Logged in as KBridge Admin (`admin@kbridge.io`), navigate to the **Admin Pipeline** or **Guides & Docs** view and switch to "Admin CMS Mode".
2. **Guide List & Filters**: View a structured table of all guides with indicators for Status (*Published* / *Draft*), Category, Author, Last Updated, and Read Time.
3. **Editor Modal / Panel**:
   - Click "Create New Guide" or "Edit" on an existing entry.
   - Enter **Title**, **Slug**, **Category**, **Summary**, **Read Time**, and **Status** (*Draft* / *Published*).
   - Write content using Markdown with a live **Split-View Markdown Preview**.
   - Save as Draft or Publish directly to the portal.
4. **Delete / Archive**: Click "Delete" with confirmation modal to safely remove outdated guides.

#### Flow B: Partner Reading Guides (Public Knowledge Base)
1. **Access**: Any signed-in partner (Capital, Originator, or Admin) clicks **"Guides & Docs"** in the top navigation bar.
2. **Category Sidebar & Search**: Browse by category (e.g. *Protocol Onboarding*, *Capital Minting*, *Redemption & Settlement*, *Hedera Custody*, *Fees & Yield*) or search via search bar.
3. **Reading View**:
   - Clean single-column reader or split-sidebar layout.
   - Unboxed metadata (Author · Date · Category · Read time).
   - Styled Markdown elements: headings, code blocks with copy buttons, callout boxes, ordered steps, and tables.
   - Related articles links at the bottom.

---

### Visual Identity & Theme

- **Aesthetic Direction**: Crisp, institutional fintech documentation aesthetic matching KBridge (`#141413` dark slate accents, `#0F172A` admin navy, `#F6F6F4` warm neutral canvas).
- **Typography & Scale**:
  - Headings & Titles: `Inter` semi-bold (`font-weight: 600`), negative letter-spacing (`letter-spacing: -0.02em`).
  - Body Prose: `Inter` 14px/15px with relaxed line-height (1.6) and comfortable line length (65-75ch max measure).
  - Code & Data: `JetBrains Mono` for code blocks, inline code, transaction hashes, timestamps, and address chips.
- **Metadata Discipline**:
  - No static pill sandwiches. Metadata renders as clean unboxed inline text with typographic dot separators: `Capital Minting · 4 min read · Updated Sep 2026`.
  - Category buttons in the sidebar act as clean segmented filters with subtle active background states (`var(--neutral-bg)` / `var(--ink)`).

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Built-In Markdown CMS Engine vs. External CMS
- **Chosen Approach**: Native client-side Markdown parser and state store integrated directly into KBridge state (`S.guides`) with `localStorage` fallback persistence.
- **Why**: Eliminates third-party API dependencies, maintains zero network latency for instantaneous live previews, and keeps all protocol guides self-contained inside the applet.

### Decision 2: Seed Guide Library
- **Chosen Approach**: Seed KBridge on first load with 4 comprehensive, production-grade institutional guides:
  1. *Institutional Capital Partner Onboarding & Treasury Minting* (Capital)
  2. *Originating Partner Receivables Assignment & Contract Uploads* (Originator)
  3. *Redemption Mechanics & Hedera Token Burn Protocols* (Settlement)
  4. *Kunda Box Administration Fees & Daily Accrual Statements* (Fees)
- **Why**: Delivers an immediate rich reading experience rather than an empty placeholder screen.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KBridge App State (S)                           │
│  S.guides = [ { id, slug, title, category, summary, content, ... } ]   │
└────────────────────────────────────────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│     Guides Reader View       │        │     Admin Guide CMS View     │
│  - Category Sidebar          │        │  - Guide Directory Table     │
│  - Real-Time Search          │        │  - Markdown Editor           │
│  - Rendered Markdown Viewer  │        │  - Side-by-Side Live Preview │
│  - Table of Contents Links   │        │  - Publish / Draft Toggle    │
└──────────────────────────────┘        └──────────────────────────────┘
```

### Data Model (`Guide` Entity)
```typescript
interface Guide {
  id: string;            // e.g. "GUIDE-2026-001"
  slug: string;          // e.g. "capital-partner-onboarding"
  title: string;         // "Institutional Capital Partner Onboarding"
  category: string;      // "Capital Minting" | "Receivables" | "Hedera Custody" | "Fees & Statements"
  summary: string;        // Brief 1-2 sentence excerpt
  content: string;        // Full Markdown prose
  status: 'Published' | 'Draft';
  author: string;         // e.g. "KBridge Protocol Governance"
  readTime: string;       // e.g. "5 min read"
  createdAt: string;      // Date string
  updatedAt: string;      // Date string
}
```

### File Structure & Module Division
- **`src/guides.js`**: Core module containing guide data structures, seed guides, local persistence, lightweight Markdown parser, rendering logic for both Public Reader and Admin CMS Editor, and modal dialog handlers.
- **`src/app.js`**: Top navigation integration (`['guides', 'Guides & Docs']`), route handler for `S.view === 'guides'`, and event dispatchers for guide creation/editing/deletion.
