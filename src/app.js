import { LOGO, PLATFORM_LOGOS, HEDERA_LOGO, HEDERA_MARK } from './assets.js';
import { P, ic, spinner, TODAY, uid, hash, nf, usdc, tok, nav, pct, short, esc, dstr, dshort, ago, inDays, kLogo } from './helpers.js';
import { INITIAL_MINT_REQUESTS, mintStatusBadge, pipelineStepper, viewAdminDashboard, viewCapitalPartnerRequests, viewOriginatorNoteRequests } from './capitalFlow.js';
import { openRequestNotesModal, openUploadNotesModal, openInspectAndMintModal, openRequestDetailsModal, renderDocChip, openDocumentPreviewModal } from './capitalModals.js';
import {
  signupScreen, passwordResetScreen, brandedLoginScreen, enhancedGateScreen,
  pendingEmailScreen, pendingApprovalScreen, userAccountModal, getAccounts,
  findAccountByEmail, updateAccountPassword, registerAccount, verifyAccountEmail,
  approveAccount, rejectAccount, getPendingAccounts, checkPasswordStrength,
  calculateAge, INITIAL_ACCOUNTS
} from './auth.js';

/* ============================================================
   KBridge — partner portal
   Capital partners mint into receivables platforms; platforms publish a
   daily token value and settle redemptions. State is in memory.
   ============================================================ */

export const WORD_SCALE = { theoriq:1, pursuit:1 };
export function orgWord(k, h){
  const hh = h || 20;
  return '<span style="font-size:'+hh+'px;font-weight:600;letter-spacing:-0.02em">'+(ORGS[k]? ORGS[k].name : k)+'</span>';
}
export function orgMark(k, s){
  return '';
}

/* ---------- orgs ---------- */
export const ORGS = {
  theoriq:{ key:'theoriq', name:'Capital Partner', legal:'Capital Partner SPV', role:'capital',
    tag:'Capital Partner', side:'Brings USDC', color:'#141413', soft:'#F3F3F0', line:'#E4E4E0',
    email:'treasury@capitalpartner.com', blurb:'Deploy treasury USDC into receivables platforms and follow what your tokens are worth.' },
  pursuit:{ key:'pursuit', name:'Originating Partner', legal:'Originating Partner SPV I', role:'supply',
    tag:'Originating Partner', side:'Brings invoices', color:'#57534E', soft:'#F5F5F3', line:'#E4E4E0',
    email:'ops@originator.finance', blurb:'Raise capital against tokenised invoices, publish the daily token value and settle redemptions.' },
  kbridge:{ key:'kbridge', name:'KBridge Admin', legal:'KBridge Protocol Governance', role:'admin',
    tag:'Admin', side:'Protocol administration & oversight', color:'#0F172A', soft:'#F1F5F9', line:'#CBD5E1',
    email:'admin@kbridge.io', blurb:'Coordinate capital requests, file formal note requests with originating partners, audit contracts, and mint on Hedera.' }
};

export function addr(){ return '0x' + Array.from({length:40}, () => Math.floor(Math.random()*16).toString(16)).join(''); }

/* ---------- data ---------- */
export function series(days, drift, phase){
  const pts = []; let v = 1.0000;
  const start = new Date(TODAY.getTime() - days*86400000);
  for (let i = 0; i <= days-1; i++){
    const d = new Date(start.getTime() + i*86400000);
    if (i > 0) v = v * (1 + drift + Math.sin((i+phase)/9)*0.00007 + Math.sin((i+phase)/2.3)*0.00004);
    pts.push({ d, v: +v.toFixed(4) });
  }
  return pts;
}

export const S = {
  org: null,
  view: 'dash',
  authMode: 'gate',
  currentUser: null,
  signupState: {
    role: 'theoriq',
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    entity: '',
    agreeTerms: true,
    showPassword: false,
    showConfirmPassword: false,
    error: null,
    loading: false
  },
  resetState: {
    step: 1,
    email: 'treasury@capitalpartner.com',
    role: 'theoriq',
    code: '',
    sentCode: '849201',
    resendTimer: 45,
    newPassword: '',
    confirmPassword: '',
    showNewPassword: false,
    showConfirmPassword: false,
    error: null,
    loading: false
  },
  openPlatform: 'pursuit',
  adminHidden: false,
  toasts: [],
  mintRequests: JSON.parse(JSON.stringify(INITIAL_MINT_REQUESTS)),

  platforms: [
    { key:'pursuit', name:'Pursuit', legal:'Pursuit Receivables SPV I', symbol:'TOKENS',
      sector:'Trade receivables', terms:'30–120 day invoices',
      desc:'Short-dated receivables from vetted manufacturers, exporters and suppliers. Value is published every day as the invoices accrue.',
      status:'Open', opened:new Date(TODAY.getTime()-183*86400000), inception:1.0000,
      outstanding:4250000, history:series(183, 0.00023, 0),
      wallet:'0xkb31d9e07c4a2f68be105c3d7a49f8210cc73b0e2',
      facilities:[
        { id:'INV-2026-8921', name:'Acme Nuts & Bolts Manufacturing', sector:'Manufacturing', amount:100000, yield:5.0, term:90,  status:'Active' },
        { id:'INV-2026-8922', name:'Global Timber Exports Ltd.',      sector:'Commodities',   amount:250000, yield:7.2, term:120, status:'Active' },
        { id:'INV-2026-9004', name:'Vertex Robotics Inc.',            sector:'Robotics',      amount:180000, yield:6.4, term:60,  status:'Active' },
        { id:'INV-2026-9011', name:'Nexus Healthcare Inc.',           sector:'Healthcare',    amount:320000, yield:5.8, term:90,  status:'Funding' },
        { id:'INV-2026-9017', name:'Oasis Agriculture Inc.',          sector:'Agriculture',   amount:140000, yield:6.9, term:45,  status:'Matured' }
      ]},
    { key:'wayflyer', name:'Wayflyer', legal:'Wayflyer eCommerce SPV IV', symbol:'TOKENS',
      sector:'eCommerce advances', terms:'30–90 day revenues',
      desc:'eCommerce inventory and marketing advances backed by store sales. Value is updated as revenue payouts settle.',
      status:'Open', opened:new Date(TODAY.getTime()-120*86400000), inception:1.0000,
      outstanding:1850000, history:series(120, 0.00018, 4),
      wallet:'0xkb32d9f08c4b2f79be205d4e8a50f9310cc74b0f3',
      facilities:[
        { id:'ADV-2026-4401', name:'Peak Apparel Direct', sector:'eCommerce', amount:75000, yield:6.2, term:60, status:'Active' },
        { id:'ADV-2026-4402', name:'Home Decors Supply', sector:'eCommerce', amount:120000, yield:5.9, term:45, status:'Active' },
        { id:'ADV-2026-4403', name:'Apex Activewear Ltd', sector:'eCommerce', amount:90000, yield:6.5, term:90, status:'Active' }
      ]},
    { key:'credix', name:'Credix', legal:'Credix Auto Fin SPV II', symbol:'TOKENS',
      sector:'Auto loans', terms:'60–180 day pools',
      desc:'Asset-backed auto loan receivables originating from premium LATAM fintech pools. High yield collateralised debt.',
      status:'Open', opened:new Date(TODAY.getTime()-90*86400000), inception:1.0000,
      outstanding:3100000, history:series(90, 0.00028, 9),
      wallet:'0xkb33d9a09c4c2f80be305e4f9a60f9410cc75b0a4',
      facilities:[
        { id:'LON-2026-2101', name:'Nova Car Finance SPV', sector:'Auto Loans', amount:200000, yield:8.4, term:120, status:'Active' },
        { id:'LON-2026-2102', name:'Horizon Transit Pool', sector:'Auto Loans', amount:150000, yield:7.8, term:90, status:'Active' }
      ]}
  ],

  wallets: [
    { id:'w-t1', org:'theoriq', kind:'funds',  label:'Capital Partner Treasury', address:'0x8f3ad2b91c4e77a0d5be612f9a3c8471e0d92b64', network:'Hedera', usdc:100000, primary:true },
    { id:'w-t2', org:'theoriq', kind:'funds',  label:'Capital Partner Reserve', address:'0x22c9f4e81a07d3b6c25ef90ba14d7736e8c01f52', network:'Hedera', usdc:45000 },
    { id:'w-t3', org:'theoriq', kind:'tokens', label:'Capital Partner Token Custody', address:'0xa10b73ce55f2419d8ab6c0e73f81d2495ba7c318', network:'Hedera',
      bal:{ pursuit:0, wayflyer:0, credix:0 }, lock:{ pursuit:0, wayflyer:0, credix:0 }, immutable:true },
    { id:'w-p1', org:'pursuit', kind:'funds',  label:'Originator Partner Funding Wallet', address:'0x5d71ac09e4b83f26d1c7590ae4bb3f8021d64c7a', network:'Hedera', usdc:0, primary:true },
    { id:'w-p2', org:'pursuit', kind:'funds',  label:'Originator Partner Settlement Reserve', address:'0x9b48c7e0135da62f9c84be71a0d35f2647ce9810', network:'Hedera', usdc:500000 },
    { id:'w-p3', org:'wayflyer', kind:'funds',  label:'Wayflyer Funding Wallet', address:'0x6e81ac09e4b83f26d1c7590ae4bb3f8021d64c8b', network:'Hedera', usdc:0, primary:true },
    { id:'w-p4', org:'wayflyer', kind:'funds',  label:'Wayflyer Settlement Reserve', address:'0xab48c7e0135da62f9c84be71a0d35f2647ce9821', network:'Hedera', usdc:350000 },
    { id:'w-p5', org:'credix', kind:'funds',  label:'Credix Funding Wallet', address:'0x7f91ac09e4b83f26d1c7590ae4bb3f8021d64c9c', network:'Hedera', usdc:0, primary:true },
    { id:'w-p6', org:'credix', kind:'funds',  label:'Credix Settlement Reserve', address:'0xbc48c7e0135da62f9c84be71a0d35f2647ce9832', network:'Hedera', usdc:420000 }
  ],

  escrow: { usdc:0, tokens:0 },

  requests: [
    { id:'RDM-0042', pf:'pursuit', holder:'Theoriq', holderKey:'theoriq', tokens:120000, navAt:1.0388,
      payTo:'0x8f3a2b64c1e0d9a8f27c89b0a1d4e789f2a02b64',
      created:new Date(TODAY.getTime()-2*86400000), lockUntil:new Date(TODAY.getTime()+1*86400000), status:'Pending',
      documents: [
        {
          name: 'Redemption_Notice_RDM-0042_TOKENS.pdf',
          size: '1.9 MB',
          uploadedAt: new Date(TODAY.getTime()-2*86400000),
          hash: '0x5c8291a039b8172901a84729104b912389108c901823901bcae8291038291028',
          signer: 'Theoriq Capital Partner Treasury',
          facilityId: 'INV-2026-9004',
          status: 'Verified & Queued',
          docType: 'Institutional Token Burn & Redemption Notice'
        }
      ]
    },
    { id:'RDM-0041', pf:'pursuit', holder:'Theoriq', holderKey:'theoriq', tokens:65000, navAt:1.0371,
      payTo:'0x8f3a2b64c1e0d9a8f27c89b0a1d4e789f2a02b64',
      created:new Date(TODAY.getTime()-3*86400000), lockUntil:new Date(TODAY.getTime()+2*86400000), status:'Pending',
      documents: [
        {
          name: 'Redemption_Notice_RDM-0041_TOKENS.pdf',
          size: '2.1 MB',
          uploadedAt: new Date(TODAY.getTime()-3*86400000),
          hash: '0x49102839018290381029387a8291bf02c890184b912389108c901823901bcae8',
          signer: 'Theoriq Capital Partner Treasury',
          facilityId: 'INV-2026-8921',
          status: 'Verified & Queued',
          docType: 'Institutional Token Burn & Redemption Notice'
        }
      ]
    },
    { id:'RDM-0039', pf:'pursuit', holder:'Theoriq', holderKey:'theoriq', tokens:40000, navAt:1.0342,
      payTo:'0x8f3a2b64c1e0d9a8f27c89b0a1d4e789f2a02b64',
      created:new Date(TODAY.getTime()-9*86400000), lockUntil:new Date(TODAY.getTime()-5*86400000),
      status:'Settled', paid:41368, settledAt:new Date(TODAY.getTime()-7*86400000),
      documents: [
        {
          name: 'Settlement_Receipt_RDM-0039_TOKENS.pdf',
          size: '1.4 MB',
          uploadedAt: new Date(TODAY.getTime()-7*86400000),
          hash: '0x1029384820194820194820194820194820194820194820194820194820194820',
          signer: 'Pursuit Originator Settlement Desk',
          facilityId: 'INV-2026-8921',
          status: 'Settled & Burned on Hedera',
          docType: 'Redemption Settlement & Burn Receipt'
        }
      ]
    },
    { id:'RDM-0043', pf:'wayflyer', holder:'Theoriq', holderKey:'theoriq', tokens:50000, navAt:1.0250,
      payTo:'0x8f3a2b64c1e0d9a8f27c89b0a1d4e789f2a02b64',
      created:new Date(TODAY.getTime()-1*86400000), lockUntil:new Date(TODAY.getTime()+3*86400000), status:'Pending',
      documents: [
        {
          name: 'Redemption_Notice_RDM-0043_TOKENS.pdf',
          size: '1.7 MB',
          uploadedAt: new Date(TODAY.getTime()-1*86400000),
          hash: '0x4c29302bf02c890184b912389108c901823901bcae82910283901829038102938',
          signer: 'Theoriq Capital Partner Treasury',
          facilityId: 'ADV-2026-4401',
          status: 'Verified & Queued',
          docType: 'Institutional Token Burn & Redemption Notice'
        }
      ]
    },
    { id:'RDM-0044', pf:'credix', holder:'Theoriq', holderKey:'theoriq', tokens:80000, navAt:1.0180,
      payTo:'0x8f3a2b64c1e0d9a8f27c89b0a1d4e789f2a02b64',
      created:new Date(TODAY.getTime()-12*3600000), lockUntil:new Date(TODAY.getTime()+4*86400000), status:'Pending',
      documents: [
        {
          name: 'Redemption_Notice_RDM-0044_TOKENS.pdf',
          size: '2.0 MB',
          uploadedAt: new Date(TODAY.getTime()-12*3600000),
          hash: '0x1028f0c29302b84b912389108c901823901bcae82910283901829038102938ac8',
          signer: 'Theoriq Capital Partner Treasury',
          facilityId: 'LON-2026-2101',
          status: 'Verified & Queued',
          docType: 'Institutional Token Burn & Redemption Notice'
        }
      ]
    }
  ],

  positions: [],
  navPublishes: [],
  feed: [],
  notifications: []
};

/* ---------- platform helpers ---------- */
export const PL = k => S.platforms.find(p => p.key === k);
export const openPL = () => PL(S.openPlatform);
export const navOf = p => p.history.length ? p.history[p.history.length-1].v : p.inception;
export const changeOf = p => p.history.length > 1 ? (p.history[p.history.length-1].v / p.history[p.history.length-2].v - 1) * 100 : 0;
export const inceptionOf = p => p.history.length ? (navOf(p)/p.inception - 1) * 100 : 0;
export const poolOf = p => p.outstanding * navOf(p);
export const sameDay = (a,b) => a.toDateString() === b.toDateString();
export const publishedToday = p => p.history.length ? sameDay(p.history[p.history.length-1].d, TODAY) : false;

/* ---------- wallet helpers ---------- */
export const wal = id => S.wallets.find(w => w.id === id);
export const fundWallets = org => S.wallets.filter(w => w.org === org && w.kind === 'funds');
export const tokenWallet = () => S.wallets.find(w => w.kind === 'tokens');
export const orgCash = org => fundWallets(org).reduce((a,w) => a + (w.usdc||0), 0);
export const heldOf = k => tokenWallet().bal[k] || 0;
export const lockedOf = k => tokenWallet().lock[k] || 0;
export const positionValue = () => S.platforms.reduce((a,p) => a + (heldOf(p.key)+lockedOf(p.key)) * navOf(p), 0);
export const investedPlatforms = () => S.platforms.filter(p => heldOf(p.key)+lockedOf(p.key) > 0);
export const costOf = k => S.positions.filter(p => p.pf===k && p.type==='mint').reduce((a,p)=>a+p.usdc,0)
                  - S.positions.filter(p => p.pf===k && p.type==='redeem').reduce((a,p)=>a+(p.costOut||0),0);
export const totalCost = () => S.platforms.reduce((a,p) => a + costOf(p.key), 0);
export const myRequests = k => S.requests.filter(r => r.holderKey === 'theoriq' && (!k || r.pf === k));
export const pfRequests = k => S.requests.filter(r => r.pf === k);

/* ---------- seed derived copy ---------- */
(function seed(){
  S.navPublishes = [];
  S.platforms.forEach(p => {
    const h = p.history, n = h.length;
    if (n < 3) return;
    const cur = h[n-1].v, d1 = h[n-2].v, d2 = h[n-3].v;
    S.navPublishes.push(
      { pf:p.key, at:new Date(TODAY.getTime()-16*3600000), value:cur, pool:cur*p.outstanding, by:p.name + ' Ops' },
      { pf:p.key, at:new Date(TODAY.getTime()-40*3600000), value:d1,  pool:d1*p.outstanding,  by:p.name + ' Ops' },
      { pf:p.key, at:new Date(TODAY.getTime()-64*3600000), value:d2,  pool:d2*p.outstanding,  by:p.name + ' Ops' }
    );
  });

  const p = PL('pursuit');
  if (p) {
    const h = p.history, n = h.length;
    const d1 = h[n-2].v, d2 = h[n-3].v, d4 = h[n-5].v;
    if (S.requests && S.requests.length >= 3) {
      S.requests[0].navAt = d1; S.requests[1].navAt = d2; S.requests[2].navAt = d4;
      S.requests[2].paid = +(S.requests[2].tokens * d4).toFixed(2);
    }
  }

  const curVal = p ? p.history[p.history.length-1].v : 1.0435;
  const prevVal = p ? p.history[p.history.length-2].v : 1.0425;
  S.feed = [
    { ic:'coins', tone:'neutral', text:'Capital partner minted 300,000.00 TOKENS.', at:new Date(TODAY.getTime()-6*3600000) },
    { ic:'trend', tone:'green',   text:'Originating partner published a token value of '+nav(curVal)+' ('+pct((curVal/prevVal-1)*100)+' vs. prior day).', at:new Date(TODAY.getTime()-16*3600000) },
    { ic:'file',  tone:'gray',    text:'Facility INV-2026-9017 matured and settled into the pool.', at:new Date(TODAY.getTime()-26*3600000) },
    { ic:'flame', tone:'amber',   text:'Redemption RDM-0039 settled — 40,000.00 TOKENS burned.', at:new Date(TODAY.getTime()-7*86400000) }
  ];
  S.notifications = [
    { text:'Originating partner published a new token value: '+nav(curVal)+'.', at:'16h ago', unread:true },
    { text:'Redemption RDM-0042 is awaiting settlement.', at:'2 days ago', unread:true }
  ];
})();

