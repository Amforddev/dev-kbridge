import { ic, spinner, hash, uid, dstr, dshort, ago, inDays, nf, nav, pct, short, esc, TODAY, kLogo, renderPaginationControls, pageHead } from './helpers.js';
import { HEDERA_LOGO, HEDERA_MARK } from './assets.js';
import { getAccounts, getPendingAccounts, calculateAge } from './auth.js';
import { canPerform } from './adminManagement.js';

export const INITIAL_MINT_REQUESTS = [
  {
    id: 'REQ-2026-079',
    pf: 'pursuit',
    holder: 'Theoriq',
    holderKey: 'theoriq',
    amt: 300000,
    tokens: 288794.76,
    navAt: 1.0388,
    payFrom: '0x8f3ad2b91c4e77a0d5be612f9a3c8471e0d92b64',
    payFromLabel: 'Capital Partner Treasury',
    tokenCustody: '0xa10b73ce55f2419d8ab6c0e73f81d2495ba7c318',
    destWallet: '0x5d71ac09e4b83f26d1c7590ae4bb3f8021d64c7a',
    destWalletLabel: 'Originator Partner Funding Wallet',
    status: 'Completed',
    created: new Date(TODAY.getTime() - 6 * 86400000),
    notesRequestedAt: new Date(TODAY.getTime() - 5 * 86400000),
    noteType: 'Senior Secured Promissory Note & Invoice Assignment Contract',
    instructions: 'Produce signed Promissory Note for 300,000.00 USDC allocation against Q3 manufacturing receivables.',
    documents: [
      {
        name: 'Promissory_Note_TOKENS_2026_8921.pdf',
        size: '2.4 MB',
        uploadedAt: new Date(TODAY.getTime() - 4 * 86400000),
        hash: '0x3a9f81d4b2e819034821bc19e048291a4729104b912389108c901823901bcae8',
        signer: 'Pursuit Legal & Treasury Ops',
        facilityId: 'INV-2026-8921'
      }
    ],
    mintedAt: new Date(TODAY.getTime() - 3 * 86400000),
    tx: '0x7a8291bf02c890184b912389108c901823901bcae82910283901829038102938'
  },
  {
    id: 'REQ-2026-080',
    pf: 'pursuit',
    holder: 'Theoriq',
    holderKey: 'theoriq',
    amt: 180000,
    tokens: 173276.85,
    navAt: 1.0388,
    payFrom: '0x8f3ad2b91c4e77a0d5be612f9a3c8471e0d92b64',
    payFromLabel: 'Capital Partner Treasury',
    tokenCustody: '0xa10b73ce55f2419d8ab6c0e73f81d2495ba7c318',
    destWallet: '0x5d71ac09e4b83f26d1c7590ae4bb3f8021d64c7a',
    destWalletLabel: 'Originator Partner Funding Wallet',
    status: 'Documents Uploaded',
    created: new Date(TODAY.getTime() - 2 * 86400000),
    notesRequestedAt: new Date(TODAY.getTime() - 1 * 86400000),
    noteType: 'Promissory Note & Invoice Assignment Contract',
    instructions: 'Provide signed contract notes backing Vertex Robotics (INV-2026-9004) facility for 180,000.00 USDC allocation.',
    documents: [
      {
        name: 'Promissory_Note_TOKENS_9004_Vertex.pdf',
        size: '3.1 MB',
        uploadedAt: new Date(TODAY.getTime() - 8 * 3600000),
        hash: '0x8c21a94b8e219038291b01c4728192a8390182741982b01c4728192a83901827',
        signer: 'Pursuit Treasury & Compliance Officer',
        facilityId: 'INV-2026-9004'
      }
    ],
    mintedAt: null,
    tx: null
  },
  {
    id: 'REQ-2026-081',
    pf: 'pursuit',
    holder: 'Theoriq',
    holderKey: 'theoriq',
    amt: 100000,
    tokens: 96264.92,
    navAt: 1.0388,
    payFrom: '0x8f3ad2b91c4e77a0d5be612f9a3c8471e0d92b64',
    payFromLabel: 'Capital Partner Treasury',
    tokenCustody: '0xa10b73ce55f2419d8ab6c0e73f81d2495ba7c318',
    destWallet: '0x5d71ac09e4b83f26d1c7590ae4bb3f8021d64c7a',
    destWalletLabel: 'Originator Partner Funding Wallet',
    status: 'Awaiting Originating Partner',
    created: new Date(TODAY.getTime() - 5 * 3600000),
    notesRequestedAt: new Date(TODAY.getTime() - 5 * 3600000),
    noteType: 'Senior Secured Promissory Note & Invoice Purchase Agreement',
    instructions: 'Originating partner automatically notified to provide signed contract notes backing Acme Nuts & Bolts (INV-2026-8921) facility for 100,000.00 USDC allocation.',
    documents: [],
    mintedAt: null,
    tx: null
  },
  {
    id: 'REQ-2026-082',
    pf: 'wayflyer',
    holder: 'Theoriq',
    holderKey: 'theoriq',
    amt: 75000,
    tokens: 72000.00,
    navAt: 1.0250,
    payFrom: '0x8f3ad2b91c4e77a0d5be612f9a3c8471e0d92b64',
    payFromLabel: 'Capital Partner Treasury',
    tokenCustody: '0xa10b73ce55f2419d8ab6c0e73f81d2495ba7c318',
    destWallet: '0x6e81ac09e4b83f26d1c7590ae4bb3f8021d64c8b',
    destWalletLabel: 'Wayflyer Funding Wallet',
    status: 'Awaiting Originating Partner',
    created: new Date(TODAY.getTime() - 4 * 3600000),
    notesRequestedAt: new Date(TODAY.getTime() - 4 * 3600000),
    noteType: 'eCommerce Advances Purchase & Promissory Note',
    instructions: 'Please upload signed promissory note and revenue sharing agreement backing Peak Apparel Direct (ADV-2026-4401) facility for 75,000.00 USDC allocation.',
    documents: [],
    mintedAt: null,
    tx: null
  },
  {
    id: 'REQ-2026-083',
    pf: 'credix',
    holder: 'Theoriq',
    holderKey: 'theoriq',
    amt: 150000,
    tokens: 144500.00,
    navAt: 1.0180,
    payFrom: '0x8f3ad2b91c4e77a0d5be612f9a3c8471e0d92b64',
    payFromLabel: 'Capital Partner Treasury',
    tokenCustody: '0xa10b73ce55f2419d8ab6c0e73f81d2495ba7c318',
    destWallet: '0x7f91ac09e4b83f26d1c7590ae4bb3f8021d64c9c',
    destWalletLabel: 'Credix Funding Wallet',
    status: 'Awaiting Originating Partner',
    created: new Date(TODAY.getTime() - 2 * 3600000),
    notesRequestedAt: new Date(TODAY.getTime() - 2 * 3600000),
    noteType: 'Receivables Assignment Agreement',
    instructions: 'Please upload signed receivables assignment agreements and auto loan pool documentation backing Nova Car Finance SPV (LON-2026-2101) facility for 150,000.00 USDC allocation.',
    documents: [],
    mintedAt: null,
    tx: null
  }
];

