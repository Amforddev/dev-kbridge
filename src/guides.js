import { ic, spinner, dshort, TODAY, esc, short, uid, renderPaginationControls, selectBox } from './helpers.js';

/* ============================================================
   KBridge Built-in Protocol Documentation & Guide System
   Design System Compliance:
   - Typography: "Inter" for all titles, headings, and body prose.
   - Code/Math/Tokens: "JetBrains Mono" for formulas, IDs, and hashes.
   - Zero-Pill Discipline: Unboxed metadata with typographic separators (·).
   - Document Editor: Visual WYSIWYG editor without raw HTML code.
   - Category Management: Dynamic category taxonomy in CMS & editor.
   ============================================================ */

const STORAGE_KEY = 'kbridge_guides_v3';
const CATS_STORAGE_KEY = 'kbridge_guide_categories_v3';

export const DEFAULT_CATEGORIES = [
  { name: 'Capital Partners', sub: 'Allocation, minting & NAV' },
  { name: 'Originating Partners', sub: 'Promissory notes & invoices' },
  { name: 'Kunda Box Fees', sub: '2.25% daily accrual & statement' },
  { name: 'Security & Infrastructure', sub: 'Hedera HTS, multi-sig & custody' },
  { name: 'Protocol Admin', sub: 'Inspection & governance' }
];

