import { ic, spinner, hash, uid, dstr, dshort, ago, inDays, nf, nav, pct, short, esc, TODAY, kLogo, kLockup, stat, pageHead, banner } from './helpers.js';
import { HEDERA_LOGO, HEDERA_MARK } from './assets.js';

/* ============================================================
   Kunda Box (kbridge) - Originator Allocated Capital Fee Engine
   Formula: 2.25% / 365 * number of days since allocation (per month)
   An item is registered when capital is minted and succeeds in wallet transfer.
   ============================================================ */

export const PROTOCOL_ANNUAL_FEE_RATE = 0.0225; // 2.25%
export const PROTOCOL_DAILY_FEE_RATE = PROTOCOL_ANNUAL_FEE_RATE / 365; // ~0.0000616438356164

export const INITIAL_ALLOCATED_FEES = [
  {
    id: 'FEE-2026-001',
    reqId: 'REQ-2026-068',
    pf: 'pursuit',
    originator: 'pursuit',
    facilityId: 'INV-2026-8922',
    facilityName: 'Global Timber Exports Ltd.',
    noteType: 'Senior Secured Promissory Note & Invoice Assignment',
    allocatedAmount: 250000,
    tokens: 241150.00,
    allocationDate: new Date(TODAY.getTime() - 42 * 86400000), // 42 days ago (September)
    destWallet: '0x5d71ac09e4b83f26d1c7590ae4bb3f8021d64c7a',
    destWalletLabel: 'Originator Partner Funding Wallet',
    txHash: '0x8f19203a9102839018290381029387a8291bf02c890184b912389108c9018239',
    noteName: 'Promissory_Note_TOKENS_2026_8922_Timber.pdf',
    annualRate: 0.0225,
    settledMonths: ['September 2026'],
    status: 'Active'
  },
  {
    id: 'FEE-2026-002',
    reqId: 'REQ-2026-079',
    pf: 'pursuit',
    originator: 'pursuit',
    facilityId: 'INV-2026-8921',
    facilityName: 'Acme Nuts & Bolts Manufacturing',
    noteType: 'Senior Secured Promissory Note & Invoice Assignment Contract',
    allocatedAmount: 300000,
    tokens: 288794.76,
    allocationDate: new Date(TODAY.getTime() - 3 * 86400000), // 3 days ago (minted & transferred in REQ-2026-079)
    destWallet: '0x5d71ac09e4b83f26d1c7590ae4bb3f8021d64c7a',
    destWalletLabel: 'Originator Partner Funding Wallet',
    txHash: '0x7a8291bf02c890184b912389108c901823901bcae82910283901829038102938',
    noteName: 'Promissory_Note_TOKENS_2026_8921.pdf',
    annualRate: 0.0225,
    settledMonths: [],
    status: 'Active'
  }
];

/**
 * Calculate total days elapsed since allocation date
 */
export function getDaysSinceAllocation(allocDate, asOf = TODAY) {
  if (!allocDate) return 0;
  const d = new Date(allocDate);
  const diffMs = asOf.getTime() - d.getTime();
  if (diffMs <= 0) return 1; // Minimum 1 day active for same-day
  return Math.max(1, Math.floor(diffMs / 86400000));
}

/**
 * Core formula: 2.25% / 365 * days * principal
 */
export function calcAccruedFee(principal, days, rate = PROTOCOL_ANNUAL_FEE_RATE) {
  return (principal || 0) * (rate / 365) * Math.max(0, days || 0);
}

/**
 * Daily fee for a given principal: principal * 2.25% / 365
 */
export function calcDailyFee(principal, rate = PROTOCOL_ANNUAL_FEE_RATE) {
  return (principal || 0) * (rate / 365);
}

/**
 * Break down an allocation into month-by-month accrued fees
 */
export function getItemMonthlyBreakdown(item, asOf = TODAY) {
  const allocDate = new Date(item.allocationDate);
  const curDate = new Date(asOf);
  const months = [];

  let iterDate = new Date(allocDate.getFullYear(), allocDate.getMonth(), 1);
  const targetMonthEnd = new Date(curDate.getFullYear(), curDate.getMonth(), 1);

  while (iterDate <= targetMonthEnd) {
    const year = iterDate.getFullYear();
    const month = iterDate.getMonth();
    const monthLabel = iterDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

    const monthStart = new Date(year, month, 1);
    const nextMonthStart = new Date(year, month + 1, 1);
    const monthEnd = new Date(nextMonthStart.getTime() - 1);

    // Start of calculation in this month
    const effectiveStart = allocDate > monthStart ? allocDate : monthStart;
    // End of calculation in this month
    const effectiveEnd = curDate < monthEnd ? curDate : monthEnd;

    let daysInMonth = 0;
    if (effectiveEnd >= effectiveStart) {
      daysInMonth = Math.max(1, Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / 86400000));
    }

    const monthFee = calcAccruedFee(item.allocatedAmount, daysInMonth, item.annualRate || PROTOCOL_ANNUAL_FEE_RATE);
    const isCurrentMonth = (year === curDate.getFullYear() && month === curDate.getMonth());
    const isSettled = (item.settledMonths || []).includes(monthLabel);

    months.push({
      monthKey,
      monthLabel,
      year,
      month,
      effectiveStart,
      effectiveEnd,
      daysInMonth,
      allocatedAmount: item.allocatedAmount,
      dailyRate: calcDailyFee(item.allocatedAmount, item.annualRate || PROTOCOL_ANNUAL_FEE_RATE),
      monthFee,
      isCurrentMonth,
      isSettled,
      status: isSettled ? 'Settled' : (isCurrentMonth ? 'Accruing' : 'Invoiced')
    });

    iterDate = new Date(year, month + 1, 1);
  }

  return months.reverse(); // Most recent month first
}