export function mintStatusBadge(status, org) {
  if (status === 'Awaiting Originating Partner' || status === 'Notes Requested' || status === 'Pending Admin Review') {
    return `<span class="badge b-amber"><span class="dot"></span>Awaiting Originating Partner</span>`;
  }
  if (status === 'Documents Uploaded') {
    return `<span class="badge b-green"><span class="dot"></span>Verified &amp; Ready</span>`;
  }
  if (status === 'Completed' || status === 'Settled') {
    const label = org === 'pursuit' ? 'Provided &amp; Settled' : (org === 'theoriq' ? 'Approved &amp; Minted' : 'Minted &amp; Settled');
    return `<span class="badge b-green"><span class="dot"></span>${label}</span>`;
  }
  return `<span class="badge b-gray">${status}</span>`;
}

export function pipelineStepper(status) {
  const steps = [
    { n: '1', title: 'Capital Request', sub: 'Capital Partner' },
    { n: '2', title: 'Submit Documents', sub: 'Originating Partner' },
    { n: '3', title: 'Inspect & Review', sub: 'KBridge Admin' },
    { n: '4', title: 'Mint & Settle', sub: 'Hedera Execution' }
  ];
  let cur = 1;
  if (status === 'Awaiting Originating Partner' || status === 'Notes Requested' || status === 'Pending Admin Review') cur = 2;
  if (status === 'Documents Uploaded') cur = 3;
  if (status === 'Completed' || status === 'Settled') cur = 4;

  return `<div class="pipe-steps">
    ${steps.map((s, i) => {
      const idx = i + 1;
      const cls = idx < cur ? 'done' : (idx === cur ? 'active' : '');
      const icn = idx < cur ? ic('check', 'icon-xs') : (idx === cur ? spinner : `<span class="mono">${s.n}</span>`);
      return `<div class="pipe-step ${cls}">
        <div class="num row gap4">${icn} <span>Step ${s.n}</span></div>
        <div style="font-weight:600;font-size:12.5px;margin-top:2px">${s.title}</div>
        <div class="faint" style="font-size:11px">${s.sub}</div>
      </div>`;
    }).join('')}
  </div>`;
}

export function hasPermission(user, perm) {
  if (!user || user.role !== 'kbridge') return false;
  if (user.staffRole === 'master') return true;
  return (user.permissions || []).includes(perm);
}

/* ============================================================
   KBridge Admin Dashboard & Workflow
   ============================================================ */