/* ---------- toast notification helper ---------- */
export function toast(title, sub, icon, type = 'info', duration = 4200){
  const host = document.getElementById('toasts');
  const id = 'toast-' + Math.random().toString(36).slice(2, 9);
  const item = { id, title, sub, icon, type, timestamp: new Date() };
  
  if (!S.toasts) S.toasts = [];
  S.toasts.unshift(item);
  if (S.toasts.length > 50) S.toasts.pop();

  if (!host) return id;

  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.id = id;

  let icColor = '#38BDF8';
  let defaultIcon = 'info';
  if (type === 'success') { icColor = '#10B981'; defaultIcon = 'check'; }
  else if (type === 'error') { icColor = '#EF4444'; defaultIcon = 'alert'; }
  else if (type === 'warn') { icColor = '#F59E0B'; defaultIcon = 'alert'; }

  const iconName = icon || defaultIcon;

  el.innerHTML = `
    <span class="t-ic" style="color:${icColor}">
      ${ic(iconName, 'icon-sm')}
    </span>
    <div class="t-content">
      <div class="t-title">${esc(title)}</div>
      ${sub ? `<div class="t-sub">${esc(sub)}</div>` : ''}
    </div>
    <button class="t-close" data-dismiss="${id}" title="Dismiss" aria-label="Dismiss notification">
      ${ic('x', 'icon-xs')}
    </button>
  `;

  const closeBtn = el.querySelector('.t-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toast.dismiss(id);
    });
  }

  host.appendChild(el);

  if (duration > 0) {
    setTimeout(() => {
      toast.dismiss(id);
    }, duration);
  }

  return id;
}

toast.success = (title, sub, icon) => toast(title, sub, icon || 'check', 'success', 4500);
toast.error = (title, sub, icon) => toast(title, sub, icon || 'alert', 'error', 6000);
toast.warn = (title, sub, icon) => toast(title, sub, icon || 'alert', 'warn', 5000);
toast.info = (title, sub, icon) => toast(title, sub, icon || 'info', 'info', 4200);
toast.dismiss = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('toast-out');
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 240);
  }
  if (S.toasts) {
    S.toasts = S.toasts.filter(t => t.id !== id);
  }
};
toast.clear = () => {
  const host = document.getElementById('toasts');
  if (host) host.innerHTML = '';
  S.toasts = [];
};

/* ---------- NAV chart ---------- */
export let CHART_PTS = [];
export let LAST_CHART_PTS = null;
export let LAST_CHART_OPTS = null;
let resizeBound = false;

export function chart(points, opts){
  opts = opts || {};
  LAST_CHART_PTS = points;
  LAST_CHART_OPTS = opts;
  const W = opts.w || 760, H = opts.h || 250, padL = 54, padR = 16, padT = 18, padB = 30;
  const vs = points.map(p => p.v);
  const min = Math.min(...vs), max = Math.max(...vs);
  const lo = min - (max-min)*0.35 - 0.0005, hi = max + (max-min)*0.25 + 0.0005;
  const X = i => padL + (i/(points.length-1)) * (W-padL-padR);
  const Y = v => padT + (1 - (v-lo)/(hi-lo)) * (H-padT-padB);
  const line = points.map((p,i) => (i?'L':'M') + X(i).toFixed(1) + ' ' + Y(p.v).toFixed(1)).join(' ');
  const area = line + ' L ' + X(points.length-1).toFixed(1) + ' ' + (H-padB) + ' L ' + X(0).toFixed(1) + ' ' + (H-padB) + ' Z';

  let grid = '', ylab = '';
  for (let i = 0; i <= 3; i++){
    const v = lo + (hi-lo) * (i/3), y = Y(v);
    grid += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W-padR}" y2="${y.toFixed(1)}" stroke="#EFEFEB" stroke-width="1"/>`;
    ylab += `<text x="${padL-10}" y="${(y+3.5).toFixed(1)}" text-anchor="end" font-size="10" fill="#9A9A94" font-family="JetBrains Mono, monospace">$${v.toFixed(3)}</text>`;
  }
  let xlab = '', seen = '', lastX = -99;
  points.forEach((p,i) => {
    const m = p.d.toLocaleDateString('en-US',{month:'short'});
    if (m !== seen && i < points.length-2){
      seen = m;
      const x = X(i);
      if (x - lastX > 46){ lastX = x;
        xlab += `<text x="${x.toFixed(1)}" y="${H-10}" text-anchor="middle" font-size="10" fill="#9A9A94">${m}</text>`; }
    }
  });
  const last = points[points.length-1];
  CHART_PTS = points.map((p,i) => ({ x:X(i), y:Y(p.v), v:p.v, d:p.d }));
  const hit = `<rect id="chit" x="${padL}" y="${padT}" width="${W-padL-padR}" height="${H-padT-padB}" fill="transparent" style="cursor:crosshair"/>`;

  return `<div class="chart-wrap" id="chartWrap" style="width:100%">
    <svg id="navChart" viewBox="0 0 ${W} ${H}" width="100%" height="${H}" preserveAspectRatio="xMidYMid meet" style="display:block;overflow:visible;width:100%">
      <defs><linearGradient id="fillg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#141413" stop-opacity=".13"/><stop offset="1" stop-color="#141413" stop-opacity="0"/></linearGradient></defs>
      ${grid}${ylab}${xlab}
      <path d="${area}" fill="url(#fillg)"/>
      <path d="${line}" fill="none" stroke="#141413" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round"/>
      <line id="cx" x1="0" y1="${padT}" x2="0" y2="${H-padB}" stroke="#B5B5AF" stroke-width="1" stroke-dasharray="3 3" opacity="0"/>
      <circle id="chov" r="4.5" fill="#141413" stroke="#fff" stroke-width="2" opacity="0"/>
      <circle cx="${X(points.length-1).toFixed(1)}" cy="${Y(last.v).toFixed(1)}" r="4" fill="#141413" stroke="#fff" stroke-width="2"/>
      ${hit}
    </svg>
    <div class="chart-tip" id="chartTip"></div>
  </div>`;
}

export function bindChart(){
  const wrap = document.getElementById('chartWrap'); if (!wrap) return;
  const actualW = wrap.clientWidth;

  if (actualW && LAST_CHART_PTS && (!LAST_CHART_OPTS || LAST_CHART_OPTS.w !== actualW)) {
    const opts = { ...(LAST_CHART_OPTS || {}), w: actualW };
    wrap.outerHTML = chart(LAST_CHART_PTS, opts);
    bindChart();
    return;
  }

  if (!resizeBound) {
    resizeBound = true;
    window.addEventListener('resize', () => {
      bindChart();
    });
  }

  const svg = document.getElementById('navChart'); if (!svg) return;
  const pts = CHART_PTS, hit = document.getElementById('chit');
  const tip = document.getElementById('chartTip');
  const cx = document.getElementById('cx'), hov = document.getElementById('chov');
  if (!hit || !tip || !cx || !hov) return;
  hit.addEventListener('mousemove', ev => {
    const r = svg.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
    const box = svg.viewBox.baseVal, sc = r.width / box.width;
    const offY = (r.height - box.height*sc)/2;
    const vx = (ev.clientX - r.left) / sc;
    let best = 0, bd = 1e9;
    for (let i = 0; i < pts.length; i++){ const d = Math.abs(pts[i].x - vx); if (d < bd){ bd = d; best = i; } }
    const p = pts[best];
    cx.setAttribute('x1',p.x); cx.setAttribute('x2',p.x); cx.setAttribute('opacity','1');
    hov.setAttribute('cx',p.x); hov.setAttribute('cy',p.y); hov.setAttribute('opacity','1');
    tip.innerHTML = '<b class="mono">$'+p.v.toFixed(4)+'</b> &nbsp;<span style="color:#9CA3AF">'+dshort(p.d)+'</span>';
    tip.style.left = (r.left - wr.left + p.x*sc) + 'px';
    tip.style.top  = (r.top - wr.top + offY + p.y*sc) + 'px';
    tip.classList.add('on');
  });
  hit.addEventListener('mouseleave', () => {
    tip.classList.remove('on'); cx.setAttribute('opacity','0'); hov.setAttribute('opacity','0');
  });
}

export const SELS = {};
export function selectBox(id, options, value, onPick){
  SELS[id] = { options, value, onPick };
  const cur = options.find(o => o.v === value) || options[0] || {label:'—'};
  return `<div class="sel" data-sel="${id}">
    <button class="sel-btn" type="button" data-act="sel-open" data-id="${id}">
      <span class="stack" style="min-width:0">
        <span class="sel-lab">${cur.label}</span>
        ${cur.sub ? '<span class="sel-sub mono">'+cur.sub+'</span>' : ''}
      </span>
      ${ic('chevd','icon-sm')}
    </button>
    <div class="sel-menu hide" data-menu="${id}">
      ${options.map(o => `<button class="sel-opt ${o.v===value?'sel-on':''}" type="button" data-act="sel-pick" data-id="${id}" data-v="${o.v}">
        <span class="stack" style="min-width:0">
          <span class="sel-lab">${o.label}</span>
          ${o.sub ? '<span class="sel-sub mono">'+o.sub+'</span>' : ''}
        </span>
        <span class="sel-tick">${ic('check','icon-sm')}</span>
      </button>`).join('')}
    </div>
  </div>`;
}

/* ---------- 1. partner gate ---------- */
export function gateScreen(){
  return enhancedGateScreen();
}

/* ---------- 2. branded login ---------- */
export function loginScreen(k){
  return brandedLoginScreen(S, k);
}

/* ---------- 3. shell ---------- */
export function navItems(){
  if (S.org === 'kbridge') {
    return [['dash','Admin Pipeline'],['redemptions','Redemptions'],['wallets','Wallets']];
  }
  return S.org === 'theoriq'
    ? [['dash','Dashboard'],['platforms','Platforms'],['wallets','Wallets']]
    : [['dash','Dashboard'],['requests','Note Requests'],['redemptions','Redemptions'],['wallets','Wallets']];
}

export function header(){
  const tabs = () => navItems().map(([k,l]) =>
    `<button class="${(S.view===k || (k==='platforms' && S.view==='platform'))?'on':''}" data-act="view" data-view="${k}">${l}</button>`).join('');

  const roleSwitcher = `
    <div class="row gap4" style="margin-left:16px;background:rgba(15,23,42,0.05);padding:2px;border-radius:99px;border:1px solid rgba(15,23,42,0.06);display:inline-flex;align-items:center">
      <span class="muted hide-sm" style="font-size:10px;font-weight:600;padding:0 6px 0 8px;text-transform:uppercase;letter-spacing:0.02em;color:var(--muted)">As:</span>
      <button class="btn btn-quiet btn-xs" data-act="switch-role" data-org="theoriq" style="font-size:11px;font-weight:500;padding:2px 8px;border-radius:99px;height:22px;border:none;box-shadow:none;background:${S.org==='theoriq'?'var(--ink)':'transparent'};color:${S.org==='theoriq'?'#fff':'var(--muted)'}">Capital</button>
      <button class="btn btn-quiet btn-xs" data-act="switch-role" data-org="pursuit" style="font-size:11px;font-weight:500;padding:2px 8px;border-radius:99px;height:22px;border:none;box-shadow:none;background:${S.org==='pursuit'?'var(--ink)':'transparent'};color:${S.org==='pursuit'?'#fff':'var(--muted)'}">Originator</button>
      <button class="btn btn-quiet btn-xs" data-act="switch-role" data-org="kbridge" style="font-size:11px;font-weight:500;padding:2px 8px;border-radius:99px;height:22px;border:none;box-shadow:none;background:${S.org==='kbridge'?'var(--ink)':'transparent'};color:${S.org==='kbridge'?'#fff':'var(--muted)'}">Admin</button>
    </div>
  `;

  const user = S.currentUser || (getAccounts().find(a => a.role === S.org) || INITIAL_ACCOUNTS.find(a => a.role === S.org) || INITIAL_ACCOUNTS[0]);
  const userName = user.firstName ? `${user.firstName} ${user.lastName}` : (ORGS[S.org]?.name || 'Signatory');
  const userInitials = (user.firstName?.[0] || 'U') + (user.lastName?.[0] || '');

  return `<header class="app"><div class="wrap">
    <div class="hbar">
      <div class="row" style="align-items:center">
        <div class="brandline" style="cursor:pointer" data-act="view" data-view="dash">
          ${kLogo(30)}<span class="name"><span style="color:#ebb03f">k</span>bridge</span>
        </div>
        <nav class="nav" style="margin-left:24px">${tabs()}</nav>
        <span class="divider-v hide-sm" style="height:16px;margin-left:16px;border-left:1px solid var(--line)"></span>
        ${roleSwitcher}
      </div>
      <div class="row gap12" style="align-items:center">
        <button class="bell" data-act="notif">${ic('bell')}<span class="pip"></span></button>
        <button class="wallet-chip" data-act="acct">
          <span class="mono chip-bal" style="font-size:13px;font-weight:500">${nf(orgCash(S.org),0)}<span class="faint" style="font-size:11px;margin-left:4px">USDC</span></span>
          <span class="divider-v chip-div"></span>
          <span class="mono chip-addr" style="font-size:12px;color:var(--ink-2)">${short(fundWallets(S.org)[0] ? fundWallets(S.org)[0].address : '0x0000000000')}</span>
        </button>
        <button class="user-profile-btn hide-sm" data-act="view-user-profile" title="Signatory Profile (${esc(userName)})">
          <span class="user-avatar-circle">${userInitials}</span>
          <span style="max-width:115px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(userName)}</span>
        </button>
        <button class="btn btn-quiet btn-sm" data-act="logout" title="Sign out">${ic('out','icon-sm')}</button>
      </div>
    </div>
    <div class="mobile-nav">${tabs()}</div>
  </div></header>`;
}

export function pageHead(title, sub, action, back){
  return `${back? '<button class="btn btn-quiet btn-sm" style="margin-bottom:10px;padding-left:0" data-act="view" data-view="'+back[0]+'">'+ic('back','icon-sm')+' '+back[1]+'</button>' : ''}
  <div class="page-head"><div><h1>${title}</h1><p>${sub}</p></div>${action||''}</div>`;
}
export function stat(label, icon, value, sub, cls){
  return `<div class="card card-pad stat">
    <div class="label">${ic(icon,'icon-sm')} ${label}</div>
    <div class="value mono ${cls||''}">${value}</div>
    ${sub? '<div class="sub">'+sub+'</div>' : ''}
  </div>`;
}
export function banner(kind, icon, text, action){
  return `<div class="callout c-${kind}" style="margin-bottom:22px;align-items:center;justify-content:space-between;gap:16px">
    <div class="row gap8" style="align-items:flex-start">${ic(icon,'icon-sm')}<div>${text}</div></div>
    ${action||''}</div>`;
}
export function statusBadge(s){
  const map = { 'Open':'b-green', 'Opening soon':'b-amber', 'Closed':'b-gray',
                'Active':'b-green', 'Funding':'b-amber', 'Matured':'b-gray',
                'Pending':'b-amber', 'Settled':'b-green' };
  const label = s === 'Settled' ? 'Completed &amp; Paid' : s;
  return `<span class="badge ${map[s]||'b-gray'}"><span class="dot"></span>${label}</span>`;
}

