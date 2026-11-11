import { ic, kLogo, nf, short, esc, dshort } from './helpers.js';

/* ============================================================
   KBridge - Walkthrough & Help Guide Engine
   Simple, jargon-free, high-fidelity guided tour and documentation.
   ============================================================ */

export const WALKTHROUGH_STEPS = [
  {
    step: 1,
    title: 'Welcome to KBridge — How It Works',
    roleTag: 'Overview',
    roleKey: null,
    view: 'guide',
    summary: 'KBridge connects companies that have invoices with institutional partners who deposit USDC to earn steady yield.',
    bullets: [
      '<b>Capital Partners</b> bring USDC cash and receive yield-earning platform tokens.',
      '<b>Originating Partners</b> bring real-world invoices and receive funding.',
      '<b>Hedera Smart Contracts</b> lock collateral and execute token minting transparently.'
    ]
  },
  {
    step: 2,
    title: 'Capital Partner: Dashboard & Holdings',
    roleTag: 'Capital Partner',
    roleKey: 'theoriq',
    view: 'dash',
    summary: 'See your available cash, your token investments across platforms, and your earnings at a glance.',
    bullets: [
      '<b>Cash Available:</b> Total USDC ready to deploy across your registered fund wallets.',
      '<b>Portfolio Value:</b> Your tokens marked daily at their current published token value (NAV).',
      '<b>Holdings Card:</b> Live breakdown of tokens owned across Pursuit, Wayflyer, and Credix.'
    ]
  },
  {
    step: 3,
    title: 'Minting Tokens into Receivables Pools',
    roleTag: 'Capital Partner',
    roleKey: 'theoriq',
    view: 'platforms',
    summary: 'Choose an invoice platform, specify how much USDC to allocate, and request a mint.',
    bullets: [
      'Tokens are mathematically backed by verified, audited receivables.',
      'Token value increases day by day as debtor invoices accrue and pay out.',
      'Tokens are delivered directly to a secure, institutional Hedera custody wallet.'
    ]
  },
  {
    step: 4,
    title: 'Originator: Note & Contract Requests',
    roleTag: 'Originating Partner',
    roleKey: 'pursuit',
    view: 'requests',
    summary: 'When capital is requested, the originator is notified to upload signed legal contracts.',
    bullets: [
      'Originators upload signed <b>Promissory Notes</b> and <b>Invoice Assignment Contracts</b>.',
      'Each file is audited with SHA-256 cryptographic hashes and facility identifiers.',
      'Ensures no token is minted without fully binding collateral behind it.'
    ]
  },
  {
    step: 5,
    title: 'Originator: Kunda Box Fee Statement',
    roleTag: 'Originating Partner',
    roleKey: 'pursuit',
    view: 'fees',
    summary: 'A clean statement detailing what the originator owes Kunda Box for allocated capital.',
    bullets: [
      '<b>Automatic Registration:</b> Items appear automatically once capital is minted and transferred.',
      '<b>Formula:</b> <code>2.25% / 365 × number of days since allocation</code>.',
      '<b>Duration:</b> Clearly displays active days and elapsed months with no confusing buttons.'
    ]
  },
  {
    step: 6,
    title: 'Redemptions: Burning Tokens for Cash',
    roleTag: 'All Partners',
    roleKey: 'pursuit',
    view: 'redemptions',
    summary: 'When a capital partner wants their cash back, tokens are burned and USDC is paid.',
    bullets: [
      'Capital partner submits a redemption notice locking the tokens.',
      'Originator settles the request from their reserve wallet at the latest published token value.',
      'Tokens are permanently burned from supply on the Hedera Distributed Ledger.'
    ]
  },
  {
    step: 7,
    title: 'Wallets & Institutional Custody',
    roleTag: 'All Partners',
    roleKey: null,
    view: 'wallets',
    summary: 'Manage Hedera funding wallets for cash flow and view locked token custody.',
    bullets: [
      '<b>Fund Wallets:</b> Register Hedera EVM addresses to send and receive USDC settlement.',
      '<b>Token Custody:</b> A pre-configured, non-transferable vault address that holds your tokens.',
      '<b>Default Wallet:</b> Easily pick which wallet receives incoming capital proceeds.'
    ]
  }
];

/* ---------- Helper: Mock Browser Screenshot Generators ---------- */

export function renderMockBrowser(title, url, contentHtml) {
  return `
    <div class="mock-browser">
      <div class="mock-browser-bar">
        <div class="mock-dots">
          <span class="mock-dot mock-dot-red"></span>
          <span class="mock-dot mock-dot-yellow"></span>
          <span class="mock-dot mock-dot-green"></span>
        </div>
        <div class="mock-address">
          ${ic('lock', 'icon-xs')} https://${url}
        </div>
        <span class="badge b-gray" style="font-size:10px;padding:1px 6px">Live Preview</span>
      </div>
      <div class="mock-body">
        ${contentHtml}
      </div>
    </div>
  `;
}