export function viewAdminDashboard(S, ctx) {
  const all = S.mintRequests;
  const pAwaitingOriginator = all.filter(r => r.status === 'Awaiting Originating Partner' || r.status === 'Notes Requested' || r.status === 'Pending Admin Review');
  const pMint = all.filter(r => r.status === 'Documents Uploaded');
  const pDone = all.filter(r => r.status === 'Completed' || r.status === 'Settled');

  const totalCap = all.reduce((a, r) => a + r.amt, 0);
  const totalSettled = pDone.reduce((a, r) => a + r.amt, 0);

  const pendingAccounts = getPendingAccounts();
  const accounts = getAccounts().filter(a => a.role !== 'kbridge');

  const signupQueueAlert = (pendingAccounts.length && hasPermission(S.currentUser, 'approve_partners')) ? `
    <div class="callout c-amber" style="margin-bottom:22px;align-items:center;justify-content:space-between">
      <div class="row gap12">
        <span class="dot-pulse" style="width:10px;height:10px;border-radius:999px;background:#D97706;display:inline-block"></span>
        <div>
          <b>Sign-up Approval Queue Action Required:</b> 
          ${pendingAccounts.length} new institutional partner signatory application(s) awaiting KBridge Governance review.
        </div>
      </div>
      <a href="#approval-queue" class="btn btn-primary btn-sm">${ic('shieldCheck', 'icon-xs')} Review Applications (${pendingAccounts.length})</a>
    </div>` : '';

  const pendingAlert = pMint.length ? `
    <div class="callout c-green" style="margin-bottom:22px;align-items:center;justify-content:space-between">
      <div class="row gap8">
        ${ic('shield', 'icon-sm')}
        <div>
          <b>Action Ready:</b> 
          ${pMint.length} request(s) submitted with documents, ready for Admin inspection &amp; token minting.
        </div>
      </div>
    </div>` : (pAwaitingOriginator.length ? `
    <div class="callout c-neutral" style="margin-bottom:22px;align-items:center;justify-content:space-between">
      <div class="row gap8">
        ${ic('hourglass', 'icon-sm')}
        <div>
          <b>Originator Pipeline Active:</b> 
          ${pAwaitingOriginator.length} request(s) automatically notified; awaiting document upload from Originating Partner.
        </div>
      </div>
    </div>` : '');

  const queueRows = accounts.slice(0, 5).map(a => renderSignatoryRow(a)).join('');
  const exposureRows = S.platforms.slice(0, 5).map(pf => renderExposureRow(pf, S)).join('');
  const tableRows = all.slice(0, 5).map(r => renderPipelineRow(r, S, ctx)).join('');

  return `
    <div style="background:#0F172A;color:#fff;padding:16px 20px;border-radius:var(--r-lg);margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
      <div class="row gap12">
        <div style="width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center">
          <svg viewBox="0 0 100 100" style="width:22px;height:22px;display:inline-block;flex:none" fill="#ebb03f" aria-label="KBridge">
            <path d="M 21.5 54 A 28.5 28.5 0 0 1 78.5 54 L 71 54 A 21 21 0 0 0 29 54 Z"/>
            <rect x="36" y="35" width="8" height="37"/>
            <rect x="56" y="35" width="8" height="37"/>
            <rect x="18" y="53" width="64" height="6" rx="3"/>
          </svg>
        </div>
        <div>
          <div style="font-weight:600;font-size:15px;letter-spacing:-.01em">KBridge Admin Console</div>
          <div style="font-size:12px;color:#94A3B8">End-to-end token minting, note coordination &amp; Hedera settlement orchestration</div>
        </div>
      </div>
    </div>

    ${signupQueueAlert}
    ${pendingAlert}

    <div class="stats" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
      <div class="card card-pad stat">
        <div class="label">${ic('coins', 'icon-sm')} Total Pipeline</div>
        <div class="value mono">${nf(totalCap, 0)} <span style="font-size:14px;color:var(--muted)">USDC</span></div>
        <div class="sub">${all.length} total capital requests</div>
      </div>
      <div class="card card-pad stat">
        <div class="label">${ic('hourglass', 'icon-sm')} Awaiting Originator</div>
        <div class="value mono">${pAwaitingOriginator.length}</div>
        <div class="sub">Auto-notified for documents</div>
      </div>
      <div class="card card-pad stat">
        <div class="label">${ic('shieldCheck', 'icon-sm')} Pending Approval Queue</div>
        <div class="value mono ${pendingAccounts.length ? 'warn' : ''}">${pendingAccounts.length}</div>
        <div class="sub">${accounts.length} total registered signatories</div>
      </div>
      <div class="card card-pad stat">
        <div class="label">${ic('check', 'icon-sm')} Minted &amp; Settled</div>
        <div class="value mono">${nf(totalSettled, 0)} <span style="font-size:14px;color:var(--muted)">USDC</span></div>
        <div class="sub">${pDone.length} completed transactions</div>
      </div>
    </div>

    <!-- Section 1: Sign-up Approval Queue Section (Max 5 on Dashboard) -->
    <div class="card" id="approval-queue" style="margin-bottom:24px">
      <div class="card-head">
        <div class="row gap10">
          <div style="color:var(--ink)">${ic('info', 'icon-sm')}</div>
          <div>
            <h3 style="margin:0;font-size:15px;font-weight:600;color:var(--ink)">Sign-up Approval Queue &amp; Signatory Directory</h3>
            <div class="faint" style="font-size:12px;margin-top:2px">Manage incoming partner applications, verify corporate KYC, and approve portal access</div>
          </div>
        </div>
        <div class="row gap8">
          ${pendingAccounts.length ? `<span class="badge b-amber"><span class="dot"></span>${pendingAccounts.length} Pending Review</span>` : `<span class="badge b-green"><span class="dot"></span>All Signatories Audited</span>`}
        </div>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Signatory Name &amp; Title</th>
              <th>Work Email</th>
              <th>Workspace &amp; Entity SPV</th>
              <th>DOB / Age</th>
              <th>Submitted</th>
              <th>Status</th>
              <th class="t-right">Governance Action</th>
            </tr>
          </thead>
          <tbody>
            ${queueRows}
          </tbody>
        </table>
      </div>
      <div class="card-foot between" style="padding:12px 20px;border-top:1px solid var(--line);background:#FAFAF8">
        <span class="faint" style="font-size:12.5px">Showing <b>${Math.min(5, accounts.length)}</b> of <b>${accounts.length}</b> registered signatories</span>
        <button class="btn btn-ghost btn-sm" data-act="view" data-view="admin-signatories" style="font-weight:500;gap:6px">
          View More Signatories (${accounts.length}) ${ic('arrowRight', 'icon-xs')}
        </button>
      </div>
    </div>

    <!-- Section 2: Originating Partners Fee Exposure Card (Max 5 on Dashboard) -->
    <div class="card" style="margin-bottom:24px">
      <div class="card-head">
        <div class="row gap10">
          ${ic('bank', 'icon-sm')}
          <div>
            <h3 style="margin:0;font-size:15px;font-weight:600">Originating Partners — Kunda Box Capital &amp; Fee Exposure</h3>
            <div class="faint" style="font-size:12px;margin-top:2px">Real-time tracking of allocated capital and accrued administration fees (2.25% / 365 basis) across all originating platforms</div>
          </div>
        </div>
        <span class="badge b-green"><span class="dot"></span>Live Protocol Audit</span>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Originating Partner &amp; SPV</th>
              <th>Active Allocations</th>
              <th class="t-right">Total Allocated Capital</th>
              <th class="t-right">Accrued Kunda Box Fees</th>
              <th class="t-right">Total Combined Owed</th>
            </tr>
          </thead>
          <tbody>
            ${exposureRows}
          </tbody>
        </table>
      </div>
      <div class="card-foot between" style="padding:12px 20px;border-top:1px solid var(--line);background:#FAFAF8">
        <span class="faint" style="font-size:12.5px">Showing <b>${Math.min(5, S.platforms.length)}</b> of <b>${S.platforms.length}</b> partner platforms</span>
        <button class="btn btn-ghost btn-sm" data-act="view" data-view="admin-fees-exposure" style="font-weight:500;gap:6px">
          View More Partner Exposures (${S.platforms.length}) ${ic('arrowRight', 'icon-xs')}
        </button>
      </div>
    </div>

    <!-- Section 3: Capital Mint & Note Coordination Pipeline (Max 5 on Dashboard with Inspect & Mint) -->
    <div class="card" style="margin-bottom:24px">
      <div class="card-head">
        <div class="row gap10">
          ${ic('activity', 'icon-sm')}
          <div>
            <h3 style="margin:0;font-size:15px;font-weight:600">Capital Mint &amp; Note Coordination Pipeline</h3>
            <div class="faint" style="font-size:12px;margin-top:2px">Institutional token requests, legal note review &amp; Hedera smart contract minting</div>
          </div>
        </div>
        <span class="badge b-ink">${all.length} total requests</span>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Platform</th>
              <th>Capital Partner</th>
              <th class="t-right">Amount</th>
              <th class="t-right">Target Tokens</th>
              <th>Submitted</th>
              <th>Pipeline Status</th>
              <th class="t-right">Inspect &amp; Mint Action</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
      <div class="card-foot between" style="padding:12px 20px;border-top:1px solid var(--line);background:#FAFAF8">
        <span class="faint" style="font-size:12.5px">Showing <b>${Math.min(5, all.length)}</b> of <b>${all.length}</b> requests in pipeline</span>
        <button class="btn btn-ghost btn-sm" data-act="view" data-view="admin-pipeline-all" style="font-weight:500;gap:6px">
          View More Requests (${all.length}) ${ic('arrowRight', 'icon-xs')}
        </button>
      </div>
    </div>
  `;
}

/* ============================================================
   Reusable Row Renderers
   ============================================================ */