/* ---------- shared cards ---------- */
export function balancesCard(){
  const tokenLines = S.platforms.filter(p => heldOf(p.key)+lockedOf(p.key) > 0)
    .map(p => nf(heldOf(p.key)+lockedOf(p.key),2)+' '+p.symbol).join('<br>') || '0.00';
  const rows = [
    ['Capital Partner · wallet of funds', fundWallets('theoriq').length+' registered', nf(orgCash('theoriq'),2)+' USDC'],
    ['Capital Partner · wallet of tokens', 'pre-configured, not editable', tokenLines],
    ['KBridge · settlement wallet', 'transit only', nf(S.escrow.usdc,2)+' USDC | '+nf(S.escrow.tokens,2)+' tokens'],
    ['Originating Partner · wallet of funds', fundWallets('pursuit').length+' registered', nf(orgCash('pursuit'),2)+' USDC']
  ];
  return `<div class="card">
    <div class="card-head"><h3>${ic('db','icon-sm')} Wallet balances</h3></div>
    <div>${rows.map(([who,sub,val]) => `<div class="wrow">
      <div><div style="font-size:13px;font-weight:500">${who}</div><div class="addr">${sub}</div></div>
      <div class="mono t-right" style="font-size:12.5px;font-weight:500;white-space:nowrap">${val}</div></div>`).join('')}</div>
  </div>`;
}
export function quickActions(items){
  return `<div class="card">
    <div class="card-head"><h3>${ic('grid','icon-sm')} Quick actions</h3></div>
    <div>${items.map(([act, label, sub, dis, data]) => `
      <button class="wrow" style="width:100%;text-align:left" data-act="${act}" ${data||''} ${dis?'disabled':''}>
        <div><div style="font-size:13.5px;font-weight:500;color:${dis?'var(--faint)':'var(--ink)'}">${label}</div>
          <div class="addr">${sub}</div></div>
        <span style="color:var(--faint)">${ic('right','icon-sm')}</span></button>`).join('')}</div>
  </div>`;
}
export function activityCard(n){
  const feed = S.feed.slice(0, n||5).map(f => {
    const tone = {neutral:['#F3F3F0','#141413'],green:['#F0FDF4','#15803D'],amber:['#FFFBEB','#B45309'],gray:['#F3F3F0','#6B6B66']}[f.tone];
    return `<div class="feed-item">
      <span class="feed-ic" style="background:${tone[0]};color:${tone[1]}">${ic(f.ic,'icon-sm')}</span>
      <div><p>${esc(f.text)}</p><div class="when mono">${ago(f.at)}</div></div></div>`;
  }).join('');
  return `<div class="card"><div class="card-head"><h3>${ic('activity','icon-sm')} Recent activity</h3></div><div>${feed}</div></div>`;
}
export function facilitiesCard(p){
  return '';
}
export function requestRows(list, opts){
  opts = opts || {};
  if (!list.length) return `<tr><td colspan="${opts.cols||6}" style="padding:36px;text-align:center" class="muted">${opts.empty||'Nothing here yet.'}</td></tr>`;
  return list.map(r => {
    const p = PL(r.pf);
    const isMint = r.reqType === 'mint' || (r.id && r.id.startsWith('REQ-'));
    const val = isMint ? (r.amt || 0) : (r.status === 'Settled' ? (r.paid || r.tokens*r.navAt) : r.tokens*navOf(p));
    const doc = (r.documents && r.documents[0]) || {
      name: isMint ? `Promissory_Note_${r.id}_${p ? p.symbol : 'TOKENS'}.pdf` : `Redemption_Notice_${r.id}_${p ? p.symbol : 'TOKENS'}.pdf`,
      size: '1.8 MB',
      uploadedAt: r.created,
      hash: r.tx || hash(),
      signer: isMint ? 'Pursuit Legal & Treasury Ops' : `${r.holder} Capital Partner Treasury`,
      facilityId: p && p.key === 'pursuit' ? 'INV-2026-9004' : 'INV-GEN-2026',
      status: r.status === 'Settled' || r.status === 'Completed' ? 'Settled & Verified on Hedera' : (r.status === 'Documents Uploaded' ? 'Verified & Ready' : (isMint ? 'Awaiting Originating Partner' : 'Verified & Queued')),
      docType: isMint ? 'Promissory Note & Invoice Assignment Contract' : 'Institutional Token Burn & Redemption Notice'
    };
    const docStr = encodeURIComponent(JSON.stringify(doc));

    const statusBadgeHtml = isMint ? mintStatusBadge(r.status, S.org) : statusBadge(r.status);
    const actionCell = isMint
      ? `<td class="t-right"><button class="btn btn-ghost btn-sm" data-act="req-details" data-id="${r.id}">${ic('file','icon-sm')} View Status</button></td>`
      : (opts.honour
          ? '<td class="t-right">' + (r.status==='Pending'
              ? '<button class="btn btn-primary btn-sm" data-act="honor" data-id="'+r.id+'">Settle '+ic('right','icon-sm')+'</button>'
              : '<span class="faint" style="font-size:11.5px">paid '+dshort(r.settledAt||r.created)+'</span>') + '</td>'
          : '<td class="faint t-right" style="font-size:11.5px">'+(r.status==='Pending' ? 'lock releases '+inDays(r.lockUntil) : 'paid '+dshort(r.settledAt||r.created))+'</td>');

    return `<tr class="hover-row">
      <td class="mono" style="font-weight:500">
        <div class="row gap8" style="align-items:center">
          <span>${r.id}</span>
          ${isMint ? '<span class="badge b-gray" style="font-size:10px;padding:1px 5px">Mint</span>' : '<span class="badge b-amber" style="font-size:10px;padding:1px 5px">Redeem</span>'}
          <button class="doc-eye-btn" data-act="preview-doc" data-doc="${docStr}" title="Preview file metadata and status" style="padding:2px 7px;font-size:11px">
            ${ic('eye','icon-xs')} <span>Doc</span>
          </button>
        </div>
      </td>
      ${opts.showHolder ? '<td>'+esc(r.holder)+'<div class="faint mono" style="font-size:11px">'+short(r.payTo || r.payFrom)+'</div></td>' : '<td>'+(p ? p.name : 'Platform')+'</td>'}
      <td class="mono t-right">${isMint ? '+' : ''}${nf(r.tokens,2)} ${p ? p.symbol : 'TOK'}</td>
      <td class="mono t-right" style="font-weight:500">${nf(val,2)}</td>
      <td class="mono">${dshort(r.created)}<div class="faint" style="font-size:11px">${ago(r.created)}</div></td>
      <td>${statusBadgeHtml}</td>
      ${actionCell}
    </tr>`;
  }).join('');
}

/* ---------- 4. dashboard · capital partner ---------- */
export function viewDashCapital(){
  const cash = orgCash('theoriq');
  const value = positionValue(), cost = totalCost(), gain = value - cost;
  const invested = investedPlatforms();
  const pend = myRequests().filter(r => r.status === 'Pending');
  const pendingMints = (S.mintRequests || []).filter(r => r.holderKey === 'theoriq' && r.status !== 'Completed');
  const tokensAwaitingAll = pendingMints.reduce((a, r) => a + (r.tokens || 0), 0);
  const fundsAllocatedAll = pendingMints.reduce((a, r) => a + (r.amt || 0), 0);

  const alert = pend.length
    ? banner('amber','hourglass',
        `<b>${pend.length} redemption request${pend.length>1?'s':''} pending settlement.</b> ${nf(pend.reduce((a,r)=>a+r.tokens,0),2)} tokens locked.`, '')
    : '';

  const mintAlert = pendingMints.length
    ? banner('amber','hourglass',
        `<b>${pendingMints.length} mint request${pendingMints.length>1?'s':''} in pipeline.</b> ${nf(tokensAwaitingAll,2)} TOKENS awaiting minting (${nf(fundsAllocatedAll,2)} USDC allocated). Originating partner auto-notified.`, '')
    : '';

  const holdings = invested.length ? invested.map(p => {
    const t = heldOf(p.key) + lockedOf(p.key), v = t * navOf(p), c = costOf(p.key), g = v - c;
    return `<div class="wrow" style="width:100%;align-items:center">
      <div class="row gap12" style="align-items:center">
        ${platformMark(p, 42)}
        <div><div style="font-size:15px;font-weight:600">${p.name}</div>
          <div class="addr">${nf(t,2)} ${p.symbol} · ${nav(navOf(p))} per token</div></div>
      </div>
      <div class="row gap16" style="align-items:center">
        <div class="t-right"><div class="mono" style="font-size:15px;font-weight:600">${nf(v,2)} USDC</div>
          <div class="mono ${g>=0?'pos':'neg'}" style="font-size:12px">${(g>=0?'+':'')+nf(g,2)} ${c?'('+pct(g/c*100)+')':''}</div></div>
        <div class="row gap8">
          <button class="btn btn-primary btn-sm" data-act="platform" data-key="${p.key}">View</button>
        </div>
      </div></div>`;
  }).join('') : `<div style="padding:48px;text-align:center" class="muted">
      You don’t hold tokens on any platform yet.<br>
      <button class="btn btn-primary btn-sm" style="margin-top:16px" data-act="view" data-view="platforms">Browse platforms ${ic('right','icon-sm')}</button>
    </div>`;

  return `${pageHead('Dashboard', 'Capital Partner',
    `<button class="btn btn-primary" data-act="view" data-view="platforms">${ic('coins','icon-sm')} Browse &amp; Mint</button>`)}
  ${alert}
  ${mintAlert}

  <div class="stats" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
    ${stat('Cash available','wallet', nf(cash,0)+' <span style="font-size:15px;color:var(--muted)" class="mono">USDC</span>', 'Across fund wallets')}
    ${stat('Portfolio value','layers', nf(value,2)+' <span style="font-size:15px;color:var(--muted)" class="mono">USDC</span>', cost? 'Cost '+nf(cost,2)+' USDC' : '—')}
    ${stat('Net gain','trend', (gain>=0?'+':'')+nf(gain,2), cost? pct(gain/cost*100)+' on cost' : '—', gain>0?'pos':'')}
  </div>

  <div class="stack" style="gap:24px">
    <div class="card">
      <div class="card-head">
        <h3>${ic('layers','icon-sm')} Your holdings</h3>
        <button class="btn btn-quiet btn-sm" data-act="view" data-view="platforms">All platforms ${ic('right','icon-sm')}</button>
      </div>
      <div>${holdings}</div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3>${ic('hourglass','icon-sm')} Redemption requests</h3>
      </div>
      <div class="table-scroll"><table>
        <thead><tr><th>Request</th><th>Platform</th><th class="t-right">Tokens</th><th class="t-right">Value (USDC)</th>
          <th>Submitted</th><th>Status</th><th></th></tr></thead>
        <tbody>${requestRows(myRequests().slice(0,5), {cols:7, empty:'No redemption requests yet.'})}</tbody></table></div>
    </div>

    ${viewCapitalPartnerRequests(S, CTX)}
  </div>`;
}

/* ---------- 5. platforms list ---------- */
export function platformMark(p, size){
  const s = size || 40;
  const rad = Math.round(s / 3.4);
  const box = `width:${s}px;height:${s}px;border-radius:${rad}px;flex:none;display:inline-flex;align-items:center;justify-content:center;overflow:hidden;background:#fff;border:1px solid var(--line-soft);box-shadow:0 1px 3px rgba(0,0,0,0.06);`;
  if (PLATFORM_LOGOS && PLATFORM_LOGOS[p.key]) {
    return `<span class="brand-mark" style="${box}">${PLATFORM_LOGOS[p.key]}</span>`;
  }
  return `<span style="${box};background:#141413;color:#fff;font-size:${Math.round(s*0.42)}px;font-weight:600">${p.name[0]}</span>`;
}
export function viewPlatforms(){
  const cards = S.platforms.map(p => {
    const open = p.status === 'Open';
    const t = heldOf(p.key) + lockedOf(p.key);
    const pendingM = (S.mintRequests || []).filter(r => r.pf === p.key && (S.org !== 'theoriq' || r.holderKey === 'theoriq') && r.status !== 'Completed');
    const awaitingTok = pendingM.reduce((s, r) => s + (r.tokens || 0), 0);
    return `<div class="card card-pad" style="display:flex;flex-direction:column;gap:16px">
      <div class="between" style="align-items:flex-start">
        <div class="row gap12">${platformMark(p, 46)}
          <div><div style="font-size:16px;font-weight:600;letter-spacing:-.01em">${p.name}</div>
            <div class="faint" style="font-size:12px">${p.legal} · ${p.sector}</div></div></div>
        ${statusBadge(p.status)}
      </div>
      <p class="muted" style="font-size:13px;line-height:1.55">${p.desc}</p>
      <div class="between" style="border-top:1px solid var(--line-soft);padding-top:14px;flex-wrap:wrap;gap:12px">
        <div><div class="micro">Value per token</div>
          <div class="mono" style="font-size:15px;margin-top:3px">${open? nav(navOf(p)) : '—'}</div></div>
        <div><div class="micro">Tokens minted</div>
          <div class="mono" style="font-size:15px;margin-top:3px">${open? nf(p.outstanding,0) : '—'}</div></div>
        <div><div class="micro">Pool value</div>
          <div class="mono" style="font-size:15px;margin-top:3px">${open? nf(poolOf(p),0) : '—'}</div></div>
        <div><div class="micro">6 month change</div>
          <div class="mono ${open?'pos':''}" style="font-size:15px;margin-top:3px">${open? pct(inceptionOf(p)) : '—'}</div></div>
      </div>
      <div class="between" style="gap:12px">
        <div class="faint" style="font-size:12px">${t>0 ? 'You hold <span class="mono">'+nf(t,2)+' '+p.symbol+'</span>' + (awaitingTok>0 ? ' · <span class="mono" style="color:var(--ink)">'+nf(awaitingTok,2)+' awaiting</span>' : '') : (awaitingTok>0 ? 'Awaiting mint: <span class="mono" style="color:var(--ink);font-weight:600">'+nf(awaitingTok,2)+' '+p.symbol+'</span>' : (open? 'No position' : 'Opens '+dstr(p.opened)))}</div>
        <div class="row gap8">
          <button class="btn btn-primary btn-sm" data-act="platform" data-key="${p.key}">View</button>
        </div>
      </div>
    </div>`;
  }).join('');

  return `${pageHead('Platforms', 'Receivables platforms on KBridge. Track pool metrics, token valuation, and facility details.', '')}
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(400px,100%),1fr))">${cards}</div>`;
}

/* ---------- 6. platform detail ---------- */
export function viewPlatform(){
  const p = openPL();
  const held = heldOf(p.key), locked = lockedOf(p.key), t = held + locked;
  const value = t * navOf(p), cost = costOf(p.key), gain = value - cost;
  const mine = myRequests(p.key);
  const moves = S.positions.filter(x => x.pf === p.key);

  const isCap = S.org === 'theoriq';
  const pendingMints = (S.mintRequests || []).filter(r => r.pf === p.key && (!isCap || r.holderKey === 'theoriq') && r.status !== 'Completed');
  const tokensAwaiting = pendingMints.reduce((sum, r) => sum + (r.tokens || 0), 0);
  const fundsAllocated = pendingMints.reduce((sum, r) => sum + (r.amt || 0), 0);
  const pfMintRequests = (S.mintRequests || []).filter(r => r.pf === p.key && (!isCap || r.holderKey === 'theoriq'));

  const allRequests = [
    ...pfMintRequests.map(r => ({ ...r, reqType: 'mint' })),
    ...mine.map(r => ({ ...r, reqType: 'redemption' }))
  ].sort((a, b) => new Date(b.created) - new Date(a.created));

  const ledgerRows = moves.length ? moves.map(m => `
    <tr class="hover-row">
      <td>${m.type==='mint' ? '<span class="badge b-gray"><span class="dot"></span>Mint</span>' : '<span class="badge b-amber"><span class="dot"></span>Redemption</span>'}</td>
      <td class="mono">${dstr(m.at)}<div class="faint" style="font-size:11px">${ago(m.at)}</div></td>
      <td class="mono t-right">${nf(m.tokens,2)}</td>
      <td class="mono t-right">${nav(m.nav)}</td>
      <td class="mono t-right">${nf(m.usdc,2)}</td>
      <td class="mono faint" style="font-size:11.5px">${m.tx.slice(0,10)}…${m.tx.slice(-6)}</td>
    </tr>`).join('')
    : '<tr><td colspan="6" style="padding:36px;text-align:center" class="muted">No token movements yet.</td></tr>';

  const headContent = `<div class="row gap16" style="align-items:center">
    ${platformMark(p, 44)}
    <div><h1 style="margin:0">${p.name}</h1><p style="margin:2px 0 0">${p.legal} · ${p.sector} · ${p.terms}</p></div>
  </div>`;

  return `${pageHead(headContent, '',
    `<div class="row gap8">
      <button class="btn btn-ghost" data-act="redeem" data-key="${p.key}" ${held<=0?'disabled':''}>${ic('flame','icon-sm')} Request redemption</button>
      <button class="btn btn-primary" data-act="mint" data-key="${p.key}">${ic('coins','icon-sm')} Mint tokens</button></div>`,
    ['platforms','Platforms'])}

  <div class="stats">
    ${stat('Value per token','trend', nav(navOf(p)),
      '<span class="'+(changeOf(p)>=0?'pos':'neg')+'">'+pct(changeOf(p))+'</span> vs. previous day · published '+ago(S.navPublishes.filter(x=>x.pf===p.key)[0] ? S.navPublishes.filter(x=>x.pf===p.key)[0].at : TODAY))}
    ${stat('Tokens minted','db', nf(p.outstanding,0)+' <span style="font-size:15px;color:var(--muted)" class="mono">'+p.symbol+'</span>', 'Across all holders')}
    ${stat('Aggregate value','layers', nf(poolOf(p),0)+' <span style="font-size:15px;color:var(--muted)" class="mono">USDC</span>', 'Tokens minted × '+nav(navOf(p)))}
    ${stat('Your position','wallet', (t > 0 ? nf(t,2) : (tokensAwaiting > 0 ? nf(tokensAwaiting,2) : '0.00'))+' <span style="font-size:15px;color:var(--muted)" class="mono">'+p.symbol+'</span>',
      t ? nf(value,2)+' USDC'+(locked? ' · '+nf(locked,2)+' locked':'')+(tokensAwaiting > 0 ? ' · '+nf(tokensAwaiting,2)+' awaiting' : '')
        : (tokensAwaiting > 0 ? '<span class="mono" style="color:var(--ink);font-weight:600">'+nf(tokensAwaiting,2)+' '+p.symbol+'</span> awaiting minting ('+nf(fundsAllocated,2)+' USDC)' : 'No tokens yet'))}
  </div>

  <div class="cols cols-2-1" style="align-items:stretch">
    <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;height:100%">
      <div class="card-head"><h3>${ic('activity','icon-sm')} Token value · last 6 months</h3>
        <span class="badge b-gray">${pct(inceptionOf(p))} since opening</span></div>
      <div style="padding:20px 18px 8px;flex:1;display:flex;flex-direction:column;justify-content:center">${chart(p.history, {h:300})}</div>
      <div class="between" style="padding:14px 22px 18px;border-top:1px solid var(--line-soft);flex-wrap:wrap;gap:14px;margin-top:auto">
        <div><div class="micro">Opening value</div><div class="mono" style="font-size:15px;margin-top:3px">${nav(p.inception)}</div></div>
        <div><div class="micro">Low</div><div class="mono" style="font-size:15px;margin-top:3px">${nav(Math.min(...p.history.map(x=>x.v)))}</div></div>
        <div><div class="micro">High</div><div class="mono" style="font-size:15px;margin-top:3px">${nav(Math.max(...p.history.map(x=>x.v)))}</div></div>
        <div><div class="micro">Opened</div><div class="mono" style="font-size:15px;margin-top:3px">${dstr(p.opened)}</div></div>
      </div>
    </div>

    <div class="card" style="display:flex;flex-direction:column;height:100%">
      <div class="card-head"><h3>${ic('wallet','icon-sm')} Your position</h3></div>
      <div class="card-pad stack" style="gap:2px">
        <div class="kv"><span class="k">Tokens held</span><span class="v mono">${nf(held,2)} ${p.symbol}</span></div>
        <div class="kv"><span class="k">Locked in redemption</span><span class="v mono">${nf(locked,2)} ${p.symbol}</span></div>
        <div class="kv"><span class="k">Tokens awaiting minting</span><span class="v mono" ${tokensAwaiting > 0 ? 'style="color:var(--ink);font-weight:600"' : ''}>${nf(tokensAwaiting,2)} ${p.symbol}</span></div>
        <div class="kv"><span class="k">Funds allocated to minting</span><span class="v mono" ${fundsAllocated > 0 ? 'style="color:var(--ink);font-weight:600"' : ''}>${nf(fundsAllocated,2)} USDC</span></div>
        <div class="kv"><span class="k">Value per token</span><span class="v mono">${nav(navOf(p))}</span></div>
        <div class="kv"><span class="k">Cost</span><span class="v mono">${nf(cost,2)} USDC</span></div>
        <div class="kv kv-total"><span class="k" style="color:var(--ink);font-weight:500">Current value</span>
          <span class="v mono" style="font-size:15px">${nf(value,2)} USDC</span></div>
        <div class="kv"><span class="k">Gain</span><span class="v mono ${gain>=0?'pos':'neg'}">${(gain>=0?'+':'')+nf(gain,2)} USDC</span></div>
        ${tokensAwaiting > 0 ? `
          <div class="callout c-amber" style="margin-top:12px">
            ${ic('hourglass','icon-sm')}
            <div style="font-size:12px;line-height:1.45">
              <b>${nf(tokensAwaiting,2)} ${p.symbol} in minting pipeline:</b> ${nf(fundsAllocated,2)} USDC allocated across ${pendingMints.length} pending mint request${pendingMints.length>1?'s':''}.
            </div>
          </div>
        ` : ''}
        <div class="callout c-neutral" style="margin-top:12px">${ic('lock','icon-sm')}<div>
          Tokens are delivered to <b>${tokenWallet().label}</b> — the only address that can hold them. It is pre-configured and cannot be edited.</div></div>
      </div>
    </div>
  </div>

  <div class="stack" style="gap:20px;margin-top:24px">
    <div class="card">
      <div class="card-head">
        <h3>${ic('hourglass','icon-sm')} Your requests here</h3>
        <span class="badge b-gray">${allRequests.length} request${allRequests.length===1?'':'s'}</span>
      </div>
      <div class="table-scroll"><table>
        <thead><tr><th>Request</th><th>Platform</th><th class="t-right">Tokens</th><th class="t-right">Value</th><th>Submitted</th><th>Status</th><th class="t-right">Action</th></tr></thead>
        <tbody>${requestRows(allRequests, {cols:7, empty:'No requests yet.'})}</tbody></table></div>
    </div>

    <div class="card">
      <div class="card-head"><h3>${ic('activity','icon-sm')} Your token movements</h3></div>
      <div class="table-scroll"><table>
        <thead><tr><th>Event</th><th>Date</th><th class="t-right">Tokens</th><th class="t-right">Value per token</th>
          <th class="t-right">USDC</th><th>Transaction</th></tr></thead>
        <tbody>${ledgerRows}</tbody></table></div>
    </div>
  </div>`;
}