/**
 * Register an item into the fee ledger upon successful mint & wallet transfer
 */
export function registerAllocatedCapitalFee(req, S) {
  if (!S.allocatedFees) {
    S.allocatedFees = JSON.parse(JSON.stringify(INITIAL_ALLOCATED_FEES));
  }

  const existing = S.allocatedFees.find(x => x.reqId === req.id);
  if (existing) return existing;

  const feeCount = S.allocatedFees.length + 1;
  const feeId = `FEE-2026-${String(feeCount).padStart(3, '0')}`;

  const doc = (req.documents && req.documents[0]) || {};
  const facility = doc.facilityId || 'INV-2026-8921';
  let facilityName = 'Allocated Receivables Facility';
  if (facility.includes('8921')) facilityName = 'Acme Nuts & Bolts Manufacturing';
  else if (facility.includes('8922')) facilityName = 'Global Timber Exports Ltd.';
  else if (facility.includes('9004')) facilityName = 'Vertex Robotics Inc.';
  else if (facility.includes('4401')) facilityName = 'Peak Apparel Direct';
  else if (facility.includes('2101')) facilityName = 'Nova Car Finance SPV';

  const newItem = {
    id: feeId,
    reqId: req.id,
    pf: req.pf || 'pursuit',
    originator: 'pursuit',
    facilityId: facility,
    facilityName: `${facilityName} (${facility})`,
    noteType: req.noteType || 'Senior Secured Promissory Note',
    allocatedAmount: req.amt,
    tokens: req.tokens,
    allocationDate: req.mintedAt || new Date(),
    destWallet: req.destWallet || '0x5d71ac09e4b83f26d1c7590ae4bb3f8021d64c7a',
    destWalletLabel: req.destWalletLabel || 'Originator Partner Funding Wallet',
    txHash: req.tx || hash(),
    noteName: doc.name || `Promissory_Note_${req.id}.pdf`,
    annualRate: PROTOCOL_ANNUAL_FEE_RATE,
    settledMonths: [],
    status: 'Active'
  };

  S.allocatedFees.unshift(newItem);
  return newItem;
}

/**
 * Originator Fees Main Screen View
 */