export function renderSignatoryRow(a) {
  let statusBadge = `<span class="badge b-green"><span class="dot"></span>Approved Signatory</span>`;
  if (a.status === 'pending_email') {
    statusBadge = `<span class="badge b-amber">${ic('mail', 'icon-xs')} Email Unverified</span>`;
  } else if (a.status === 'pending_approval') {
    statusBadge = `<span class="badge b-amber"><span class="dot"></span>Pending Governance Review</span>`;
  } else if (a.status === 'rejected') {
    statusBadge = `<span class="badge b-red">${ic('alert', 'icon-xs')} Rejected</span>`;
  }

  const roleName = a.role === 'theoriq' ? 'Capital Partner' : (a.role === 'pursuit' ? 'Originating Partner' : 'Protocol Admin');
  const age = calculateAge(a.dob);

  let actionBtns = '';
  if (a.status === 'pending_approval' || a.status === 'pending_email') {
    actionBtns = `
      <div class="row gap6" style="justify-content:flex-end">
        <button class="btn btn-primary btn-sm" data-act="admin-approve-acc" data-email="${esc(a.email)}">
          ${ic('check', 'icon-xs')} Approve
        </button>
        <button class="btn btn-ghost btn-sm" style="color:var(--bad)" data-act="admin-reject-acc" data-email="${esc(a.email)}">
          ${ic('trash', 'icon-xs')} Reject
        </button>
      </div>`;
  } else if (a.status === 'approved') {
    actionBtns = `
      <div class="row gap6" style="justify-content:flex-end">
        <button class="btn btn-ghost btn-sm" data-act="admin-view-acc-audit" data-email="${esc(a.email)}" style="gap:6px">
          ${ic('fileText', 'icon-xs')} Audit Log
        </button>
      </div>`;
  } else if (a.status === 'rejected') {
    actionBtns = `
      <div class="row gap6" style="justify-content:flex-end">
        <button class="btn btn-ghost btn-sm" data-act="admin-approve-acc" data-email="${esc(a.email)}">
          ${ic('refresh', 'icon-xs')} Re-approve
        </button>
      </div>`;
  }

  return `<tr class="hover-row">
    <td>
      <div style="font-weight:600;font-size:13.5px;color:var(--ink)">${esc(a.firstName)} ${esc(a.lastName)}</div>
      <div class="faint" style="font-size:12px;margin-top:2px">${esc(a.title || 'Signatory')}</div>
    </td>
    <td class="mono" style="font-size:13px;color:var(--ink)">${esc(a.email)}</td>
    <td>
      <div style="margin-bottom:4px"><span class="partner-pill" style="padding:4px 14px;font-size:12.5px;font-weight:600">${roleName}</span></div>
      <div class="faint" style="font-size:11.5px">${esc(a.entity || 'Partner SPV')}</div>
    </td>
    <td class="mono" style="font-size:12.5px;line-height:1.45">${esc(a.dob || '—')} ${age ? `<span class="faint">(${age}y)</span>` : ''}</td>
    <td class="mono" style="font-size:12.5px">${a.createdAt ? dshort(a.createdAt) : '—'}</td>
    <td>${statusBadge}</td>
    <td class="t-right">${actionBtns}</td>
  </tr>`;
}

export function renderPipelineRow(r, S, ctx) {
  const p = ctx.PL ? ctx.PL(r.pf) : null;
  let actionBtn = '';
  if (r.status === 'Completed' || r.status === 'Settled') {
    actionBtn = `
      <div class="row gap6" style="justify-content:flex-end">
        <button class="btn btn-primary btn-sm" data-act="admin-inspect-mint" data-id="${r.id}" title="Inspect Promissory Note &amp; Token Mint Data">
          ${ic('shield', 'icon-xs')} Inspect &amp; Mint
        </button>
        <button class="btn btn-ghost btn-sm" data-act="req-details" data-id="${r.id}" title="View On-Chain Receipt">
          ${ic('fileCheck', 'icon-xs')} Receipt
        </button>
      </div>`;
  } else {
    actionBtn = `
      <button class="btn btn-primary btn-sm" data-act="admin-inspect-mint" data-id="${r.id}" style="font-weight:600;gap:6px">
        ${ic('shield', 'icon-xs')} Inspect &amp; Mint
      </button>`;
  }

  return `<tr class="hover-row">
    <td class="mono" style="font-weight:600">${r.id}</td>
    <td>
      <div style="font-weight:500">${p ? p.name : 'Receivables'}</div>
      <div class="faint mono" style="font-size:11px">${p ? p.symbol : 'TOKENS'}</div>
    </td>
    <td>
      <div>${esc(r.holder)}</div>
      <div class="faint mono" style="font-size:11px">${short(r.payFrom)}</div>
    </td>
    <td class="mono t-right" style="font-weight:600">${nf(r.amt, 2)} USDC</td>
    <td class="mono t-right">${nf(r.tokens, 2)}</td>
    <td class="mono">${dshort(r.created)}<div class="faint" style="font-size:11px">${ago(r.created)}</div></td>
    <td>${mintStatusBadge(r.status, S.org)}</td>
    <td class="t-right">${actionBtn}</td>
  </tr>`;
}

export function renderExposureRow(pf, S) {
  const pfItems = (S.mintRequests || []).filter(r => r.pf === pf.key && (r.status === 'Completed' || r.status === 'Settled' || r.mintedAt));
  let pfAlloc = 0;
  let pfFees = 0;
  pfItems.forEach(r => {
    const allocDate = new Date(r.mintedAt || r.created || TODAY);
    const daysSince = Math.max(1, Math.floor((TODAY.getTime() - allocDate.getTime()) / (1000 * 60 * 60 * 24)));
    const fee = r.amt * (0.0225 / 365) * daysSince;
    pfAlloc += r.amt;
    pfFees += fee;
  });
  const pfTotal = pfAlloc + pfFees;
  return `<tr class="hover-row">
    <td>
      <div style="font-weight:600;font-size:13.5px">${esc(pf.name)}</div>
      <div class="faint" style="font-size:11.5px">${esc(pf.legal)}</div>
    </td>
    <td><span class="badge b-ink">${pfItems.length} active</span></td>
    <td class="mono t-right" style="font-weight:600">${nf(pfAlloc, 2)} USDC</td>
    <td class="mono t-right" style="color:var(--amber);font-weight:600">${nf(pfFees, 2)} USDC</td>
    <td class="mono t-right" style="font-weight:600">${nf(pfTotal, 2)} USDC</td>
  </tr>`;
}

/* ============================================================
   Dedicated Paginated View 1: Signatory Directory & Approval Queue
   ============================================================ */

