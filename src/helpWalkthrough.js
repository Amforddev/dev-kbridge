import { ic, spinner, hash, uid, dstr, dshort, ago, inDays, nf, nav, pct, short, esc, TODAY, kLogo, kLockup, stat, pageHead, banner } from './helpers.js';
import { HEDERA_LOGO, HEDERA_MARK } from './assets.js';

/* ============================================================
   KBridge Help Guide & Interactive Walkthrough Engine
   ============================================================ */

export function viewHelpGuide(S, ctx) {
  const isTourOn = S.walkthroughActive || false;

  return `
    ${ctx.pageHead('KBridge Help Guide & Documentation', 'Comprehensive reference manual for institutional partners, capital minting workflows, Kunda Box fee statements, and Hedera settlement mechanics.',
      `<button class="btn ${isTourOn ? 'btn-primary' : 'btn-ghost'}" data-act="toggle-walkthrough">
        ${ic(isTourOn ? 'check' : 'sparkle', 'icon-sm')} ${isTourOn ? 'Interactive Tour: ON' : 'Turn On Guided Tour'}
      </button>`)}

    <!-- Interactive Tour Banner -->
    <div class="callout ${isTourOn ? 'c-green' : 'c-neutral'}" style="margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
      <div class="row gap12" style="align-items:center">
        <div style="width:36px;height:36px;border-radius:8px;background:var(--line-soft);display:flex;align-items:center;justify-content:center;color:var(--ink)">
          ${ic('compass', 'icon-md')}
        </div>
        <div>
          <b>Interactive Guided Walkthrough is currently ${isTourOn ? 'ACTIVE' : 'OFF'}.</b>
          ${isTourOn ? 'Follow the step-by-step assistant tour overlay as you navigate portal screens.' : 'Click "Turn On Guided Tour" to enable interactive feature callouts and guided walkthrough overlays.'}
        </div>
      </div>
      <button class="btn btn-sm btn-primary" data-act="toggle-walkthrough">
        ${isTourOn ? 'Disable Tour' : 'Enable Walkthrough'}
      </button>
    </div>

    <!-- Quick Navigation Anchor Cards -->
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:28px">
      <div class="card card-pad" style="cursor:pointer" data-act="jump-help" data-target="arch">
        <div style="font-weight:600;font-size:14px;margin-bottom:4px;display:flex;align-items:center;gap:8px">${ic('layers','icon-sm')} 1. Architecture & Roles</div>
        <div class="faint" style="font-size:12.5px">Capital Partners, Originators &amp; Protocol Admin</div>
      </div>
      <div class="card card-pad" style="cursor:pointer" data-act="jump-help" data-target="mint">
        <div style="font-weight:600;font-size:14px;margin-bottom:4px;display:flex;align-items:center;gap:8px">${ic('coins','icon-sm')} 2. Minting &amp; Notes</div>
        <div class="faint" style="font-size:12.5px">4-step pipeline and promissory document upload</div>
      </div>
      <div class="card card-pad" style="cursor:pointer" data-act="jump-help" data-target="fees">
        <div style="font-weight:600;font-size:14px;margin-bottom:4px;display:flex;align-items:center;gap:8px">${ic('bank','icon-sm')} 3. Kunda Box Fees</div>
        <div class="faint" style="font-size:12.5px">2.25% / 365 daily accrual &amp; monthly statements</div>
      </div>
      <div class="card card-pad" style="cursor:pointer" data-act="jump-help" data-target="redm">
        <div style="font-weight:600;font-size:14px;margin-bottom:4px;display:flex;align-items:center;gap:8px">${ic('flame','icon-sm')} 4. Redemptions</div>
        <div class="faint" style="font-size:12.5px">Token locking, burning, and USDC settlement</div>
      </div>
    </div>

    <!-- Main Documentation Content -->
    <div class="stack" style="gap:28px">

      <!-- Section 1: Architecture & Roles -->
      <div class="card card-pad" id="sec-arch">
        <div class="card-head" style="margin:-24px -24px 20px;border-radius:var(--r-lg) var(--r-lg) 0 0">
          <h3>${ic('layers','icon-sm')} 1. Platform Architecture &amp; User Roles</h3>
          <span class="badge b-ink">Core Concepts</span>
        </div>
        <p style="color:var(--ink-2);line-height:1.6;margin-bottom:16px">
          KBridge is a real-time institutional gateway operating on the Hedera Distributed Ledger Technology (DLT) network. It bridges audited trade receivables and short-term credit assets with vetted institutional yield providers.
        </p>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:16px">
          <div class="panel" style="background:#FAFAF8;padding:16px;border-radius:var(--r)">
            <b style="color:var(--ink);font-size:14px">Capital Partner (Theoriq)</b>
            <p class="faint" style="font-size:12.5px;margin-top:6px;line-height:1.45">
              Deploys treasury USDC into receivables platforms, mints tokenized yield positions into a secure custody address, and tracks daily NAV growth.
            </p>
          </div>
          <div class="panel" style="background:#FAFAF8;padding:16px;border-radius:var(--r)">
            <b style="color:var(--ink);font-size:14px">Originating Partner (Pursuit, Wayflyer, Credix)</b>
            <p class="faint" style="font-size:12.5px;margin-top:6px;line-height:1.45">
              Originates invoices/advances, submits backing promissory notes, publishes daily token net asset values (NAV), and settles redemptions.
            </p>
          </div>
          <div class="panel" style="background:#FAFAF8;padding:16px;border-radius:var(--r)">
            <b style="color:var(--ink);font-size:14px">KBridge Governance Admin</b>
            <p class="faint" style="font-size:12.5px;margin-top:6px;line-height:1.45">
              Audits corporate KYC applications, coordinates legal note documentation, inspects mint requests, and executes final Hedera DLT mint/burn transactions.
            </p>
          </div>
        </div>
      </div>

      <!-- Section 2: Capital Minting & Note Coordination -->
      <div class="card card-pad" id="sec-mint">
        <div class="card-head" style="margin:-24px -24px 20px;border-radius:var(--r-lg) var(--r-lg) 0 0">
          <h3>${ic('coins','icon-sm')} 2. Capital Minting &amp; Note Coordination Pipeline</h3>
          <span class="badge b-amber">4-Step Workflow</span>
        </div>
        <p style="color:var(--ink-2);line-height:1.6;margin-bottom:16px">
          Minting converts capital partner USDC into platform-backed tokens via an automated 4-step trustless pipeline:
        </p>
        <div class="stack" style="gap:12px">
          <div class="row gap12" style="background:#FAFAF8;padding:12px 16px;border-radius:var(--r);align-items:flex-start">
            <span class="numdot mono">1</span>
            <div><b>Capital Request:</b> Capital partner specifies USDC allocation and target platform. Funds lock in treasury vault.</div>
          </div>
          <div class="row gap12" style="background:#FAFAF8;padding:12px 16px;border-radius:var(--r);align-items:flex-start">
            <span class="numdot mono">2</span>
            <div><b>Submit Documents:</b> Originating partner is automatically notified to upload signed senior secured promissory notes &amp; invoice purchase contracts.</div>
          </div>
          <div class="row gap12" style="background:#FAFAF8;padding:12px 16px;border-radius:var(--r);align-items:flex-start">
            <span class="numdot mono">3</span>
            <div><b>Inspect &amp; Review:</b> KBridge Governance Admin verifies legal hashes, corporate signatures, and collateral backing.</div>
          </div>
          <div class="row gap12" style="background:#FAFAF8;padding:12px 16px;border-radius:var(--r);align-items:flex-start">
            <span class="numdot mono">4</span>
            <div><b>Mint &amp; Settle:</b> Hedera smart contracts execute token delivery to custody and transfer USDC to the originator funding wallet.</div>
          </div>
        </div>

        <!-- Dashboard Screenshot Preview -->
        <div style="margin-top:20px;border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;background:#0F172A">
          <div style="padding:10px 16px;background:#1E293B;color:#94A3B8;font-size:12px;display:flex;align-items:center;justify-content:space-between">
            <span>Interface Preview — Institutional Dashboard &amp; Analytics</span>
            <span class="badge b-green"><span class="dot"></span>Live Hedera Mainnet</span>
          </div>
          <img src="/assets/aistudio/help_dashboard_preview.jpg" alt="Dashboard Preview" style="width:100%;height:auto;display:block;opacity:0.95" />
        </div>
      </div>

      <!-- Section 3: Kunda Box (KBridge) Fees Statement -->
      <div class="card card-pad" id="sec-fees">
        <div class="card-head" style="margin:-24px -24px 20px;border-radius:var(--r-lg) var(--r-lg) 0 0">
          <h3>${ic('bank','icon-sm')} 3. Kunda Box Fee Statements &amp; Calculations</h3>
          <span class="badge b-ink">2.25% Annualized Accrual</span>
        </div>
        <p style="color:var(--ink-2);line-height:1.6;margin-bottom:16px">
          The Originator portal features a dedicated **Kunda Box Fees** statement view detailing capital allocated from partners and accrued protocol administration fees.
        </p>

        <div class="panel" style="background:#FAFAF8;padding:18px;border-radius:var(--r);margin-bottom:16px">
          <div style="font-weight:600;font-size:13.5px;color:var(--ink);margin-bottom:6px">Official Fee Formula</div>
          <div class="mono" style="font-size:14px;background:#fff;padding:10px 14px;border:1px solid var(--line);border-radius:6px;color:#0F172A">
            Accrued Fee = Allocated Capital × ( 2.25% / 365 ) × Days Since Allocation
          </div>
          <p class="faint" style="font-size:12px;margin-top:8px">
            Items are automatically registered into the statement ledger as soon as capital minting completes and succeeds in wallet transfer.
          </p>
        </div>

        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px">
          <div class="panel" style="padding:14px">
            <div class="micro">Daily Accrual Rate</div>
            <div class="mono" style="font-size:16px;font-weight:600;margin-top:4px">0.00616% / day</div>
            <div class="faint" style="font-size:11.5px;margin-top:2px">2.25% annualized fee</div>
          </div>
          <div class="panel" style="padding:14px">
            <div class="micro">Duration Tracking</div>
            <div class="mono" style="font-size:16px;font-weight:600;margin-top:4px">Days &amp; Mos Breakdown</div>
            <div class="faint" style="font-size:11.5px;margin-top:2px">Calculated dynamically against current date</div>
          </div>
          <div class="panel" style="padding:14px">
            <div class="micro">Admin Oversight</div>
            <div class="mono" style="font-size:16px;font-weight:600;margin-top:4px">Multi-Originator Audit</div>
            <div class="faint" style="font-size:11.5px;margin-top:2px">Visible for Pursuit, Wayflyer &amp; Credix</div>
          </div>
        </div>
      </div>

      <!-- Section 4: Redemptions & Hedera DLT -->
      <div class="card card-pad" id="sec-redm">
        <div class="card-head" style="margin:-24px -24px 20px;border-radius:var(--r-lg) var(--r-lg) 0 0">
          <h3>${ic('flame','icon-sm')} 4. Token Redemptions &amp; Hedera Settlement</h3>
          <span class="badge b-amber">Token Burn Protocol</span>
        </div>
        <p style="color:var(--ink-2);line-height:1.6;margin-bottom:14px">
          Capital partners can request redemptions at any time by burning platform tokens back into USDC. Tokens lock immediately upon submission, and originating partners settle redemptions directly from their funding wallets with verified Hedera transaction hashes.
        </p>
        <div class="callout c-neutral">
          ${ic('shield','icon-sm')}
          <div style="font-size:12.5px;line-height:1.5">
            <b>Hedera Token Service (HTS) Guarantee:</b> All token mints, locks, and burns are permanently recorded on Hedera mainnet immutable ledgers, ensuring 100% cryptographic auditability for institutional treasuries.
          </div>
        </div>
      </div>

    </div>

    <!-- Walkthrough Floating Control Box -->
    <div style="margin-top:32px;text-align:center;padding:24px;background:#FAFAF8;border:1px solid var(--line);border-radius:var(--r-xl)">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:6px">Ready to Explore the Platform?</h3>
      <p class="muted" style="font-size:13px;margin-bottom:16px">Toggle the interactive guided tour on or switch user roles (Capital, Originator, Admin) in the top header.</p>
      <div class="row gap12" style="justify-content:center">
        <button class="btn btn-primary" data-act="view" data-view="dash">Return to Dashboard ${ic('right','icon-xs')}</button>
        <button class="btn btn-ghost" data-act="toggle-walkthrough">${isTourOn ? 'Disable Guided Tour' : 'Turn On Guided Tour'}</button>
      </div>
    </div>
  `;
}

