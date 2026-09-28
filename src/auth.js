import { ic, kLogo, esc, spinner } from './helpers.js';
import { ORGS } from './app.js';

/* ============================================================
   KBridge Partner Authentication & Sign Up / Password Reset
   Handles:
   - Capital Partner & Originating Partner Sign Up (Email, Names, DOB, Password)
   - Multi-step Password Reset UX Flow
   - Account persistence and signatory profile tracking
   ============================================================ */

const STORAGE_KEY = 'kbridge_registered_accounts_v1';

export const INITIAL_ACCOUNTS = [
  {
    id: 'acc-cap-1',
    email: 'treasury@capitalpartner.com',
    password: 'kbridge-access',
    firstName: 'Victoria',
    lastName: 'Chen',
    dob: '1986-04-14',
    role: 'theoriq',
    entity: 'Capital Partner SPV',
    title: 'Managing Director, Treasury',
    status: 'approved',
    emailVerified: true,
    createdAt: new Date('2025-09-01').toISOString()
  },
  {
    id: 'acc-orig-1',
    email: 'ops@originator.finance',
    password: 'kbridge-access',
    firstName: 'Marcus',
    lastName: 'Vance',
    dob: '1982-11-28',
    role: 'pursuit',
    entity: 'Originating Partner SPV I',
    title: 'Head of Originating & Structured Credit',
    status: 'approved',
    emailVerified: true,
    createdAt: new Date('2025-10-15').toISOString()
  },
  {
    id: 'acc-admin-1',
    email: 'admin@kbridge.io',
    password: 'kbridge-access',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    dob: '1988-07-22',
    role: 'kbridge',
    entity: 'KBridge Protocol Governance',
    title: 'Protocol Administrator',
    status: 'approved',
    emailVerified: true,
    createdAt: new Date('2025-08-01').toISOString()
  }
];

export function getAccounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    // Ensure default initial accounts have status set
    return parsed.map(acc => ({
      ...acc,
      status: acc.status || 'approved'
    }));
  } catch (e) {
    return INITIAL_ACCOUNTS;
  }
}

export function saveAccounts(accounts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {}
}

export function findAccountByEmail(email) {
  if (!email) return null;
  const accounts = getAccounts();
  const clean = email.trim().toLowerCase();
  return accounts.find(a => a.email.toLowerCase() === clean) || null;
}

export function updateAccountPassword(email, newPassword) {
  const accounts = getAccounts();
  const clean = email.trim().toLowerCase();
  const index = accounts.findIndex(a => a.email.toLowerCase() === clean);
  if (index !== -1) {
    accounts[index].password = newPassword;
    accounts[index].updatedAt = new Date().toISOString();
    saveAccounts(accounts);
    return true;
  }
  return false;
}

export function registerAccount(accountData) {
  const accounts = getAccounts();
  const clean = accountData.email.trim().toLowerCase();
  const exists = accounts.find(a => a.email.toLowerCase() === clean);
  if (exists) {
    throw new Error('An account with this institutional email already exists. Please sign in or reset your password.');
  }

  const newAcc = {
    id: 'reg-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    ...accountData,
    email: clean,
    status: 'pending_email',
    emailVerified: false,
    emailVerificationCode: '849201',
    createdAt: new Date().toISOString()
  };
  accounts.push(newAcc);
  saveAccounts(accounts);
  return newAcc;
}

export function verifyAccountEmail(email, code) {
  const accounts = getAccounts();
  const clean = email.trim().toLowerCase();
  const index = accounts.findIndex(a => a.email.toLowerCase() === clean);
  if (index !== -1) {
    const acc = accounts[index];
    if (code && acc.emailVerificationCode && code.trim() !== acc.emailVerificationCode) {
      throw new Error('Invalid verification code. Please check your inbox or click auto-fill demo code.');
    }
    acc.emailVerified = true;
    acc.status = 'pending_approval';
    acc.emailVerifiedAt = new Date().toISOString();
    saveAccounts(accounts);
    return acc;
  }
  throw new Error('Account not found.');
}

export function approveAccount(email, adminNotes = '') {
  const accounts = getAccounts();
  const clean = email.trim().toLowerCase();
  const index = accounts.findIndex(a => a.email.toLowerCase() === clean);
  if (index !== -1) {
    accounts[index].status = 'approved';
    accounts[index].approvedAt = new Date().toISOString();
    accounts[index].adminNotes = adminNotes;
    saveAccounts(accounts);
    return accounts[index];
  }
  return null;
}

export function rejectAccount(email, reason = 'Institutional criteria not met') {
  const accounts = getAccounts();
  const clean = email.trim().toLowerCase();
  const index = accounts.findIndex(a => a.email.toLowerCase() === clean);
  if (index !== -1) {
    accounts[index].status = 'rejected';
    accounts[index].rejectedAt = new Date().toISOString();
    accounts[index].rejectionReason = reason;
    saveAccounts(accounts);
    return accounts[index];
  }
  return null;
}

export function getPendingAccounts() {
  const accounts = getAccounts();
  return accounts.filter(a => a.status === 'pending_approval' || a.status === 'pending_email');
}

/* ---------- helpers & validation ---------- */
export function calculateAge(dobStr) {
  if (!dobStr) return null;
  const birth = new Date(dobStr);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function checkPasswordStrength(pw) {
  const p = pw || '';
  const checks = {
    length: p.length >= 8,
    hasUpper: /[A-Z]/.test(p) && /[a-z]/.test(p),
    hasNumber: /[0-9]/.test(p),
    hasSpecial: /[^A-Za-z0-9]/.test(p)
  };
  let score = 0;
  if (checks.length) score++;
  if (checks.hasUpper) score++;
  if (checks.hasNumber) score++;
  if (checks.hasSpecial) score++;

  let label = 'Weak';
  let colorClass = 'active-weak';
  if (score >= 4) {
    label = 'Strong';
    colorClass = 'active-strong';
  } else if (score === 3) {
    label = 'Good';
    colorClass = 'active-good';
  } else if (score === 2) {
    label = 'Fair';
    colorClass = 'active-fair';
  }

  return { score, label, colorClass, checks };
}

export function maxAdultDobString() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split('T')[0];
}

/* ============================================================
   View 1: Sign Up Page for Capital and Originating
   ============================================================ */