/* ---------- 7. wallets ---------- */
export function viewWallets(){
  const isCap = S.org === 'theoriq';
  const funds = fundWallets(S.org);
  const tw = tokenWallet();

  const fundRows = funds.map(w => `
    <div class="wrow">
      <div class="row gap12" style="min-width:0;flex:1 1 auto">
        <span class="wic">${ic('wallet','icon-sm')}</span>
        <div style="min-width:0;overflow:hidden">
          <div class="row gap8" style="flex-wrap:nowrap"><span style="font-size:13.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(w.label)}</span>
            ${w.primary? '<span class="badge b-ink" style="font-size:10px;flex:none">Default</span>':''}</div>
          <div class="addr mono" title="${w.address}">${short(w.address)}</div>
        </div>
      </div>
      <div class="row gap12" style="flex:none;align-items:center;margin-left:auto">
        <div class="t-right" style="flex:none"><div class="mono" style="font-size:13.5px;font-weight:500">${nf(w.usdc,2)}</div>
          <div class="faint" style="font-size:11px">USDC · ${w.network}</div></div>
        <div class="row gap4" style="flex:none">
          ${w.primary ? '' : '<button class="btn btn-ghost btn-sm" data-act="wallet-primary" data-id="'+w.id+'">Make default</button>'}
          <button class="btn btn-quiet btn-sm" data-act="wallet-edit" data-id="${w.id}" title="Edit">${ic('pencil','icon-sm')}</button>
          <button class="btn btn-quiet btn-sm" data-act="wallet-del" data-id="${w.id}" title="Remove">${ic('trash','icon-sm')}</button>
        </div>
      </div>
    </div>`).join('') || '<div style="padding:36px;text-align:center" class="muted">No wallets registered yet.</div>';

  const tokenCard = isCap ? `
    <div class="card">
      <div class="card-head"><h3>${ic('lock','icon-sm')} Token wallet</h3>
        <span class="badge b-gray">${ic('lock','icon-sm')} Not editable</span></div>
      <div class="wrow locked">
        <div class="row gap12" style="min-width:0;flex:1 1 auto">
          <span class="wic">${ic('lock','icon-sm')}</span>
          <div style="min-width:0;overflow:hidden">
            <div style="font-size:13.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(tw.label)}</div>
            <div class="addr mono" title="${tw.address}">${short(tw.address)}</div>
          </div>
        </div>
      </div>
      <div>${S.platforms.filter(p => p.status==='Open').map(p => `
        <div class="wrow" style="padding-top:11px;padding-bottom:11px">
          <div class="row gap12" style="min-width:0;flex:1">${platformMark(p, 26)}<span style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</span></div>
          <div class="mono t-right" style="font-size:13px;font-weight:500;flex:none">${nf(heldOf(p.key)+lockedOf(p.key),2)} ${p.symbol}</div>
        </div>`).join('')}</div>
      <div style="padding:14px 20px;border-top:1px solid var(--line-soft)">
        <div class="callout c-neutral">${ic('shield','icon-sm')}<div>
          Every token you mint is delivered to this address and no other. It is managed by the capital partner outside KBridge, so it is shown here read-only.</div></div>
      </div>
    </div>` : `
    <div class="card">
      <div class="card-head"><h3>${ic('bank','icon-sm')} How funds move</h3></div>
      <div class="card-pad stack" style="gap:2px">
        <div class="kv"><span class="k">Receives capital from mints</span>
          <span class="v mono">${short((funds.find(w=>w.primary)||funds[0]||{address:'—'}).address)}</span></div>
        <div class="kv"><span class="k">Pays out redemptions</span>
          <span class="v">Chosen when you settle each request</span></div>
        <div class="kv"><span class="k">Network</span><span class="v">Hedera · USDC</span></div>
        <div class="callout c-neutral" style="margin-top:12px">${ic('info','icon-sm')}<div>
          Add every wallet you want to receive capital in or pay redemptions from. The default wallet receives mint proceeds.</div></div>
      </div>
    </div>`;

  return `${pageHead('Wallets', isCap
      ? 'The wallets you send funds from and receive funds into.'
      : 'The wallets that receive capital and settle redemptions.',
    `<button class="btn btn-primary" data-act="wallet-add">${ic('plus','icon-sm')} Add wallet</button>`)}

  <div class="cols cols-1-1">
    <div class="card">
      <div class="card-head"><h3>${ic('wallet','icon-sm')} Fund wallets</h3>
        <span class="mono" style="font-size:12.5px;font-weight:500">${nf(orgCash(S.org),2)} USDC</span></div>
      <div>${fundRows}</div>
    </div>
    ${tokenCard}
  </div>`;
}

/* ---------- 8. dashboard · receivables partner ---------- */
export function viewDashSupply(){
  const p = PL(S.openPlatform) || PL('pursuit');
  const pend = pfRequests(p.key).filter(r => r.status === 'Pending');
  const owed = pend.reduce((a,r) => a + r.tokens*navOf(p), 0);
  const cash = orgCash(p.key);
  const funds = fundWallets(p.key);
  const short_ = cash < owed;

  const lastPub = S.navPublishes.find(n => n.pf === p.key);
  const lastPubTime = lastPub ? ago(lastPub.at) : (p.history.length > 1 ? ago(p.history[p.history.length-2].d) : '16h ago');

  const alert = !publishedToday(p)
    ? banner('amber','alert',
        `<b>Today’s token value has not been published for ${p.name}.</b> Holders still see ${nav(navOf(p))} from ${lastPubTime}.`,
        `<button class="btn btn-primary btn-sm" data-act="publish">${ic('upload','icon-sm')} Publish now</button>`)
    : banner('green','check', `<b>Today’s token value is published for ${p.name}</b> at ${nav(navOf(p))}. Every holder is marked at this value.`, '');

  const platformSelector = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;background:#fff;padding:12px 16px;border-radius:12px;border:1px solid var(--line-soft);box-shadow: 0 1px 2px rgba(0,0,0,0.05)">
      <span class="faint" style="font-weight:600;font-size:13.5px">${ic('layers','icon-xs')} Active Originating Platform:</span>
      <div style="width:340px;position:relative;z-index:40">
        ${selectBox('dashPlatform', S.platforms.map(x => ({ v:x.key, label:x.name + ' (' + x.symbol + ')', sub:x.legal })), p.key, v => {
          S.openPlatform = v;
          render();
        })}
      </div>
    </div>
  `;

  return `${pageHead('Dashboard', 'Originating Partner',
    `<button class="btn btn-primary" data-act="publish">${ic('upload','icon-sm')} Publish token value</button>`)}
  
  ${platformSelector}
  ${alert}

  <div class="stats" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
    ${stat('Capital received','bank', nf(cash,0)+' <span style="font-size:15px;color:var(--muted)" class="mono">USDC</span>', 'Across '+funds.length+' registered wallets')}
    ${stat('Tokens minted','db', nf(p.outstanding,0)+' <span style="font-size:15px;color:var(--muted)" class="mono">'+p.symbol+'</span>', 'Held by capital partners')}
    ${stat('Pool value','layers', nf(poolOf(p),0)+' <span style="font-size:15px;color:var(--muted)" class="mono">USDC</span>', 'Tokens minted × '+nav(navOf(p)))}
    ${stat('Redemptions due','hourglass', String(pend.length), short_
      ? '<span style="color:var(--bad)">'+nf(owed,2)+' USDC owed · short by '+nf(owed-cash,2)+'</span>'
      : nf(owed,2)+' USDC payable · funded')}
  </div>

  <div class="stack" style="gap:24px">
    <div class="card">
      <div class="card-head">
        <h3>${ic('hourglass','icon-sm')} Redemption queue</h3>
        <button class="btn btn-quiet btn-sm" data-act="view" data-view="redemptions">All redemptions ${ic('right','icon-sm')}</button>
      </div>
      <div class="table-scroll"><table>
        <thead><tr><th>Request</th><th>Holder</th><th class="t-right">Tokens</th><th class="t-right">Payable</th>
          <th>Submitted</th><th>Status</th><th></th></tr></thead>
        <tbody>${requestRows(pend.slice(0,5), {cols:7, showHolder:true, honour:true, empty:'Queue is clear.'})}</tbody></table></div>
    </div>

    <div class="card">
      <div class="card-head"><h3>${ic('activity','icon-sm')} Published token value</h3>
        <span class="badge ${publishedToday(p)?'b-green':'b-amber'}"><span class="dot"></span>${publishedToday(p)?'Published today':'Not published today'}</span></div>
      <div style="padding:18px 18px 4px">${chart(p.history, {h:230})}</div>
      <div class="between" style="padding:14px 22px 18px;border-top:1px solid var(--line-soft);flex-wrap:wrap;gap:14px">
        <div><div class="micro">Latest</div><div class="mono" style="font-size:15px;margin-top:3px">${nav(navOf(p))}</div></div>
        <div><div class="micro">Previous day</div><div class="mono" style="font-size:15px;margin-top:3px">${nav(p.history[p.history.length-2].v)}</div></div>
        <div><div class="micro">Change</div><div class="mono ${changeOf(p)>=0?'pos':'neg'}" style="font-size:15px;margin-top:3px">${pct(changeOf(p))}</div></div>
        <div><div class="micro">Since opening</div><div class="mono pos" style="font-size:15px;margin-top:3px">${pct(inceptionOf(p))}</div></div>
      </div>
    </div>

    ${viewOriginatorNoteRequests(S, CTX)}
  </div>`;
}

/* ---------- 9. redemptions · receivables partner ---------- */
export function viewRedemptionsSupply(){
  const p = PL(S.openPlatform) || PL('pursuit');
  const all = pfRequests(p.key);
  const pend = all.filter(r => r.status === 'Pending');
  const done = all.filter(r => r.status !== 'Pending');
  const owed = pend.reduce((a,r) => a + r.tokens*navOf(p), 0);
  const cash = orgCash(p.key);

  const platformSelector = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;background:#fff;padding:12px 16px;border-radius:12px;border:1px solid var(--line-soft);box-shadow: 0 1px 2px rgba(0,0,0,0.05)">
      <span class="faint" style="font-weight:600;font-size:13.5px">${ic('layers','icon-xs')} Active Originating Platform:</span>
      <div style="width:340px;position:relative;z-index:40">
        ${selectBox('redPlatform', S.platforms.map(x => ({ v:x.key, label:x.name + ' (' + x.symbol + ')', sub:x.legal })), p.key, v => {
          S.openPlatform = v;
          render();
        })}
      </div>
    </div>
  `;

  return `${pageHead('Redemptions', 'Holders burn tokens back into USDC. Pick a request, choose the wallet to pay from, and settle it.', '')}
  
  ${platformSelector}

  <div class="stats">
    ${stat('Waiting','hourglass', String(pend.length), 'Requests to settle')}
    ${stat('Tokens to burn','flame', nf(pend.reduce((a,r)=>a+r.tokens,0),2)+' <span style="font-size:15px;color:var(--muted)" class="mono">'+p.symbol+'</span>','Locked in holders’ wallets')}
    ${stat('Cash required','bank', nf(owed,2)+' <span style="font-size:15px;color:var(--muted)" class="mono">USDC</span>', 'At '+nav(navOf(p))+' per token')}
    ${stat('Available to pay','wallet', nf(cash,2)+' <span style="font-size:15px;color:var(--muted)" class="mono">USDC</span>',
      cash>=owed? 'Enough across your wallets' : '<span style="color:var(--bad)">Short by '+nf(owed-cash,2)+' USDC</span>')}
  </div>

  <div class="card" style="margin-bottom:20px">
    <div class="card-head"><h3>${ic('hourglass','icon-sm')} Waiting to be settled</h3></div>
    <div class="table-scroll"><table>
      <thead><tr><th>Request</th><th>Holder</th><th class="t-right">Tokens</th><th class="t-right">Payable</th>
        <th>Submitted</th><th>Status</th><th></th></tr></thead>
      <tbody>${requestRows(pend, {cols:7, showHolder:true, honour:true, empty:'Queue is clear.'})}</tbody></table></div>
  </div>

  <div class="card">
    <div class="card-head"><h3>${ic('check','icon-sm')} Settled</h3></div>
    <div class="table-scroll"><table>
      <thead><tr><th>Request</th><th>Holder</th><th class="t-right">Tokens</th><th class="t-right">Paid</th>
        <th>Submitted</th><th>Status</th><th></th></tr></thead>
      <tbody>${requestRows(done, {cols:7, showHolder:true, honour:true, empty:'Nothing settled yet.'})}</tbody></table></div>
  </div>`;
}

/* ============================================================
   Modals, flows, router
   ============================================================ */
let modalHost = document.getElementById('modal-host');
if (!modalHost) {
  modalHost = document.createElement('div');
  modalHost.id = 'modal-host';
  document.body.appendChild(modalHost);
}

export function openModal(html){ modalHost.innerHTML = '<div class="overlay" id="ovl">'+html+'</div>'; }
export function closeModal(){ modalHost.innerHTML = ''; }

export function openTermsModal() {
  const body = `
    <div style="font-size:13.5px;line-height:1.6;color:var(--ink-2);max-height:55vh;overflow-y:auto;padding-right:8px;display:flex;flex-direction:column;gap:14px" class="stack">
      <div class="callout c-neutral" style="margin-bottom:12px;display:flex;align-items:flex-start;gap:10px">
        ${ic('info','icon-sm')}
        <div style="font-size:12.5px">
          <b>Authorized Signatory Notice:</b> By checking the agreement checkbox and signing, you certify that you have read, understood, and agreed to this legally binding operational contract.
        </div>
      </div>
      
      <div>
        <h3 style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:6px">SECTION 1: INTRODUCTORY PROVISIONS</h3>
        <p>
          These Terms of Service (the "Agreement") form a legally binding contract between KBridge Financial, Inc. ("KBridge") and the registering corporate legal entity represented by the signatory ("Institutional Partner"). The KBridge Protocol operates as a specialized, real-time administrative and tokenization gateway connecting audited trade receivables accounts ("Originating Partners") with institutional yield providers ("Capital Partners") on the Hedera Distributed Ledger Technology (DLT) network.
        </p>
      </div>

      <div>
        <h3 style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:6px">SECTION 2: REPRESENTATION OF CORPORATE CAPACITY</h3>
        <p>
          By checking the acceptance box and initiating the signatory registration, you represent, warrant, and covenant that: (a) you are an authorized officer, signatory, or legal representative of the registering corporate entity; (b) you possess all necessary corporate approvals, powers, and credentials to commit funds, transfer USDC, issue promissory backing notes, and execute smart contract-based token burns; and (c) all registration data (including legal entity name, corporate email address, and age validation) is complete and true.
        </p>
      </div>

      <div>
        <h3 style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:6px">SECTION 3: SMART CONTRACT TOKENIZATION & HEDERA STANDARD CUSTODY</h3>
        <p>
          The KBridge Protocol utilizes standard automated Hedera Smart Contracts and Hedera Token Service (HTS) minting protocols. Capital Partners authorize the locking of treasury USDC in stablecoin vaults to mint corresponding quantities of TOKENS. All parties agree that such tokenized positions are mathematically backed by verified, legally binding trade receivables and that such smart contracts govern interest payouts, NAV adjustments, and redemption queues automatically.
        </p>
      </div>

      <div>
        <h3 style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:6px">SECTION 4: REDEMPTIONS, SETTLEMENTS & BURN STANDARDS</h3>
        <p>
          Token redemption and subsequent burning are subject to standard liquidity intervals, notice periods, and reserve thresholds. Originating Partners are contractually mandated to settle all incoming redemptions within the specified queue timeframes. KBridge is not an escrow agent, custodian, or financial advisor, and is not responsible for settlement defaults, counterparty liquidity failures, or network outages.
        </p>
      </div>

      <div>
        <h3 style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:6px">SECTION 5: RISK ACKNOWLEDGMENTS & WAIVER OF LIABILITY</h3>
        <p>
          Institutional partners acknowledge and accept all risks inherent to smart contracts, digital custody, stablecoin pegs, and DLT network stability. Under no circumstances shall KBridge, its affiliates, or Hedera infrastructure operators be liable for indirect, incidental, consequential, or punitive damages, including loss of profits, corporate data, or treasury funds resulting from counterparty default, cyber-attacks, or lost cryptographic keys.
        </p>
      </div>

      <div class="sep" style="margin:8px 0"></div>

      <p class="faint" style="font-size:12px;font-style:italic">
        Version Code: KB-TOS-2026-V1. This terms draft is designed for Delaware SPV structured finance compliance. Legal teams may modify or append localized jurisdiction riders later as required.
      </p>
    </div>
  `;
  const foot = `<button class="btn btn-primary btn-block" data-act="close">${ic('check', 'icon-sm')} I Read &amp; Agree to the Terms</button>`;
  openModal(modalShell('KBridge Institutional Terms of Service', 'Corporate Signatory Agreement & HTS Token Standards', 'shield', body, foot, true));
}
export function modalShell(title, sub, icon, body, foot, wide){
  return `<div class="modal ${wide?'modal-wide':''}">
    <div class="modal-head">
      <div><h2>${ic(icon,'icon-sm')} ${title}</h2><p>${sub}</p></div>
      <button class="xbtn" data-act="close">${ic('x','icon-sm')}</button>
    </div>
    <div class="modal-body" id="mBody">${body}</div>
    ${foot ? '<div class="modal-foot">'+foot+'</div>' : ''}
  </div>`;
}
export const walletOptions = org => fundWallets(org).map(w => ({ v:w.id, label:w.label, sub:short(w.address)+' · '+nf(w.usdc,2)+' USDC' }));