export function renderWalkthroughOverlay(S, ctx) {
  if (!S.walkthroughActive) return '';

  const role = S.org || 'pursuit';
  const roleName = ORGS_LABEL(role);

  return `
    <div id="walkthroughOverlay" style="position:fixed;bottom:24px;right:24px;z-index:9999;width:360px;background:#0F172A;color:#fff;border:1px solid #334155;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.3),0 8px 10px -6px rgba(0,0,0,0.3);animation:dropdownSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1)">
      <div style="padding:16px 20px;border-bottom:1px solid #1E293B;display:flex;align-items:center;justify-content:space-between">
        <div class="row gap8" style="align-items:center">
          <div style="width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;color:#ebb03f">
            ${ic('compass', 'icon-sm')}
          </div>
          <div>
            <div style="font-size:13.5px;font-weight:600">KBridge Guided Tour</div>
            <div style="font-size:11px;color:#94A3B8">Active Role: ${roleName}</div>
          </div>
        </div>
        <button class="xbtn" data-act="toggle-walkthrough" style="color:#94A3B8;background:rgba(255,255,255,0.06);border-radius:999px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer" title="Close Tour">
          ${ic('x','icon-xs')}
        </button>
      </div>
      <div style="padding:18px 20px;font-size:13px;line-height:1.55;color:#E2E8F0">
        <p style="margin-bottom:12px">
          <b>Welcome to ${roleName}!</b> You are currently viewing the live portal state. 
        </p>
        <ul style="margin:0 0 16px 16px;padding:0;color:#CBD5E1;font-size:12.5px;display:flex;flex-direction:column;gap:6px">
          <li>Use the top role switcher (<span style="color:#E2E8F0;font-weight:600">Capital</span>, <span style="color:#E2E8F0;font-weight:600">Originator</span>, <span style="color:#E2E8F0;font-weight:600">Admin</span>) to test all workflows.</li>
          <li>Originator portal includes the <b>Kunda Box Fees</b> statement view (2.25% / 365 daily accrual).</li>
          <li>Check out the <b>Help &amp; Guide</b> tab anytime for full documentation.</li>
        </ul>
      </div>
      <div style="padding:12px 20px;background:#1E293B;border-radius:0 0 16px 16px;display:flex;align-items:center;justify-content:space-between">
        <button class="btn btn-ghost btn-sm" data-act="view" data-view="help" style="color:#fff;border-color:#334155;background:rgba(255,255,255,0.06);font-size:12px">
          Open Help Guide ${ic('right','icon-xs')}
        </button>
        <button class="btn btn-primary btn-sm" data-act="toggle-walkthrough" style="font-size:12px">
          Finish Tour
        </button>
      </div>
    </div>
  `;
}

function ORGS_LABEL(r) {
  if (r === 'theoriq') return 'Capital Partner';
  if (r === 'pursuit') return 'Originating Partner';
  if (r === 'kbridge') return 'Protocol Admin';
  return 'Partner';
}