export function signupScreen(S) {
  const s = S.signupState || {
    role: 'theoriq',
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    entity: '',
    agreeTerms: false,
    showPassword: false,
    showConfirmPassword: false,
    error: null,
    loading: false
  };

  const isCapital = s.role === 'theoriq';
  const age = calculateAge(s.dob);
  const isAdult = age !== null && age >= 18;
  const strength = checkPasswordStrength(s.password);
  const passwordsMatch = s.password && s.confirmPassword && s.password === s.confirmPassword;

  const defaultEntityPlaceholder = s.role === 'theoriq'
    ? 'e.g. Apex Horizon Capital SPV'
    : (s.role === 'pursuit' ? 'e.g. Prime Receivables Originator SPV' : 'e.g. KBridge Protocol Governance');

  return `
  <div class="center-screen fadein" style="position:relative;padding:32px 16px">
    <button class="btn btn-quiet btn-sm" data-act="back-gate" style="position:absolute;top:20px;left:24px;display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--muted);z-index:10" title="Return to Partner Gate">
      ${ic('back', 'icon-xs')} Return to Partner Gate
    </button>
    <div class="auth-wrap auth-wrap-wide">
      <div class="cobrand" style="margin-bottom:18px">
        ${kLogo(34)}
        <span style="font-size:20px;font-weight:600;letter-spacing:-.02em"><span style="color:#ebb03f">k</span>bridge</span>
      </div>

      <div class="card" style="border-radius:var(--r-xl);overflow:hidden">
        <div style="padding:28px 30px">
          <div style="text-align:center;margin-bottom:24px">
            <span class="micro" style="color:var(--faint)">Institutional Onboarding · ${s.role === 'theoriq' ? 'Capital Partner' : (s.role === 'pursuit' ? 'Originating Partner' : 'Protocol Admin')}</span>
            <h1 style="font-size:22px;font-weight:600;letter-spacing:-.02em;margin-top:4px">Create Partner Account</h1>
            <p class="muted" style="font-size:13.5px;margin-top:6px;max-width:440px;margin-left:auto;margin-right:auto">
              Register as an authorized signatory for the <strong>${s.role === 'theoriq' ? 'Capital Partner' : (s.role === 'pursuit' ? 'Originating Partner' : 'Protocol Admin')}</strong> workspace.
            </p>
          </div>

          ${s.error ? `
            <div class="callout c-red" style="margin-bottom:16px;align-items:center">
              ${ic('alert', 'icon-sm')}
              <div style="font-size:13px">${esc(s.error)}</div>
            </div>
          ` : ''}

          <!-- Sign Up Form -->
          <form id="signupForm" class="stack gap16" onsubmit="return false;">
            <!-- First & Last Name -->
            <div class="two-col">
              <label class="field">
                <span>First Name <b style="color:var(--bad)">*</b></span>
                <div style="position:relative">
                  <input class="input" type="text" id="suFirst" placeholder="e.g. Victoria" value="${esc(s.firstName)}" required autocomplete="given-name">
                </div>
              </label>
              <label class="field">
                <span>Last Name <b style="color:var(--bad)">*</b></span>
                <input class="input" type="text" id="suLast" placeholder="e.g. Chen" value="${esc(s.lastName)}" required autocomplete="family-name">
              </label>
            </div>

            <!-- Email & DOB -->
            <div class="two-col">
              <label class="field">
                <span>Work / Corporate Email <b style="color:var(--bad)">*</b></span>
                <input class="input" type="email" id="suEmail" placeholder="signatory@company.com" value="${esc(s.email)}" required autocomplete="email">
              </label>

              <label class="field">
                <div class="between" style="margin-bottom:6px">
                  <span style="font-size:13px;font-weight:500;color:var(--ink-2)">Date of Birth (DOB) <b style="color:var(--bad)">*</b></span>
                  ${age !== null ? `
                    <span class="badge ${isAdult ? 'b-green' : 'b-red'}" style="font-size:10.5px;padding:1px 7px">
                      ${isAdult ? `Age ${age} · Verified` : `Under 18 (${age})`}
                    </span>
                  ` : ''}
                </div>
                <input class="input" type="date" id="suDob" value="${esc(s.dob)}" max="${maxAdultDobString()}" required>
                <div class="hint" style="font-size:11px">Must be an authorized signatory (18+ years).</div>
              </label>
            </div>

            <!-- Password & Confirm Password -->
            <div class="two-col">
              <label class="field">
                <span>Password <b style="color:var(--bad)">*</b></span>
                <div style="position:relative">
                  <input class="input" type="${s.showPassword ? 'text' : 'password'}" id="suPass" placeholder="Min. 8 characters" value="${esc(s.password)}" required autocomplete="new-password" style="padding-right:38px">
                  <button type="button" class="btn-quiet" data-act="toggle-su-pass" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);padding:4px 6px;color:var(--muted)" title="Toggle visibility">
                    ${ic(s.showPassword ? 'eyeOff' : 'eye', 'icon-sm')}
                  </button>
                </div>
              </label>

              <label class="field">
                <div class="between" style="margin-bottom:6px">
                  <span style="font-size:13px;font-weight:500;color:var(--ink-2)">Confirm Password <b style="color:var(--bad)">*</b></span>
                  ${s.confirmPassword ? `
                    <span class="badge ${passwordsMatch ? 'b-green' : 'b-red'}" style="font-size:10.5px;padding:1px 7px">
                      ${passwordsMatch ? 'Match' : 'Mismatch'}
                    </span>
                  ` : ''}
                </div>
                <div style="position:relative">
                  <input class="input" type="${s.showConfirmPassword ? 'text' : 'password'}" id="suConfirmPass" placeholder="Repeat password" value="${esc(s.confirmPassword)}" required autocomplete="new-password" style="padding-right:38px">
                  <button type="button" class="btn-quiet" data-act="toggle-su-confirm-pass" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);padding:4px 6px;color:var(--muted)" title="Toggle visibility">
                    ${ic(s.showConfirmPassword ? 'eyeOff' : 'eye', 'icon-sm')}
                  </button>
                </div>
              </label>
            </div>

            <!-- Password Strength Bar & Checklist -->
            <div style="background:#FAFAF8;border:1px solid var(--line-soft);border-radius:var(--r);padding:10px 12px;margin-top:-6px">
              <div class="between" style="font-size:11.5px">
                <span class="muted">Password strength</span>
                <span class="mono" style="font-weight:600;color:${strength.score >= 3 ? 'var(--ok)' : (strength.score >= 2 ? 'var(--warn)' : 'var(--bad)')}">
                  ${strength.label}
                </span>
              </div>
              <div class="pw-strength-bar">
                <div class="pw-strength-segment ${strength.score >= 1 ? strength.colorClass : ''}"></div>
                <div class="pw-strength-segment ${strength.score >= 2 ? strength.colorClass : ''}"></div>
                <div class="pw-strength-segment ${strength.score >= 3 ? strength.colorClass : ''}"></div>
                <div class="pw-strength-segment ${strength.score >= 4 ? strength.colorClass : ''}"></div>
              </div>

              <div class="pw-checklist">
                <div class="pw-req-item ${strength.checks.length ? 'met' : ''}">
                  ${ic(strength.checks.length ? 'check' : 'lock', 'icon-xs')} 8+ characters
                </div>
                <div class="pw-req-item ${strength.checks.hasUpper ? 'met' : ''}">
                  ${ic(strength.checks.hasUpper ? 'check' : 'lock', 'icon-xs')} Upper &amp; lowercase
                </div>
                <div class="pw-req-item ${strength.checks.hasNumber ? 'met' : ''}">
                  ${ic(strength.checks.hasNumber ? 'check' : 'lock', 'icon-xs')} Numeric digit (0-9)
                </div>
                <div class="pw-req-item ${strength.checks.hasSpecial ? 'met' : ''}">
                  ${ic(strength.checks.hasSpecial ? 'check' : 'lock', 'icon-xs')} Special character
                </div>
              </div>
            </div>

            <!-- Signatory Agreement Checkbox -->
            <label class="row gap8" style="cursor:pointer;align-items:flex-start;font-size:12.5px;color:var(--ink-2);margin-top:4px">
              <input type="checkbox" id="suTerms" ${s.agreeTerms ? 'checked' : ''} style="margin-top:3px;accent-color:#141413;width:15px;height:15px">
              <span>
                I represent and warrant that I am an authorized corporate signatory for this entity and agree to the
                <button type="button" data-act="open-tos" style="display:inline;padding:0;color:var(--ink);font-weight:600;text-decoration:underline;text-underline-offset:2px">KBridge Institutional Terms of Service</button>
                and Hedera smart contract custody standards.
              </span>
            </label>

            <!-- Submit Button -->
            <button class="btn btn-primary btn-block" style="padding:11px;font-size:14px;margin-top:6px" type="button" data-act="submit-signup" id="suSubmitBtn" ${(s.loading || !s.agreeTerms) ? 'disabled' : ''}>
              ${s.loading ? spinner + ' Creating institutional account…' : ic('shield', 'icon-sm') + ' Register &amp; Access ' + (s.role === 'theoriq' ? 'Capital' : (s.role === 'pursuit' ? 'Originating' : 'Admin')) + ' Portal'}
            </button>
          </form>
        </div>
      </div>

      <!-- Footer switch links -->
      <div style="text-align:center;margin-top:18px">
        <div style="font-size:13.5px;color:var(--muted)">
          Already have an authorized partner account?
          <button class="btn btn-quiet btn-sm" data-act="goto-login" data-org="${s.role}" style="font-weight:600;color:var(--ink);text-decoration:underline;text-underline-offset:3px">
            Sign in here
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

/* ============================================================
   View 2: Password Reset UX Flow (4 distinct steps)
   ============================================================ */
export function passwordResetScreen(S) {
  const r = S.resetState || {
    step: 1, // 1: Email, 2: Verification Code, 3: New Password, 4: Success
    email: (S.gateOrg && ORGS[S.gateOrg] ? ORGS[S.gateOrg].email : 'treasury@capitalpartner.com'),
    role: S.gateOrg || 'theoriq',
    code: '',
    sentCode: '849201',
    resendTimer: 45,
    newPassword: '',
    confirmPassword: '',
    showNewPassword: false,
    showConfirmPassword: false,
    error: null,
    loading: false
  };

  const step = r.step || 1;
  const strength = checkPasswordStrength(r.newPassword);
  const passwordsMatch = r.newPassword && r.confirmPassword && r.newPassword === r.confirmPassword;

  // Step 1: Request Reset (Enter Email)
  const renderStep1 = () => `
    <div style="text-align:center;margin-bottom:22px">
      <span class="micro" style="color:var(--faint)">Account Recovery</span>
      <h1 style="font-size:20px;font-weight:600;letter-spacing:-.02em;margin-top:4px">Reset Your Password</h1>
      <p class="muted" style="font-size:13px;margin-top:6px">
        Enter your institutional email address to receive an authorization verification code.
      </p>
    </div>

    ${r.error ? `
      <div class="callout c-red" style="margin-bottom:16px;align-items:center">
        ${ic('alert', 'icon-sm')}
        <div style="font-size:13px">${esc(r.error)}</div>
      </div>
    ` : ''}

    <form class="stack gap16" onsubmit="return false;">
      <label class="field">
        <span>Work / Corporate Email</span>
        <input class="input" type="email" id="prEmail" placeholder="signatory@company.com" value="${esc(r.email)}" required autocomplete="email">
      </label>

      <div class="callout c-neutral" style="font-size:12px;align-items:flex-start">
        ${ic('info', 'icon-sm')}
        <div>
          For institutional security, a 6-digit one-time cryptographic code will be dispatched to verify your account authorization.
        </div>
      </div>

      <button class="btn btn-primary btn-block" style="padding:11px" type="button" data-act="pr-send-code" id="prSendBtn" ${r.loading ? 'disabled' : ''}>
        ${r.loading ? spinner + ' Dispatching verification code…' : ic('mail', 'icon-sm') + ' Send Verification Code'}
      </button>

      <div style="text-align:center">
        <button class="btn btn-quiet btn-sm" data-act="goto-login" data-org="${r.role || 'theoriq'}">
          ${ic('back', 'icon-xs')} Return to Sign In
        </button>
      </div>
    </form>
  `;

  // Step 2: Verification Code
  const renderStep2 = () => `
    <div style="text-align:center;margin-bottom:20px">
      <div style="width:44px;height:44px;border-radius:999px;background:var(--neutral-bg);display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
        ${ic('shield', 'icon-md')}
      </div>
      <h1 style="font-size:20px;font-weight:600;letter-spacing:-.02em">Enter Verification Code</h1>
      <p class="muted" style="font-size:13px;margin-top:6px">
        We sent a 6-digit authorization code to <b class="mono" style="color:var(--ink)">${esc(r.email)}</b>
      </p>
    </div>

    ${r.error ? `
      <div class="callout c-red" style="margin-bottom:16px;align-items:center">
        ${ic('alert', 'icon-sm')}
        <div style="font-size:13px">${esc(r.error)}</div>
      </div>
    ` : ''}

    <form class="stack gap16" onsubmit="return false;">
      <div class="code-box-wrap">
        <input class="input mono code-input-lg" type="text" id="prCode" maxlength="6" placeholder="••••••" value="${esc(r.code)}" autocomplete="one-time-code" autofocus>
      </div>

      <!-- Quick test helper chip -->
      <div class="row between" style="background:#FAFAF8;border:1px solid var(--line);border-radius:var(--r);padding:8px 12px">
        <div class="row gap8">
          ${ic('sparkle', 'icon-xs')}
          <span style="font-size:12px;color:var(--muted)">Test verification code: <b class="mono" style="color:var(--ink)">${r.sentCode || '849201'}</b></span>
        </div>
        <button type="button" class="btn btn-quiet btn-xs" data-act="pr-fill-code" style="font-size:11px;font-weight:600">
          Autofill
        </button>
      </div>

      <div class="between" style="font-size:12.5px;color:var(--muted)">
        <span>Didn't receive code?</span>
        <button type="button" class="btn-quiet" data-act="pr-resend-code" style="font-size:12px;font-weight:500;color:var(--ink);text-decoration:underline">
          Resend code
        </button>
      </div>

      <button class="btn btn-primary btn-block" style="padding:11px" type="button" data-act="pr-verify-code" id="prVerifyBtn" ${r.loading ? 'disabled' : ''}>
        ${r.loading ? spinner + ' Verifying…' : ic('check', 'icon-sm') + ' Verify Code'}
      </button>

      <div class="between" style="font-size:12px">
        <button class="btn btn-quiet btn-xs" data-act="pr-step-1">
          ${ic('back', 'icon-xs')} Change Email
        </button>
        <button class="btn btn-quiet btn-xs" data-act="goto-login" data-org="${r.role}">
          Cancel &amp; Sign In
        </button>
      </div>
    </form>
  `;

  // Step 3: Enter New Password
  const renderStep3 = () => `
    <div style="text-align:center;margin-bottom:20px">
      <span class="micro" style="color:var(--ok)">Authorization Confirmed</span>
      <h1 style="font-size:20px;font-weight:600;letter-spacing:-.02em;margin-top:4px">Set New Password</h1>
      <p class="muted" style="font-size:13px;margin-top:6px">
        Create a secure new password for <b style="color:var(--ink)">${esc(r.email)}</b>
      </p>
    </div>

    ${r.error ? `
      <div class="callout c-red" style="margin-bottom:16px;align-items:center">
        ${ic('alert', 'icon-sm')}
        <div style="font-size:13px">${esc(r.error)}</div>
      </div>
    ` : ''}

    <form class="stack gap16" onsubmit="return false;">
      <label class="field">
        <span>New Password</span>
        <div style="position:relative">
          <input class="input" type="${r.showNewPassword ? 'text' : 'password'}" id="prNewPass" placeholder="Min. 8 characters" value="${esc(r.newPassword)}" required autocomplete="new-password" style="padding-right:38px">
          <button type="button" class="btn-quiet" data-act="toggle-pr-new-pass" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);padding:4px 6px;color:var(--muted)">
            ${ic(r.showNewPassword ? 'eyeOff' : 'eye', 'icon-sm')}
          </button>
        </div>
      </label>

      <label class="field">
        <div class="between" style="margin-bottom:6px">
          <span style="font-size:13px;font-weight:500;color:var(--ink-2)">Confirm New Password</span>
          ${r.confirmPassword ? `
            <span class="badge ${passwordsMatch ? 'b-green' : 'b-red'}" style="font-size:10.5px;padding:1px 7px">
              ${passwordsMatch ? 'Passwords Match' : 'Mismatch'}
            </span>
          ` : ''}
        </div>
        <div style="position:relative">
          <input class="input" type="${r.showConfirmPassword ? 'text' : 'password'}" id="prConfirmPass" placeholder="Repeat new password" value="${esc(r.confirmPassword)}" required autocomplete="new-password" style="padding-right:38px">
          <button type="button" class="btn-quiet" data-act="toggle-pr-confirm-pass" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);padding:4px 6px;color:var(--muted)">
            ${ic(r.showConfirmPassword ? 'eyeOff' : 'eye', 'icon-sm')}
          </button>
        </div>
      </label>

      <!-- Password Strength -->
      <div style="background:#FAFAF8;border:1px solid var(--line-soft);border-radius:var(--r);padding:10px 12px">
        <div class="between" style="font-size:11.5px">
          <span class="muted">Security rating</span>
          <span class="mono" style="font-weight:600;color:${strength.score >= 3 ? 'var(--ok)' : (strength.score >= 2 ? 'var(--warn)' : 'var(--bad)')}">
            ${strength.label}
          </span>
        </div>
        <div class="pw-strength-bar">
          <div class="pw-strength-segment ${strength.score >= 1 ? strength.colorClass : ''}"></div>
          <div class="pw-strength-segment ${strength.score >= 2 ? strength.colorClass : ''}"></div>
          <div class="pw-strength-segment ${strength.score >= 3 ? strength.colorClass : ''}"></div>
          <div class="pw-strength-segment ${strength.score >= 4 ? strength.colorClass : ''}"></div>
        </div>

        <div class="pw-checklist">
          <div class="pw-req-item ${strength.checks.length ? 'met' : ''}">
            ${ic(strength.checks.length ? 'check' : 'lock', 'icon-xs')} 8+ characters
          </div>
          <div class="pw-req-item ${strength.checks.hasUpper ? 'met' : ''}">
            ${ic(strength.checks.hasUpper ? 'check' : 'lock', 'icon-xs')} Upper &amp; lower letters
          </div>
          <div class="pw-req-item ${strength.checks.hasNumber ? 'met' : ''}">
            ${ic(strength.checks.hasNumber ? 'check' : 'lock', 'icon-xs')} Numeric character
          </div>
          <div class="pw-req-item ${strength.checks.hasSpecial ? 'met' : ''}">
            ${ic(strength.checks.hasSpecial ? 'check' : 'lock', 'icon-xs')} Symbol (!@#$%)
          </div>
        </div>
      </div>

      <button class="btn btn-primary btn-block" style="padding:11px" type="button" data-act="pr-save-new-pass" id="prSaveBtn" ${r.loading ? 'disabled' : ''}>
        ${r.loading ? spinner + ' Updating password…' : ic('key', 'icon-sm') + ' Reset Password &amp; Update Account'}
      </button>

      <div style="text-align:center">
        <button class="btn btn-quiet btn-sm" data-act="pr-step-2">
          ${ic('back', 'icon-xs')} Back to Code Verification
        </button>
      </div>
    </form>
  `;

  // Step 4: Success & Confirmation
  const renderStep4 = () => `
    <div style="text-align:center;padding:12px 4px">
      <div style="width:56px;height:56px;border-radius:999px;background:var(--ok-bg);color:var(--ok);border:1px solid var(--ok-line);display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
        ${ic('check', 'icon-lg')}
      </div>
      <h1 style="font-size:21px;font-weight:600;letter-spacing:-.02em">Password Reset Complete!</h1>
      <p class="muted" style="font-size:13.5px;margin-top:8px;line-height:1.55">
        Your institutional credentials for <b class="mono" style="color:var(--ink)">${esc(r.email)}</b> have been updated. You can now securely sign in to KBridge with your new password.
      </p>

      <div class="panel" style="margin:20px 0;text-align:left">
        <div class="kv"><span class="k">Account Email</span><span class="v mono">${esc(r.email)}</span></div>
        <div class="kv"><span class="k">Security Status</span><span class="v" style="color:var(--ok)">Verified &amp; Active</span></div>
        <div class="kv"><span class="k">Last Updated</span><span class="v">Just now</span></div>
      </div>

      <div class="stack gap10">
        <button class="btn btn-primary btn-block" style="padding:11px;font-size:14px" type="button" data-act="goto-login" data-org="${r.role || 'theoriq'}" data-email="${esc(r.email)}" data-newpass="${esc(r.newPassword)}">
          ${ic('lock', 'icon-sm')} Sign In With New Password
        </button>

        <button class="btn btn-ghost btn-block" style="padding:10px" type="button" data-act="pr-direct-login" data-email="${esc(r.email)}">
          ${ic('right', 'icon-sm')} Direct Sign In to Portal
        </button>
      </div>
    </div>
  `;

  const stepsHtml = `
    <div class="auth-stepper">
      <div class="auth-step-dot ${step === 1 ? 'active' : (step > 1 ? 'done' : '')}">
        <div class="auth-step-num">${step > 1 ? ic('check', 'icon-xs') : '1'}</div>
        <span>Email</span>
      </div>
      <div class="auth-step-line ${step > 1 ? 'done' : ''}"></div>
      <div class="auth-step-dot ${step === 2 ? 'active' : (step > 2 ? 'done' : '')}">
        <div class="auth-step-num">${step > 2 ? ic('check', 'icon-xs') : '2'}</div>
        <span>Verify Code</span>
      </div>
      <div class="auth-step-line ${step > 2 ? 'done' : ''}"></div>
      <div class="auth-step-dot ${step === 3 ? 'active' : (step > 3 ? 'done' : '')}">
        <div class="auth-step-num">${step > 3 ? ic('check', 'icon-xs') : '3'}</div>
        <span>New Password</span>
      </div>
      <div class="auth-step-line ${step > 3 ? 'done' : ''}"></div>
      <div class="auth-step-dot ${step === 4 ? 'done' : ''}">
        <div class="auth-step-num">${step === 4 ? ic('check', 'icon-xs') : '4'}</div>
        <span>Done</span>
      </div>
    </div>
  `;

  let bodyContent = renderStep1();
  if (step === 2) bodyContent = renderStep2();
  else if (step === 3) bodyContent = renderStep3();
  else if (step === 4) bodyContent = renderStep4();

  return `
  <div class="center-screen fadein" style="position:relative;padding:32px 16px">
    <button class="btn btn-quiet btn-sm" data-act="back-gate" style="position:absolute;top:20px;left:24px;display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--muted);z-index:10" title="Return to Partner Gate">
      ${ic('back', 'icon-xs')} Return to Partner Gate
    </button>
    <div class="auth-wrap">
      <div class="cobrand" style="margin-bottom:18px">
        ${kLogo(34)}
        <span style="font-size:20px;font-weight:600;letter-spacing:-.02em"><span style="color:#ebb03f">k</span>bridge</span>
      </div>

      <div class="card" style="border-radius:var(--r-xl);overflow:hidden">
        <div style="padding:28px 28px 24px">
          ${stepsHtml}
          ${bodyContent}
        </div>
      </div>
    </div>
  </div>`;
}

/* ============================================================
   View 3: Enhanced Branded Login with Sign Up & Reset Links
   ============================================================ */
export function brandedLoginScreen(S, k) {
  const o = ORGS[k] || ORGS.theoriq;
  const isAdmin = k === 'kbridge';

  // Find any account matching this role for convenient demo fill
  const accounts = getAccounts();
  const roleAccounts = accounts.filter(a => a.role === k);
  const primaryAccount = roleAccounts[0] || null;

  const defaultEmail = primaryAccount ? primaryAccount.email : o.email;
  const defaultPass = primaryAccount ? primaryAccount.password : 'kbridge-access';

  return `
  <div class="center-screen fadein" style="position:relative;padding:32px 16px">
    <button class="btn btn-quiet btn-sm" data-act="back-gate" style="position:absolute;top:20px;left:24px;display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--muted);z-index:10" title="Return to Partner Gate">
      ${ic('back', 'icon-xs')} Return to Partner Gate
    </button>
    <div class="login-card">
      <div class="cobrand" style="margin-bottom:18px">
        ${kLogo(34)}
        <span style="font-size:20px;font-weight:600;letter-spacing:-.02em"><span style="color:#ebb03f">k</span>bridge</span>
      </div>

      <div class="card" style="border-radius:var(--r-xl);overflow:hidden">
        <div style="padding:30px 28px 26px">
          <div style="text-align:center;margin-bottom:22px">
            <span class="micro" style="color:var(--faint)">Sign In</span>
            <h2 style="font-size:20px;font-weight:600;letter-spacing:-.02em;margin-top:4px">
              ${o.name}
            </h2>
            <p class="muted" style="font-size:13px;margin-top:4px">${o.side}</p>
          </div>

          <div id="loginForm" class="stack gap16">
            <label class="field">
              <span>Work / Corporate Email</span>
              <input class="input" type="email" id="lgEmail" value="${esc(defaultEmail)}" autocomplete="email" placeholder="signatory@company.com">
            </label>

            <label class="field">
              <span>Password</span>
              <div style="position:relative">
                <input class="input" type="password" id="lgPass" value="${esc(defaultPass)}" autocomplete="current-password" placeholder="••••••••" style="padding-right:38px">
                <button type="button" class="btn-quiet" data-act="toggle-lg-pass" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);padding:4px 6px;color:var(--muted)" title="Toggle password visibility">
                  ${ic('eye', 'icon-sm')}
                </button>
              </div>
            </label>

            <div class="between" style="font-size:13px">
              <label class="row gap8" style="cursor:pointer">
                <input type="checkbox" checked style="accent-color:#141413;width:15px;height:15px">
                <span>Remember this device</span>
              </label>

              <!-- Forgot Password link triggers the Password Reset UX Flow -->
              <button type="button" class="btn-quiet" data-act="goto-reset-password" data-org="${k}" style="padding:0;font-weight:500;text-decoration:underline;text-underline-offset:3px;color:var(--ink)">
                Forgot password?
              </button>
            </div>

            <button class="btn btn-primary btn-block" style="padding:11px;font-size:14px" type="button" data-act="login" id="lgBtn">
              ${ic('lock', 'icon-sm')} Sign in to Portal
            </button>
          </div>

          <div class="sep" style="margin:20px 0 16px"></div>
          <!-- Sign up link for all roles -->
          <div style="text-align:center">
            <span class="muted" style="font-size:13px">Need a partner account? </span>
            <button type="button" class="btn btn-quiet btn-sm" data-act="goto-signup" data-role="${k}" style="font-weight:600;color:var(--ink);text-decoration:underline;text-underline-offset:3px">
              Sign up as ${o.tag}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ============================================================
   View 4: Enhanced Gate Screen with direct Sign Up Callout
   ============================================================ */