export const INITIAL_GUIDES = [
  {
    id: 'guide-capital-lifecycle',
    slug: 'capital-allocation-lifecycle',
    title: 'KBridge Capital Allocation & Token Minting Lifecycle',
    category: 'Capital Partners',
    author: 'KBridge Protocol Governance',
    readTime: '5 min read',
    lastUpdated: 'Nov 06, 2026',
    status: 'published',
    excerpt: 'Comprehensive walkthrough of institutional capital commitment in USDC, promissory note execution, Hedera Token Service (HTS) minting, and wallet delivery.',
    content: `
      <h2>01. Executive Overview</h2>
      <p>KBridge enables institutional capital partners to allocate USDC liquidity directly into vetted receivables platforms (Pursuit, Wayflyer, and Credix) on the Hedera network. Each capital allocation is legally collateralized by promissory notes and executed through automated token minting workflows.</p>

      <figure class="guide-diagram" contenteditable="false">
        <img src="/assets/lockup-on-light.svg" alt="KBridge Capital Flow" style="max-height:64px;margin:12px auto;display:block" />
        <figcaption class="guide-caption">Figure 1.1: End-to-end atomic execution from capital ticket to Hedera Token Service settlement.</figcaption>
      </figure>

      <h2>02. Step-by-Step Procedure for Capital Partners</h2>
      <div class="guide-steps">
        <div class="guide-step">
          <div class="step-num">01</div>
          <div class="step-content">
            <h4>Select Target Receivables Platform</h4>
            <p>From the Capital Partner Dashboard, evaluate the current Net Asset Value (NAV), historical yield trajectory, and underlying facility maturity dates across Pursuit, Wayflyer, and Credix.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">02</div>
          <div class="step-content">
            <h4>Specify Allocation Amount &amp; Funding Wallet</h4>
            <p>Click <b>Request to Mint</b>, enter your USDC commitment, and select your registered corporate funding wallet. The system computes estimated target tokens based on current NAV.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">03</div>
          <div class="step-content">
            <h4>Automated Originator Notification</h4>
            <p>KBridge registers your request under status <code>Awaiting Originating Partner</code>. The assigned originating platform signatory is immediately alerted to execute and upload signed promissory notes.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">04</div>
          <div class="step-content">
            <h4>Protocol Admin Verification &amp; Hedera Token Mint</h4>
            <p>Once legal notes are signed and SHA-256 hashes verified, KBridge Protocol Administrators complete the cryptographic mint on Hedera Mainnet, depositing platform tokens directly into your Token Custody Wallet.</p>
          </div>
        </div>
      </div>

      <h2>03. Mathematical Formulas &amp; NAV Discipline</h2>
      <p>Tokens minted reflect the continuous NAV accrual of the platform receivables portfolio:</p>
      <div class="guide-formula">
        <code>Target Tokens = Committed USDC Amount / Current Platform NAV</code>
      </div>
      <p>Redemptions and yield accruals are calculated on a transparent 365-day basis, settled atomically in USDC upon note maturity.</p>

      <div class="callout c-neutral">
        <div style="font-size:13px;line-height:1.55">
          <b>Governance Note:</b> All minted tokens are non-rebasing ERC-20 compatible representations deployed on the Hedera Token Service (HTS). Each token unit is backed 1:1 by audited institutional promissory notes held in escrow.
        </div>
      </div>
    `
  },
  {
    id: 'guide-originator-notes',
    slug: 'originator-promissory-note-workflow',
    title: 'Originating Partner Promissory Note & Legal Document Workflow',
    category: 'Originating Partners',
    author: 'KBridge Protocol Governance',
    readTime: '6 min read',
    lastUpdated: 'Nov 06, 2026',
    status: 'published',
    excerpt: 'How receivables originators review capital allocations, generate and sign senior secured promissory notes, and submit invoices for Admin inspection.',
    content: `
      <h2>01. Originating Partner Obligations</h2>
      <p>Originating partners (e.g. Pursuit Receivables SPV I, Wayflyer eCommerce SPV IV, Credix Auto Fin SPV II) act as the credit underwriting conduit. When a capital partner commits funds, the originator must pledge underlying senior secured invoice contracts and execute formal promissory notes.</p>

      <h2>02. Note Submission Lifecycle</h2>
      <div class="guide-steps">
        <div class="guide-step">
          <div class="step-num">01</div>
          <div class="step-content">
            <h4>Review Note Request in the Originator Portal</h4>
            <p>Navigate to <b>Note Requests</b> tab. Active requests will show status <code>Awaiting Originator</code> or <code>Notes Requested</code>, highlighting the requested USDC amount, facility sector, and required legal annexes.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">02</div>
          <div class="step-content">
            <h4>Generate &amp; Execute Senior Secured Promissory Note</h4>
            <p>Download the pre-populated KBridge institutional promissory note template containing the unique Allocation ID, lender SPV details, and interest terms. Execute the document with authorized corporate signatories.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">03</div>
          <div class="step-content">
            <h4>Upload Contract &amp; SHA-256 Checksum Verification</h4>
            <p>Click <b>Upload Signed Notes</b>. Attach the signed PDF agreement, invoice schedules, and corporate authorization certificate. The portal automatically computes a SHA-256 cryptographic hash and anchors the document metadata.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">04</div>
          <div class="step-content">
            <h4>Admin Inspection &amp; Funding Wallet Receipt</h4>
            <p>Protocol governance reviews document authenticity. Upon approval, token minting completes, and the allocated USDC principal is transferred directly to your designated Originator Funding Wallet.</p>
          </div>
        </div>
      </div>

      <figure class="guide-diagram" contenteditable="false">
        <img src="/assets/bridge-amber.svg" alt="Promissory Note Verification Flow" style="max-height:64px;margin:12px auto;display:block" />
        <figcaption class="guide-caption">Figure 2.1: Legal note verification pipeline and Hedera consensus registration.</figcaption>
      </figure>
    `
  },
  {
    id: 'guide-kunda-box-fees',
    slug: 'kunda-box-fee-mechanics',
    title: 'Kunda Box Administration Fees & Monthly Statement Reconciliation',
    category: 'Kunda Box Fees',
    author: 'KBridge Protocol Governance',
    readTime: '4 min read',
    lastUpdated: 'Nov 06, 2026',
    status: 'published',
    excerpt: 'Detailed mathematical formula and statement policy for Kunda Box 2.25% per annum protocol fees calculated per active day and reconciled monthly.',
    content: `
      <h2>01. Fee Structure &amp; Rationale</h2>
      <p>Kunda Box operates as the legal structuring and custody coordination layer within KBridge. For managing ongoing SPV compliance, custody verification, and note lifecycle administration, an annualized administration fee of <b>2.25%</b> applies to all capital allocated to originating partners.</p>

      <h2>02. Continuous Daily Accrual Formula</h2>
      <p>Fees accrue on a day-count basis of <code>365 days per year</code>. Each facility begins accruing immediately upon token minting and wallet transfer completion:</p>
      
      <div class="guide-formula">
        <code>Accrued Fee = Allocated Capital × (2.25% / 365) × Days Elapsed</code>
      </div>

      <div class="guide-table-wrap">
        <table class="guide-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Parameter Value</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Annual Fee Rate</code></td>
              <td class="mono">2.2500% (0.0225)</td>
              <td>Protocol governance approved base administration rate</td>
            </tr>
            <tr>
              <td><code>Daily Accrual Factor</code></td>
              <td class="mono">0.006164% / day</td>
              <td>Base rate divided by standard 365 calendar days</td>
            </tr>
            <tr>
              <td><code>Accrual Trigger</code></td>
              <td class="mono">Minted &amp; Transferred</td>
              <td>Item registered when capital enters originator wallet</td>
            </tr>
            <tr>
              <td><code>Reconciliation Cycle</code></td>
              <td class="mono">Monthly Statement</td>
              <td>Active duration tracked by total elapsed days &amp; months</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>03. Official Statement Reporting</h2>
      <p>Originating partners can inspect their active liabilities under the <b>Kunda Box Fees</b> portal tab. The screen renders a statement ledger displaying active allocations, elapsed duration in both calendar days and fractional months (e.g. <code>42 days active (1.4 mos)</code>), and cumulative fee amounts owed.</p>
    `
  },
  {
    id: 'guide-hedera-governance',
    slug: 'hedera-token-custody-governance',
    title: 'Hedera Token Service (HTS) Custody & Multi-Sig Governance',
    category: 'Security & Infrastructure',
    author: 'KBridge Protocol Governance',
    readTime: '5 min read',
    lastUpdated: 'Nov 06, 2026',
    status: 'published',
    excerpt: 'Enterprise custody architecture on Hedera Mainnet, cryptographic multi-signature keys, smart contract whitelisting, and receipt auditability.',
    content: `
      <h2>01. Institutional Distributed Ledger Architecture</h2>
      <p>KBridge is architected natively on Hedera Mainnet, leveraging the <b>Hedera Token Service (HTS)</b> and <b>Hedera Consensus Service (HCS)</b>. Unlike public EVM chains with variable gas markets, Hedera provides fixed micro-cent transaction fees and predictable sub-second finality.</p>

      <h2>02. Security &amp; Custody Principles</h2>
      <div class="guide-steps">
        <div class="guide-step">
          <div class="step-num">01</div>
          <div class="step-content">
            <h4>Multi-Signature Governance Keys</h4>
            <p>HTS supply keys and minting capabilities are governed by a 3-of-5 threshold multi-sig held across institutional custodian signatories and protocol administrators.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">02</div>
          <div class="step-content">
            <h4>Whitelisted Partner Wallets</h4>
            <p>Only corporate signatory wallets that have completed verified KYC/AML through the Sign-up Approval Queue are permitted to associate and receive token allocations.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">03</div>
          <div class="step-content">
            <h4>Immutable Consensus Audit Trails</h4>
            <p>Every note upload, admin approval, and token mint event generates a verifiable consensus timestamp on Hedera, creating a tamper-proof audit trail for regulatory examinations.</p>
          </div>
        </div>
      </div>
    `
  }
];

