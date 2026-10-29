import { ic, spinner, hash, uid, dstr, dshort, ago, inDays, nf, nav, pct, short, esc, TODAY, kLogo } from './helpers.js';
import { HEDERA_LOGO, HEDERA_MARK } from './assets.js';
import { getAccounts, getPendingAccounts, calculateAge } from './auth.js';

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

  const signupQueueAlert = pendingAccounts.length ? `
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

  const queueRows = accounts.map(a => {
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
          <button class="btn btn-ghost btn-sm" data-act="admin-view-acc-audit" data-email="${esc(a.email)}">
            ${ic('fileCheck', 'icon-xs')} Audit Log
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
        <div style="font-weight:600;font-size:13.5px">${esc(a.firstName)} ${esc(a.lastName)}</div>
        <div class="faint" style="font-size:11.5px">${esc(a.title || 'Signatory')}</div>
      </td>
      <td class="mono" style="font-size:12.5px">${esc(a.email)}</td>
      <td>
        <div><span class="partner-pill">${roleName}</span></div>
        <div class="faint" style="font-size:11px;margin-top:2px">${esc(a.entity || 'Partner SPV')}</div>
      </td>
      <td class="mono" style="font-size:12px">${esc(a.dob || '—')} ${age ? `<span class="faint">(${age}y)</span>` : ''}</td>
      <td class="mono" style="font-size:12px">${a.createdAt ? dshort(a.createdAt) : '—'}</td>
      <td>${statusBadge}</td>
      <td class="t-right">${actionBtns}</td>
    </tr>`;
  }).join('');

  const tableRows = all.map(r => {
    const p = ctx.PL(r.pf);
    let actionBtn = '';
    if (r.status === 'Documents Uploaded') {
      actionBtn = `<button class="btn btn-primary btn-sm" data-act="admin-inspect-mint" data-id="${r.id}">${ic('shield', 'icon-sm')} Inspect &amp; Mint</button>`;
    } else if (r.status === 'Awaiting Originating Partner' || r.status === 'Notes Requested' || r.status === 'Pending Admin Review') {
      actionBtn = `<button class="btn btn-ghost btn-sm" data-act="req-details" data-id="${r.id}"><span class="faint">Awaiting Originator</span></button>`;
    } else {
      actionBtn = `<button class="btn btn-ghost btn-sm" data-act="req-details" data-id="${r.id}">${ic('fileCheck', 'icon-sm')} View Receipt</button>`;
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
  }).join('');

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

    <!-- Sign-up Approval Queue Section -->
    <div class="card" id="approval-queue" style="margin-bottom:24px">
      <div class="card-head">
        <div class="row gap10">
          ${ic('shieldCheck', 'icon-sm')}
          <div>
            <h3 style="margin:0;font-size:15px;font-weight:600">Sign-up Approval Queue &amp; Signatory Directory</h3>
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
    </div>

    <!-- Originating Partners Fee Exposure Card -->
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
            ${S.platforms.map(pf => {
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
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card" style="margin-bottom:24px">
      <div class="card-head">
        <h3>${ic('activity', 'icon-sm')} Capital Mint &amp; Note Coordination Pipeline</h3>
        <span class="badge b-ink">${all.length} requests</span>
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
              <th class="t-right">Action</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
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