/* Screenshot 1: Capital Dashboard */
export function screenshotCapitalDashboard() {
  const content = `
    <div style="background:#fff;border-radius:8px;padding:12px;border:1px solid #E4E4E0">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #F0F0EC;padding-bottom:10px;margin-bottom:12px">
        <div>
          <div style="font-size:13px;font-weight:600">Dashboard</div>
          <div style="font-size:10px;color:var(--muted)">Capital Partner Portfolio</div>
        </div>
        <span class="badge b-ink" style="font-size:9.5px">Capital View</span>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;margin-bottom:12px">
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:6px;padding:8px">
          <div style="font-size:9.5px;color:var(--muted)">Cash available</div>
          <div class="mono" style="font-size:14px;font-weight:600;margin-top:2px">145,000 <span style="font-size:10px">USDC</span></div>
          <div style="font-size:9px;color:var(--muted)">Across fund wallets</div>
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:6px;padding:8px">
          <div style="font-size:9.5px;color:var(--muted)">Portfolio value</div>
          <div class="mono" style="font-size:14px;font-weight:600;margin-top:2px">4,414,900 <span style="font-size:10px">USDC</span></div>
          <div style="font-size:9px;color:var(--muted)">Cost 4,250,000 USDC</div>
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:6px;padding:8px">
          <div style="font-size:9.5px;color:var(--muted)">Net gain</div>
          <div class="mono" style="font-size:14px;font-weight:600;color:var(--ok);margin-top:2px">+164,900</div>
          <div style="font-size:9px;color:var(--ok)">+3.88% on cost</div>
        </div>
      </div>

      <div style="border:1px solid #E4E4E0;border-radius:6px;overflow:hidden">
        <div style="background:#FAFAF8;padding:6px 10px;font-size:10.5px;font-weight:600;border-bottom:1px solid #E4E4E0">
          Your Holdings
        </div>
        <div style="padding:8px 10px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #F0F0EC">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="width:16px;height:16px;border-radius:4px;background:#0C2340;display:inline-block"></span>
            <div>
              <div style="font-size:11px;font-weight:600">Pursuit Receivables SPV I</div>
              <div style="font-size:9px;color:var(--muted)">4,250,000.00 TOKENS · $1.0388 per token</div>
            </div>
          </div>
          <div class="mono" style="font-size:11px;font-weight:600">4,414,900.00 USDC</div>
        </div>
      </div>
    </div>
  `;
  return renderMockBrowser('Capital Dashboard', 'kbridge.io/portal/capital/dashboard', content);
}

/* Screenshot 2: Platforms & Token Minting */
export function screenshotPlatformsMinting() {
  const content = `
    <div style="background:#fff;border-radius:8px;padding:12px;border:1px solid #E4E4E0">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #F0F0EC;padding-bottom:10px;margin-bottom:12px">
        <div>
          <div style="font-size:13px;font-weight:600">Receivables Platforms</div>
          <div style="font-size:10px;color:var(--muted)">Select a pool to mint tokens into</div>
        </div>
        <button class="btn btn-primary btn-xs" style="font-size:10px;padding:3px 8px">Mint Tokens</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        <div style="border:1px solid #E4E4E0;border-radius:6px;padding:10px;background:#FAFAF8">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:11.5px;font-weight:600">Pursuit</div>
            <span class="badge b-green" style="font-size:9px">Open</span>
          </div>
          <div style="font-size:9.5px;color:var(--muted);margin-top:2px">Trade receivables · 30-120 day invoices</div>
          <div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:6px;border-top:1px dashed #E4E4E0">
            <div>
              <div style="font-size:8.5px;color:var(--muted)">Value per token</div>
              <div class="mono" style="font-size:11px;font-weight:600">$1.0388</div>
            </div>
            <div>
              <div style="font-size:8.5px;color:var(--muted)">Pool value</div>
              <div class="mono" style="font-size:11px;font-weight:600">4.41M USDC</div>
            </div>
          </div>
        </div>

        <div style="border:1px solid #E4E4E0;border-radius:6px;padding:10px;background:#FAFAF8">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:11.5px;font-weight:600">Wayflyer</div>
            <span class="badge b-green" style="font-size:9px">Open</span>
          </div>
          <div style="font-size:9.5px;color:var(--muted);margin-top:2px">eCommerce advances · 30-90 day revs</div>
          <div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:6px;border-top:1px dashed #E4E4E0">
            <div>
              <div style="font-size:8.5px;color:var(--muted)">Value per token</div>
              <div class="mono" style="font-size:11px;font-weight:600">$1.0250</div>
            </div>
            <div>
              <div style="font-size:8.5px;color:var(--muted)">Pool value</div>
              <div class="mono" style="font-size:11px;font-weight:600">1.89M USDC</div>
            </div>
          </div>
        </div>
      </div>

      <div style="background:#F6F6F4;border:1px solid #E4E4E0;border-radius:6px;padding:8px;font-size:10px;color:var(--ink-2);display:flex;align-items:center;gap:6px">
        ${ic('info', 'icon-xs')}
        <span>Minting turns treasury USDC into platform tokens at current daily NAV. Originating partner is auto-notified.</span>
      </div>
    </div>
  `;
  return renderMockBrowser('Platforms & Minting', 'kbridge.io/portal/capital/platforms', content);
}