export function enhancedGateScreen() {
  const card = k => {
    const o = ORGS[k];
    const isAdmin = k === 'kbridge';
    return `
    <div class="gate-card" style="display:flex;flex-direction:column;justify-content:space-between">
      <div>
        <div class="between" style="align-items:center;min-height:38px">
          <span class="partner-pill">${o.tag}</span>
          <span class="gate-arrow">${ic('right', 'icon-sm')}</span>
        </div>
        <div style="font-size:12.5px;color:var(--faint);margin-top:14px">${o.side}</div>
        <p style="font-size:13.5px;color:var(--muted);margin-top:10px;line-height:1.55">${o.blurb}</p>
      </div>

      <div style="margin-top:22px;border-top:1px solid var(--line-soft);padding-top:16px;display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-primary btn-sm btn-block" data-act="${isAdmin ? 'login-admin' : 'pick'}" ${isAdmin ? '' : `data-org="${k}"`}>
          ${ic('lock', 'icon-xs')} Sign in as ${o.tag}
        </button>

        <button class="btn btn-ghost btn-sm btn-block" data-act="goto-signup" data-role="${k}">
          ${ic('plus', 'icon-xs')} Sign up for ${o.tag}
        </button>
      </div>
    </div>`;
  };

  return `
  <div class="center-screen fadein" style="position:relative;padding:32px 16px">
    <div class="brandline" style="margin-bottom:8px">
      ${kLogo(36)}
      <span class="name" style="font-size:24px"><span style="color:#ebb03f">k</span>bridge</span>
    </div>
    <h1 style="font-size:26px;font-weight:600;letter-spacing:-.02em;margin-top:14px;text-align:center">
      Institutional Partner Portal
    </h1>
    <p class="muted" style="font-size:14px;margin-top:6px;text-align:center;max-width:540px">
      KBridge connects institutional capital partners with receivables platforms on Hedera. Sign in to your workspace or register as a partner signatory.
    </p>

    <div class="gate-grid">${card('theoriq')}${card('pursuit')}${card('kbridge')}</div>
  </div>`;
}