/* ---------- LocalStorage Data Access ---------- */

export function getCategories() {
  try {
    const raw = localStorage.getItem(CATS_STORAGE_KEY);
    let cats = [];
    if (raw) {
      cats = JSON.parse(raw);
    } else {
      cats = [...DEFAULT_CATEGORIES];
      localStorage.setItem(CATS_STORAGE_KEY, JSON.stringify(cats));
    }
    const guides = getGuides();
    guides.forEach(g => {
      if (g.category && !cats.some(c => c.name.toLowerCase() === g.category.toLowerCase())) {
        cats.push({ name: g.category, sub: 'Custom Category' });
      }
    });
    return cats;
  } catch (e) {
    return DEFAULT_CATEGORIES;
  }
}

export function addCategory(name, sub = 'Custom Category') {
  const clean = (name || '').trim();
  if (!clean) return null;
  const cats = getCategories();
  const existing = cats.find(c => c.name.toLowerCase() === clean.toLowerCase());
  if (existing) return existing;
  const newCat = { name: clean, sub: (sub || '').trim() || 'Custom Category' };
  cats.push(newCat);
  try {
    localStorage.setItem(CATS_STORAGE_KEY, JSON.stringify(cats));
  } catch (e) {
    console.error('Failed to save category', e);
  }
  return newCat;
}

export function deleteCategory(name) {
  const cats = getCategories().filter(c => c.name.toLowerCase() !== name.toLowerCase());
  try {
    localStorage.setItem(CATS_STORAGE_KEY, JSON.stringify(cats));
  } catch (e) {}
  return cats;
}

export function getGuides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GUIDES));
      return INITIAL_GUIDES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : INITIAL_GUIDES;
  } catch (e) {
    return INITIAL_GUIDES;
  }
}

export function saveGuides(guides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guides));
  } catch (e) {
    console.error('Failed to save guides', e);
  }
}

export function getGuideById(id) {
  const guides = getGuides();
  return guides.find(g => g.id === id || g.slug === id) || guides[0] || null;
}

export function saveGuide(guideData) {
  const guides = getGuides();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  if (guideData.id) {
    const idx = guides.findIndex(g => g.id === guideData.id);
    if (idx !== -1) {
      guides[idx] = {
        ...guides[idx],
        ...guideData,
        lastUpdated: dateStr
      };
      saveGuides(guides);
      return guides[idx];
    }
  }

  const newId = 'guide-' + Date.now().toString(36);
  const newGuide = {
    id: newId,
    slug: (guideData.title || 'guide').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    author: guideData.author || 'KBridge Protocol Governance',
    lastUpdated: dateStr,
    status: guideData.status || 'published',
    readTime: guideData.readTime || '4 min read',
    ...guideData
  };
  guides.unshift(newGuide);
  saveGuides(guides);
  return newGuide;
}

export function deleteGuide(id) {
  const guides = getGuides();
  const filtered = guides.filter(g => g.id !== id);
  saveGuides(filtered);
  return filtered;
}

/* ============================================================
   View 1: User-Facing Built-in Guide Reader
   Menus, navigation, structured typography, diagrams, and TOC
   ============================================================ */