/* Screenshot 3: Originator Note & Contract Requests */
export function screenshotOriginatorRequests() {
  const content = `
    <div style="background:#fff;border-radius:8px;padding:12px;border:1px solid #E4E4E0">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #F0F0EC;padding-bottom:10px;margin-bottom:10px">
        <div>
          <div style="font-size:13px;font-weight:600">Note &amp; Contract Requests</div>
          <div style="font-size:10px;color:var(--muted)">Upload signed promissory notes backing capital allocations</div>
        </div>
        <span class="badge b-amber" style="font-size:9.5px">1 Awaiting Action</span>
      </div>

      <div style="background:#FFFBEB;border:1px solid #FCD9A5;border-radius:6px;padding:8px;margin-bottom:10px;display:flex;align-items:center;gap:6px;font-size:10px">
        ${ic('fileText', 'icon-xs')}
        <span><b>Capital Allocation Received:</b> Please upload signed legal notes for Acme Nuts &amp; Bolts (100,000 USDC).</span>
      </div>

      <div style="border:1px solid #E4E4E0;border-radius:6px;overflow:hidden">
        <table style="width:100%;font-size:10px">
          <thead>
            <tr style="background:#FAFAF8;border-bottom:1px solid #E4E4E0;color:var(--muted);text-align:left">
              <th style="padding:6px 8px">Request ID</th>
              <th style="padding:6px 8px">Capital Partner</th>
              <th style="padding:6px 8px;text-align:right">Amount</th>
              <th style="padding:6px 8px">Pipeline Status</th>
              <th style="padding:6px 8px;text-align:right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #F0F0EC">
              <td class="mono" style="padding:6px 8px;font-weight:600">REQ-2026-081</td>
              <td style="padding:6px 8px">Theoriq Treasury</td>
              <td class="mono" style="padding:6px 8px;text-align:right;font-weight:600">100,000 USDC</td>
              <td style="padding:6px 8px"><span class="badge b-amber" style="font-size:9px">Awaiting Documents</span></td>
              <td style="padding:6px 8px;text-align:right"><button class="btn btn-primary btn-xs" style="font-size:9px;padding:2px 6px">Submit Notes</button></td>
            </tr>
            <tr>
              <td class="mono" style="padding:6px 8px;font-weight:600">REQ-2026-079</td>
              <td style="padding:6px 8px">Theoriq Treasury</td>
              <td class="mono" style="padding:6px 8px;text-align:right;font-weight:600">300,000 USDC</td>
              <td style="padding:6px 8px"><span class="badge b-green" style="font-size:9px">Minted &amp; Settled</span></td>
              <td style="padding:6px 8px;text-align:right"><span class="badge b-gray" style="font-size:9px">Verified</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  return renderMockBrowser('Originator Note Requests', 'kbridge.io/portal/originator/requests', content);
}

/* Screenshot 4: Wallets & Institutional Custody */
export function screenshotWallets() {
  const content = `
    <div style="background:#fff;border-radius:8px;padding:12px;border:1px solid #E4E4E0">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #F0F0EC;padding-bottom:10px;margin-bottom:10px">
        <div>
          <div style="font-size:13px;font-weight:600">Hedera Wallets &amp; Custody</div>
          <div style="font-size:10px;color:var(--muted)">USDC fund cash reserves and institutional token vault</div>
        </div>
        <span class="badge b-green" style="font-size:9px">Hedera Network</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:6px;padding:8px">
          <div style="font-size:10px;font-weight:600;margin-bottom:4px">Fund Wallets (USDC)</div>
          <div class="mono" style="font-size:12px;font-weight:600">1,250,000.00 USDC</div>
          <div class="mono" style="font-size:8.5px;color:var(--muted);margin-top:2px">0x12a9...c48b · Default</div>
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:6px;padding:8px">
          <div style="font-size:10px;font-weight:600;margin-bottom:4px">Token Custody Vault</div>
          <div class="mono" style="font-size:12px;font-weight:600">800,000.00 TOKENS</div>
          <div class="mono" style="font-size:8.5px;color:var(--muted);margin-top:2px">0x81b0...9f21 · Non-transferable</div>
        </div>
      </div>
    </div>
  `;
  return renderMockBrowser('Hedera Wallets & Custody', 'kbridge.io/portal/wallets', content);
}


/* Screenshot 5: Originator Kunda Box Fee Statement */
export function screenshotOriginatorFees() {
  const content = `
    <div style="background:#fff;border-radius:8px;padding:12px;border:1px solid #E4E4E0">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #F0F0EC;padding-bottom:10px;margin-bottom:10px">
        <div>
          <div style="font-size:13px;font-weight:600">Kunda Box (KBridge) Statement &amp; Fees</div>
          <div style="font-size:10px;color:var(--muted)">Originator statement: 2.25% / 365 daily accrual on allocated capital</div>
        </div>
        <span class="badge b-ink" style="font-size:9.5px">Official Statement</span>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;margin-bottom:10px">
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:6px;padding:6px">
          <div style="font-size:8.5px;color:var(--muted)">Allocated Capital</div>
          <div class="mono" style="font-size:11.5px;font-weight:600">300,000.00 <span style="font-size:8.5px">USDC</span></div>
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:6px;padding:6px">
          <div style="font-size:8.5px;color:var(--muted)">Accrued Fees</div>
          <div class="mono" style="font-size:11.5px;font-weight:600;color:var(--amber)">55.48 <span style="font-size:8.5px">USDC</span></div>
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:6px;padding:6px">
          <div style="font-size:8.5px;color:var(--muted)">Total Owed</div>
          <div class="mono" style="font-size:11.5px;font-weight:600">300,055.48 <span style="font-size:8.5px">USDC</span></div>
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:6px;padding:6px">
          <div style="font-size:8.5px;color:var(--muted)">Daily Rate</div>
          <div class="mono" style="font-size:11.5px;font-weight:600">0.00616% / day</div>
        </div>
      </div>

      <div style="border:1px solid #E4E4E0;border-radius:6px;overflow:hidden">
        <table style="width:100%;font-size:9.5px">
          <thead>
            <tr style="background:#FAFAF8;border-bottom:1px solid #E4E4E0;color:var(--muted);text-align:left">
              <th style="padding:5px 6px">Allocation ID</th>
              <th style="padding:5px 6px">Capital Partner</th>
              <th style="padding:5px 6px;text-align:right">Capital</th>
              <th style="padding:5px 6px">Duration (per month)</th>
              <th style="padding:5px 6px;text-align:right">Rate</th>
              <th style="padding:5px 6px;text-align:right">Accrued Fee</th>
              <th style="padding:5px 6px;text-align:right">Total Owed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="mono" style="padding:6px;font-weight:600">REQ-2026-079</td>
              <td style="padding:6px">Theoriq Treasury</td>
              <td class="mono" style="padding:6px;text-align:right;font-weight:600">300,000.00 USDC</td>
              <td class="mono" style="padding:6px">3 days active (0.1 mos)</td>
              <td class="mono" style="padding:6px;text-align:right">2.25% p.a.</td>
              <td class="mono" style="padding:6px;text-align:right;color:var(--amber);font-weight:600">55.48 USDC</td>
              <td class="mono" style="padding:6px;text-align:right;font-weight:600">300,055.48 USDC</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  return renderMockBrowser('Kunda Box Fee Statement', 'kbridge.io/portal/originator/kunda-box-fees', content);
}