/* ============================================================
   View 5: Signatory User Account Details Modal
   ============================================================ */
export function userAccountModal(user, S) {
  const isCap = user.role === 'theoriq';
  const roleName = isCap ? 'Capital Partner' : (user.role === 'pursuit' ? 'Originating Partner' : 'Protocol Administrator');

  return `
    <div class="panel">
      <div class="between">
        <div class="row gap12">
          <div style="width:42px;height:42px;border-radius:999px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600">
            ${user.firstName ? user.firstName[0] : 'U'}${user.lastName ? user.lastName[0] : ''}
          </div>
          <div>
            <div style="font-size:15px;font-weight:600">${esc(user.firstName)} ${esc(user.lastName)}</div>
            <div class="faint" style="font-size:12px">${esc(user.title || 'Authorized Signatory')} · ${esc(user.entity || 'KBridge Partner')}</div>
          </div>
        </div>
        <span class="badge b-green"><span class="dot"></span>Active Signatory</span>
      </div>
    </div>

    <div class="panel" style="margin-top:14px">
      <div class="kv"><span class="k">Institutional Role</span><span class="v">${roleName}</span></div>
      <div class="kv"><span class="k">Email Address</span><span class="v mono">${esc(user.email)}</span></div>
      <div class="kv"><span class="k">Date of Birth (DOB)</span><span class="v mono">${esc(user.dob || '—')}</span></div>
      <div class="kv"><span class="k">Signatory Age</span><span class="v">${user.dob ? calculateAge(user.dob) + ' years (KYC Verified)' : 'Verified'}</span></div>
      <div class="kv"><span class="k">Entity SPV</span><span class="v">${esc(user.entity || 'Registered Partner SPV')}</span></div>
      <div class="kv"><span class="k">Custody Network</span><span class="v mono">Hedera Mainnet</span></div>
    </div>

    <div class="callout c-neutral" style="margin-top:14px;font-size:12px">
      ${ic('shield', 'icon-sm')}
      <div>
        Credentials are authenticated with cryptographic signature verification. You can update your password or authorization keys at any time.
      </div>
    </div>
  `;
}