export function viewGuideCatalog(S, ctx) {
  const guides = getGuides().filter(g => g.status === 'published' || S.org === 'kbridge');
  const selectedId = S.selectedGuideId || (guides[0] ? guides[0].id : null);
  const activeGuide = guides.find(g => g.id === selectedId) || guides[0];

  if (!activeGuide) {
    return `
      <div class="guide-calm-wrap">
        <div class="card card-pad" style="text-align:center;padding:64px 20px">
          <div style="color:var(--muted);margin-bottom:12px">${ic('book', 'icon-lg')}</div>
          <h3 style="font-size:16px;font-weight:600">No guides found</h3>
          <p class="muted" style="font-size:13px;margin-top:6px">No documentation articles have been published yet.</p>
        </div>
      </div>
    `;
  }

  // Design system dropdown options without subtitles (clean, minimalist)
  const guideOptions = guides.map(g => ({
    v: g.id,
    label: g.title
  }));

  const topicDropdown = selectBox('guideTopicSelect', guideOptions, activeGuide.id, (chosenId) => {
    S.selectedGuideId = chosenId;
    if (window.render) window.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  return `
    <div class="guide-calm-wrap fadein">
      <div class="guide-calm-card">
        <!-- Minimalist Topic Dropdown Menu without subtitles -->
        <div style="margin-bottom:22px">
          <label class="field" style="margin:0">
            <span style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:0.04em;text-transform:uppercase">Topic</span>
            ${topicDropdown}
          </label>
        </div>

        <!-- Guide Title -->
        <h1 style="font-size:24px;font-weight:600;letter-spacing:-.02em;color:var(--ink);margin:0 0 16px">
          ${esc(activeGuide.title)}
        </h1>

        <!-- Serene, clear Description -->
        <div class="guide-desc-box" style="margin:0 0 28px">
          <p class="guide-desc-text">
            ${esc(activeGuide.excerpt)}
          </p>
        </div>

        <!-- Smooth, distraction-free Guide Prose -->
        <div class="guide-prose">
          ${activeGuide.content}
        </div>

        ${S.org === 'kbridge' ? `
          <div style="text-align:center;margin-top:36px;padding-top:16px;border-top:1px solid var(--line-soft)">
            <button class="btn btn-quiet btn-xs" data-act="view" data-view="guides-admin" style="font-size:11.5px;color:var(--muted)">
              ${ic('pencil', 'icon-xs')} Open in Guide CMS (Admin)
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/* ============================================================
   View 2: Admin Guide CMS (Blog Admin - Add/Delete/Edit)
   ============================================================ */

export function viewGuideAdminCMS(S, ctx) {
  const guides = getGuides();
  const publishedCount = guides.filter(g => g.status === 'published').length;
  const draftCount = guides.filter(g => g.status === 'draft').length;
  const categories = getCategories();

  const adminQuery = (S.guideAdminQuery || '').toLowerCase().trim();
  const adminFilter = S.guideAdminFilter || 'all';

  const filtered = guides.filter(g => {
    const matchStatus = adminFilter === 'all' || g.status === adminFilter;
    const matchQuery = !adminQuery || g.title.toLowerCase().includes(adminQuery) || g.category.toLowerCase().includes(adminQuery);
    return matchStatus && matchQuery;
  });

  const page = (S.pagination && S.pagination.guides) || 1;
  const perPage = 5;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIdx = (safePage - 1) * perPage;
  const pageItems = filtered.slice(startIdx, startIdx + perPage);

  const rows = pageItems.map(g => {
    const isPub = g.status === 'published';
    const statusBadge = isPub 
      ? `<span class="badge b-green"><span class="dot"></span>Published</span>`
      : `<span class="badge b-amber"><span class="dot"></span>Draft</span>`;

    return `
      <tr class="hover-row">
        <td>
          <div style="font-weight:600;font-size:13.5px;color:var(--ink)">${esc(g.title)}</div>
          <div class="faint" style="font-size:11.5px;margin-top:2px;max-width:380px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(g.excerpt || '')}</div>
        </td>
        <td>
          <span class="partner-pill" style="font-size:11.5px;padding:4px 10px">${esc(g.category)}</span>
        </td>
        <td>${statusBadge}</td>
        <td class="mono" style="font-size:12px">${esc(g.readTime || '4 min read')}</td>
        <td class="mono" style="font-size:12px">${esc(g.lastUpdated)}</td>
        <td class="t-right">
          <div class="row gap6" style="justify-content:flex-end">
            <button class="btn btn-ghost btn-sm" data-act="guide-preview-admin" data-id="${g.id}" title="Read Guide">
              ${ic('book', 'icon-xs')} Read
            </button>
            <button class="btn btn-ghost btn-sm" data-act="guide-edit" data-id="${g.id}" title="Edit Guide">
              ${ic('pencil', 'icon-xs')} Edit
            </button>
            <button class="btn btn-ghost btn-sm" style="color:var(--bad)" data-act="guide-delete-confirm" data-id="${g.id}" title="Delete Guide">
              ${ic('trash', 'icon-xs')}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('') || `<tr><td colspan="6" style="text-align:center;padding:40px" class="muted">No guides found matching your search.</td></tr>`;

  return `
    <div class="page-head" style="margin-bottom:20px">
      <div>
        <h1 style="font-size:23px;font-weight:600;letter-spacing:-.02em">Guide Management &amp; Content CMS</h1>
        <p class="muted" style="font-size:13.5px;margin-top:4px">Author, publish, edit, and maintain protocol documentation and user manuals across KBridge.</p>
      </div>
      <div class="row gap8">
        <button class="btn btn-ghost" data-act="view" data-view="guide">
          ${ic('book', 'icon-sm')} View Live Documentation
        </button>
        <button class="btn btn-ghost" data-act="guide-cat-manage">
          ${ic('plus', 'icon-sm')} Manage Categories
        </button>
        <button class="btn btn-primary" data-act="guide-create">
          ${ic('plus', 'icon-sm')} Create New Guide
        </button>
      </div>
    </div>

    <!-- CMS Overview Stats -->
    <div class="stats" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr))">
      <div class="card card-pad stat">
        <div class="label">${ic('book', 'icon-sm')} Total Guides</div>
        <div class="value mono">${guides.length}</div>
        <div class="sub">Across ${categories.length} protocol categories</div>
      </div>
      <div class="card card-pad stat">
        <div class="label">${ic('check', 'icon-sm')} Published</div>
        <div class="value mono">${publishedCount}</div>
        <div class="sub">Live to Capital &amp; Originators</div>
      </div>
      <div class="card card-pad stat">
        <div class="label">${ic('pencil', 'icon-sm')} Drafts</div>
        <div class="value mono ${draftCount ? 'warn' : ''}">${draftCount}</div>
        <div class="sub">Pending protocol review</div>
      </div>
      <div class="card card-pad stat">
        <div class="label">${ic('layers', 'icon-sm')} Categories</div>
        <div class="value mono">${categories.length}</div>
        <div class="sub"><a href="#" data-act="guide-cat-manage" style="color:var(--ink);text-decoration:underline">+ Add new category</a></div>
      </div>
    </div>

    <!-- CMS Filter & Search Toolbar -->
    <div class="card" style="margin-bottom:24px">
      <div class="card-head">
        <div class="row gap12" style="flex:1;max-width:560px">
          <div style="position:relative;width:100%">
            <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--faint)">${ic('search', 'icon-xs')}</span>
            <input type="text" class="input input-sm" id="guideAdminSearch" placeholder="Search guides by title or category…" value="${esc(S.guideAdminQuery || '')}" style="padding-left:32px">
          </div>
        </div>
        <div class="range-tabs">
          <button class="${adminFilter === 'all' ? 'on' : ''}" data-act="guide-admin-filter" data-f="all">All (${guides.length})</button>
          <button class="${adminFilter === 'published' ? 'on' : ''}" data-act="guide-admin-filter" data-f="published">Published (${publishedCount})</button>
          <button class="${adminFilter === 'draft' ? 'on' : ''}" data-act="guide-admin-filter" data-f="draft">Drafts (${draftCount})</button>
        </div>
      </div>

      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Guide Title &amp; Excerpt</th>
              <th>Category</th>
              <th>Status</th>
              <th>Read Time</th>
              <th>Last Modified</th>
              <th class="t-right">Action</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
      ${renderPaginationControls(safePage, total, perPage, 'paginate-guides', 'Guides')}
    </div>
  `;
}

/* ============================================================
   View 3: Add / Edit Guide Modal (Google Docs / Medium style Editor)
   - Uses Design System Custom Select for Category & Status
   - Clean Document Canvas without raw HTML formatting
   - Inline Link & Image Adders with Presets
   - Inline ability to create new categories on the fly
   ============================================================ */

export function openGuideEditorModal(guideId, S, ctx) {
  const guide = guideId ? getGuideById(guideId) : null;
  const isEditing = !!guide;

  const defaultContent = isEditing ? guide.content : `
    <h2>01. Introduction</h2>
    <p>Provide an executive summary and purpose of this operational guide for institutional partners.</p>

    <h2>02. Step-by-Step Procedure</h2>
    <p>Follow these operational requirements to ensure complete protocol and legal compliance:</p>
    <ul>
      <li>Review the institutional facility terms and verification checklist.</li>
      <li>Confirm authorized signatory status and KYC verification timestamp.</li>
      <li>Execute the promissory note and verify Hedera multi-signature consensus.</li>
    </ul>

    <h2>03. Protocol Specifications</h2>
    <p>All transactions settle natively on the Hedera Token Service with continuous 365-day reconciliation.</p>
  `.trim();

  const title = isEditing ? guide.title : '';
  const currentCategory = isEditing ? guide.category : 'Capital Partners';
  const excerpt = isEditing ? guide.excerpt : '';
  const readTime = isEditing ? guide.readTime : '5 min read';
  const currentStatus = isEditing ? guide.status : 'published';

  const allCats = getCategories();
  const categoryOptions = allCats.map(c => ({
    v: c.name,
    label: c.name,
    sub: c.sub || ''
  }));

  const statusOptions = [
    { v: 'published', label: 'Published', sub: 'Live in portal for all partners' },
    { v: 'draft', label: 'Draft', sub: 'Visible only to administrators' }
  ];

  const modalHtml = `
    <div class="modal modal-wide" style="max-width:920px">
      <div class="modal-head">
        <div>
          <h2>${ic(isEditing ? 'pencil' : 'plus', 'icon-sm')} ${isEditing ? 'Edit Protocol Guide' : 'Create New Protocol Guide'}</h2>
          <p>Compose institutional documentation using the KBridge WYSIWYG document editor.</p>
        </div>
        <button class="btn btn-quiet btn-sm" data-act="close">${ic('x', 'icon-sm')}</button>
      </div>

      <div class="modal-body" style="gap:16px;max-height:82vh;overflow-y:auto">
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px">
          <label class="field">
            <span>Guide Title</span>
            <input class="input" type="text" id="edGuideTitle" value="${esc(title)}" placeholder="e.g. Originating Partner Promissory Note Execution">
          </label>
          <label class="field">
            <div class="between" style="margin-bottom:6px">
              <span style="font-size:13px;font-weight:500;color:var(--ink-2)">Category</span>
              <button type="button" class="btn btn-quiet btn-xs" data-act="editor-toggle-new-cat" style="color:var(--ink);font-weight:600;padding:2px 6px">
                ${ic('plus', 'icon-xs')} Add Category
              </button>
            </div>

            <!-- Inline New Category Box -->
            <div id="editorNewCatBox" class="hide" style="background:#FAFAF8;border:1px solid var(--line);border-radius:var(--r);padding:10px 12px;margin-bottom:10px">
              <div style="font-size:12px;font-weight:600;margin-bottom:6px">Create New Category:</div>
              <div class="row gap6">
                <input type="text" id="editorNewCatInput" class="input input-sm" placeholder="e.g. Treasury Operations" style="flex:1" />
                <button type="button" class="btn btn-primary btn-sm" data-act="editor-save-new-cat">Add &amp; Select</button>
                <button type="button" class="btn btn-quiet btn-sm" data-act="editor-cancel-new-cat">Cancel</button>
              </div>
            </div>

            <input type="hidden" id="edGuideCat" value="${esc(currentCategory)}" />
            ${ctx.selectBox('edGuideCatSel', categoryOptions, currentCategory, v => {
              const inp = document.getElementById('edGuideCat');
              if (inp) inp.value = v;
              const btn = document.querySelector('[data-sel="edGuideCatSel"] .sel-btn');
              const opt = categoryOptions.find(o => o.v === v);
              if (btn && opt) {
                btn.querySelector('.sel-lab').textContent = opt.label;
                const sub = btn.querySelector('.sel-sub');
                if (sub) sub.textContent = opt.sub || '';
              }
            })}
          </label>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label class="field">
            <span>Read Time</span>
            <input class="input" type="text" id="edGuideReadTime" value="${esc(readTime)}" placeholder="e.g. 5 min read">
          </label>
          <label class="field">
            <span>Publication Status</span>
            <input type="hidden" id="edGuideStatus" value="${esc(currentStatus)}" />
            ${ctx.selectBox('edGuideStatusSel', statusOptions, currentStatus, v => {
              const inp = document.getElementById('edGuideStatus');
              if (inp) inp.value = v;
              const btn = document.querySelector('[data-sel="edGuideStatusSel"] .sel-btn');
              const opt = statusOptions.find(o => o.v === v);
              if (btn && opt) {
                btn.querySelector('.sel-lab').textContent = opt.label;
                const sub = btn.querySelector('.sel-sub');
                if (sub) sub.textContent = opt.sub || '';
              }
            })}
          </label>
        </div>

        <label class="field">
          <span>Executive Excerpt (Brief Summary)</span>
          <textarea class="input" id="edGuideExcerpt" rows="2" placeholder="Summary of this guide shown in the directory…">${esc(excerpt)}</textarea>
        </label>

        <!-- WYSIWYG Document Editor (Google Docs style, Image 3) -->
        <label class="field">
          <span>Guide Article Content</span>
          <div class="doc-editor-box">
            <!-- Google Docs style toolbar -->
            <div class="doc-toolbar">
              <!-- Paragraph Format Style Dropdown -->
              <div class="row gap4">
                <button type="button" class="doc-tool-btn" data-act="doc-format" data-tag="p" title="Normal Body Text">Normal text</button>
                <button type="button" class="doc-tool-btn" data-act="doc-format" data-tag="h2" title="Large Section Heading">Heading 1</button>
                <button type="button" class="doc-tool-btn" data-act="doc-format" data-tag="h3" title="Medium Sub-heading">Heading 2</button>
              </div>

              <div class="doc-tool-sep"></div>

              <!-- Bold, Italic, Underline, Strikethrough -->
              <div class="row gap2">
                <button type="button" class="doc-tool-btn" data-act="doc-cmd" data-cmd="bold" title="Bold (Ctrl+B)"><b>B</b></button>
                <button type="button" class="doc-tool-btn" data-act="doc-cmd" data-cmd="italic" title="Italic (Ctrl+I)"><i>I</i></button>
                <button type="button" class="doc-tool-btn" data-act="doc-cmd" data-cmd="underline" title="Underline (Ctrl+U)"><u>U</u></button>
                <button type="button" class="doc-tool-btn" data-act="doc-cmd" data-cmd="strikeThrough" title="Strikethrough"><s>S</s></button>
              </div>

              <div class="doc-tool-sep"></div>

              <!-- Link & Image Insert -->
              <div class="row gap4">
                <button type="button" class="doc-tool-btn" data-act="doc-toggle-link" title="Insert Web or Protocol Link" style="gap:4px">
                  ${ic('bookmark', 'icon-xs')} Link
                </button>
                <button type="button" class="doc-tool-btn" data-act="doc-toggle-img" title="Insert Image or Diagram" style="gap:4px">
                  ${ic('image', 'icon-xs')} Image
                </button>
              </div>

              <div class="doc-tool-sep"></div>

              <!-- Lists & Blocks -->
              <div class="row gap2">
                <button type="button" class="doc-tool-btn" data-act="doc-cmd" data-cmd="insertUnorderedList" title="Bulleted List">• List</button>
                <button type="button" class="doc-tool-btn" data-act="doc-cmd" data-cmd="insertOrderedList" title="Numbered List">1. List</button>
                <button type="button" class="doc-tool-btn" data-act="doc-add-callout" title="Add Protocol Callout Card">💬 Callout</button>
                <button type="button" class="doc-tool-btn" data-act="doc-add-step" title="Add Step Card">+ Step</button>
                <button type="button" class="doc-tool-btn" data-act="doc-cmd" data-cmd="removeFormat" title="Clear Formatting">Tx</button>
              </div>
            </div>

            <!-- Inline Link Bar (appears when Link button clicked) -->
            <div id="docLinkBar" class="doc-inline-tool hide" style="background:#FAFAF8;border-bottom:1px solid var(--line);padding:10px 14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span style="font-size:12px;font-weight:600;color:var(--ink)">Insert Link:</span>
              <input type="text" id="docLinkText" class="input input-sm" placeholder="Link Text" style="max-width:180px">
              <input type="text" id="docLinkUrl" class="input input-sm" placeholder="https://… or /dash" style="flex:1;min-width:200px">
              <button type="button" class="btn btn-primary btn-sm" data-act="doc-apply-link">Apply</button>
              <button type="button" class="btn btn-quiet btn-sm" data-act="doc-cancel-link">Cancel</button>
            </div>

            <!-- Inline Image Inserter Bar (appears when Image button clicked) -->
            <div id="docImgBar" class="doc-inline-tool hide" style="background:#FAFAF8;border-bottom:1px solid var(--line);padding:14px 16px">
              <input type="file" id="docImgFileInput" accept="image/*" style="display:none">
              <div class="between" style="margin-bottom:10px">
                <div class="row gap8">
                  <span style="font-size:12.5px;font-weight:600;color:var(--ink)">Insert Image or Diagram</span>
                  <span class="faint" style="font-size:11px">· From Device or URL</span>
                </div>
                <button type="button" class="btn btn-quiet btn-xs" data-act="doc-cancel-img">${ic('x','icon-xs')}</button>
              </div>

              <!-- Device Upload Drop Area & URL Row -->
              <div style="display:grid;grid-template-columns:auto 1fr;gap:10px;margin-bottom:10px;align-items:center">
                <button type="button" class="btn btn-primary btn-sm" data-act="doc-browse-device-img" style="gap:6px;white-space:nowrap">
                  ${ic('upload', 'icon-xs')} Choose from Device…
                </button>
                <input type="text" id="docImgUrl" class="input input-sm" placeholder="Or paste image URL (https://… or /assets/…)">
              </div>

              <!-- Device Upload Preview Thumbnail (shown when image selected from device) -->
              <div id="docDevicePreviewWrap" class="hide" style="margin-bottom:10px;padding:8px 12px;background:#FFFFFF;border:1px solid var(--line);border-radius:var(--r);display:flex;align-items:center;justify-content:space-between">
                <div class="row gap10" style="align-items:center;min-width:0">
                  <img id="docDeviceThumb" src="" alt="Thumbnail" style="width:38px;height:38px;border-radius:4px;object-fit:cover;border:1px solid var(--line)" />
                  <div style="min-width:0">
                    <div id="docDeviceFileName" style="font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">image.png</div>
                    <div id="docDeviceFileSize" class="faint mono" style="font-size:11px">Ready to insert</div>
                  </div>
                </div>
                <button type="button" class="btn btn-quiet btn-xs" data-act="doc-clear-device-img" style="color:var(--bad)">Remove</button>
              </div>

              <div class="row gap8" style="margin-bottom:10px">
                <input type="text" id="docImgCaption" class="input input-sm" placeholder="Image Caption (e.g. Figure 1: Operational Workflow)" style="flex:1">
              </div>

              <div class="between" style="flex-wrap:wrap;gap:8px">
                <div class="row gap6">
                  <span class="faint" style="font-size:11px">Presets:</span>
                  <button type="button" class="btn btn-ghost btn-xs" data-act="doc-preset-img" data-url="/assets/lockup-on-light.svg" data-caption="KBridge Protocol Overview">Brand Lockup</button>
                  <button type="button" class="btn btn-ghost btn-xs" data-act="doc-preset-img" data-url="/assets/token-primary.svg" data-caption="Receivables Token Architecture">Token Architecture</button>
                  <button type="button" class="btn btn-ghost btn-xs" data-act="doc-preset-img" data-url="/assets/icon-amber-round.svg" data-caption="Hedera Custody Shield">Hedera Custody</button>
                </div>
                <div class="row gap6">
                  <button type="button" class="btn btn-ghost btn-sm" data-act="doc-cancel-img">Cancel</button>
                  <button type="button" class="btn btn-primary btn-sm" data-act="doc-apply-img">Insert Image</button>
                </div>
              </div>
            </div>

            <!-- Clean visual document canvas (NO raw HTML visible) -->
            <div id="edGuideCanvas" class="doc-canvas" contenteditable="true" spellcheck="true" placeholder="Start typing your guide article here…">${defaultContent}</div>
          </div>
        </label>
      </div>

      <div class="modal-foot">
        <button class="btn btn-ghost" data-act="close">Cancel</button>
        <button class="btn btn-primary" data-act="guide-save" data-id="${isEditing ? guide.id : ''}">
          ${ic('check', 'icon-sm')} ${isEditing ? 'Save Changes' : 'Publish Guide'}
        </button>
      </div>
    </div>
  `;

  ctx.openModal(modalHtml);
}

/* ============================================================
   View 4: Manage Categories Modal
   ============================================================ */

export function openGuideCategoryModal(S, ctx) {
  const cats = getCategories();
  const guides = getGuides();

  const catRows = cats.map(c => {
    const count = guides.filter(g => g.category.toLowerCase() === c.name.toLowerCase()).length;
    const isDefault = DEFAULT_CATEGORIES.some(d => d.name.toLowerCase() === c.name.toLowerCase());
    return `
      <div class="row between" style="padding:10px 14px;border-bottom:1px solid var(--line-soft)">
        <div>
          <div style="font-weight:600;font-size:13.5px">${esc(c.name)}</div>
          <div class="faint" style="font-size:11.5px">${esc(c.sub || '')}</div>
        </div>
        <div class="row gap8">
          <span class="mono faint" style="font-size:12px">${count} ${count === 1 ? 'guide' : 'guides'}</span>
          ${!isDefault && count === 0 ? `
            <button class="btn btn-quiet btn-xs" style="color:var(--bad)" data-act="guide-cat-del" data-name="${esc(c.name)}" title="Delete Category">
              ${ic('trash', 'icon-xs')}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  const modalHtml = `
    <div class="modal" style="max-width:540px">
      <div class="modal-head">
        <div>
          <h2>${ic('layers', 'icon-sm')} Documentation Categories</h2>
          <p>Organize protocol guides into distinct knowledge areas.</p>
        </div>
        <button class="btn btn-quiet btn-sm" data-act="close">${ic('x', 'icon-sm')}</button>
      </div>

      <div class="modal-body" style="gap:16px">
        <!-- Add New Category Form -->
        <div style="background:#FAFAF8;border:1px solid var(--line);border-radius:var(--r);padding:14px">
          <div style="font-weight:600;font-size:13px;margin-bottom:8px">Add New Category</div>
          <div class="stack gap8">
            <input type="text" id="newCatName" class="input input-sm" placeholder="Category Name (e.g. Treasury Operations, Compliance)" />
            <input type="text" id="newCatSub" class="input input-sm" placeholder="Description / Subtitle (optional)" />
            <button type="button" class="btn btn-primary btn-sm" data-act="guide-cat-add-submit" style="align-self:flex-start">
              ${ic('plus', 'icon-xs')} Add Category
            </button>
          </div>
        </div>

        <!-- Existing Categories List -->
        <div>
          <div class="micro" style="margin-bottom:8px">Current Categories (${cats.length})</div>
          <div class="card" style="overflow:hidden">
            ${catRows}
          </div>
        </div>
      </div>

      <div class="modal-foot">
        <button class="btn btn-primary" data-act="close">Done</button>
      </div>
    </div>
  `;

  ctx.openModal(modalHtml);
}

/* ============================================================
   View 5: Delete Confirmation Modal
   ============================================================ */

export function openGuideDeleteModal(guideId, S, ctx) {
  const guide = getGuideById(guideId);
  if (!guide) return;

  const modalHtml = `
    <div class="modal">
      <div class="modal-head">
        <h2>${ic('alert', 'icon-sm')} Delete Guide</h2>
        <button class="btn btn-quiet btn-sm" data-act="close">${ic('x', 'icon-sm')}</button>
      </div>
      <div class="modal-body">
        <p style="font-size:14px;color:var(--ink-2);line-height:1.55">
          Are you sure you want to delete <b>"${esc(guide.title)}"</b>?
        </p>
        <p class="muted" style="font-size:12.5px">
          This article will be removed from the built-in documentation directory and can only be restored from raw backup.
        </p>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" data-act="close">Cancel</button>
        <button class="btn btn-danger" data-act="guide-delete-go" data-id="${guide.id}">
          ${ic('trash', 'icon-sm')} Delete Article
        </button>
      </div>
    </div>
  `;

  ctx.openModal(modalHtml);
}