/* Screenshot 6: Token Redemptions */
export function screenshotRedemptions() {
  const content = `
    <div style="background:#fff;border-radius:8px;padding:12px;border:1px solid #E4E4E0">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #F0F0EC;padding-bottom:10px;margin-bottom:10px">
        <div>
          <div style="font-size:13px;font-weight:600">Token Redemptions &amp; Settlement</div>
          <div style="font-size:10px;color:var(--muted)">Burn platform tokens back into liquid USDC at published NAV</div>
        </div>
        <span class="badge b-green" style="font-size:9.5px">Reserve Funded</span>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;margin-bottom:10px">
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:6px;padding:6px">
          <div style="font-size:8.5px;color:var(--muted)">Waiting in Queue</div>
          <div class="mono" style="font-size:12px;font-weight:600">2 Requests</div>
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:6px;padding:6px">
          <div style="font-size:8.5px;color:var(--muted)">Tokens to Burn</div>
          <div class="mono" style="font-size:12px;font-weight:600">185,000.00 TOKENS</div>
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:6px;padding:6px">
          <div style="font-size:8.5px;color:var(--muted)">Cash Required</div>
          <div class="mono" style="font-size:12px;font-weight:600">192,178.00 USDC</div>
        </div>
      </div>

      <div style="border:1px solid #E4E4E0;border-radius:6px;overflow:hidden">
        <div style="padding:6px 8px;font-size:10px;display:flex;justify-content:space-between;align-items:center">
          <div>
            <span class="mono" style="font-weight:600">RDM-0042</span> · 120,000 TOKENS ($1.0388 NAV)
            <div style="font-size:8.5px;color:var(--muted)">Holder: Theoriq Treasury · Pay: 124,656.00 USDC</div>
          </div>
          <button class="btn btn-primary btn-xs" style="font-size:9px;padding:2px 8px">Settle &amp; Burn</button>
        </div>
      </div>
    </div>
  `;
  return renderMockBrowser('Redemptions Queue', 'kbridge.io/portal/redemptions', content);
}