/* ---------- step runner ---------- */
export function execSteps(steps, onDone){
  const body = document.getElementById('mBody');
  let i = 0;
  const paint = () => {
    body.innerHTML = `<div class="callout c-neutral">${ic('shield','icon-sm')}<div>Confirming each step. Keep this window open.</div></div>
      <div class="steps">` + steps.map((s, idx) => {
        const cls = idx < i ? 'done' : (idx === i ? 'active' : '');
        const glyph = idx < i ? ic('check','icon-sm') : (idx === i ? spinner : '<span style="width:7px;height:7px;border-radius:99px;background:#D6D6D1;display:block"></span>');
        return `<div class="step ${cls}"><span class="sic">${glyph}</span>
          <div><div class="txt">${s.label}</div>${s.meta?'<div class="meta">'+s.meta+'</div>':''}</div></div>`;
      }).join('') + `</div>
      <div class="progress"><div style="width:${Math.round(i/steps.length*100)}%"></div></div>`;
  };
  paint();
  const tick = () => {
    if (i >= steps.length){ onDone(); return; }
    setTimeout(() => { if (steps[i].fx) steps[i].fx(); i++; paint(); tick(); }, steps[i].ms || 900);
  };
  tick();
}
export function successBlock(title, lines, tx){
  return `<div style="text-align:center;padding:6px 0 2px">
      <div class="tick">${ic('check','icon-lg')}</div>
      <h3 style="font-size:16.5px;font-weight:600;margin-top:14px">${title}</h3>
    </div>
    <div class="panel">${lines.map(([k,v]) => `<div class="kv"><span class="k">${k}</span><span class="v mono">${v}</span></div>`).join('')}</div>
    <div><div class="micro" style="margin-bottom:6px">Transaction</div><div class="hashbox mono">${tx}</div></div>`;
}

export const CTX = {
  PL, openPL, navOf, changeOf, inceptionOf, poolOf,
  wal, fundWallets, tokenWallet, orgCash, heldOf, lockedOf,
  positionValue, investedPlatforms, costOf, totalCost,
  myRequests, pfRequests, openModal, closeModal, modalShell,
  execSteps, successBlock, toast,
  get render() { return render; }
};

/* ============================================================
   Mint — USDC into platform tokens
   ============================================================ */
export let M = {};
export function mintOpen(key){
  const openPfs = S.platforms.filter(p => p.status === 'Open');
  const pf = key || (openPfs.find(p => heldOf(p.key) > 0) || openPfs[0]).key;
  const funds = fundWallets('theoriq');
  const richest = funds.slice().sort((a,b) => b.usdc - a.usdc)[0];
  const pref = funds.find(w => w.primary);
  const from = (pref && pref.usdc > 0) ? pref : (richest || funds[0]);
  M = { pf, wid:from.id, amt: Math.min(100000, Math.max(0, from.usdc)), step:'config' };
  mintRender();
}
export const mintTokens = () => M.amt / navOf(PL(M.pf));
export function mintRender(){
  const p = PL(M.pf), w = wal(M.wid), tw = tokenWallet();
  const over = M.amt > (w ? w.usdc : 0);
  const openPfs = S.platforms.filter(x => x.status === 'Open');

  if (M.step === 'config'){
    const body = `
      <label class="field"><span>Platform</span>
        ${selectBox('mPf', openPfs.map(x => ({ v:x.key, label:x.name, sub:nav(navOf(x))+' per token · '+x.sector })), M.pf,
          v => { M.pf = v; mintRender(); })}</label>

      <label class="field"><span>Pay from</span>
        ${selectBox('mW', walletOptions('theoriq'), M.wid, v => { M.wid = v; mintRender(); })}</label>

      <div>
        <div class="between" style="margin-bottom:6px">
          <span style="font-size:13px;font-weight:500;color:var(--ink-2)">Amount</span>
          <span class="faint" style="font-size:12px">Balance <span class="mono">${nf(w?w.usdc:0,2)}</span> USDC</span>
        </div>
        <div style="position:relative">
          <input class="input input-lg mono" id="mAmt" type="number" min="0" step="100" value="${M.amt}">
          <span class="mono faint" style="position:absolute;right:14px;top:13px;font-size:13px">USDC</span>
        </div>
        <div class="presets" style="margin-top:10px">
          <button data-act="mint-pct" data-p="25">25%</button>
          <button data-act="mint-pct" data-p="50">50%</button>
          <button data-act="mint-pct" data-p="100">Max</button>
        </div>
        ${over ? '<div class="err">'+ic('alert','icon-sm')+' More than this wallet holds.</div>' : ''}
      </div>

      <div class="panel" id="mPrev">
        <div class="kv"><span class="k">Value per token</span><span class="v mono">${nav(navOf(p))}</span></div>
        <div class="kv"><span class="k">Tokens you receive</span><span class="v mono">${nf(mintTokens(),2)} ${p.symbol}</span></div>
        <div class="kv"><span class="k">Delivered to</span><span class="v" title="${tw.address}">${esc(tw.label)} ${ic('lock','icon-sm')}</span></div>
        <div class="kv"><span class="k">Fee</span><span class="v mono">0.00 USDC</span></div>
        <div class="kv kv-total"><span class="k" style="color:var(--ink);font-weight:500">Total to pay</span>
          <span class="v mono" style="font-size:15px">${nf(M.amt,2)} USDC</span></div>
      </div>`;
    const foot = `<button class="btn btn-ghost" data-act="close">Cancel</button>
      <button class="btn btn-primary" data-act="mint-review" ${over||M.amt<=0?'disabled':''}>Review ${ic('right','icon-sm')}</button>`;
    openModal(modalShell('Mint tokens', 'Turn USDC into platform tokens', 'coins', body, foot));
    document.getElementById('mAmt').addEventListener('input', e => {
      M.amt = Math.max(0, Number(e.target.value)||0); mintPreview();
    });
    return;
  }

  const body = `
    <div class="panel">
      <div class="kv"><span class="k">Platform</span><span class="v">${p.name}</span></div>
      <div class="kv"><span class="k">Paying from</span><span class="v">${esc(w.label)}</span></div>
      <div class="kv"><span class="k">Amount</span><span class="v mono">${nf(M.amt,2)} USDC</span></div>
      <div class="kv"><span class="k">Value per token</span><span class="v mono">${nav(navOf(p))}</span></div>
      <div class="kv kv-total"><span class="k" style="color:var(--ink);font-weight:500">Tokens you receive</span>
        <span class="v mono" style="font-size:15px">${nf(mintTokens(),2)} ${p.symbol}</span></div>
    </div>
    <div>
      <div class="micro" style="margin-bottom:10px">What happens next</div>
      <div class="stack" style="gap:9px">
        ${[['1','USDC leaves '+esc(w.label)],
           ['2',nf(mintTokens(),2)+' '+p.symbol+' is minted'],
           ['3','USDC settles to the originating partner’s funding wallet']].map(([n,t]) =>
          `<div class="row gap12" style="font-size:13px;color:var(--ink-2)">
            <span class="numdot mono">${n}</span>${t}</div>`).join('')}
      </div>
    </div>
    <div class="callout c-amber">${ic('alert','icon-sm')}<div>Minting cannot be reversed. To exit, submit a redemption request.</div></div>`;
  const foot = `<button class="btn btn-ghost" data-act="mint-back">Back</button>
    <button class="btn btn-primary" data-act="mint-go">${ic('shield','icon-sm')} Confirm</button>`;
  openModal(modalShell('Confirm', 'Check the details before you continue', 'shield', body, foot));
}
export function mintPreview(){
  const el = document.getElementById('mPrev'); if (!el) return;
  const p = PL(M.pf), w = wal(M.wid);
  el.querySelectorAll('.kv')[1].querySelector('.v').textContent = nf(mintTokens(),2)+' '+p.symbol;
  el.querySelector('.kv-total .v').textContent = nf(M.amt,2)+' USDC';
  const b = document.querySelector('[data-act="mint-review"]');
  if (b) b.disabled = (M.amt <= 0 || M.amt > w.usdc);
}
export function mintGo(){
  const p = PL(M.pf), w = wal(M.wid), tw = tokenWallet();
  if (!w || M.amt <= 0) {
    toast.error('Invalid mint amount', 'Please enter a valid USDC amount greater than zero.', 'alert');
    return;
  }
  if (M.amt > w.usdc) {
    toast.error('Insufficient balance', `Selected wallet only has ${nf(w.usdc, 2)} USDC.`, 'alert');
    return;
  }
  const dest = p.key === 'pursuit' ? fundWallets('pursuit').find(x => x.primary) : null;
  const amt = M.amt, tokens = mintTokens();
  const curYear = new Date().getFullYear();
  const reqId = 'REQ-' + curYear + '-0' + (82 + ((S.mintRequests && S.mintRequests.length) ? S.mintRequests.length - 3 : 0));

  const steps = [
    { label:'Authorizing capital allocation from wallet', meta:w.label, ms:900 },
    { label:'Submitting formal capital mint request to KBridge Protocol', meta:'Request ID: '+reqId, ms:900 },
    { label:'Automatically notifying originating partner to submit contracts', meta:p.name, ms:800 }
  ];

  openModal(modalShell('Submitting Capital Request', nf(amt,2)+' USDC → '+nf(tokens,2)+' '+p.symbol, 'coins', '<div class="steps"></div>', ''));
  execSteps(steps, () => {
    const newReq = {
      id: reqId,
      pf: p.key,
      holder: 'Theoriq',
      holderKey: 'theoriq',
      amt,
      tokens,
      navAt: navOf(p),
      payFrom: w.address,
      payFromLabel: w.label,
      tokenCustody: tw.address,
      destWallet: dest ? dest.address : '0x5d71ac09e4b83f26d1c7590ae4bb3f8021d64c7a',
      destWalletLabel: dest ? dest.label : 'Originating Partner Funding Wallet',
      status: 'Awaiting Originating Partner',
      created: new Date(),
      notesRequestedAt: new Date(),
      noteType: 'Senior Secured Promissory Note & Invoice Purchase Agreement',
      instructions: `Originating partner automatically notified to provide signed backing contract notes for ${nf(amt, 2)} USDC allocation.`,
      documents: [],
      mintedAt: null,
      tx: null
    };
    if (!S.mintRequests) S.mintRequests = [];
    S.mintRequests.unshift(newReq);
    S.feed.unshift({ ic:'coins', tone:'neutral', text:'Capital Partner filed capital request '+reqId+' for '+nf(tokens,2)+' '+p.symbol+'. Originating partner auto-notified.', at:new Date() });

    const body = `
      <div style="text-align:center;padding:8px 0 12px">
        <div class="tick">${ic('check','icon-lg')}</div>
        <h3 style="font-size:17px;font-weight:600;margin-top:14px">Capital Request Submitted</h3>
        <p class="muted" style="font-size:13.5px;max-width:440px;margin:6px auto 0">
          Request <b class="mono" style="color:var(--ink)">${reqId}</b> active. <b style="color:var(--ink)">${p.name}</b> (Originating Partner) has been automatically notified to produce and submit backing contract documents.
        </p>
      </div>

      <div style="margin-bottom:16px">
        ${pipelineStepper('Awaiting Originating Partner')}
      </div>

      <div class="panel">
        <div class="kv"><span class="k">Platform</span><span class="v">${p.name}</span></div>
        <div class="kv"><span class="k">Capital Amount</span><span class="v mono">${nf(amt,2)} USDC</span></div>
        <div class="kv"><span class="k">Tokens to Mint</span><span class="v mono">${nf(tokens,2)} ${p.symbol}</span></div>
        <div class="kv"><span class="k">Source Wallet</span><span class="v">${esc(w.label)}</span></div>
        <div class="kv"><span class="k">Pipeline Status</span><span class="v">${mintStatusBadge('Awaiting Originating Partner')}</span></div>
      </div>

      <div class="callout c-neutral">
        ${ic('info','icon-sm')}
        <div style="font-size:12.5px;line-height:1.5">
          <b>Next steps:</b> The Originating Partner will upload signed legal promissory notes. Once submitted, KBridge Admin will inspect &amp; review the documents and execute token minting.
        </div>
      </div>
    `;

    const foot = `
      <button class="btn btn-primary" data-act="close">Close</button>
    `;

    openModal(modalShell('Capital Request Active', reqId, 'coins', body, foot));
    toast.success('Capital request submitted', reqId + ' — Originating Partner notified', 'coins');
    render();
  });
}

/* ============================================================
   Redemption request
   ============================================================ */
export let R = {};
export function redeemOpen(key){
  const held = S.platforms.filter(p => heldOf(p.key) > 0);
  if (!held.length){
    toast.warn('No tokens to redeem', 'Mint tokens on an active platform first', 'alert');
    return;
  }
  const pf = (key && heldOf(key) > 0) ? key : held[0].key;
  const funds = fundWallets('theoriq');
  R = { pf, tokens: Math.floor(heldOf(pf)/2), wid:(funds.find(w=>w.primary)||funds[0]).id, step:'config' };
  redeemRender();
}
export function redeemRender(){
  const p = PL(R.pf), held = heldOf(R.pf);
  const value = R.tokens * navOf(p);
  const lockUntil = new Date(Date.now() + 2*86400000);
  const heldPfs = S.platforms.filter(x => heldOf(x.key) > 0);

  const stagedDoc = {
    name: `Redemption_Notice_${p.symbol}_Burn.pdf`,
    size: '1.8 MB',
    uploadedAt: new Date(),
    hash: hash(),
    signer: 'Theoriq Capital Partner Treasury',
    facilityId: p.key === 'pursuit' ? 'INV-2026-9004' : 'INV-GEN-2026',
    status: 'Verified & Queued',
    docType: 'Institutional Token Burn & Redemption Notice'
  };

  if (R.step === 'config'){
    const body = `
      ${heldPfs.length > 1 ? `<label class="field"><span>Platform</span>
        ${selectBox('rPf', heldPfs.map(x => ({ v:x.key, label:x.name, sub:nf(heldOf(x.key),2)+' '+x.symbol+' held' })), R.pf,
          v => { R.pf = v; R.tokens = Math.floor(heldOf(v)/2); redeemRender(); })}</label>` : ''}

      <div>
        <div class="between" style="margin-bottom:2px">
          <span style="font-size:13px;font-weight:500;color:var(--ink-2)">Tokens to burn</span>
          <input class="input mono" id="rTok" type="number" min="0" max="${held}" value="${R.tokens}" style="max-width:170px;text-align:right;padding:6px 10px">
        </div>
        <input class="slider" id="rSlide" type="range" min="0" max="${Math.floor(held)}" value="${R.tokens}">
        <div class="between faint mono" style="font-size:11px"><span>0</span><span>${nf(held,0)} ${p.symbol} held</span></div>
        <div class="presets" style="margin-top:10px">
          <button data-act="rdm-pct" data-p="25">25%</button>
          <button data-act="rdm-pct" data-p="50">50%</button>
          <button data-act="rdm-pct" data-p="100">All</button>
        </div>
      </div>

      <label class="field"><span>Send the USDC to</span>
        ${selectBox('rW', walletOptions('theoriq'), R.wid, v => { R.wid = v; })}</label>

      <div class="panel" id="rPrev">
        <div class="kv"><span class="k">Tokens burned</span><span class="v mono">${nf(R.tokens,2)} ${p.symbol}</span></div>
        <div class="kv"><span class="k">Value per token</span><span class="v mono">${nav(navOf(p))}</span></div>
        <div class="kv"><span class="k">Tokens locked until</span><span class="v">${dstr(lockUntil)}</span></div>
        <div class="kv kv-total"><span class="k" style="color:var(--ink);font-weight:500">You receive</span>
          <span class="v mono" style="font-size:15px">${nf(value,2)} USDC</span></div>
      </div>

      <div style="margin-top:14px;margin-bottom:14px">
        <div class="micro" style="margin-bottom:6px">Redemption Burn Authorization Note</div>
        ${renderDocChip(stagedDoc)}
      </div>

      <div class="callout c-amber">${ic('lock','icon-sm')}<div>
        These tokens are locked as soon as you submit, until the originating partner settles the request.</div></div>`;
    const foot = `<button class="btn btn-ghost" data-act="close">Cancel</button>
      <button class="btn btn-primary" data-act="rdm-review" ${R.tokens<=0?'disabled':''}>Review ${ic('right','icon-sm')}</button>`;
    openModal(modalShell('Request redemption', 'Burn tokens back into USDC', 'flame', body, foot));

    const t = document.getElementById('rTok'), sl = document.getElementById('rSlide');
    t.addEventListener('input', e => { R.tokens = Math.min(held, Math.max(0, Number(e.target.value)||0)); sl.value = R.tokens; redeemPreview(); });
    sl.addEventListener('input', e => { R.tokens = Number(e.target.value); t.value = R.tokens; redeemPreview(); });
    return;
  }

  const w = wal(R.wid);
  const body = `
    <div class="panel">
      <div class="kv"><span class="k">Platform</span><span class="v">${p.name}</span></div>
      <div class="kv"><span class="k">Tokens burned</span><span class="v mono">${nf(R.tokens,2)} ${p.symbol}</span></div>
      <div class="kv"><span class="k">Value per token</span><span class="v mono">${nav(navOf(p))}</span></div>
      <div class="kv"><span class="k">Paid into</span><span class="v">${esc(w.label)}</span></div>
      <div class="kv"><span class="k">Left after this</span><span class="v mono">${nf(held - R.tokens,2)} ${p.symbol}</span></div>
      <div class="kv kv-total"><span class="k" style="color:var(--ink);font-weight:500">You receive</span>
        <span class="v mono" style="font-size:15px">${nf(R.tokens*navOf(p),2)} USDC</span></div>
    </div>

    <div style="margin-top:14px;margin-bottom:14px">
      <div class="micro" style="margin-bottom:6px">Attached Burn Authorization Note</div>
      ${renderDocChip(stagedDoc)}
    </div>

    <div class="callout c-neutral">${ic('info','icon-sm')}<div>
      The request goes into the originating partner’s settlement queue. You can follow it from your dashboard.</div></div>`;
  const foot = `<button class="btn btn-ghost" data-act="rdm-back">Back</button>
    <button class="btn btn-primary" data-act="rdm-go">${ic('shield','icon-sm')} Submit request</button>`;
  openModal(modalShell('Confirm request', 'Tokens lock as soon as you submit', 'shield', body, foot));
}
export function redeemPreview(){
  const el = document.getElementById('rPrev'); if (!el) return;
  const p = PL(R.pf);
  el.querySelectorAll('.kv')[0].querySelector('.v').textContent = nf(R.tokens,2)+' '+p.symbol;
  el.querySelector('.kv-total .v').textContent = nf(R.tokens*navOf(p),2)+' USDC';
  const b = document.querySelector('[data-act="rdm-review"]'); if (b) b.disabled = R.tokens <= 0;
}
export function redeemGo(){
  const p = PL(R.pf), tw = tokenWallet(), w = wal(R.wid);
  const held = heldOf(p.key);
  if (R.tokens <= 0 || R.tokens > held) {
    toast.error('Invalid amount', `You have ${nf(held, 2)} ${p.symbol} available to redeem.`, 'alert');
    return;
  }
  const tokens = R.tokens, navAt = navOf(p), tx = hash();
  const id = 'RDM-' + String(43 + myRequests().length).padStart(4,'0');
  const doc = {
    name: `Redemption_Notice_${id}_${p.symbol}.pdf`,
    size: '1.8 MB',
    uploadedAt: new Date(),
    hash: tx,
    signer: 'Theoriq Capital Partner Treasury',
    facilityId: p.key === 'pursuit' ? 'INV-2026-9004' : 'INV-GEN-2026',
    status: 'Verified & Queued',
    docType: 'Institutional Token Burn & Redemption Notice'
  };

  const steps = [
    { label:'Checking your balance', meta:nf(heldOf(p.key),2)+' '+p.symbol+' available', ms:950 },
    { label:'Locking '+nf(tokens,2)+' '+p.symbol, meta:'Released when settled or on '+dstr(new Date(Date.now()+2*86400000)), ms:1050,
      fx:()=>{ tw.bal[p.key] -= tokens; tw.lock[p.key] += tokens; } },
    { label:'Sending the request to the originating partner', meta:'Queued as '+id, ms:1050,
      fx:()=>{ S.requests.unshift({ id, pf:p.key, holder:'Capital Partner', holderKey:'theoriq', tokens, navAt,
        payTo:w.address, created:new Date(), lockUntil:new Date(Date.now()+2*86400000), status:'Pending',
        documents: [doc] }); } }
  ];
  openModal(modalShell('Submitting', nf(tokens,2)+' '+p.symbol, 'flame', '<div class="steps"></div>', ''));
  execSteps(steps, () => {
    S.feed.unshift({ ic:'flame', tone:'amber', text:'You requested redemption of '+nf(tokens,2)+' '+p.symbol+' ('+id+').', at:new Date() });
    const successContent = `
      ${successBlock('Request '+id+' submitted', [
        ['Platform', p.name], ['Tokens locked', nf(tokens,2)+' '+p.symbol],
        ['Value per token', nav(navAt)], ['You receive', nf(tokens*navAt,2)+' USDC'], ['Into', w.label]
      ], tx)}
      <div style="margin-top:16px">
        <div class="micro" style="margin-bottom:6px">Attached Redemption Burn Certificate</div>
        ${renderDocChip(doc)}
      </div>
    `;
    openModal(modalShell('Request submitted', 'The originating partner will settle it from the queue', 'check',
      successContent,
      `<button class="btn btn-primary" data-act="close">Done</button>`));
    toast.success('Request '+id+' submitted', nf(tokens,2)+' '+p.symbol+' locked for settlement', 'hourglass');
  });
}