export function viewOriginatorFees(S, ctx) {
  if (!S.allocatedFees) {
    S.allocatedFees = JSON.parse(JSON.stringify(INITIAL_ALLOCATED_FEES));
  }

  const fees = S.allocatedFees;
  const totalAllocated = fees.reduce((acc, f) => acc + (f.allocatedAmount || 0), 0);
  
  // Calculate total fee owed to Kunda Box across all items and active days
  let totalAccruedAllTime = 0;
  let totalCurrentMonthAccrued = 0;
  let totalDailyAccrualRate = 0;
  let totalSettled = 0;

  fees.forEach(f => {
    const days = getDaysSinceAllocation(f.allocationDate);
    const itemTotal = calcAccruedFee(f.allocatedAmount, days, f.annualRate);
    totalAccruedAllTime += itemTotal;
    totalDailyAccrualRate += calcDailyFee(f.allocatedAmount, f.annualRate);

    const breakdown = getItemMonthlyBreakdown(f);
    breakdown.forEach(m => {
      if (m.isSettled) {
        totalSettled += m.monthFee;
      }
      if (m.isCurrentMonth) {
        totalCurrentMonthAccrued += m.monthFee;
      }
    });
  });

  const netOwed = Math.max(0, totalAccruedAllTime - totalSettled);

  // Group monthly breakdown across all allocations for the "Per Month" statement view
  const monthMap = {};
  fees.forEach(f => {
    const bds = getItemMonthlyBreakdown(f);
    bds.forEach(m => {
      if (!monthMap[m.monthLabel]) {
        monthMap[m.monthLabel] = {
          monthLabel: m.monthLabel,
          monthKey: m.monthKey,
          isCurrentMonth: m.isCurrentMonth,
          tranches: [],
          totalPrincipal: 0,
          totalFee: 0,
          totalSettled: 0
        };
      }
      monthMap[m.monthLabel].tranches.push({
        item: f,
        monthData: m
      });
      monthMap[m.monthLabel].totalPrincipal += f.allocatedAmount;
      monthMap[m.monthLabel].totalFee += m.monthFee;
      if (m.isSettled) {
        monthMap[m.monthLabel].totalSettled += m.monthFee;
      }
    });
  });

  const monthlyStatements = Object.values(monthMap);

  // Active view tab state (stored in S.feeTab or default 'statements')
  const activeTab = S.feeTab || 'statements';

  const tabSwitcher = `
    <div class="seg" style="max-width:540px;margin-bottom:20px">
      <button class="${activeTab === 'statements' ? 'on' : ''}" data-act="switch-fee-tab" data-tab="statements">
        ${ic('fileText', 'icon-sm')} Monthly Billing Statements
      </button>
      <button class="${activeTab === 'tranches' ? 'on' : ''}" data-act="switch-fee-tab" data-tab="tranches">
        ${ic('layers', 'icon-sm')} Allocated Capital Tranches (${fees.length})
      </button>
      <button class="${activeTab === 'calculator' ? 'on' : ''}" data-act="switch-fee-tab" data-tab="calculator">
        ${ic('gauge', 'icon-sm')} Fee Simulator &amp; Formula
      </button>
    </div>
  `;

  // Itemized Tranches Table
  const trancheRows = fees.map(f => {
    const days = getDaysSinceAllocation(f.allocationDate);
    const feeOwed = calcAccruedFee(f.allocatedAmount, days, f.annualRate);
    const dailyFee = calcDailyFee(f.allocatedAmount, f.annualRate);
    const breakdown = getItemMonthlyBreakdown(f);
    const curMonthData = breakdown.find(m => m.isCurrentMonth);
    const curMonthFee = curMonthData ? curMonthData.monthFee : 0;

    return `
      <tr class="hover-row">
        <td>
          <div class="mono" style="font-weight:600;color:var(--ink)">${esc(f.id)}</div>
          <div class="faint mono" style="font-size:11px" title="${esc(f.txHash)}">
            Hedera: ${short(f.txHash)}
          </div>
        </td>
        <td>
          <div style="font-weight:600;color:var(--ink)">${esc(f.facilityName)}</div>
          <div class="faint" style="font-size:11.5px">${esc(f.noteType || 'Senior Promissory Note')}</div>
        </td>
        <td>
          <div class="mono">${dstr(f.allocationDate)}</div>
          <div class="faint" style="font-size:11px">${ago(f.allocationDate)}</div>
        </td>
        <td class="t-right mono" style="font-weight:600;font-size:13.5px">
          ${nf(f.allocatedAmount, 2)} <span class="faint" style="font-size:11px">USDC</span>
        </td>
        <td class="t-center">
          <span class="badge b-ink mono" style="font-weight:600">${days} ${days === 1 ? 'day' : 'days'}</span>
        </td>
        <td class="t-right mono faint" style="font-size:12px">
          ${nf(dailyFee, 2)} <span style="font-size:10px">/day</span>
        </td>
        <td class="t-right mono" style="font-weight:600;color:var(--ink)">
          ${nf(curMonthFee, 2)} <span class="faint" style="font-size:11px">USDC</span>
        </td>
        <td class="t-right mono" style="font-weight:700;color:#B45309;font-size:14px">
          ${nf(feeOwed, 2)} <span class="faint" style="font-size:11px">USDC</span>
        </td>
        <td class="t-right">
          <div class="row gap4" style="justify-content:flex-end">
            <button class="btn btn-ghost btn-sm" data-act="fee-item-math" data-id="${f.id}" title="Inspect Exact Calculation Math">
              ${ic('activity', 'icon-xs')} Audit Math
            </button>
            <button class="btn btn-quiet btn-sm" data-act="fee-item-breakdown" data-id="${f.id}" title="View Month-by-Month Statement">
              ${ic('calendar', 'icon-xs')} Monthly
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Monthly Statements Cards/Table
  const monthlyRows = monthlyStatements.map(m => {
    const netMonthOwed = Math.max(0, m.totalFee - m.totalSettled);
    let statusBadge = '';
    if (m.totalSettled >= m.totalFee && m.totalFee > 0) {
      statusBadge = `<span class="badge b-green"><span class="dot"></span>Settled &amp; Paid</span>`;
    } else if (m.isCurrentMonth) {
      statusBadge = `<span class="badge b-amber"><span class="dot"></span>Accruing (Current Month)</span>`;
    } else {
      statusBadge = `<span class="badge b-ink"><span class="dot"></span>Invoiced · Due</span>`;
    }

    const payBtn = netMonthOwed > 0 ? `
      <button class="btn btn-primary btn-sm" data-act="fee-pay-month" data-month="${esc(m.monthLabel)}" style="padding:4px 10px;font-size:12px">
        ${ic('bank', 'icon-xs')} Pay ${nf(netMonthOwed, 2)} USDC
      </button>
    ` : `
      <span class="badge b-green" style="font-size:11px">${ic('check', 'icon-xs')} Fully Paid</span>
    `;

    return `
      <tr class="hover-row">
        <td>
          <div style="font-weight:600;font-size:13.5px;color:var(--ink);display:flex;align-items:center;gap:6px">
            ${ic('calendar', 'icon-xs')} ${esc(m.monthLabel)}
          </div>
          <div class="faint" style="font-size:11px">
            ${m.isCurrentMonth ? 'Active billing period' : 'Closed monthly cycle'}
          </div>
        </td>
        <td>
          <span class="badge b-gray mono">${m.tranches.length} active ${m.tranches.length === 1 ? 'tranche' : 'tranches'}</span>
        </td>
        <td class="t-right mono" style="font-weight:600">
          ${nf(m.totalPrincipal, 2)} USDC
        </td>
        <td class="t-right mono faint" style="font-size:12px">
          2.25% p.a. (Day-count 365)
        </td>
        <td class="t-right mono" style="font-weight:700;font-size:14px;color:#B45309">
          ${nf(m.totalFee, 2)} USDC
        </td>
        <td class="t-right mono" style="font-size:12.5px;color:var(--ok)">
          ${m.totalSettled > 0 ? `${nf(m.totalSettled, 2)} USDC` : '—'}
        </td>
        <td class="t-right mono" style="font-weight:600;font-size:13.5px;color:${netMonthOwed > 0 ? 'var(--ink)' : 'var(--muted)'}">
          ${nf(netMonthOwed, 2)} USDC
        </td>
        <td>${statusBadge}</td>
        <td class="t-right">
          <div class="row gap6" style="justify-content:flex-end">
            <button class="btn btn-ghost btn-sm" data-act="fee-view-statement" data-month="${esc(m.monthLabel)}">
              ${ic('fileText', 'icon-xs')} Statement
            </button>
            ${payBtn}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="page-head">
      <div>
        <div class="row gap8" style="align-items:center;margin-bottom:4px">
          <span class="badge b-amber" style="font-weight:600;font-size:11px">
            ${ic('shield', 'icon-xs')} Protocol Facility Fee Ledger
          </span>
          <span class="badge b-gray mono" style="font-size:11px">
            Rate: 2.25% APR ÷ 365 (Actual/365)
          </span>
        </div>
        <h1 style="display:flex;align-items:center;gap:10px">
          Fees Owed to Kunda Box (kbridge)
        </h1>
        <p>
          Itemized protocol facility fee calculated off allocated capital at <b>2.25% / 365 × number of days since allocation (per month)</b>.
        </p>
      </div>
      <div class="row gap8" style="align-items:center">
        <button class="btn btn-ghost btn-sm" data-act="fee-open-calculator">
          ${ic('gauge', 'icon-sm')} Formula Explainer
        </button>
        <button class="btn btn-primary btn-sm" data-act="fee-pay-total">
          ${ic('bank', 'icon-sm')} Settle Outstanding (${nf(netOwed, 2)} USDC)
        </button>
      </div>
    </div>

    <!-- Formula & Lifecycle Callout -->
    <div class="card card-pad" style="background:#FFFDF7;border:1px solid #FDE68A;margin-bottom:20px;box-shadow:0 1px 3px rgba(0,0,0,0.03)">
      <div class="between" style="flex-wrap:wrap;gap:16px;align-items:center">
        <div class="row gap12" style="align-items:flex-start">
          <div style="background:#FEF3C7;border-radius:10px;padding:8px 10px;border:1px solid #FCD34D;color:#92400E;display:flex;align-items:center;justify-content:center">
            ${ic('sparkle', 'icon-sm')}
          </div>
          <div style="max-width:720px">
            <div style="font-weight:700;font-size:13.5px;color:#92400E;margin-bottom:3px">
              Deterministic Daily Accrual Formula
            </div>
            <div style="font-size:12.5px;color:#78350F;line-height:1.5">
              An item is automatically registered here whenever capital is minted and succeeds in Hedera wallet transfer. 
              The platform fee owed to Kunda Box is calculated continuously:
              <span class="mono" style="display:inline-block;background:#FEF3C7;padding:2px 8px;border-radius:6px;font-weight:700;border:1px solid #FCD34D;margin:3px 0">
                Fee Owed = Allocated Capital × (2.25% ÷ 365) × Days Since Allocation
              </span>
              Broken down by calendar month for accounting reconciliation and settlement.
            </div>
          </div>
        </div>
        <div class="t-right" style="border-left:1px solid #FDE68A;padding-left:16px">
          <div class="micro" style="color:#92400E">Daily Multiplier</div>
          <div class="mono" style="font-weight:700;font-size:14px;color:#78350F">0.006164% / day</div>
          <div class="faint" style="font-size:11px;color:#B45309">Day-count Actual/365</div>
        </div>
      </div>
    </div>

    <!-- KPI Summary Stats -->
    <div class="stats" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr));margin-bottom:24px">
      ${stat('Total Allocated Capital', 'bank', `${nf(totalAllocated, 0)} <span class="mono" style="font-size:14px;color:var(--muted)">USDC</span>`, `${fees.length} active minted tranches`)}
      ${stat('Total Accrued to Kunda Box', 'coins', `${nf(totalAccruedAllTime, 2)} <span class="mono" style="font-size:14px;color:var(--muted)">USDC</span>`, `All-time accrued (2.25%/365)`)}
      ${stat('Current Month Accrual', 'calendar', `${nf(totalCurrentMonthAccrued, 2)} <span class="mono" style="font-size:14px;color:var(--muted)">USDC</span>`, `${new Date().toLocaleDateString('en-US', {month:'long'})} active accrual`)}
      ${stat('Net Outstanding Owed', 'hourglass', `${nf(netOwed, 2)} <span class="mono" style="font-size:14px;color:var(--muted)">USDC</span>`, `${nf(totalSettled, 2)} USDC settled to date`)}
    </div>

    ${tabSwitcher}

    ${activeTab === 'statements' ? `
      <!-- Monthly Statements View -->
      <div class="card" style="margin-bottom:24px">
        <div class="card-head">
          <div class="row gap8">
            ${ic('fileText', 'icon-sm')}
            <div>
              <h3 style="margin:0;font-size:15px;font-weight:600">Monthly Billing Statements (Per Month Breakdown)</h3>
              <div class="faint" style="font-size:11.5px">Calendar month fee reconciliation for capital allocations</div>
            </div>
          </div>
          <div class="row gap8">
            <span class="badge b-ink">${monthlyStatements.length} billing cycles</span>
          </div>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Billing Month</th>
                <th>Tranches</th>
                <th class="t-right">Capital Under Facility</th>
                <th class="t-right">Fee Rate</th>
                <th class="t-right">Total Accrued</th>
                <th class="t-right">Settled</th>
                <th class="t-right">Balance Due</th>
                <th>Status</th>
                <th class="t-right">Statement Action</th>
              </tr>
            </thead>
            <tbody>
              ${monthlyRows}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    ${activeTab === 'tranches' ? `
      <!-- Allocated Capital Tranches View -->
      <div class="card" style="margin-bottom:24px">
        <div class="card-head">
          <div class="row gap8">
            ${ic('layers', 'icon-sm')}
            <div>
              <h3 style="margin:0;font-size:15px;font-weight:600">Allocated Capital Tranches &amp; Wallet Transfer Ledger</h3>
              <div class="faint" style="font-size:11.5px">Registered when capital is minted and successfully transferred to your wallet on Hedera</div>
            </div>
          </div>
          <span class="badge b-ink">${fees.length} allocations</span>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Allocation ID / Tx</th>
                <th>Backing Facility &amp; Notes</th>
                <th>Allocation Date</th>
                <th class="t-right">Allocated Principal</th>
                <th class="t-center">Days Active</th>
                <th class="t-right">Daily Fee</th>
                <th class="t-right">Current Month</th>
                <th class="t-right">Total Accrued</th>
                <th class="t-right">Audit</th>
              </tr>
            </thead>
            <tbody>
              ${trancheRows}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    ${activeTab === 'calculator' ? `
      <!-- Interactive Calculator & Formula Simulator -->
      <div class="card card-pad" style="margin-bottom:24px">
        <div style="margin-bottom:16px">
          <h3 style="font-size:16px;font-weight:600;margin-bottom:4px">Kunda Box Facility Fee Calculator</h3>
          <p class="faint" style="font-size:13px">Simulate how much is owed to Kunda Box based on any allocated capital amount and days elapsed.</p>
        </div>

        <div class="cols cols-1-1 gap16">
          <div class="stack" style="gap:14px">
            <label class="field">
              <span>Allocated Capital Amount (USDC)</span>
              <input class="input mono input-lg" id="simAmt" type="number" step="10000" value="300000" placeholder="e.g. 300,000">
              <div class="hint">Capital minted and transferred to your wallet</div>
            </label>

            <label class="field">
              <span>Days Elapsed Since Allocation</span>
              <input class="input mono input-lg" id="simDays" type="number" step="1" value="30" placeholder="e.g. 30">
              <div class="hint">Active days under capital facility</div>
            </label>

            <div class="row gap8" style="flex-wrap:wrap">
              <button class="btn btn-quiet btn-xs" data-act="sim-preset-days" data-days="7">7 Days</button>
              <button class="btn btn-quiet btn-xs" data-act="sim-preset-days" data-days="15">15 Days</button>
              <button class="btn btn-quiet btn-xs" data-act="sim-preset-days" data-days="30">30 Days (1 Mo)</button>
              <button class="btn btn-quiet btn-xs" data-act="sim-preset-days" data-days="60">60 Days (2 Mos)</button>
              <button class="btn btn-quiet btn-xs" data-act="sim-preset-days" data-days="90">90 Days (Qtr)</button>
              <button class="btn btn-quiet btn-xs" data-act="sim-preset-days" data-days="365">365 Days (1 Yr)</button>
            </div>
          </div>

          <div class="panel" id="simResultBox" style="background:#F8FAFC;border:1px solid #E2E8F0;display:flex;flex-direction:column;justify-content:center">
            <div class="micro" style="margin-bottom:6px">Calculated Fee Owed to Kunda Box</div>
            <div class="mono" id="simResultFee" style="font-size:28px;font-weight:700;color:#B45309">
              $554.79 <span style="font-size:14px;color:var(--muted)">USDC</span>
            </div>
            <div class="kv" style="margin-top:14px"><span class="k">Daily Fee Burn Rate</span><span class="v mono" id="simResultDaily">$18.49 / day</span></div>
            <div class="kv"><span class="k">Annualized Protocol Spread</span><span class="v mono">2.25% p.a.</span></div>
            <div class="kv"><span class="k">Daily Fractional Rate</span><span class="v mono">2.25% ÷ 365 = 0.006164%</span></div>
            <div class="kv kv-total"><span class="k">Formula Proof</span><span class="v mono" id="simResultProof" style="font-size:12px;color:var(--ink)">$300,000 × (2.25% ÷ 365) × 30 days</span></div>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Protocol Settlement & Wallet Reserve Card -->
    <div class="card card-pad" style="background:#F8FAFC;border:1px solid #E2E8F0">
      <div class="between" style="flex-wrap:wrap;gap:16px;align-items:center">
        <div>
          <div style="font-weight:600;font-size:14px;color:#0F172A;display:flex;align-items:center;gap:8px">
            ${HEDERA_MARK} Automated Hedera Protocol Settlement
          </div>
          <div class="faint" style="font-size:12px;margin-top:2px;max-width:600px">
            All fees are settled directly via native Hedera USDC transfers to the KBridge Protocol Treasury contract. 
            Receipts and cryptographic hashes are permanently audited on the Hedera Distributed Ledger.
          </div>
        </div>
        <button class="btn btn-primary" data-act="fee-pay-total">
          ${ic('bank', 'icon-sm')} Settle Outstanding Fee Balance
        </button>
      </div>
    </div>
  `;
}

/**
 * Open Audit Math Modal showing the exact formula breakdown for an allocation item
 */
export function openFeeMathModal(itemId, S, ctx) {
  const item = (S.allocatedFees || []).find(x => x.id === itemId);
  if (!item) return;

  const days = getDaysSinceAllocation(item.allocationDate);
  const totalFee = calcAccruedFee(item.allocatedAmount, days, item.annualRate);
  const dailyFee = calcDailyFee(item.allocatedAmount, item.annualRate);
  const monthly = getItemMonthlyBreakdown(item);

  const body = `
    <div class="card card-pad" style="background:#FFFDF7;border:1px solid #FDE68A;margin-bottom:16px">
      <div class="micro" style="color:#92400E;margin-bottom:4px">Formula Specification</div>
      <div class="mono" style="font-weight:700;font-size:15px;color:#78350F;margin-bottom:8px">
        Owed = Principal × (2.25% ÷ 365) × Days Elapsed
      </div>
      <div class="faint" style="font-size:12px;color:#92400E;line-height:1.45">
        Mandated fee convention for KBridge originating partners based off allocated capital. 
        Registration occurred automatically upon smart contract mint &amp; wallet delivery.
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px">
      <div class="kv"><span class="k">Allocation ID</span><span class="v mono">${esc(item.id)}</span></div>
      <div class="kv"><span class="k">Originating Facility</span><span class="v">${esc(item.facilityName)}</span></div>
      <div class="kv"><span class="k">Allocated Capital</span><span class="v mono" style="font-weight:600">${nf(item.allocatedAmount, 2)} USDC</span></div>
      <div class="kv"><span class="k">Allocation Date</span><span class="v mono">${dstr(item.allocationDate)} (${ago(item.allocationDate)})</span></div>
      <div class="kv"><span class="k">Days Since Allocation</span><span class="v mono">${days} days</span></div>
      <div class="kv"><span class="k">Daily Fee Rate</span><span class="v mono">2.25% ÷ 365 = 0.0000616438...</span></div>
      <div class="kv"><span class="k">Daily Accrual Burn</span><span class="v mono">${nf(dailyFee, 4)} USDC / day</span></div>
      <div class="kv kv-total">
        <span class="k" style="color:var(--ink);font-weight:600">Total Fee Accrued</span>
        <span class="v mono" style="font-size:17px;font-weight:700;color:#B45309">${nf(totalFee, 2)} USDC</span>
      </div>
    </div>

    <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--ink)">
      Monthly Breakdown Schedule (Per Month)
    </div>
    <div class="table-scroll" style="margin-bottom:16px">
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th class="t-center">Days in Period</th>
            <th class="t-right">Daily Rate</th>
            <th class="t-right">Month Accrual</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${monthly.map(m => `
            <tr>
              <td style="font-weight:600">${esc(m.monthLabel)}</td>
              <td class="t-center mono">${m.daysInMonth}</td>
              <td class="t-right mono faint">${nf(m.dailyRate, 2)}/d</td>
              <td class="t-right mono" style="font-weight:600;color:#B45309">${nf(m.monthFee, 2)} USDC</td>
              <td>
                <span class="badge ${m.isSettled ? 'b-green' : (m.isCurrentMonth ? 'b-amber' : 'b-ink')}">
                  ${m.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="panel">
      <div class="micro" style="margin-bottom:4px">Hedera Settlement Audit Trail</div>
      <div class="kv"><span class="k">Mint Transaction</span><span class="v mono" style="font-size:11px">${short(item.txHash)}</span></div>
      <div class="kv"><span class="k">Receiving Wallet</span><span class="v mono" style="font-size:11px">${short(item.destWallet)}</span></div>
    </div>
  `;

  const foot = `
    <button class="btn btn-ghost" data-act="close">Close</button>
    <button class="btn btn-primary" data-act="fee-pay-item" data-id="${item.id}">
      ${ic('bank', 'icon-sm')} Settle This Allocation (${nf(totalFee, 2)} USDC)
    </button>
  `;

  ctx.openModal(ctx.modalShell('Fee Accrual Mathematical Audit', item.id, 'activity', body, foot));
}

/**
 * Open Monthly Statement Modal
 */
export function openMonthlyStatementModal(monthLabel, S, ctx) {
  const fees = S.allocatedFees || [];
  const tranchesInMonth = [];

  fees.forEach(f => {
    const bds = getItemMonthlyBreakdown(f);
    const mData = bds.find(m => m.monthLabel === monthLabel);
    if (mData) {
      tranchesInMonth.push({ item: f, data: mData });
    }
  });

  const totalFee = tranchesInMonth.reduce((a, t) => a + t.data.monthFee, 0);
  const totalSettled = tranchesInMonth.reduce((a, t) => a + (t.data.isSettled ? t.data.monthFee : 0), 0);
  const netDue = Math.max(0, totalFee - totalSettled);

  const body = `
    <div class="panel" style="background:#FAFAF9;border:1px solid #E7E5E4;margin-bottom:16px">
      <div class="between" style="align-items:flex-start">
        <div>
          <div class="micro">Statement Billing Period</div>
          <div style="font-weight:700;font-size:17px;color:var(--ink);margin-top:2px">${esc(monthLabel)}</div>
          <div class="faint" style="font-size:12px;margin-top:2px">Creditor: Kunda Box Protocol Treasury (kbridge)</div>
          <div class="faint" style="font-size:12px">Debtor: Pursuit Originating Partner SPV I</div>
        </div>
        <div class="t-right">
          <div class="micro">Net Payable</div>
          <div class="mono" style="font-weight:700;font-size:20px;color:${netDue > 0 ? '#B45309' : 'var(--ok)'}">
            ${nf(netDue, 2)} USDC
          </div>
          <div class="faint" style="font-size:11px">Formula: 2.25% / 365 × Days</div>
        </div>
      </div>
    </div>

    <div class="micro" style="margin-bottom:8px">Itemized Capital Allocations for ${esc(monthLabel)}</div>
    <div class="table-scroll" style="margin-bottom:16px">
      <table>
        <thead>
          <tr>
            <th>Allocation ID</th>
            <th>Facility / Promissory Note</th>
            <th class="t-right">Allocated Principal</th>
            <th class="t-center">Days in Month</th>
            <th class="t-right">Accrued Fee</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${tranchesInMonth.map(t => `
            <tr>
              <td class="mono" style="font-weight:600">${t.item.id}</td>
              <td>${esc(t.item.facilityName)}</td>
              <td class="t-right mono">${nf(t.item.allocatedAmount, 2)} USDC</td>
              <td class="t-center mono">${t.data.daysInMonth}</td>
              <td class="t-right mono" style="font-weight:600;color:#B45309">${nf(t.data.monthFee, 2)} USDC</td>
              <td>
                <span class="badge ${t.data.isSettled ? 'b-green' : (t.data.isCurrentMonth ? 'b-amber' : 'b-ink')}">
                  ${t.data.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="callout c-neutral">
      ${ic('shield', 'icon-sm')}
      <div style="font-size:12px">
        Settlement transfers USDC directly from your registered funding wallet to the KBridge protocol governance treasury on Hedera.
      </div>
    </div>
  `;

  const foot = `
    <button class="btn btn-ghost" data-act="close">Close</button>
    ${netDue > 0 ? `
      <button class="btn btn-primary" data-act="fee-pay-month" data-month="${esc(monthLabel)}">
        ${ic('bank', 'icon-sm')} Pay Statement (${nf(netDue, 2)} USDC)
      </button>
    ` : `
      <button class="btn btn-primary" data-act="close">Statement Settled</button>
    `}
  `;

  ctx.openModal(ctx.modalShell(`Monthly Statement: ${monthLabel}`, `Kunda Box Facility Fee`, 'fileText', body, foot));
}

/**
 * Open Modal to Pay/Settle Owed Fees
 */
export function openPayFeeModal(monthOrItem, S, ctx) {
  const funds = ctx.fundWallets('pursuit');
  const w = funds.find(x => x.usdc > 0) || funds[0] || { label: 'Originator Funding Wallet', usdc: 0, address: '0x5d71ac09e4b83f26d1c7590ae4bb3f8021d64c7a' };
  
  let targetDesc = 'All Outstanding Protocol Fees';
  let amountToPay = 0;

  if (monthOrItem && monthOrItem.includes('2026')) {
    targetDesc = `Monthly Statement for ${monthOrItem}`;
    // Sum for that month
    (S.allocatedFees || []).forEach(f => {
      const bds = getItemMonthlyBreakdown(f);
      const m = bds.find(x => x.monthLabel === monthOrItem);
      if (m && !m.isSettled) {
        amountToPay += m.monthFee;
      }
    });
  } else if (monthOrItem && monthOrItem.startsWith('FEE-')) {
    targetDesc = `Allocation Tranche ${monthOrItem}`;
    const f = (S.allocatedFees || []).find(x => x.id === monthOrItem);
    if (f) {
      const days = getDaysSinceAllocation(f.allocationDate);
      amountToPay = calcAccruedFee(f.allocatedAmount, days, f.annualRate);
    }
  } else {
    // Total net owed
    (S.allocatedFees || []).forEach(f => {
      const days = getDaysSinceAllocation(f.allocationDate);
      amountToPay += calcAccruedFee(f.allocatedAmount, days, f.annualRate);
    });
  }

  amountToPay = Math.max(1, +amountToPay.toFixed(2));
  const isShort = w.usdc < amountToPay;

  const body = `
    <div class="panel" style="margin-bottom:16px">
      <div class="kv"><span class="k">Payment Target</span><span class="v" style="font-weight:600">${esc(targetDesc)}</span></div>
      <div class="kv"><span class="k">Creditor</span><span class="v">Kunda Box Protocol Treasury</span></div>
      <div class="kv"><span class="k">Payer Wallet</span><span class="v">${esc(w.label)}</span></div>
      <div class="kv"><span class="k">Available Balance</span><span class="v mono">${nf(w.usdc, 2)} USDC</span></div>
      <div class="kv kv-total">
        <span class="k" style="color:var(--ink);font-weight:600">Total Fee Amount</span>
        <span class="v mono" style="font-size:18px;font-weight:700;color:#B45309">${nf(amountToPay, 2)} USDC</span>
      </div>
    </div>

    ${isShort ? `
      <div class="callout c-amber" style="margin-bottom:16px">
        ${ic('alert', 'icon-sm')}
        <div>
          <b>Insufficient Balance in Funding Wallet:</b> Wallet holds ${nf(w.usdc, 2)} USDC. Please top up your funding wallet or select another registered wallet.
        </div>
      </div>
    ` : ''}

    <div class="callout c-neutral">
      ${ic('shield', 'icon-sm')}
      <div style="font-size:12.5px;line-height:1.45">
        Executing settlement will transfer <b>${nf(amountToPay, 2)} USDC</b> to KBridge Protocol Governance and mark the corresponding billing period as <b>Settled &amp; Paid</b> on Hedera.
      </div>
    </div>
  `;

  const foot = `
    <button class="btn btn-ghost" data-act="close">Cancel</button>
    <button class="btn btn-primary" id="btnConfirmPayFee" ${isShort ? 'disabled' : ''}>
      ${ic('bank', 'icon-sm')} Execute Hedera Payment (${nf(amountToPay, 2)} USDC)
    </button>
  `;

  ctx.openModal(ctx.modalShell('Settle Kunda Box Fees', targetDesc, 'bank', body, foot));

  const btn = document.getElementById('btnConfirmPayFee');
  if (btn) {
    btn.addEventListener('click', () => {
      const tx = hash();
      const steps = [
        { label: 'Authorizing Hedera USDC debit from Originator Wallet', meta: short(w.address), ms: 900 },
        { 
          label: `Transferring ${nf(amountToPay, 2)} USDC to Kunda Box Protocol Treasury`, 
          meta: `Hedera Smart Contract 0.0.491204`, 
          ms: 1100,
          fx: () => {
            if (w.usdc !== undefined) w.usdc = Math.max(0, w.usdc - amountToPay);
            if (S.escrow) S.escrow.usdc += amountToPay;

            // Mark settled
            if (monthOrItem && monthOrItem.includes('2026')) {
              (S.allocatedFees || []).forEach(f => {
                if (!f.settledMonths) f.settledMonths = [];
                if (!f.settledMonths.includes(monthOrItem)) {
                  f.settledMonths.push(monthOrItem);
                }
              });
            } else if (monthOrItem && monthOrItem.startsWith('FEE-')) {
              const f = (S.allocatedFees || []).find(x => x.id === monthOrItem);
              if (f) {
                f.status = 'Settled';
                if (!f.settledMonths) f.settledMonths = [];
                f.settledMonths.push('September 2026', 'October 2026');
              }
            } else {
              // mark all current months as settled
              (S.allocatedFees || []).forEach(f => {
                if (!f.settledMonths) f.settledMonths = [];
                f.settledMonths.push('September 2026', 'October 2026');
              });
            }

            S.feed.unshift({
              ic: 'bank',
              tone: 'green',
              text: `Pursuit settled ${nf(amountToPay, 2)} USDC in facility fees to Kunda Box (kbridge).`,
              at: new Date()
            });
          }
        },
        { label: 'Recording cryptographic settlement receipt on Hedera', meta: 'SHA-256 State Root Verified', ms: 900 }
      ];

      ctx.openModal(ctx.modalShell('Processing Hedera Settlement', `${nf(amountToPay, 2)} USDC → Kunda Box Treasury`, 'refresh', '<div class="steps"></div>', ''));
      ctx.execSteps(steps, () => {
        ctx.openModal(ctx.modalShell('Fee Settlement Complete', 'Paid to Kunda Box Protocol Governance', 'check',
          ctx.successBlock('Kunda Box Facility Fee Settled', [
            ['Beneficiary', 'Kunda Box (kbridge) Protocol Treasury'],
            ['Amount Paid', `${nf(amountToPay, 2)} USDC`],
            ['Paid From', w.label || 'Originator Funding Wallet'],
            ['Target Billing', targetDesc],
            ['Rate Applied', '2.25% / 365 Daily Day-Count']
          ], tx),
          `<button class="btn btn-primary" data-act="close">Done</button>`
        ));
        ctx.toast.success(
          `Settled ${nf(amountToPay, 2)} USDC to Kunda Box`,
          `Transaction confirmed on Hedera Network`,
          'check'
        );
      });
    });
  }
}

/**
 * Bind live updates to the Fee Simulator
 */
export function bindFeeSimulator() {
  const amtEl = document.getElementById('simAmt');
  const daysEl = document.getElementById('simDays');
  const feeEl = document.getElementById('simResultFee');
  const dailyEl = document.getElementById('simResultDaily');
  const proofEl = document.getElementById('simResultProof');
  if (!amtEl || !daysEl || !feeEl) return;

  function update() {
    const amt = Math.max(0, Number(amtEl.value) || 0);
    const days = Math.max(0, Number(daysEl.value) || 0);
    const fee = amt * (0.0225 / 365) * days;
    const daily = amt * (0.0225 / 365);
    feeEl.innerHTML = `$${nf(fee, 2)} <span style="font-size:14px;color:var(--muted)">USDC</span>`;
    if (dailyEl) dailyEl.textContent = `$${nf(daily, 2)} / day`;
    if (proofEl) proofEl.textContent = `$${nf(amt, 0)} × (2.25% ÷ 365) × ${days} days`;
  }

  amtEl.addEventListener('input', update);
  daysEl.addEventListener('input', update);
  update();
}