/* ---------- Main Help Guide View (Full Page) ---------- */

export function viewHelpGuide(S, CTX) {
  const isWalkthroughOn = !!(S.walkthrough && S.walkthrough.active);
  const currentRoleFilter = S.guideFilter || 'all';

  const filterBtn = (key, label) => {
    const on = currentRoleFilter === key;
    return `<button class="btn btn-sm ${on ? 'btn-primary' : 'btn-ghost'}" data-act="guide-filter" data-role="${key}" style="border-radius:99px;font-size:12px;padding:5px 14px">
      ${label}
    </button>`;
  };

  return `
    <div class="page-head" style="margin-bottom:20px">
      <div>
        <h1 style="font-size:24px;font-weight:600;letter-spacing:-.02em">KBridge Help Guide &amp; Feature Walkthrough</h1>
        <p class="muted" style="font-size:14px;margin-top:4px">
          A simple, plain-English overview of how KBridge works, how invoices are tokenized on Hedera, and how fees accrue.
        </p>
      </div>

      <div class="row gap8">
        <button class="btn ${isWalkthroughOn ? 'btn-danger' : 'btn-primary'}" data-act="toggle-walkthrough">
          ${ic('sparkle', 'icon-sm')}
          ${isWalkthroughOn ? 'Turn Off Walkthrough' : 'Start Interactive Walkthrough'}
        </button>
      </div>
    </div>

    <!-- Role Filter Tabs -->
    <div class="row gap8" style="margin-bottom:24px;flex-wrap:wrap;align-items:center">
      <span class="faint" style="font-size:12px;font-weight:600;text-transform:uppercase;margin-right:4px">Filter by Role:</span>
      ${filterBtn('all', 'All Features')}
      ${filterBtn('theoriq', 'Capital Partner')}
      ${filterBtn('pursuit', 'Originating Partner')}
    </div>

    <!-- Feature Walkthrough Sections with Screenshots -->
    <div class="stack gap24">

      <!-- Section 1: Capital Partner Dashboard -->
      ${(currentRoleFilter === 'all' || currentRoleFilter === 'theoriq') ? `
      <div class="guide-card">
        <div class="card-head">
          <div class="row gap10">
            <span class="guide-step-num">1</span>
            <div>
              <h3 style="margin:0;font-size:16px;font-weight:600">Capital Partner: Cash, Holdings &amp; Gains</h3>
              <div class="faint" style="font-size:12px;margin-top:2px">Dashboard for treasuries deploying USDC into real-world trade finance</div>
            </div>
          </div>
          <span class="guide-tag-pill" style="background:#F3F3F0;color:#141413">Capital Partner</span>
        </div>
        <div class="card-pad" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:20px;align-items:center">
          <div>
            ${screenshotCapitalDashboard()}
          </div>
          <div class="stack gap12">
            <div>
              <div style="font-weight:600;font-size:14px;color:var(--ink)">What this page does</div>
              <p class="muted" style="font-size:13px;line-height:1.55;margin-top:4px">
                When you sign in as a Capital Partner, this dashboard gives you total visibility over your treasury funds. You can see how much liquid USDC you have in reserve, your total portfolio value across all receivable pools, and your exact net gain over cost.
              </p>
            </div>
            <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:8px;padding:12px;font-size:12.5px" class="stack gap6">
              <div><b>• Cash Available:</b> USDC sitting in your primary and secondary fund wallets on Hedera.</div>
              <div><b>• Portfolio Value:</b> Calculated automatically every day as platforms publish invoice accruals.</div>
              <div><b>• Direct Navigation:</b> One click takes you into any platform to mint more or request redemptions.</div>
            </div>
            <div>
              <button class="btn btn-ghost btn-sm" data-act="guide-jump-live" data-view="dash" data-org="theoriq">
                ${ic('upright', 'icon-xs')} View Live Capital Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Section 2: Platforms & Token Minting -->
      ${(currentRoleFilter === 'all' || currentRoleFilter === 'theoriq') ? `
      <div class="guide-card">
        <div class="card-head">
          <div class="row gap10">
            <span class="guide-step-num">2</span>
            <div>
              <h3 style="margin:0;font-size:16px;font-weight:600">Receivables Platforms &amp; Minting Tokens</h3>
              <div class="faint" style="font-size:12px;margin-top:2px">How treasury USDC is allocated to verified invoice pools</div>
            </div>
          </div>
          <span class="guide-tag-pill" style="background:#F3F3F0;color:#141413">Capital Partner</span>
        </div>
        <div class="card-pad" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:20px;align-items:center">
          <div>
            ${screenshotPlatformsMinting()}
          </div>
          <div class="stack gap12">
            <div>
              <div style="font-weight:600;font-size:14px;color:var(--ink)">How minting works</div>
              <p class="muted" style="font-size:13px;line-height:1.55;margin-top:4px">
                Capital partners browse active platforms (such as <b>Pursuit</b> for trade receivables, <b>Wayflyer</b> for eCommerce, and <b>Credix</b> for asset-backed pools). When you allocate USDC, you receive platform tokens at the daily published valuation.
              </p>
            </div>
            <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:8px;padding:12px;font-size:12.5px" class="stack gap6">
              <div><b>• Zero Speculation:</b> Tokens are 1:1 backed by real invoices from vetted suppliers.</div>
              <div><b>• Institutional Custody:</b> Tokens are delivered to your pre-configured, non-transferable Hedera custody wallet.</div>
              <div><b>• Automatic Routing:</b> Submitting a mint request instantly notifies the Originator to supply signed contract notes.</div>
            </div>
            <div>
              <button class="btn btn-ghost btn-sm" data-act="guide-jump-live" data-view="platforms" data-org="theoriq">
                ${ic('upright', 'icon-xs')} Explore Platforms Live
              </button>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Section 3: Originator Note & Contract Requests -->
      ${(currentRoleFilter === 'all' || currentRoleFilter === 'pursuit') ? `
      <div class="guide-card">
        <div class="card-head">
          <div class="row gap10">
            <span class="guide-step-num">3</span>
            <div>
              <h3 style="margin:0;font-size:16px;font-weight:600">Originator: Note &amp; Contract Requests</h3>
              <div class="faint" style="font-size:12px;margin-top:2px">Submitting signed legal promissory notes to back capital requests</div>
            </div>
          </div>
          <span class="guide-tag-pill" style="background:#F5F5F3;color:#57534E">Originating Partner</span>
        </div>
        <div class="card-pad" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:20px;align-items:center">
          <div>
            ${screenshotOriginatorRequests()}
          </div>
          <div class="stack gap12">
            <div>
              <div style="font-weight:600;font-size:14px;color:var(--ink)">Legal backing verification</div>
              <p class="muted" style="font-size:13px;line-height:1.55;margin-top:4px">
                In KBridge, tokens are never minted out of thin air. When a capital partner requests tokens, the Originating Partner receives a formal notification to provide signed legal promissory notes and invoice assignment agreements.
              </p>
            </div>
            <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:8px;padding:12px;font-size:12.5px" class="stack gap6">
              <div><b>• Document Pipeline:</b> Upload signed PDFs with signatory verification and invoice facility IDs.</div>
              <div><b>• Cryptographic Audit:</b> Every file generates a SHA-256 hash verified by the protocol.</div>
              <div><b>• Ready for Mint:</b> Once submitted, backing contracts are confirmed and token minting executes on Hedera.</div>
            </div>
            <div>
              <button class="btn btn-ghost btn-sm" data-act="guide-jump-live" data-view="requests" data-org="pursuit">
                ${ic('upright', 'icon-xs')} View Note Requests Live
              </button>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Section 4: Originator Kunda Box Fees Statement -->
      ${(currentRoleFilter === 'all' || currentRoleFilter === 'pursuit') ? `
      <div class="guide-card">
        <div class="card-head">
          <div class="row gap10">
            <span class="guide-step-num">4</span>
            <div>
              <h3 style="margin:0;font-size:16px;font-weight:600">Originator: Kunda Box (KBridge) Fee Statement</h3>
              <div class="faint" style="font-size:12px;margin-top:2px">Statement of fees owed on allocated capital (2.25% / 365 daily accrual)</div>
            </div>
          </div>
          <span class="guide-tag-pill" style="background:#F5F5F3;color:#57534E">Originating Partner</span>
        </div>
        <div class="card-pad" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:20px;align-items:center">
          <div>
            ${screenshotOriginatorFees()}
          </div>
          <div class="stack gap12">
            <div>
              <div style="font-weight:600;font-size:14px;color:var(--ink)">Simple statement of fees owed</div>
              <p class="muted" style="font-size:13px;line-height:1.55;margin-top:4px">
                Originators borrow capital to fund invoice advances and pay an administrative protocol fee of <b>2.25% per year</b> to Kunda Box (kbridge). This screen acts as an official record and statement detailing every allocation.
              </p>
            </div>
            <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:8px;padding:12px;font-size:12.5px" class="stack gap6">
              <div><b>• Formula:</b> <code>2.25% / 365 × number of days since allocation</code> (accruing daily at 0.00616%).</div>
              <div><b>• Per-Month Tracking:</b> Clearly shows the duration in elapsed days and active months.</div>
              <div><b>• Clean Statement:</b> Purely transparent reporting with no clutter or extra buttons.</div>
            </div>
            <div>
              <button class="btn btn-ghost btn-sm" data-act="guide-jump-live" data-view="fees" data-org="pursuit">
                ${ic('upright', 'icon-xs')} View Live Fee Statement
              </button>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Section 5: Redemptions & Settle -->
      ${(currentRoleFilter === 'all' || currentRoleFilter === 'theoriq' || currentRoleFilter === 'pursuit') ? `
      <div class="guide-card">
        <div class="card-head">
          <div class="row gap10">
            <span class="guide-step-num">5</span>
            <div>
              <h3 style="margin:0;font-size:16px;font-weight:600">Redemptions: Burning Tokens Back to Cash</h3>
              <div class="faint" style="font-size:12px;margin-top:2px">Liquidating tokenized positions back into USDC</div>
            </div>
          </div>
          <span class="guide-tag-pill" style="background:#F3F3F0;color:#141413">All Partners</span>
        </div>
        <div class="card-pad" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:20px;align-items:center">
          <div>
            ${screenshotRedemptions()}
          </div>
          <div class="stack gap12">
            <div>
              <div style="font-weight:600;font-size:14px;color:var(--ink)">How redemptions settle</div>
              <p class="muted" style="font-size:13px;line-height:1.55;margin-top:4px">
                When a capital partner wants to exit a position, they submit a redemption request. The tokens are locked and the Originator is notified to settle the request by transferring USDC from their reserve wallet.
              </p>
            </div>
            <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:8px;padding:12px;font-size:12.5px" class="stack gap6">
              <div><b>• Accurate Valuation:</b> Paid at the daily published token value (NAV).</div>
              <div><b>• Deflationary Token Burn:</b> Once paid, tokens are permanently removed from circulating supply on Hedera.</div>
              <div><b>• Complete History:</b> Every transaction has an immutable cryptographic hash for compliance.</div>
            </div>
            <div>
              <button class="btn btn-ghost btn-sm" data-act="guide-jump-live" data-view="redemptions" data-org="pursuit">
                ${ic('upright', 'icon-xs')} View Redemptions Queue Live
              </button>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Section 6: Wallets & Institutional Custody -->
      ${(currentRoleFilter === 'all' || currentRoleFilter === 'theoriq' || currentRoleFilter === 'pursuit') ? `
      <div class="guide-card">
        <div class="card-head">
          <div class="row gap10">
            <span class="guide-step-num">6</span>
            <div>
              <h3 style="margin:0;font-size:16px;font-weight:600">Wallets &amp; Institutional Custody</h3>
              <div class="faint" style="font-size:12px;margin-top:2px">Managing USDC cash flow wallets and pre-configured token vaults</div>
            </div>
          </div>
          <span class="guide-tag-pill" style="background:#F3F3F0;color:#141413">All Partners</span>
        </div>
        <div class="card-pad" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:20px;align-items:center">
          <div>
            ${screenshotWallets()}
          </div>
          <div class="stack gap12">
            <div>
              <div style="font-weight:600;font-size:14px;color:var(--ink)">Secure custody on Hedera</div>
              <p class="muted" style="font-size:13px;line-height:1.55;margin-top:4px">
                KBridge separates cash transfers from token custody for institutional safety. You can register multiple Hedera fund wallets for daily USDC operations, while tokens reside in an immutable vault.
              </p>
            </div>
            <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:8px;padding:12px;font-size:12.5px" class="stack gap6">
              <div><b>• Fund Wallets:</b> Easily add or edit wallets to send capital or receive redemption payouts.</div>
              <div><b>• Non-Transferable Vault:</b> Tokens cannot be transferred to arbitrary third parties, preventing security risks.</div>
              <div><b>• Primary Allocation:</b> Designate your primary default wallet for automated capital routing.</div>
            </div>
            <div>
              <button class="btn btn-ghost btn-sm" data-act="guide-jump-live" data-view="wallets" data-org="${currentRoleFilter === 'pursuit' ? 'pursuit' : 'theoriq'}">
                ${ic('upright', 'icon-xs')} View Wallets Live
              </button>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

    </div>

    <!-- Plain-English Glossary -->
    <div class="card card-pad" style="margin-top:28px">
      <div class="card-head" style="margin:-24px -24px 20px -24px">
        <div class="row gap8">
          ${ic('info', 'icon-sm')}
          <h3 style="margin:0;font-size:15px;font-weight:600">KBridge Plain-English Glossary (No Jargon)</h3>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;font-size:13px">
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:8px;padding:12px">
          <b>Token Value (NAV):</b> The price of one token in USDC. It rises slightly every day as debtor businesses pay interest on their invoices.
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:8px;padding:12px">
          <b>Minting:</b> Depositing USDC cash into a platform pool to receive newly created tokens.
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:8px;padding:12px">
          <b>Redemption:</b> Returning tokens to the platform in exchange for liquid USDC cash.
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:8px;padding:12px">
          <b>Promissory Note:</b> A legally binding corporate loan contract signed by the Originator promising full repayment.
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:8px;padding:12px">
          <b>Kunda Box Fee:</b> An administrative protocol fee of 2.25% per year, calculated daily as <code>2.25% / 365 × days</code>.
        </div>
        <div style="background:#FAFAF8;border:1px solid #E4E4E0;border-radius:8px;padding:12px">
          <b>Hedera Network:</b> The ultra-fast, energy-efficient distributed ledger that handles token custody and settlement.
        </div>
      </div>
    </div>
  `;
}

/* ---------- Floating Interactive Walkthrough Widget ---------- */

export function renderWalkthroughWidget(S, CTX) {
  if (!S.walkthrough || !S.walkthrough.active) return '';

  const stepIdx = S.walkthrough.step || 0;
  const totalSteps = WALKTHROUGH_STEPS.length;
  const currentStep = WALKTHROUGH_STEPS[stepIdx] || WALKTHROUGH_STEPS[0];
  const percent = Math.round(((stepIdx + 1) / totalSteps) * 100);

  const dots = WALKTHROUGH_STEPS.map((s, idx) => {
    const cls = idx === stepIdx ? 'active' : (idx < stepIdx ? 'done' : '');
    return `<span class="walkthrough-dot ${cls}" data-act="walkthrough-jump" data-step="${idx}" title="Step ${idx+1}: ${s.title}"></span>`;
  }).join('');

  return `
    <div class="walkthrough-widget" id="walkthroughWidget">
      <!-- Header -->
      <div class="between" style="align-items:flex-start">
        <div class="row gap8">
          <span style="background:#141413;color:#fff;font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:999px">
            Step ${stepIdx + 1} of ${totalSteps}
          </span>
          <span class="badge b-gray" style="font-size:11px;font-weight:600">
            ${currentStep.roleTag}
          </span>
        </div>
        <button class="xbtn" data-act="walkthrough-close" title="Turn off walkthrough">
          ${ic('x', 'icon-sm')}
        </button>
      </div>

      <!-- Title & Summary -->
      <div>
        <h4 style="font-size:15px;font-weight:600;color:var(--ink);margin:0 0 4px 0">
          ${currentStep.title}
        </h4>
        <p style="font-size:12.5px;color:var(--muted);line-height:1.45;margin:0">
          ${currentStep.summary}
        </p>
      </div>

      <!-- Simple Bullet Points -->
      <div style="background:#FAFAF8;border:1px solid var(--line);border-radius:var(--r);padding:10px 12px;font-size:12px;line-height:1.5" class="stack gap4">
        ${currentStep.bullets.map(b => `<div>${b}</div>`).join('')}
      </div>

      <!-- Live Page Action -->
      ${currentStep.view ? `
      <div class="between" style="padding:6px 0;border-top:1px dashed var(--line);border-bottom:1px dashed var(--line)">
        <span class="faint" style="font-size:11px">Demonstrating: <b>${currentStep.title}</b></span>
        <button class="btn btn-ghost btn-xs" data-act="walkthrough-show-live" data-view="${currentStep.view}" data-role="${currentStep.roleKey || ''}" style="font-size:11px;padding:3px 8px">
          ${ic('upright', 'icon-xs')} Jump to Live Page
        </button>
      </div>
      ` : ''}

      <!-- Progress Track -->
      <div>
        <div class="walkthrough-bar-track">
          <div class="walkthrough-bar-fill" style="width:${percent}%"></div>
        </div>
        <div class="between" style="margin-top:6px">
          <div class="row gap6">${dots}</div>
          <span class="mono faint" style="font-size:10px">${percent}% completed</span>
        </div>
      </div>

      <!-- Navigation Footer -->
      <div class="between" style="margin-top:2px">
        <button class="btn btn-quiet btn-xs" data-act="toggle-walkthrough" style="font-size:11.5px;color:var(--muted)">
          Turn Off
        </button>

        <div class="row gap6">
          <button class="btn btn-ghost btn-sm" data-act="walkthrough-prev" ${stepIdx === 0 ? 'disabled' : ''} style="padding:5px 12px;font-size:12px">
            ${ic('back', 'icon-xs')} Back
          </button>
          
          ${stepIdx < totalSteps - 1 ? `
            <button class="btn btn-primary btn-sm" data-act="walkthrough-next" style="padding:5px 14px;font-size:12px">
              Next Step ${ic('right', 'icon-xs')}
            </button>
          ` : `
            <button class="btn btn-primary btn-sm" data-act="walkthrough-close" style="padding:5px 14px;font-size:12px">
              ${ic('check', 'icon-xs')} Finish Tour
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}