/* ============================================================
   Settle a redemption (receivables partner)
   ============================================================ */
export let H = {};
export function honorOpen(id){
  const r = S.requests.find(x => x.id === id); if (!r) return;
  const funds = fundWallets('pursuit');
  H = { id, wid:(funds.find(w => w.usdc > 0) || funds[0]).id, price: navOf(PL(r.pf)) };
  honorRender();
}
export function honorRender(){
  const r = S.requests.find(x => x.id === H.id), p = PL(r.pf);
  const w = wal(H.wid), total = r.tokens * H.price, short_ = w.usdc < total;
  const doc = (r.documents && r.documents[0]) || {
    name: `Redemption_Notice_${r.id}_${p.symbol}.pdf`,
    size: '1.8 MB',
    uploadedAt: r.created,
    hash: hash(),
    signer: `${r.holder} Capital Partner Treasury`,
    facilityId: p.key === 'pursuit' ? 'INV-2026-9004' : 'INV-GEN-2026',
    status: 'Verified & Queued',
    docType: 'Institutional Token Burn & Redemption Notice'
  };

  const body = `
    <div class="panel">
      <div class="between">
        <div><div class="micro">Request</div>
          <div class="mono" style="font-size:14px;font-weight:600;margin-top:3px">${r.id}</div>
          <div class="faint" style="font-size:11.5px">${esc(r.holder)} · ${ago(r.created)}</div></div>
        <div class="t-right"><div class="micro">Tokens to burn</div>
          <div class="mono" style="font-size:15px;font-weight:600;margin-top:3px">${nf(r.tokens,2)} ${p.symbol}</div>
          <div class="faint" style="font-size:11px">locked ${inDays(r.lockUntil)}</div></div>
      </div>
    </div>

    <div style="margin-top:14px;margin-bottom:14px">
      <div class="micro" style="margin-bottom:6px">Attached Redemption Notice &amp; Legal Authorization</div>
      ${renderDocChip(doc)}
    </div>

    <label class="field"><span>Pay from</span>
      ${selectBox('hW', walletOptions('pursuit'), H.wid, v => { H.wid = v; honorRender(); })}</label>

    <label class="field"><span>Value per token</span>
      <input class="input mono" id="hPrice" type="number" step="0.0001" value="${H.price.toFixed(4)}">
      <div class="hint">Today’s published value is <span class="mono">${nav(navOf(p))}</span> · at request it was <span class="mono">${nav(r.navAt)}</span></div></label>

    <div class="panel" id="hPrev">
      <div class="kv"><span class="k">Tokens burned</span><span class="v mono">${nf(r.tokens,2)} ${p.symbol}</span></div>
      <div class="kv"><span class="k">Value per token</span><span class="v mono">${nav(H.price)}</span></div>
      <div class="kv"><span class="k">Paid to</span><span class="v mono">${short(r.payTo)}</span></div>
      <div class="kv kv-total"><span class="k" style="color:var(--ink);font-weight:500">Total to pay</span>
        <span class="v mono" style="font-size:15px">${nf(total,2)} USDC</span></div>
    </div>
    ${short_ ? '<div class="err">'+ic('alert','icon-sm')+' This wallet holds less than the amount payable.</div>' : ''}`;
  const foot = `<button class="btn btn-ghost" data-act="close">Cancel</button>
    <button class="btn btn-primary" data-act="honor-go" ${short_?'disabled':''}>${ic('shield','icon-sm')} Pay and burn</button>`;
  openModal(modalShell('Settle redemption', 'Pay the capital partner and burn their tokens', 'bank', body, foot));
  document.getElementById('hPrice').addEventListener('input', e => {
    H.price = Math.max(0, Number(e.target.value)||0); honorPreview();
  });
}
export function honorPreview(){
  const r = S.requests.find(x => x.id === H.id), w = wal(H.wid), el = document.getElementById('hPrev');
  if (!el) return;
  const total = r.tokens * H.price;
  el.querySelectorAll('.kv')[1].querySelector('.v').textContent = nav(H.price);
  el.querySelector('.kv-total .v').textContent = nf(total,2)+' USDC';
  const b = document.querySelector('[data-act="honor-go"]'); if (b) b.disabled = (w.usdc < total || H.price <= 0);
}
export function honorGo(){
  const r = S.requests.find(x => x.id === H.id), p = PL(r.pf), w = wal(H.wid), tw = tokenWallet();
  const total = r.tokens * H.price, tx = hash();
  if (w.usdc < total) {
    toast.error('Insufficient wallet balance', 'Selected funding wallet holds less than the payable amount.', 'alert');
    return;
  }
  const mine = r.holderKey === 'theoriq';
  const dest = mine ? S.wallets.find(x => x.address === r.payTo) : null;
  const steps = [
    { label:'Confirming with your wallet', meta:w.label, ms:1000 },
    { label:'Taking '+nf(total,2)+' USDC from '+w.label, meta:short(w.address), ms:1050,
      fx:()=>{ w.usdc -= total; S.escrow.usdc += total; } },
    { label:'Paying the capital partner', meta:short(r.payTo), ms:1050,
      fx:()=>{ S.escrow.usdc -= total; if (dest) dest.usdc += total; } },
    { label:'Burning '+nf(r.tokens,2)+' '+p.symbol, meta:'Removed from supply', ms:1150,
      fx:()=>{ if (mine) tw.lock[p.key] -= r.tokens; p.outstanding -= r.tokens;
               r.status='Settled'; r.paid=total; r.settledAt=new Date(); r.navAt=H.price; } }
  ];
  openModal(modalShell('Settling', r.id, 'bank', '<div class="steps"></div>', ''));
  execSteps(steps, () => {
    S.feed.unshift({ ic:'flame', tone:'amber', text:'Redemption '+r.id+' settled — '+nf(r.tokens,2)+' '+p.symbol+' burned.', at:new Date() });
    if (mine) S.positions.unshift({ pf:p.key, type:'redeem', at:new Date(), tokens:r.tokens, nav:H.price, usdc:total,
      costOut: costPerToken(p.key)*r.tokens, tx });
    openModal(modalShell('Settled', 'Funds delivered and tokens burned', 'check',
      successBlock('Redemption '+r.id+' settled', [
        ['Capital partner', r.holder], ['Tokens burned', nf(r.tokens,2)+' '+p.symbol],
        ['Value per token', nav(H.price)], ['Paid', nf(total,2)+' USDC'], ['From', w.label]
      ], tx),
      '<button class="btn btn-primary" data-act="close">Done</button>'));
    toast.success('Settled '+r.id, nf(total,2)+' USDC paid to '+short(r.payTo), 'check');
  });
}
export function costPerToken(k){
  const mints = S.positions.filter(x => x.pf===k && x.type==='mint');
  const t = mints.reduce((a,x)=>a+x.tokens,0), c = mints.reduce((a,x)=>a+x.usdc,0);
  return t ? c/t : navOf(PL(k));
}

/* ============================================================
   Publish today's token value
   ============================================================ */
export let N = {};
export function publishOpen(){
  const p = PL(S.openPlatform) || PL('pursuit');
  N = { per: +(navOf(p) * 1.0012).toFixed(4), mode:'per' };
  publishRender();
}
export function publishRender(){
  const p = PL(S.openPlatform) || PL('pursuit'), prev = navOf(p);
  const pool = N.per * p.outstanding, delta = (N.per/prev - 1) * 100;
  const lastPub = S.navPublishes.find(n => n.pf === p.key);
  const lastPubTime = lastPub ? ago(lastPub.at) : (p.history.length > 1 ? ago(p.history[p.history.length-2].d) : '16h ago');
  const body = `
    <div class="panel">
      <div class="between">
        <div><div class="micro">Currently showing</div>
          <div class="mono" style="font-size:15px;font-weight:600;margin-top:3px">${nav(prev)}</div>
          <div class="faint" style="font-size:11.5px">${lastPubTime}</div></div>
        <div class="t-right"><div class="micro">Tokens minted</div>
          <div class="mono" style="font-size:15px;font-weight:600;margin-top:3px">${nf(p.outstanding,0)}</div>
          <div class="faint" style="font-size:11.5px">${p.symbol}</div></div>
      </div>
    </div>
    <div class="seg">
      <button class="${N.mode==='per'?'on':''}" data-act="nav-mode" data-m="per">${ic('coins','icon-sm')} Per token</button>
      <button class="${N.mode==='pool'?'on':''}" data-act="nav-mode" data-m="pool">${ic('layers','icon-sm')} Whole pool</button>
    </div>
    ${N.mode === 'per'
      ? `<label class="field"><span>Value per token</span>
          <input class="input input-lg mono" id="nPer" type="number" step="0.0001" value="${N.per.toFixed(4)}">
          <div class="hint">Every holder’s balance is marked at this value.</div></label>`
      : `<label class="field"><span>Total pool value (USDC)</span>
          <input class="input input-lg mono" id="nPool" type="number" step="100" value="${pool.toFixed(2)}">
          <div class="hint">Divided by tokens minted to get the value per token.</div></label>`}

    <div class="panel" id="nPrev">
      <div class="kv"><span class="k">New value per token</span><span class="v mono">${nav(N.per)}</span></div>
      <div class="kv"><span class="k">Pool value</span><span class="v mono">${nf(pool,2)} USDC</span></div>
      <div class="kv kv-total"><span class="k" style="color:var(--ink);font-weight:500">Change since yesterday</span>
        <span class="v mono ${delta>=0?'pos':'neg'}" style="font-size:15px">${pct(delta)}</span></div>
    </div>`;
  const foot = `<button class="btn btn-ghost" data-act="close">Cancel</button>
    <button class="btn btn-primary" data-act="nav-go">${ic('upload','icon-sm')} Publish</button>`;
  openModal(modalShell('Publish token value', dstr(TODAY), 'upload', body, foot));

  const per = document.getElementById('nPer'), poolEl = document.getElementById('nPool');
  if (per) per.addEventListener('input', e => { N.per = Math.max(0, Number(e.target.value)||0); publishPreview(); });
  if (poolEl) poolEl.addEventListener('input', e => {
    const v = Math.max(0, Number(e.target.value)||0);
    N.per = p.outstanding ? +(v / p.outstanding).toFixed(4) : 0; publishPreview();
  });
}
export function publishPreview(){
  const p = PL(S.openPlatform) || PL('pursuit'), el = document.getElementById('nPrev'); if (!el) return;
  const pool = N.per * p.outstanding, delta = (N.per/navOf(p) - 1)*100;
  el.querySelectorAll('.kv')[0].querySelector('.v').textContent = nav(N.per);
  el.querySelectorAll('.kv')[1].querySelector('.v').textContent = nf(pool,2)+' USDC';
  const t = el.querySelector('.kv-total .v');
  t.textContent = pct(delta); t.className = 'v mono ' + (delta>=0?'pos':'neg');
}
export function publishGo(){
  const p = PL(S.openPlatform) || PL('pursuit'), per = N.per, prev = navOf(p), pool = per * p.outstanding;
  if (per <= 0) {
    toast.error('Invalid token valuation', 'Valuation price must be greater than zero.', 'alert');
    return;
  }
  const steps = [
    { label:'Signing today’s valuation', meta: p.name + ' Ops', ms:950 },
    { label:'Publishing '+nav(per)+' to every holder', meta:'Pool marked at '+nf(pool,2)+' USDC', ms:1150,
      fx:()=>{ p.history.push({ d:new Date(), v:per });
        S.navPublishes.unshift({ pf:p.key, at:new Date(), value:per, pool, by: p.name + ' Ops' }); } }
  ];
  openModal(modalShell('Publishing', dstr(new Date()), 'upload', '<div class="steps"></div>', ''));
  execSteps(steps, () => {
    S.feed.unshift({ ic:'trend', tone:'green', text:p.name + ' published a token value of '+nav(per)+' ('+pct((per/prev-1)*100)+' vs. prior day).', at:new Date() });
    openModal(modalShell('Published', 'Every holder now sees this value', 'check',
      successBlock('Token value published', [
        ['Platform', p.name], ['Value per token', nav(per)], ['Pool value', nf(pool,2)+' USDC'],
        ['Change', pct((per/prev-1)*100)], ['Date', dstr(new Date())]
      ], hash()),
      '<button class="btn btn-primary" data-act="close">Done</button>'));
    toast.success('Token value published: '+nav(per), pct((per/prev-1)*100)+' vs. yesterday', 'trend');
  });
}

/* ============================================================
   Wallets
   ============================================================ */