export function viewAdminSignatories(S, ctx) {
  const accounts = getAccounts().filter(a => a.role !== 'kbridge');
  const page = (S.pagination && S.pagination.signatories) || 1;
  const perPage = 5;

  const filter = S.signatoryFilter || 'all';
  const query = (S.signatoryQuery || '').toLowerCase().trim();

  const filtered = accounts.filter(a => {
    if (filter === 'pending') {
      if (a.status !== 'pending_approval' && a.status !== 'pending_email') return false;
    } else if (filter === 'approved') {
      if (a.status !== 'approved') return false;
    } else if (filter === 'rejected') {
      if (a.status !== 'rejected') return false;
    }

    if (query) {
      const matchName = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase().includes(query);
      const matchEmail = (a.email || '').toLowerCase().includes(query);
      const matchEntity = (a.entity || '').toLowerCase().includes(query);
      if (!matchName && !matchEmail && !matchEntity) return false;
    }
    return true;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIdx = (safePage - 1) * perPage;
  const pageItems = filtered.slice(startIdx, startIdx + perPage);

  const rowsHtml = pageItems.length
    ? pageItems.map(a => renderSignatoryRow(a)).join('')
    : `<tr><td colspan="7" style="text-align:center;padding:36px" class="muted">No signatories found matching criteria.</td></tr>`;

  return `
    ${pageHead('Signatory Directory &amp; Approval Queue', 'Comprehensive governance directory of institutional partner signatories, corporate KYC, and portal access rights.', '', ['dash', 'Back to Admin Pipeline'])}

    <div class="card" style="margin-top:16px">
      <div class="card-head" style="flex-wrap:wrap;gap:12px">
        <div class="row gap8" style="flex-wrap:wrap">
          <button class="btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-sm" data-act="filter-signatories" data-filter="all">All (${accounts.length})</button>
          <button class="btn ${filter === 'pending' ? 'btn-primary' : 'btn-ghost'} btn-sm" data-act="filter-signatories" data-filter="pending">Pending (${accounts.filter(a => a.status === 'pending_approval' || a.status === 'pending_email').length})</button>
          <button class="btn ${filter === 'approved' ? 'btn-primary' : 'btn-ghost'} btn-sm" data-act="filter-signatories" data-filter="approved">Approved (${accounts.filter(a => a.status === 'approved').length})</button>
          <button class="btn ${filter === 'rejected' ? 'btn-primary' : 'btn-ghost'} btn-sm" data-act="filter-signatories" data-filter="rejected">Rejected (${accounts.filter(a => a.status === 'rejected').length})</button>
        </div>
        <div class="row gap8">
          <div class="field" style="margin:0;min-width:240px">
            <input type="text" id="signatorySearchInput" class="input" placeholder="Search by name, email, SPV..." value="${esc(S.signatoryQuery || '')}" style="height:34px;font-size:12.5px" />
          </div>
        </div>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Signatory Name &amp; Title</th>
              <th>Work Email</th>
              <th>Workspace &amp; Entity SPV</th>
              <th>DOB / Age</th>
              <th>Submitted</th>
              <th>Status</th>
              <th class="t-right">Governance Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
      ${renderPaginationControls(safePage, total, perPage, 'paginate-signatories', 'Signatories')}
    </div>
  `;
}

/* ============================================================
   Dedicated Paginated View 2: Capital Mint & Note Coordination Pipeline
   ============================================================ */

export function viewAdminPipelineAll(S, ctx) {
  const all = S.mintRequests;
  const page = (S.pagination && S.pagination.pipeline) || 1;
  const perPage = 5;

  const filter = S.pipelineFilter || 'all';
  const query = (S.pipelineQuery || '').toLowerCase().trim();

  const filtered = all.filter(r => {
    if (filter === 'awaiting') {
      if (r.status !== 'Awaiting Originating Partner' && r.status !== 'Notes Requested' && r.status !== 'Pending Admin Review') return false;
    } else if (filter === 'ready') {
      if (r.status !== 'Documents Uploaded') return false;
    } else if (filter === 'completed') {
      if (r.status !== 'Completed' && r.status !== 'Settled') return false;
    }

    if (query) {
      const matchId = (r.id || '').toLowerCase().includes(query);
      const matchHolder = (r.holder || '').toLowerCase().includes(query);
      const matchPf = (r.pf || '').toLowerCase().includes(query);
      if (!matchId && !matchHolder && !matchPf) return false;
    }
    return true;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIdx = (safePage - 1) * perPage;
  const pageItems = filtered.slice(startIdx, startIdx + perPage);

  const rowsHtml = pageItems.length
    ? pageItems.map(r => renderPipelineRow(r, S, ctx)).join('')
    : `<tr><td colspan="8" style="text-align:center;padding:36px" class="muted">No requests found matching criteria.</td></tr>`;

  return `
    ${pageHead('Capital Mint &amp; Note Coordination Pipeline', 'Complete institutional pipeline of token mint requests, promissory note audit packages, and atomic Hedera settlement execution.', '', ['dash', 'Back to Admin Pipeline'])}

    <div class="card" style="margin-top:16px">
      <div class="card-head" style="flex-wrap:wrap;gap:12px">
        <div class="row gap8" style="flex-wrap:wrap">
          <button class="btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-sm" data-act="filter-pipeline" data-filter="all">All Requests (${all.length})</button>
          <button class="btn ${filter === 'ready' ? 'btn-primary' : 'btn-ghost'} btn-sm" data-act="filter-pipeline" data-filter="ready">Ready to Mint (${all.filter(r => r.status === 'Documents Uploaded').length})</button>
          <button class="btn ${filter === 'awaiting' ? 'btn-primary' : 'btn-ghost'} btn-sm" data-act="filter-pipeline" data-filter="awaiting">Awaiting Originator (${all.filter(r => r.status === 'Awaiting Originating Partner' || r.status === 'Notes Requested' || r.status === 'Pending Admin Review').length})</button>
          <button class="btn ${filter === 'completed' ? 'btn-primary' : 'btn-ghost'} btn-sm" data-act="filter-pipeline" data-filter="completed">Settled (${all.filter(r => r.status === 'Completed' || r.status === 'Settled').length})</button>
        </div>
        <div class="row gap8">
          <div class="field" style="margin:0;min-width:240px">
            <input type="text" id="pipelineSearchInput" class="input" placeholder="Search by request ID, partner..." value="${esc(S.pipelineQuery || '')}" style="height:34px;font-size:12.5px" />
          </div>
        </div>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Platform</th>
              <th>Capital Partner</th>
              <th class="t-right">Amount</th>
              <th class="t-right">Target Tokens</th>
              <th>Submitted</th>
              <th>Pipeline Status</th>
              <th class="t-right">Inspect &amp; Mint Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
      ${renderPaginationControls(safePage, total, perPage, 'paginate-pipeline', 'Requests')}
    </div>
  `;
}

/* ============================================================
   Dedicated Paginated View 3: Partner Capital & Fee Exposure
   ============================================================ */

export function viewAdminFeesExposure(S, ctx) {
  const platforms = S.platforms || [];
  const page = (S.pagination && S.pagination.exposure) || 1;
  const perPage = 5;

  const total = platforms.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIdx = (safePage - 1) * perPage;
  const pageItems = platforms.slice(startIdx, startIdx + perPage);

  const rowsHtml = pageItems.length
    ? pageItems.map(pf => renderExposureRow(pf, S)).join('')
    : `<tr><td colspan="5" style="text-align:center;padding:36px" class="muted">No platforms registered.</td></tr>`;

  return `
    ${pageHead('Originating Partners — Capital &amp; Fee Exposure', 'Comprehensive real-time tracking of allocated capital and accrued administration fees (2.25% / 365 basis) across all partner SPVs.', '', ['dash', 'Back to Admin Pipeline'])}

    <div class="card" style="margin-top:16px">
      <div class="card-head">
        <div class="row gap10">
          ${ic('bank', 'icon-sm')}
          <div>
            <h3 style="margin:0;font-size:15px;font-weight:600">Partner Platform Ledger</h3>
            <div class="faint" style="font-size:12px;margin-top:2px">Audited exposure and accrued Kunda Box administration fees</div>
          </div>
        </div>
        <span class="badge b-green"><span class="dot"></span>Live Protocol Audit</span>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Originating Partner &amp; SPV</th>
              <th>Active Allocations</th>
              <th class="t-right">Total Allocated Capital</th>
              <th class="t-right">Accrued Kunda Box Fees</th>
              <th class="t-right">Total Combined Owed</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
      ${renderPaginationControls(safePage, total, perPage, 'paginate-exposure', 'Platforms')}
    </div>
  `;
}

/* ============================================================
   Capital Partner Requests Card / View
   ============================================================ */
export function viewCapitalPartnerRequests(S, ctx) {
  const mine = S.mintRequests.filter(r => r.holderKey === 'theoriq');
  
  const rows = mine.length ? mine.map(r => {
    const p = ctx.PL(r.pf);
    return `<tr class="hover-row">
      <td class="mono" style="font-weight:600">${r.id}</td>
      <td>${p ? p.name : 'Receivables'}</td>
      <td class="mono t-right" style="font-weight:600">${nf(r.amt, 2)} USDC</td>
      <td class="mono t-right">${nf(r.tokens, 2)} ${p ? p.symbol : 'TOKENS'}</td>
      <td class="mono">${dshort(r.created)}<div class="faint" style="font-size:11px">${ago(r.created)}</div></td>
      <td>${mintStatusBadge(r.status, S.org)}</td>
      <td class="t-right">
        <button class="btn btn-ghost btn-sm" data-act="req-details" data-id="${r.id}">${ic('file', 'icon-sm')} View Status</button>
      </td>
    </tr>`;
  }).join('') : `<tr><td colspan="7" style="padding:36px;text-align:center" class="muted">No capital mint requests yet.</td></tr>`;

  return `
    <div class="card" style="margin-top:24px">
      <div class="card-head">
        <h3>${ic('coins', 'icon-sm')} Capital Mint Requests</h3>
        <button class="btn btn-primary btn-sm" data-act="mint">${ic('plus', 'icon-sm')} Request to Mint</button>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Request</th>
              <th>Platform</th>
              <th class="t-right">Amount (USDC)</th>
              <th class="t-right">Tokens</th>
              <th>Submitted</th>
              <th>Status</th>
              <th class="t-right">Details</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

/* ============================================================
   Originating Partner Note Requests View / Card
   ============================================================ */
export function viewOriginatorNoteRequests(S, ctx) {
  const activePf = S.openPlatform || 'pursuit';
  const forOriginator = S.mintRequests.filter(r => r.pf === activePf);
  const pendingNotes = forOriginator.filter(r => r.status === 'Awaiting Originating Partner' || r.status === 'Notes Requested' || r.status === 'Pending Admin Review');
  
  const alert = pendingNotes.length ? `
    <div class="callout c-amber" style="margin-bottom:20px;align-items:center;justify-content:space-between">
      <div class="row gap8">
        ${ic('fileText', 'icon-sm')}
        <div>
          <b>${pendingNotes.length} Capital Request(s) Awaiting Backing Documents:</b>
          Capital Partner allocations have been filed and automatically routed to you. Please upload signed promissory notes &amp; invoice contracts for Admin inspection.
        </div>
      </div>
    </div>` : '';

  const rows = forOriginator.map(r => {
    const p = ctx.PL(r.pf);
    let actionBtn = '';
    if (r.status === 'Awaiting Originating Partner' || r.status === 'Notes Requested' || r.status === 'Pending Admin Review') {
      actionBtn = `<button class="btn btn-primary btn-sm" data-act="originator-upload-notes" data-id="${r.id}">${ic('upload', 'icon-sm')} Submit Documents</button>`;
    } else if (r.status === 'Documents Uploaded') {
      actionBtn = `<span class="badge b-ink">Submitted · Ready for Review</span>`;
    } else if (r.status === 'Completed' || r.status === 'Settled') {
      actionBtn = `<span class="badge b-green">Minted &amp; Settled</span>`;
    } else {
      actionBtn = `<span class="faint" style="font-size:12px">Pending</span>`;
    }

    return `<tr class="hover-row">
      <td class="mono" style="font-weight:600">${r.id}</td>
      <td>${esc(r.holder)}</td>
      <td class="mono t-right" style="font-weight:600">${nf(r.amt, 2)} USDC</td>
      <td class="mono t-right">${nf(r.tokens, 2)} ${p ? p.symbol : 'TOKENS'}</td>
      <td class="mono">${dshort(r.created)}<div class="faint" style="font-size:11px">${ago(r.created)}</div></td>
      <td>${mintStatusBadge(r.status, S.org)}</td>
      <td class="t-right">${actionBtn}</td>
    </tr>`;
  }).join('');

  return `
    ${alert}
    <div class="card" style="margin-top:24px">
      <div class="card-head">
        <h3>${ic('fileText', 'icon-sm')} Note &amp; Contract Requests</h3>
        <span class="badge b-gray">${forOriginator.length} requests</span>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Request</th>
              <th>Capital Partner</th>
              <th class="t-right">Capital Amount</th>
              <th class="t-right">Tokens to Mint</th>
              <th>Submitted</th>
              <th>Status</th>
              <th class="t-right">Action</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

/* ============================================================
   Originator Kunda Box (KBridge) Fees & Allocated Capital Screen
   ============================================================ */
export function viewOriginatorKundaBoxFees(S, ctx) {
  const activePf = S.openPlatform || 'pursuit';
  const p = ctx.PL(activePf);
  const orgKey = S.org || 'pursuit';
  
  const allocatedItems = (S.mintRequests || []).filter(r => r.pf === activePf && (r.status === 'Completed' || r.status === 'Settled' || r.mintedAt));
  
  let totalAllocated = 0;
  let totalAccruedFees = 0;
  
  const rows = allocatedItems.length ? allocatedItems.map(r => {
    const allocDate = new Date(r.mintedAt || r.created || TODAY);
    const daysSince = Math.max(1, Math.floor((TODAY.getTime() - allocDate.getTime()) / (1000 * 60 * 60 * 24)));
    const mosSince = (daysSince / 30.4375).toFixed(1);
    const feeRateDaily = 0.0225 / 365;
    const accruedFee = r.amt * feeRateDaily * daysSince;
    const totalItemOwed = r.amt + accruedFee;
    
    totalAllocated += r.amt;
    totalAccruedFees += accruedFee;
    
    return `<tr class="hover-row">
      <td class="mono" style="font-weight:600">${r.id}</td>
      <td>${esc(r.holder)}</td>
      <td class="mono t-right" style="font-weight:600">${nf(r.amt, 2)} USDC</td>
      <td class="mono">${dshort(allocDate)}<div class="faint" style="font-size:11px">${daysSince} days active (${mosSince} mos)</div></td>
      <td class="mono t-right">2.25% p.a.</td>
      <td class="mono t-right" style="color:var(--amber);font-weight:600">${nf(accruedFee, 2)} USDC</td>
      <td class="mono t-right" style="font-weight:600">${nf(totalItemOwed, 2)} USDC</td>
    </tr>`;
  }).join('') : `<tr><td colspan="7" style="padding:48px;text-align:center" class="muted">No allocated capital items registered yet. Items appear here automatically when capital minting completes and succeeds in wallet transfer.</td></tr>`;

  const totalOwedCombined = totalAllocated + totalAccruedFees;
  const cash = ctx.orgCash(orgKey);

  const platformSelector = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;background:#fff;padding:12px 16px;border-radius:12px;border:1px solid var(--line-soft);box-shadow: 0 1px 2px rgba(0,0,0,0.05)">
      <span class="faint" style="font-weight:600;font-size:13.5px">${ic('layers','icon-xs')} Active Originating Platform:</span>
      <div style="width:340px;position:relative;z-index:40">
        ${ctx.selectBox('feePlatform', S.platforms.map(x => ({ v:x.key, label:x.name + ' (' + x.symbol + ')', sub:x.legal })), activePf, v => {
          S.openPlatform = v;
          ctx.render();
        })}
      </div>
    </div>
  `;

  return `
    ${ctx.pageHead('Kunda Box (KBridge) Statement & Fees', 'Statement of capital allocated from partners, active duration, and accrued Kunda Box administration fees (2.25% / 365 daily accrual).', '')}
    
    ${platformSelector}

    <div class="stats" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
      ${ctx.stat('Allocated Capital', 'coins', nf(totalAllocated, 2) + ' <span style="font-size:15px;color:var(--muted)" class="mono">USDC</span>', 'Successfully minted &amp; transferred')}
      ${ctx.stat('Accrued Kunda Box Fees', 'trend', nf(totalAccruedFees, 2) + ' <span style="font-size:15px;color:var(--muted)" class="mono">USDC</span>', '2.25% / 365 daily accrual')}
      ${ctx.stat('Total Owed (Capital + Fees)', 'bank', nf(totalOwedCombined, 2) + ' <span style="font-size:15px;color:var(--muted)" class="mono">USDC</span>', 'Payable to KBridge Protocol')}
      ${ctx.stat('Originator Cash', 'wallet', nf(cash, 2) + ' <span style="font-size:15px;color:var(--muted)" class="mono">USDC</span>', 'Across funding wallets')}
    </div>

    <div class="card" style="margin-top:24px">
      <div class="card-head">
        <div class="row gap10">
          ${ic('shieldCheck', 'icon-sm')}
          <div>
            <h3 style="margin:0;font-size:15px;font-weight:600">Allocated Capital &amp; Fee Statement (${p ? p.name : 'Platform'})</h3>
            <div class="faint" style="font-size:12px;margin-top:2px">Calculated at (2.25% / 365) × number of days since allocation</div>
          </div>
        </div>
        <span class="badge b-ink">${allocatedItems.length} active allocation(s)</span>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Allocation ID</th>
              <th>Capital Partner</th>
              <th class="t-right">Allocated Capital</th>
              <th>Allocation Date &amp; Duration</th>
              <th class="t-right">Annual Rate</th>
              <th class="t-right">Accrued Fee</th>
              <th class="t-right">Total Owed</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>

    <div class="callout c-neutral" style="margin-top:20px">
      ${ic('info', 'icon-sm')}
      <div style="font-size:12.5px;line-height:1.5">
        <b>Statement Policy:</b> Items are automatically registered upon successful capital minting and wallet transfer. Fees accrue continuously at an annualized rate of 2.25% divided by 365 days, multiplied by the active days elapsed since capital allocation. This screen is for official statement reporting and recordkeeping.
      </div>
    </div>
  `;
}

/* ============================================================
   KBridge Staff Management View (Master Admin Only)
   ============================================================ */
export function viewAdminStaff(S, ctx) {
  if (!hasPermission(S.currentUser, 'manage_staff')) {
    return `<div class="card card-pad" style="text-align:center;padding:64px 20px">
      <div style="color:var(--bad);margin-bottom:12px">${ic('alert', 'icon-lg')}</div>
      <h3 style="font-size:18px;font-weight:600">Access Restricted</h3>
      <p class="muted" style="font-size:14px;margin-top:6px">Only Master Administrators can manage protocol staff and permissions.</p>
    </div>`;
  }

  const staff = getAccounts().filter(a => a.role === 'kbridge');

  const rows = staff.map(s => {
    const isMaster = s.staffRole === 'master';
    const perms = (s.permissions || []).map(p => {
      const labels = {
        approve_mint: 'Mint Approval',
        approve_partners: 'Partner KYC',
        manage_guides: 'Guides CMS',
        manage_staff: 'Staff Admin'
      };
      return `<span class="badge b-gray" style="font-size:10px;margin:1px">${labels[p] || p}</span>`;
    }).join('');

    return `<tr class="hover-row">
      <td>
        <div style="font-weight:600;font-size:13.5px">${esc(s.firstName)} ${esc(s.lastName)}</div>
        <div class="faint mono" style="font-size:11px">${esc(s.email)}</div>
      </td>
      <td>
        <span class="badge ${isMaster ? 'b-ink' : 'b-amber'}">${isMaster ? 'Master Admin' : 'Staff Editor'}</span>
      </td>
      <td><div class="row" style="flex-wrap:wrap;max-width:240px">${perms || '<span class="faint">No permissions</span>'}</div></td>
      <td class="mono" style="font-size:11.5px">${s.createdAt ? dshort(s.createdAt) : '—'}</td>
      <td class="t-right">
        <div class="row gap6" style="justify-content:flex-end">
          ${isMaster ? '' : `
            <button class="btn btn-ghost btn-sm" data-act="staff-edit" data-email="${esc(s.email)}">
              ${ic('pencil', 'icon-xs')} Edit
            </button>
            <button class="btn btn-ghost btn-sm" style="color:var(--bad)" data-act="staff-delete-confirm" data-email="${esc(s.email)}">
              ${ic('trash', 'icon-xs')}
            </button>
          `}
        </div>
      </td>
    </tr>`;
  }).join('');

  return `
    <div class="page-head" style="margin-bottom:20px">
      <div>
        <h1 style="font-size:23px;font-weight:600;letter-spacing:-.02em">Staff &amp; Permission Governance</h1>
        <p class="muted" style="font-size:13.5px;margin-top:4px">Manage internal KBridge administrators, protocol editors, and granular workflow permissions.</p>
      </div>
      <button class="btn btn-primary" data-act="staff-add">
        ${ic('plus', 'icon-sm')} Add New Staff Member
      </button>
    </div>

    <div class="card">
      <div class="card-head">
        <div class="row gap10">
          ${ic('users', 'icon-sm')}
          <h3 style="font-size:15px;font-weight:600">Protocol Signatories (${staff.length})</h3>
        </div>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Role</th>
              <th>Active Permissions</th>
              <th>Joined</th>
              <th class="t-right">Action</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

export function openStaffModal(email, S, ctx) {
  const accounts = getAccounts();
  const s = email ? accounts.find(a => a.email.toLowerCase() === email.toLowerCase()) : null;
  const isEditing = !!s;

  const roles = [
    { v: 'editor', label: 'Staff Editor', sub: 'Granular workflow access' },
    { v: 'master', label: 'Master Admin', sub: 'Full protocol governance' }
  ];

  const permsList = [
    { id: 'approve_mint', label: 'Approve Mint Requests', desc: 'Can inspect documents and execute HTS token minting' },
    { id: 'approve_partners', label: 'Approve Partners', desc: 'Can review KYC and approve new partner accounts' },
    { id: 'manage_guides', label: 'Manage Guides', desc: 'Can create, edit, and delete protocol documentation' }
  ];

  const currentRole = s ? s.staffRole : 'editor';
  const currentPerms = s ? (s.permissions || []) : ['approve_mint', 'approve_partners', 'manage_guides'];

  const modalHtml = `
    <div class="modal">
      <div class="modal-head">
        <div>
          <h2>${ic(isEditing ? 'pencil' : 'plus', 'icon-sm')} ${isEditing ? 'Edit Staff Permissions' : 'Add New Protocol Staff'}</h2>
          <p>Assign institutional authorization and granular workflow permissions.</p>
        </div>
        <button class="btn btn-quiet btn-sm" data-act="close">${ic('x', 'icon-sm')}</button>
      </div>

      <div class="modal-body" style="gap:16px">
        <div class="two-col">
          <label class="field"><span>First Name</span><input class="input" id="staffFirst" value="${esc(s?.firstName || '')}" placeholder="e.g. John"></label>
          <label class="field"><span>Last Name</span><input class="input" id="staffLast" value="${esc(s?.lastName || '')}" placeholder="e.g. Doe"></label>
        </div>
        <label class="field"><span>Work Email</span><input class="input" id="staffEmail" value="${esc(s?.email || '')}" ${isEditing ? 'disabled' : ''} placeholder="signatory@kbridge.io"></label>
        
        <label class="field">
          <span>Signatory Role</span>
          <input type="hidden" id="staffRole" value="${currentRole}" />
          ${ctx.selectBox('staffRoleSel', roles, currentRole, v => {
            document.getElementById('staffRole').value = v;
            const btn = document.querySelector('[data-sel="staffRoleSel"] .sel-btn');
            const opt = roles.find(o => o.v === v);
            if (btn && opt) {
              btn.querySelector('.sel-lab').textContent = opt.label;
              const sub = btn.querySelector('.sel-sub');
              if (sub) sub.textContent = opt.sub || '';
            }
            const permBox = document.getElementById('staffPermsBox');
            if (permBox) permBox.style.display = v === 'master' ? 'none' : 'block';
          })}
        </label>

        <div id="staffPermsBox" style="display: ${currentRole === 'master' ? 'none' : 'block'}">
          <div class="micro" style="margin-bottom:10px">Granular Permissions</div>
          <div class="stack gap8">
            ${permsList.map(p => `
              <label class="row gap10" style="cursor:pointer;padding:10px 12px;border:1px solid var(--line-soft);border-radius:var(--r);background:#FAFAF8">
                <input type="checkbox" name="staff_perm" value="${p.id}" ${currentPerms.includes(p.id) ? 'checked' : ''} style="width:16px;height:16px;accent-color:var(--ink)">
                <div>
                  <div style="font-weight:600;font-size:13px">${p.label}</div>
                  <div class="faint" style="font-size:11px">${p.desc}</div>
                </div>
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="modal-foot">
        <button class="btn btn-ghost" data-act="close">Cancel</button>
        <button class="btn btn-primary" data-act="staff-save" data-email="${esc(email || '')}">
          ${ic('check', 'icon-sm')} ${isEditing ? 'Update Signatory' : 'Add Staff Member'}
        </button>
      </div>
    </div>
  `;

  ctx.openModal(modalHtml);
}