/* ============================================================
   View 6: Email Confirmation Pending Screen
   ============================================================ */
export function pendingEmailScreen(S) {
  const acc = S.pendingAccount || (S.signupState ? {
    email: S.signupState.email || 'signatory@company.com',
    firstName: S.signupState.firstName || 'Signatory',
    lastName: S.signupState.lastName || 'Partner',
    role: S.signupState.role || 'theoriq',
    entity: S.signupState.entity || 'Partner SPV',
    dob: S.signupState.dob || '1990-01-01'
  } : { email: 'signatory@company.com' });

  const roleLabel = acc.role === 'theoriq' ? 'Capital Partner' : (acc.role === 'pursuit' ? 'Originating Partner' : 'Protocol Admin');

  return `
  <div class="center-screen fadein" style="position:relative;padding:32px 16px">
    <button class="btn btn-quiet btn-sm" data-act="back-gate" style="position:absolute;top:20px;left:24px;display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--muted);z-index:10" title="Return to Partner Gate">
      ${ic('back', 'icon-xs')} Return to Partner Gate
    </button>
    <div class="auth-wrap">
      <div class="cobrand" style="margin-bottom:18px">
        ${kLogo(34)}
        <span style="font-size:20px;font-weight:600;letter-spacing:-.02em"><span style="color:#ebb03f">k</span>bridge</span>
      </div>

      <div class="card" style="border-radius:var(--r-xl);overflow:hidden">
        <div style="padding:28px 28px 24px">
          <!-- Stepper -->
          <div class="auth-stepper" style="margin-bottom:24px">
            <div class="auth-step-dot done">
              <div class="auth-step-num">${ic('check', 'icon-xs')}</div>
              <span>Sign-Up</span>
            </div>
            <div class="auth-step-line done"></div>
            <div class="auth-step-dot active">
              <div class="auth-step-num">2</div>
              <span>Email Verification</span>
            </div>
            <div class="auth-step-line"></div>
            <div class="auth-step-dot">
              <div class="auth-step-num">3</div>
              <span>Admin Queue</span>
            </div>
          </div>

          <div style="text-align:center;margin-bottom:20px">
            <div style="width:52px;height:52px;border-radius:999px;background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px">
              ${ic('mail', 'icon-lg')}
            </div>
            <h1 style="font-size:21px;font-weight:600;letter-spacing:-.02em">Verify Your Work Email</h1>
            <p class="muted" style="font-size:13.5px;margin-top:6px;line-height:1.5">
              We dispatched a 6-digit verification code to <b class="mono" style="color:var(--ink)">${esc(acc.email)}</b>.
              Please confirm your email address to proceed to the KBridge Admin Approval Queue.
            </p>
          </div>

          <div class="panel" style="margin-bottom:18px;background:#FAF9F5">
            <div class="kv"><span class="k">Institutional Role</span><span class="v">${roleLabel}</span></div>
            <div class="kv"><span class="k">Corporate Entity</span><span class="v">${esc(acc.entity || 'Partner SPV')}</span></div>
            <div class="kv"><span class="k">Signatory Name</span><span class="v">${esc(acc.firstName)} ${esc(acc.lastName)}</span></div>
            <div class="kv"><span class="k">Verification Code Sent</span><span class="v mono" style="color:var(--ok)">849201</span></div>
          </div>

          <div class="stack gap16" style="gap: 16px; margin-top: 20px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span style="font-size: 13px; font-weight: 500; color: var(--ink-2);">Enter 6-Digit Verification Code</span>
              <div class="row gap8" style="display: flex; gap: 8px; align-items: center;">
                <input class="input mono" type="text" id="emailVerifyCodeInput" placeholder="849201" maxlength="6" style="font-size:18px;letter-spacing:4px;text-align:center;font-weight:600;flex: 1;min-width: 0;">
                <button class="btn btn-ghost" type="button" data-act="autofill-email-code" style="white-space:nowrap;font-size:12.5px;height: 42px;" title="Fill demo code">
                  Auto-fill (849201)
                </button>
              </div>
            </div>

            <button class="btn btn-primary btn-block" style="padding:12px;font-size:14px;height: 44px;display: flex;align-items: center;justify-content: center;gap: 8px;" type="button" data-act="submit-email-verify" data-email="${esc(acc.email)}">
              ${ic('shieldCheck', 'icon-sm')} Verify Email &amp; Submit for Admin Review
            </button>

            <button class="btn btn-ghost btn-block" style="padding:10px;font-size:13px;color:var(--muted);height: 42px;display: flex;align-items: center;justify-content: center;gap: 8px;" type="button" data-act="quick-verify-email-link" data-email="${esc(acc.email)}">
              ${ic('mail', 'icon-xs')} Simulate 1-Click Email Confirmation Link
            </button>
          </div>

          <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--line); display: flex; flex-direction: column; align-items: center; gap: 12px;">
            <span class="muted" style="font-size: 13px;">Didn't receive the verification email?</span>
            <div style="display: flex; gap: 8px; justify-content: center; width: 100%;">
              <button class="btn btn-ghost btn-sm" data-act="resend-email-code" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: var(--ink-2); flex: 1; justify-content: center; height: 36px; font-size: 12px;">
                ${ic('refresh', 'icon-xs')} Resend Code
              </button>
              <button class="btn btn-ghost btn-sm" data-act="goto-signup" data-role="${acc.role || 'theoriq'}" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 500; color: var(--muted); flex: 1; justify-content: center; height: 36px; font-size: 12px;">
                ${ic('pencil', 'icon-xs')} Change Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ============================================================
   View 7: Admin Approval Queue Pending Screen for New Sign-ups
   ============================================================ */
export function pendingApprovalScreen(S) {
  const acc = S.pendingAccount || findAccountByEmail(S.signupState?.email) || {
    email: S.signupState?.email || 'signatory@company.com',
    firstName: S.signupState?.firstName || 'Signatory',
    lastName: S.signupState?.lastName || 'Partner',
    role: S.signupState?.role || 'theoriq',
    entity: S.signupState?.entity || 'Partner SPV',
    dob: S.signupState?.dob || '1990-01-01',
    createdAt: new Date().toISOString()
  };

  const currentAcc = findAccountByEmail(acc.email) || acc;

  // Check if status changed to approved
  if (currentAcc.status === 'approved') {
    return `
    <div class="center-screen fadein" style="position:relative;padding:32px 16px">
      <div class="auth-wrap">
        <div class="cobrand" style="margin-bottom:18px">${kLogo(34)}<span style="font-size:20px;font-weight:600"><span style="color:#ebb03f">k</span>bridge</span></div>
        <div class="card" style="border-radius:var(--r-xl);overflow:hidden;padding:32px;text-align:center">
          <div style="width:56px;height:56px;border-radius:999px;background:var(--ok-bg);color:var(--ok);border:1px solid var(--ok-line);display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
            ${ic('check', 'icon-lg')}
          </div>
          <h1 style="font-size:22px;font-weight:600">Account Approved!</h1>
          <p class="muted" style="font-size:14px;margin-top:8px">Your signatory application for <b>${esc(currentAcc.entity || 'Partner SPV')}</b> was approved by KBridge Governance.</p>
          <button class="btn btn-primary btn-block" style="margin-top:20px;padding:12px" data-act="pending-approved-login" data-email="${esc(currentAcc.email)}">
            ${ic('lock', 'icon-sm')} Enter Authorized Workspace
          </button>
        </div>
      </div>
    </div>`;
  }

  const roleLabel = currentAcc.role === 'theoriq' ? 'Capital Partner' : (currentAcc.role === 'pursuit' ? 'Originating Partner' : 'Protocol Admin');
  const age = calculateAge(currentAcc.dob);

  return `
  <div class="center-screen fadein" style="position:relative;padding:32px 16px">
    <button class="btn btn-quiet btn-sm" data-act="back-gate" style="position:absolute;top:20px;left:24px;display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--muted);z-index:10" title="Return to Partner Gate">
      ${ic('back', 'icon-xs')} Return to Partner Gate
    </button>
    <div class="auth-wrap auth-wrap-wide">
      <div class="cobrand" style="margin-bottom:18px">
        ${kLogo(34)}
        <span style="font-size:20px;font-weight:600;letter-spacing:-.02em"><span style="color:#ebb03f">k</span>bridge</span>
      </div>

      <div class="card" style="border-radius:var(--r-xl);overflow:hidden">
        <div style="padding:28px 32px">
          <!-- Stepper -->
          <div class="auth-stepper" style="margin-bottom:24px">
            <div class="auth-step-dot done">
              <div class="auth-step-num">${ic('check', 'icon-xs')}</div>
              <span>Sign-Up</span>
            </div>
            <div class="auth-step-line done"></div>
            <div class="auth-step-dot done">
              <div class="auth-step-num">${ic('check', 'icon-xs')}</div>
              <span>Email Verified</span>
            </div>
            <div class="auth-step-line done"></div>
            <div class="auth-step-dot active">
              <div class="auth-step-num">3</div>
              <span>Admin Review</span>
            </div>
          </div>

          <div style="text-align:center;margin-bottom:22px">
            <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:#FFFBEB;border:1px solid #FCD34D;border-radius:999px;margin-bottom:12px;color:#B45309;font-size:12.5px;font-weight:600">
              <span class="dot-pulse" style="width:8px;height:8px;border-radius:999px;background:#D97706;display:inline-block"></span>
              Admin Approval Queue · Pending Governance Review
            </div>
            <h1 style="font-size:22px;font-weight:600;letter-spacing:-.02em">Sign-up Submitted to KBridge Admin Queue</h1>
            <p class="muted" style="font-size:13.5px;margin-top:6px;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.55">
              Your institutional signatory application for <strong>${esc(currentAcc.entity || roleLabel)}</strong> is queued for review by KBridge Protocol Administrators.
            </p>
          </div>

          <!-- Application Details Summary -->
          <div style="background:#FAF9F5;border:1px solid var(--line-soft);border-radius:var(--r-lg);padding:18px 20px;margin-bottom:22px">
            <div class="between" style="border-bottom:1px solid var(--line-soft);padding-bottom:10px;margin-bottom:12px">
              <div class="row gap8">
                ${ic('shieldCheck', 'icon-sm')}
                <span style="font-weight:600;font-size:13.5px">Signatory KYC &amp; Verification Audit</span>
              </div>
              <span class="badge b-amber"><span class="dot"></span>Queue Ref: ${currentAcc.id || 'REG-PENDING'}</span>
            </div>

            <div class="two-col" style="gap:12px 24px">
              <div class="kv"><span class="k">Signatory Name</span><span class="v">${esc(currentAcc.firstName)} ${esc(currentAcc.lastName)}</span></div>
              <div class="kv"><span class="k">Work Email</span><span class="v mono">${esc(currentAcc.email)} <span class="badge b-green" style="font-size:10px;padding:0 5px">Verified ✓</span></span></div>
              <div class="kv"><span class="k">Workspace Role</span><span class="v">${roleLabel}</span></div>
              <div class="kv"><span class="k">Corporate Entity SPV</span><span class="v">${esc(currentAcc.entity || 'Partner SPV')}</span></div>
              <div class="kv"><span class="k">DOB &amp; KYC Age</span><span class="v mono">${esc(currentAcc.dob || '—')} (${age ? age + ' yrs · Authorized' : '18+'})</span></div>
              <div class="kv"><span class="k">Submission Time</span><span class="v mono">${currentAcc.createdAt ? new Date(currentAcc.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'Just now'}</span></div>
            </div>
          </div>

          <!-- Actions & Demo Shortcuts -->
          <div class="stack gap12">
            <button class="btn btn-primary btn-block" style="padding:11px;font-size:14px" type="button" data-act="check-approval-status" data-email="${esc(currentAcc.email)}">
              ${ic('refresh', 'icon-sm')} Refresh / Check Approval Status
            </button>

            <div style="background:#F0FDF4;border:1px dashed #86EFAC;border-radius:var(--r);padding:12px 14px;margin-top:4px">
              <div class="between" style="align-items:center">
                <div>
                  <div style="font-size:12.5px;font-weight:600;color:#166534">Fast Demo Testing Actions</div>
                  <div style="font-size:11.5px;color:#15803D;margin-top:2px">Test approval instantly or log in to the Admin Portal to manage the queue</div>
                </div>
                <div class="row gap8">
                  <button class="btn btn-sm" style="background:#16A34A;color:#fff;border:none;font-weight:600" type="button" data-act="demo-quick-approve" data-email="${esc(currentAcc.email)}">
                    ${ic('check', 'icon-xs')} Instant Approve
                  </button>
                  <button class="btn btn-ghost btn-sm" style="color:#166534;border-color:#86EFAC" type="button" data-act="demo-switch-to-admin">
                    ${ic('shield', 'icon-xs')} Admin Console
                  </button>
                </div>
              </div>
            </div>

            <div style="text-align:center;margin-top:8px">
              <button class="btn btn-quiet btn-sm" data-act="back-gate" style="color:var(--muted)">
                ${ic('back', 'icon-xs')} Return to Partner Gate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