export let WM = {};
export function walletModal(id){
  const w = id ? wal(id) : null;
  WM = { id, net: 'Hedera' };
  walletModalRender();
}
export function walletModalRender(){
  const w = WM.id ? wal(WM.id) : null;
  const body = `
    <div class="callout c-neutral" style="margin-bottom:18px;background:#F6F6F3;border:1px solid var(--line);border-radius:var(--r-md);padding:12px 16px">
      <div style="display:flex;align-items:center;gap:16px">
        <div style="background:#fff;border:1px solid var(--line-soft);border-radius:8px;padding:6px 12px;flex:none;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,0.04)">
          ${HEDERA_LOGO}
        </div>
        <div style="font-size:13px;color:var(--ink-2);line-height:1.45;flex:1">
          All capital transactions &amp; USDC settlement run on <b>Hedera Network</b>
        </div>
      </div>
    </div>
    <label class="field"><span>Name</span>
      <input class="input" id="wLabel" value="${w?esc(w.label):''}" placeholder="e.g. Treasury Operations"></label>
    <label class="field"><span>Hedera wallet address</span>
      <input class="input mono" id="wAddr" value="${w?w.address:''}" placeholder="0x… or 0.0.xxxxx" style="font-size:12.5px">
      <div class="hint" style="margin-top:4px;font-size:11.5px;color:var(--muted)">Hedera EVM address or native Account ID</div></label>
    ${w ? '' : `<label class="field"><span>Starting balance (USDC)</span>
      <input class="input mono" id="wBal" type="number" step="1000" value="0"></label>`}`;
  const foot = `<button class="btn btn-ghost" data-act="close">Cancel</button>
    <button class="btn btn-primary" data-act="wallet-save">${ic('check','icon-sm')} ${w?'Save changes':'Add wallet'}</button>`;
  openModal(modalShell(w?'Edit wallet':'Add wallet', w?'Update this Hedera wallet':'Register a Hedera wallet to send and receive funds', 'wallet', body, foot));
}
export function walletSave(){
  const label = (document.getElementById('wLabel')||{}).value ? document.getElementById('wLabel').value.trim() : '';
  const address = (document.getElementById('wAddr')||{}).value ? document.getElementById('wAddr').value.trim() : '';
  if (!label || !address){
    toast.error('Missing wallet details', 'Name and wallet address are required.', 'alert');
    return;
  }
  if (WM.id){
    const w = wal(WM.id);
    w.label = label;
    w.address = address;
    w.network = 'Hedera';
    toast.info('Wallet updated', label, 'check');
  } else {
    const bal = Number((document.getElementById('wBal')||{}).value) || 0;
    S.wallets.push({ id:uid('w'), org:S.org, kind:'funds', label, address, network:'Hedera', usdc:bal });
    toast.success('Wallet registered', label + ' on Hedera', 'wallet');
  }
  closeModal();
  render();
}
export function walletDelete(id){
  const w = wal(id);
  openModal(modalShell('Remove wallet', 'You can add it again at any time', 'trash',
    `<div class="callout c-amber">${ic('alert','icon-sm')}<div>
      Remove <b>${esc(w.label)}</b>? No funds move — the address simply stops being available on KBridge.</div></div>
     <div class="panel">
       <div class="kv"><span class="k">Address</span><span class="v mono" style="font-size:12px">${short(w.address)}</span></div>
       <div class="kv"><span class="k">Balance</span><span class="v mono">${nf(w.usdc,2)} USDC</span></div></div>`,
    `<button class="btn btn-ghost" data-act="close">Cancel</button>
     <button class="btn btn-danger" data-act="wallet-del-go" data-id="${id}">${ic('trash','icon-sm')} Remove</button>`));
}

/* ---------- notifications ---------- */
export function notifModal(){
  const body = S.notifications.map(n => `
    <div class="row gap12" style="align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--line-soft)">
      <span style="color:${n.unread?'var(--ink)':'var(--faint)'};margin-top:1px">${ic(n.unread?'clock':'check','icon-sm')}</span>
      <div><p style="font-size:13px;color:var(--ink-2)">${esc(n.text)}</p>
        <div class="faint mono" style="font-size:11px;margin-top:3px">${n.at}</div></div>
    </div>`).join('');
  openModal(modalShell('Notifications', '', 'bell', body, '<button class="btn btn-primary" data-act="close">Close</button>'));
}

/* ============================================================
   Router & Auth Workflows (Signup, Password Reset, Login)
   ============================================================ */

export function handleSignupSubmit(){
  const s = S.signupState;
  const firstInput = document.getElementById('suFirst');
  const lastInput = document.getElementById('suLast');
  const emailInput = document.getElementById('suEmail');
  const dobInput = document.getElementById('suDob');
  const passInput = document.getElementById('suPass');
  const confirmPassInput = document.getElementById('suConfirmPass');
  const termsInput = document.getElementById('suTerms');

  const firstName = firstInput ? firstInput.value.trim() : (s.firstName || '');
  const lastName = lastInput ? lastInput.value.trim() : (s.lastName || '');
  const email = emailInput ? emailInput.value.trim() : (s.email || '');
  const dob = dobInput ? dobInput.value : (s.dob || '');
  const password = passInput ? passInput.value : (s.password || '');
  const confirmPassword = confirmPassInput ? confirmPassInput.value : (s.confirmPassword || '');
  const entity = s.entity || '';
  const agreeTerms = termsInput ? termsInput.checked : s.agreeTerms;

  s.firstName = firstName;
  s.lastName = lastName;
  s.email = email;
  s.dob = dob;
  s.password = password;
  s.confirmPassword = confirmPassword;
  s.entity = entity;
  s.agreeTerms = agreeTerms;

  if (!firstName || !lastName) {
    s.error = 'First name and last name are required for authorized signatories.';
    render();
    toast.error('Missing name', s.error, 'alert');
    return;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    s.error = 'Please enter a valid work or corporate email address.';
    render();
    toast.error('Invalid email', s.error, 'alert');
    return;
  }

  if (!dob) {
    s.error = 'Date of birth (DOB) is required for institutional signatory verification.';
    render();
    toast.error('Missing DOB', s.error, 'alert');
    return;
  }

  const age = calculateAge(dob);
  if (age === null || age < 18) {
    s.error = 'Authorized signatories must be at least 18 years of age (institutional KYC requirement).';
    render();
    toast.error('Age requirement not met', s.error, 'alert');
    return;
  }

  if (!password || password.length < 8) {
    s.error = 'Password must be at least 8 characters long.';
    render();
    toast.error('Password too short', s.error, 'alert');
    return;
  }

  if (password !== confirmPassword) {
    s.error = 'Passwords do not match. Please verify both password fields.';
    render();
    toast.error('Password mismatch', s.error, 'alert');
    return;
  }

  if (!agreeTerms) {
    s.error = 'You must agree to the institutional signatory representation & Hedera custody standards.';
    render();
    toast.error('Terms required', s.error, 'alert');
    return;
  }

  s.loading = true;
  s.error = null;
  render();

  setTimeout(() => {
    try {
      const defaultEntity = s.role === 'theoriq' 
        ? 'Capital Partner SPV' 
        : (s.role === 'pursuit' ? 'Originating Partner SPV' : 'KBridge Protocol Governance');
      const newAcc = registerAccount({
        firstName,
        lastName,
        email,
        dob,
        password,
        role: s.role,
        entity: entity || defaultEntity,
        title: s.role === 'theoriq' 
          ? 'Treasury Signatory' 
          : (s.role === 'pursuit' ? 'Originating Signatory' : 'Protocol Administrator')
      });

      s.loading = false;
      S.pendingAccount = newAcc;
      S.authMode = 'pending-email';
      render();

      toast.info(
        `Email Confirmation Required`,
        `Verification security code sent to ${email}.`,
        'mail'
      );
    } catch (err) {
      s.loading = false;
      s.error = err.message || 'Failed to create account.';
      render();
      toast.error('Registration failed', s.error, 'alert');
    }
  }, 850);
}

export function handleResetSendCode(){
  const r = S.resetState;
  const emailEl = document.getElementById('prEmail');
  const email = emailEl ? emailEl.value.trim() : (r.email || '');
  r.email = email;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    r.error = 'Please enter a valid work or corporate email address.';
    render();
    toast.error('Invalid email', r.error, 'alert');
    return;
  }

  r.loading = true;
  r.error = null;
  render();

  setTimeout(() => {
    r.loading = false;
    r.sentCode = '849201';
    r.code = '';
    r.step = 2;
    render();
    toast.info('Authorization code dispatched', `Check ${email} for your 6-digit code`, 'mail');
  }, 750);
}

export function handleResetVerifyCode(){
  const r = S.resetState;
  const codeEl = document.getElementById('prCode');
  const code = codeEl ? codeEl.value.trim().replace(/\D/g, '') : (r.code || '');
  r.code = code;

  if (!code || code.length !== 6) {
    r.error = 'Please enter the 6-digit verification code sent to your email.';
    render();
    toast.error('Invalid code', 'Code must be 6 digits.', 'alert');
    return;
  }

  r.loading = true;
  r.error = null;
  render();

  setTimeout(() => {
    r.loading = false;
    r.verified = true;
    r.step = 3;
    render();
    toast.success('Identity verified', 'Please create your new password.', 'check');
  }, 600);
}

export function handleResetSaveNewPassword(){
  const r = S.resetState;
  const passEl = document.getElementById('prNewPass');
  const confirmEl = document.getElementById('prConfirmPass');
  const newPassword = passEl ? passEl.value : (r.newPassword || '');
  const confirmPassword = confirmEl ? confirmEl.value : (r.confirmPassword || '');
  r.newPassword = newPassword;
  r.confirmPassword = confirmPassword;

  if (!newPassword || newPassword.length < 8) {
    r.error = 'Password must be at least 8 characters long.';
    render();
    toast.error('Password too short', r.error, 'alert');
    return;
  }

  if (newPassword !== confirmPassword) {
    r.error = 'Passwords do not match. Please verify both password fields.';
    render();
    toast.error('Password mismatch', r.error, 'alert');
    return;
  }

  r.loading = true;
  r.error = null;
  render();

  setTimeout(() => {
    r.loading = false;
    updateAccountPassword(r.email, newPassword);
    r.step = 4;
    render();
    toast.success('Password updated successfully', 'Your new credentials are ready for use.', 'check');
  }, 750);
}

export function attachSignupEvents(){
  const s = S.signupState;
  const first = document.getElementById('suFirst');
  const last = document.getElementById('suLast');
  const email = document.getElementById('suEmail');
  const dob = document.getElementById('suDob');
  const pass = document.getElementById('suPass');
  const confirmPass = document.getElementById('suConfirmPass');
  const terms = document.getElementById('suTerms');

  if (first) first.addEventListener('input', e => { s.firstName = e.target.value; });
  if (last) last.addEventListener('input', e => { s.lastName = e.target.value; });
  if (email) email.addEventListener('input', e => { s.email = e.target.value; });
  if (terms) terms.addEventListener('change', e => {
    s.agreeTerms = e.target.checked;
    const btn = document.getElementById('suSubmitBtn');
    if (btn) btn.disabled = s.loading || !s.agreeTerms;
  });

  if (dob) dob.addEventListener('input', e => {
    s.dob = e.target.value;
    const age = calculateAge(s.dob);
    const badgeContainer = dob.closest('.field')?.querySelector('.between');
    if (badgeContainer) {
      let badge = badgeContainer.querySelector('.badge');
      if (age !== null) {
        const isAdult = age >= 18;
        const html = `<span class="badge ${isAdult ? 'b-green' : 'b-red'}" style="font-size:10.5px;padding:1px 7px">${isAdult ? `Age ${age} · Verified` : `Under 18 (${age})`}</span>`;
        if (badge) badge.outerHTML = html;
        else badgeContainer.insertAdjacentHTML('beforeend', html);
      } else if (badge) {
        badge.remove();
      }
    }
  });

  const updateConfirmBadge = match => {
    if (!confirmPass) return;
    const container = confirmPass.closest('.field')?.querySelector('.between');
    if (container) {
      let badge = container.querySelector('.badge');
      if (confirmPass.value) {
        const html = `<span class="badge ${match ? 'b-green' : 'b-red'}" style="font-size:10.5px;padding:1px 7px">${match ? 'Match' : 'Mismatch'}</span>`;
        if (badge) badge.outerHTML = html;
        else container.insertAdjacentHTML('beforeend', html);
      } else if (badge) {
        badge.remove();
      }
    }
  };

  if (pass) pass.addEventListener('input', e => {
    s.password = e.target.value;
    const strength = checkPasswordStrength(s.password);
    const strengthBox = document.querySelector('.pw-strength-bar');
    if (strengthBox) {
      const segs = strengthBox.querySelectorAll('.pw-strength-segment');
      segs.forEach((seg, idx) => {
        seg.className = 'pw-strength-segment' + (idx < strength.score ? ' ' + strength.colorClass : '');
      });
      const label = strengthBox.parentElement?.querySelector('.mono');
      if (label) {
        label.textContent = strength.label;
        label.style.color = strength.score >= 3 ? 'var(--ok)' : (strength.score >= 2 ? 'var(--warn)' : 'var(--bad)');
      }
      const reqItems = strengthBox.parentElement?.querySelectorAll('.pw-req-item');
      if (reqItems && reqItems.length >= 4) {
        reqItems[0].className = 'pw-req-item' + (strength.checks.length ? ' met' : '');
        reqItems[1].className = 'pw-req-item' + (strength.checks.hasUpper ? ' met' : '');
        reqItems[2].className = 'pw-req-item' + (strength.checks.hasNumber ? ' met' : '');
        reqItems[3].className = 'pw-req-item' + (strength.checks.hasSpecial ? ' met' : '');
      }
    }
    if (confirmPass && confirmPass.value) {
      updateConfirmBadge(confirmPass.value === s.password);
    }
  });

  if (confirmPass) {
    confirmPass.addEventListener('input', e => {
      s.confirmPassword = e.target.value;
      updateConfirmBadge(s.password && s.confirmPassword && s.password === s.confirmPassword);
    });
  }
}

export function attachResetEvents(){
  const r = S.resetState;
  const email = document.getElementById('prEmail');
  const code = document.getElementById('prCode');
  const newPass = document.getElementById('prNewPass');
  const confirmPass = document.getElementById('prConfirmPass');

  if (email) {
    email.addEventListener('input', e => { r.email = e.target.value; });
    email.addEventListener('keydown', e => { if (e.key === 'Enter') handleResetSendCode(); });
  }

  if (code) {
    code.addEventListener('input', e => {
      r.code = e.target.value.replace(/\D/g, '').slice(0, 6);
      e.target.value = r.code;
      if (r.code.length === 6) {
        setTimeout(handleResetVerifyCode, 300);
      }
    });
    code.addEventListener('keydown', e => { if (e.key === 'Enter') handleResetVerifyCode(); });
  }

  const updateResetConfirmBadge = match => {
    if (!confirmPass) return;
    const container = confirmPass.closest('.field')?.querySelector('.between');
    if (container) {
      let badge = container.querySelector('.badge');
      if (confirmPass.value) {
        const html = `<span class="badge ${match ? 'b-green' : 'b-red'}" style="font-size:10.5px;padding:1px 7px">${match ? 'Passwords Match' : 'Mismatch'}</span>`;
        if (badge) badge.outerHTML = html;
        else container.insertAdjacentHTML('beforeend', html);
      } else if (badge) {
        badge.remove();
      }
    }
  };

  if (newPass) {
    newPass.addEventListener('input', e => {
      r.newPassword = e.target.value;
      const strength = checkPasswordStrength(r.newPassword);
      const strengthBox = document.querySelector('.pw-strength-bar');
      if (strengthBox) {
        const segs = strengthBox.querySelectorAll('.pw-strength-segment');
        segs.forEach((seg, idx) => {
          seg.className = 'pw-strength-segment' + (idx < strength.score ? ' ' + strength.colorClass : '');
        });
        const label = strengthBox.parentElement?.querySelector('.mono');
        if (label) {
          label.textContent = strength.label;
          label.style.color = strength.score >= 3 ? 'var(--ok)' : (strength.score >= 2 ? 'var(--warn)' : 'var(--bad)');
        }
        const reqItems = strengthBox.parentElement?.querySelectorAll('.pw-req-item');
        if (reqItems && reqItems.length >= 4) {
          reqItems[0].className = 'pw-req-item' + (strength.checks.length ? ' met' : '');
          reqItems[1].className = 'pw-req-item' + (strength.checks.hasUpper ? ' met' : '');
          reqItems[2].className = 'pw-req-item' + (strength.checks.hasNumber ? ' met' : '');
          reqItems[3].className = 'pw-req-item' + (strength.checks.hasSpecial ? ' met' : '');
        }
      }
      if (confirmPass && confirmPass.value) {
        updateResetConfirmBadge(confirmPass.value === r.newPassword);
      }
    });
  }

  if (confirmPass) {
    confirmPass.addEventListener('input', e => {
      r.confirmPassword = e.target.value;
      updateResetConfirmBadge(r.newPassword && r.confirmPassword && r.newPassword === r.confirmPassword);
    });
    confirmPass.addEventListener('keydown', e => { if (e.key === 'Enter') handleResetSaveNewPassword(); });
  }
}

export function attachLoginEvents(){
  ['lgEmail','lgPass'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); doLogin(); } });
  });
}

export function doLogin(){
  const b = document.getElementById('lgBtn');
  if (!b || b.disabled) return;
  const emailInput = document.getElementById('lgEmail');
  const passInput = document.getElementById('lgPass');
  const email = emailInput ? emailInput.value.trim() : '';
  const password = passInput ? passInput.value : '';

  if (!email || !password) {
    toast.error('Missing credentials', 'Please enter your email and password.', 'alert');
    return;
  }

  b.innerHTML = spinner + ' Signing in…';
  b.disabled = true;

  setTimeout(() => {
    const accounts = getAccounts();
    const found = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());

    if (found) {
      if (found.password && found.password !== password) {
        b.innerHTML = ic('lock','icon-sm') + ' Sign in to Portal';
        b.disabled = false;
        toast.error('Incorrect password', 'Please enter the correct password or click "Forgot password?" to reset it.', 'alert');
        return;
      }

      if (found.status === 'pending_email') {
        b.innerHTML = ic('lock','icon-sm') + ' Sign in to Portal';
        b.disabled = false;
        S.pendingAccount = found;
        S.authMode = 'pending-email';
        render();
        toast.info('Email verification required', `Check ${found.email} for your 6-digit confirmation code.`, 'mail');
        return;
      }

      if (found.status === 'pending_approval') {
        b.innerHTML = ic('lock','icon-sm') + ' Sign in to Portal';
        b.disabled = false;
        S.pendingAccount = found;
        S.authMode = 'pending-approval';
        render();
        toast.info('Admin approval pending', 'Your application is queued for KBridge Protocol Governance review.', 'clock');
        return;
      }

      if (found.status === 'rejected') {
        b.innerHTML = ic('lock','icon-sm') + ' Sign in to Portal';
        b.disabled = false;
        toast.error('Application Rejected', found.rejectionReason || 'Institutional criteria not met.', 'alert');
        return;
      }

      S.currentUser = found;
      S.org = found.role || S.gateOrg || 'theoriq';
    } else {
      const role = S.gateOrg || 'theoriq';
      S.currentUser = {
        email,
        password,
        firstName: email.split('@')[0].split('.')[0] || 'Signatory',
        lastName: email.split('@')[0].split('.')[1] || 'Partner',
        role,
        entity: ORGS[role]?.legal || 'Partner SPV',
        dob: '1988-01-01',
        title: 'Authorized Signatory'
      };
      S.org = role;
    }

    S.gateOrg = null;
    S.authMode = 'dash';
    S.view = 'dash';
    render();
    const name = S.currentUser.firstName ? `${S.currentUser.firstName} ${S.currentUser.lastName}` : ORGS[S.org].name;
    toast.success('Signed in as ' + name, ORGS[S.org].name + ' (' + ORGS[S.org].tag + ')', 'check');
  }, 750);
}

export function render(){
  const root = document.getElementById('root');
  if (!root) return;

  if (!S.org){
    if (S.authMode === 'signup') {
      root.innerHTML = signupScreen(S);
      attachSignupEvents();
      return;
    }
    if (S.authMode === 'pending-email') {
      root.innerHTML = pendingEmailScreen(S);
      return;
    }
    if (S.authMode === 'pending-approval') {
      root.innerHTML = pendingApprovalScreen(S);
      return;
    }
    if (S.authMode === 'reset-password') {
      root.innerHTML = passwordResetScreen(S);
      attachResetEvents();
      return;
    }
    if (S.authMode === 'login' || S.gateOrg) {
      root.innerHTML = brandedLoginScreen(S, S.gateOrg || 'theoriq');
      attachLoginEvents();
      return;
    }
    root.innerHTML = enhancedGateScreen();
    return;
  }

  const isAdmin = S.org === 'kbridge';
  const isCap = S.org === 'theoriq';
  let fn;
  if (isAdmin) {
    const adminViews = {
      dash: () => viewAdminDashboard(S, CTX),
      redemptions: viewRedemptionsSupply,
      wallets: viewWallets
    };
    fn = adminViews[S.view] || adminViews.dash;
  } else if (isCap) {
    const capViews = {
      dash: viewDashCapital,
      platforms: viewPlatforms,
      platform: viewPlatform,
      requests: () => pageHead('Capital Requests', 'Track your token mint requests and legal note coordination with KBridge', '<button class="btn btn-primary" data-act="mint">' + ic('plus','icon-sm') + ' Request to Mint</button>') + viewCapitalPartnerRequests(S, CTX),
      wallets: viewWallets
    };
    fn = capViews[S.view] || capViews.dash;
  } else {
    const supplyViews = {
      dash: viewDashSupply,
      requests: () => pageHead('Note & Contract Requests', 'Upload signed promissory notes and legal contracts requested by KBridge', '') + viewOriginatorNoteRequests(S, CTX),
      redemptions: viewRedemptionsSupply,
      wallets: viewWallets
    };
    fn = supplyViews[S.view] || supplyViews.dash;
  }
  root.innerHTML = header() + '<main><div class="wrap fadein">' + fn() + '</div></main>';
  if (S.view === 'platform' || (!isCap && !isAdmin && S.view === 'dash')) bindChart();
}
export function go(v){ S.view = v; window.scrollTo(0,0); render(); }

export function closeSelects(except){
  document.querySelectorAll('[data-menu]').forEach(m => { if (m.dataset.menu !== except) m.classList.add('hide'); });
  document.querySelectorAll('.sel-btn').forEach(b => { if (b.dataset.id !== except) b.classList.remove('on'); });
}

document.addEventListener('click', e => {
  const cp = e.target.closest('[data-copy]');
  if (cp) {
    const text = cp.dataset.copy || cp.textContent.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Copied to clipboard', text.length > 20 ? short(text) : text, 'check');
      }).catch(() => {
        toast.info('Copied', text, 'check');
      });
    } else {
      toast.info('Copied to clipboard', text, 'check');
    }
    return;
  }

  const t = e.target.closest('[data-act]');
  if (e.target.id === 'ovl'){ closeModal(); return; }
  if (!t){ closeSelects(); return; }
  const a = t.dataset.act;
  if (a !== 'sel-open' && a !== 'sel-pick') closeSelects();

  if (a === 'sel-open'){
    const id = t.dataset.id;
    const menu = document.querySelector('[data-menu="'+id+'"]');
    const willOpen = menu.classList.contains('hide');
    closeSelects(willOpen ? id : null);
    menu.classList.toggle('hide', !willOpen);
    t.classList.toggle('on', willOpen);
    return;
  }
  if (a === 'sel-pick'){
    const id = t.dataset.id, v = t.dataset.v, s = SELS[id];
    closeSelects();
    if (s && s.onPick) s.onPick(v);
    return;
  }

  if (a === 'pick'){ S.authMode = 'login'; S.gateOrg = t.dataset.org; render(); }
  else if (a === 'login'){ doLogin(); }
  else if (a === 'back-gate'){ S.authMode = 'gate'; S.gateOrg = null; S.signupState.error = null; S.resetState.error = null; render(); }
  else if (a === 'logout'){
    S.org = null; S.gateOrg = null; S.authMode = 'gate'; S.currentUser = null; closeModal(); render();
    toast.info('Signed out', 'Returned to institutional portal gate', 'out');
  }
  else if (a === 'goto-signup'){
    S.authMode = 'signup';
    S.gateOrg = null;
    S.signupState.role = t.dataset.role || 'theoriq';
    S.signupState.error = null;
    render();
  }
  else if (a === 'set-signup-role'){
    S.signupState.role = t.dataset.role;
    render();
  }
  else if (a === 'open-tos'){
    openTermsModal();
  }
  else if (a === 'toggle-su-pass'){
    S.signupState.showPassword = !S.signupState.showPassword;
    render();
  }
  else if (a === 'toggle-su-confirm-pass'){
    S.signupState.showConfirmPassword = !S.signupState.showConfirmPassword;
    render();
  }
  else if (a === 'submit-signup'){
    handleSignupSubmit();
  }
  else if (a === 'autofill-email-code'){
    const inp = document.getElementById('emailVerifyCodeInput');
    if (inp) inp.value = '849201';
  }
  else if (a === 'submit-email-verify'){
    const email = t.dataset.email || S.pendingAccount?.email;
    const inp = document.getElementById('emailVerifyCodeInput');
    const code = inp ? inp.value.trim() : '849201';
    try {
      const updated = verifyAccountEmail(email, code);
      S.pendingAccount = updated;
      S.authMode = 'pending-approval';
      render();
      toast.success('Email Verified!', 'Application submitted to KBridge Admin Approval Queue.', 'check');
    } catch (err) {
      toast.error('Verification failed', err.message || 'Invalid code', 'alert');
    }
  }
  else if (a === 'quick-verify-email-link'){
    const email = t.dataset.email || S.pendingAccount?.email;
    try {
      const updated = verifyAccountEmail(email, '849201');
      S.pendingAccount = updated;
      S.authMode = 'pending-approval';
      render();
      toast.success('1-Click Email Verified!', 'Application submitted to KBridge Admin Approval Queue.', 'check');
    } catch (err) {
      toast.error('Verification failed', err.message, 'alert');
    }
  }
  else if (a === 'resend-email-code'){
    toast.info('New verification code dispatched', 'Check your corporate email inbox.', 'mail');
  }
  else if (a === 'check-approval-status'){
    const email = t.dataset.email || S.pendingAccount?.email;
    const acc = findAccountByEmail(email);
    if (acc && acc.status === 'approved') {
      S.pendingAccount = null;
      S.currentUser = acc;
      S.org = acc.role;
      S.authMode = 'dash';
      S.view = 'dash';
      render();
      toast.success('Application Approved!', `Welcome to the ${ORGS[acc.role]?.name} workspace.`, 'shieldCheck');
    } else {
      render();
      toast.info('Status checked', 'Application is still queued for KBridge Governance review.', 'clock');
    }
  }
  else if (a === 'pending-approved-login'){
    const email = t.dataset.email || S.pendingAccount?.email;
    const acc = findAccountByEmail(email);
    if (acc) {
      S.pendingAccount = null;
      S.currentUser = acc;
      S.org = acc.role;
      S.authMode = 'dash';
      S.view = 'dash';
      render();
      toast.success('Signed in as ' + acc.firstName, ORGS[acc.role]?.name, 'check');
    }
  }
  else if (a === 'demo-quick-approve'){
    const email = t.dataset.email || S.pendingAccount?.email;
    const acc = approveAccount(email, 'Approved via fast demo action');
    if (acc) {
      S.pendingAccount = null;
      S.currentUser = acc;
      S.org = acc.role;
      S.authMode = 'dash';
      S.view = 'dash';
      render();
      toast.success('Account Approved!', `Instant approval granted. Entered ${ORGS[acc.role]?.name} workspace.`, 'shieldCheck');
    }
  }
  else if (a === 'demo-switch-to-admin'){
    S.pendingAccount = null;
    S.org = 'kbridge';
    S.currentUser = findAccountByEmail('admin@kbridge.io');
    S.authMode = 'dash';
    S.view = 'dash';
    render();
    toast.info('Switched to KBridge Admin View', 'You can now review pending sign-ups in the Admin Approval Queue.', 'shield');
  }
  else if (a === 'admin-approve-acc'){
    const email = t.dataset.email;
    const updated = approveAccount(email, 'Approved by KBridge Protocol Governance Admin');
    if (updated) {
      render();
      toast.success('Account Approved', `Signatory access granted for ${updated.firstName} ${updated.lastName} (${updated.email}).`, 'check');
    }
  }
  else if (a === 'admin-reject-acc'){
    const email = t.dataset.email;
    const acc = findAccountByEmail(email);
    openModal(modalShell('Reject Partner Sign-up Application', `Signatory: ${acc ? acc.firstName + ' ' + acc.lastName : email}`, 'alert',
      `<div class="callout c-red">${ic('alert','icon-sm')}<div>This will reject the signatory request and prevent portal sign-in.</div></div>
       <label class="field" style="margin-top:14px">
         <span>Reason for Rejection</span>
         <input class="input" type="text" id="rejReasonInput" value="Institutional eligibility requirements not satisfied." placeholder="e.g. Unverified corporate domain">
       </label>`,
      `<button class="btn btn-ghost" data-act="close">Cancel</button>
       <button class="btn btn-danger" data-act="admin-confirm-reject-acc" data-email="${esc(email)}">${ic('trash','icon-xs')} Confirm Rejection</button>`
    ));
  }
  else if (a === 'admin-confirm-reject-acc'){
    const email = t.dataset.email;
    const inp = document.getElementById('rejReasonInput');
    const reason = inp ? inp.value.trim() : 'Institutional eligibility requirements not satisfied.';
    rejectAccount(email, reason);
    closeModal();
    render();
    toast.warn('Application Rejected', `Account application for ${email} was rejected.`, 'trash');
  }
  else if (a === 'admin-view-acc-audit'){
    const email = t.dataset.email;
    const acc = findAccountByEmail(email);
    if (acc) {
      openModal(modalShell('Signatory Audit & Governance Record', `KBridge Protocol Security Audit`, 'shieldCheck',
        userAccountModal(acc, S),
        `<button class="btn btn-primary" data-act="close">Close Audit Log</button>`
      ));
    }
  }
  else if (a === 'goto-login'){
    S.authMode = 'login';
    S.gateOrg = t.dataset.org || 'theoriq';
    S.signupState.error = null;
    S.resetState.error = null;
    render();
    if (t.dataset.email) {
      const em = document.getElementById('lgEmail');
      if (em) em.value = t.dataset.email;
    }
    if (t.dataset.newpass) {
      const pw = document.getElementById('lgPass');
      if (pw) pw.value = t.dataset.newpass;
    }
  }
  else if (a === 'goto-reset-password'){
    S.authMode = 'reset-password';
    S.resetState.step = 1;
    S.resetState.role = t.dataset.org || 'theoriq';
    const emEl = document.getElementById('lgEmail');
    if (emEl && emEl.value.trim()) S.resetState.email = emEl.value.trim();
    S.resetState.error = null;
    render();
  }
  else if (a === 'pr-send-code'){
    handleResetSendCode();
  }
  else if (a === 'pr-fill-code'){
    const c = document.getElementById('prCode');
    if (c) {
      c.value = S.resetState.sentCode || '849201';
      S.resetState.code = c.value;
    }
  }
  else if (a === 'pr-resend-code'){
    toast.info('New verification code dispatched', 'Check your institutional inbox', 'mail');
  }
  else if (a === 'pr-verify-code'){
    handleResetVerifyCode();
  }
  else if (a === 'pr-save-new-pass'){
    handleResetSaveNewPassword();
  }
  else if (a === 'pr-step-1'){
    S.resetState.step = 1;
    S.resetState.error = null;
    render();
  }
  else if (a === 'pr-step-2'){
    S.resetState.step = 2;
    S.resetState.error = null;
    render();
  }
  else if (a === 'pr-direct-login'){
    const em = t.dataset.email || S.resetState.email;
    const acc = findAccountByEmail(em);
    if (acc) {
      S.currentUser = acc;
      S.org = acc.role;
    } else {
      S.org = S.resetState.role || 'theoriq';
      S.currentUser = {
        email: em,
        firstName: em.split('@')[0],
        lastName: 'Signatory',
        role: S.org,
        entity: ORGS[S.org]?.legal || 'Partner SPV',
        dob: '1988-01-01',
        title: 'Authorized Signatory'
      };
    }
    S.authMode = 'dash';
    S.gateOrg = null;
    S.view = 'dash';
    render();
    toast.success('Signed in as ' + (S.currentUser.firstName || 'Signatory'), ORGS[S.org].name, 'check');
  }
  else if (a === 'toggle-pr-new-pass'){
    S.resetState.showNewPassword = !S.resetState.showNewPassword;
    render();
  }
  else if (a === 'toggle-pr-confirm-pass'){
    S.resetState.showConfirmPassword = !S.resetState.showConfirmPassword;
    render();
  }
  else if (a === 'toggle-lg-pass'){
    const lgp = document.getElementById('lgPass');
    if (lgp) {
      lgp.type = lgp.type === 'password' ? 'text' : 'password';
    }
  }
  else if (a === 'view-user-profile'){
    const u = S.currentUser || (getAccounts().find(x => x.role === S.org) || INITIAL_ACCOUNTS[0]);
    openModal(modalShell('Authorized Signatory Profile', 'Hedera Custody & Representative Verification', 'user', userAccountModal(u, S), '<button class="btn btn-ghost" data-act="goto-change-pass">Reset Password</button><button class="btn btn-primary" data-act="close">Done</button>'));
  }
  else if (a === 'goto-change-pass'){
    closeModal();
    S.authMode = 'reset-password';
    S.resetState.step = 1;
    S.resetState.email = S.currentUser ? S.currentUser.email : (ORGS[S.org]?.email || '');
    S.resetState.role = S.org;
    S.org = null;
    render();
  }
  else if (a === 'view'){ go(t.dataset.view); }
  else if (a === 'platform'){ S.openPlatform = t.dataset.key; go('platform'); }
  else if (a === 'goto-platform'){ closeModal(); S.openPlatform = t.dataset.key; go('platform'); }
  else if (a === 'close'){ closeModal(); render(); }
  else if (a === 'notif'){ notifModal(); }
  else if (a === 'acct'){ go('wallets'); }

  else if (a === 'toggle-admin'){
    S.adminHidden = !S.adminHidden;
    render();
    toast.info(S.adminHidden ? 'Admin button hidden' : 'Admin button visible', 'Click the eye icon to toggle visibility', S.adminHidden ? 'eyeOff' : 'eye');
  }
  else if (a === 'login-admin'){
    S.org = 'kbridge';
    S.gateOrg = null;
    S.view = 'dash';
    closeModal();
    render();
    toast.info('Signed in as KBridge Admin', ORGS.kbridge.tag, 'shield');
  }
  else if (a === 'switch-role'){
    S.org = t.dataset.org;
    S.view = 'dash';
    closeModal();
    render();
    toast.info('Switched to ' + ORGS[S.org].name, ORGS[S.org].tag, 'shield');
  }
  else if (a === 'admin-req-notes'){
    openRequestNotesModal(t.dataset.id, S, CTX);
  }
  else if (a === 'originator-upload-notes'){
    openUploadNotesModal(t.dataset.id, S, CTX);
  }
  else if (a === 'admin-inspect-mint'){
    openInspectAndMintModal(t.dataset.id, S, CTX);
  }
  else if (a === 'req-details'){
    openRequestDetailsModal(t.dataset.id, S, CTX);
  }
  else if (a === 'download-doc'){
    toast.success('Downloaded ' + (t.dataset.name || 'document'), 'Contract saved to local storage', 'download');
  }
  else if (a === 'preview-doc'){
    let doc = null;
    if (t.dataset.doc) {
      try { doc = JSON.parse(decodeURIComponent(t.dataset.doc)); } catch (e) {}
    } else if (t.dataset.id) {
      const r = S.requests.find(x => x.id === t.dataset.id) || S.mintRequests.find(x => x.id === t.dataset.id);
      if (r && r.documents && r.documents.length) doc = r.documents[0];
    }
    if (doc) {
      openDocumentPreviewModal(doc, S, CTX);
    }
  }

  else if (a === 'mint'){ mintOpen(t.dataset.key); }
  else if (a === 'mint-pct'){ const w = wal(M.wid); M.amt = Math.round(w.usdc * (+t.dataset.p)/100); mintRender(); }
  else if (a === 'mint-review'){ M.step = 'review'; mintRender(); }
  else if (a === 'mint-back'){ M.step = 'config'; mintRender(); }
  else if (a === 'mint-go'){ mintGo(); }

  else if (a === 'redeem'){ redeemOpen(t.dataset.key); }
  else if (a === 'rdm-pct'){ R.tokens = Math.floor(heldOf(R.pf) * (+t.dataset.p)/100); redeemRender(); }
  else if (a === 'rdm-review'){ R.step = 'review'; redeemRender(); }
  else if (a === 'rdm-back'){ R.step = 'config'; redeemRender(); }
  else if (a === 'rdm-go'){ redeemGo(); }

  else if (a === 'honor'){ honorOpen(t.dataset.id); }
  else if (a === 'honor-go'){ honorGo(); }

  else if (a === 'publish'){ publishOpen(); }
  else if (a === 'nav-mode'){ N.mode = t.dataset.m; publishRender(); }
  else if (a === 'nav-go'){ publishGo(); }

  else if (a === 'wallet-add'){ walletModal(null); }
  else if (a === 'wallet-edit'){ walletModal(t.dataset.id); }
  else if (a === 'wallet-save'){ walletSave(); }
  else if (a === 'wallet-del'){ walletDelete(t.dataset.id); }
  else if (a === 'wallet-primary'){
    const w = wal(t.dataset.id);
    S.wallets.forEach(x => { if (x.org === w.org && x.kind === 'funds') x.primary = false; });
    w.primary = true; render(); toast.success('Default wallet updated', w.label, 'check');
  }
  else if (a === 'wallet-del-go'){
    const w = wal(t.dataset.id);
    S.wallets = S.wallets.filter(x => x.id !== t.dataset.id);
    closeModal(); render(); toast.warn('Wallet removed', w.label, 'trash');
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape'){ closeSelects(); closeModal(); } });

// Initial render on boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => render());
} else {
  render();
}
