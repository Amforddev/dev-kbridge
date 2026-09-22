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
    email: 'treasury@capitalpartner.com',
    password: 'kbridge-access',
    firstName: 'Victoria',
    lastName: 'Chen',
    dob: '1986-04-14',
    role: 'theoriq',
    entity: 'Capital Partner SPV',
    title: 'Managing Director, Treasury',
    createdAt: new Date('2025-09-01').toISOString()
  },
  {
    email: 'ops@originator.finance',
    password: 'kbridge-access',
    firstName: 'Marcus',
    lastName: 'Vance',
    dob: '1982-11-28',
    role: 'pursuit',
    entity: 'Originating Partner SPV I',
    title: 'Head of Originating & Structured Credit',
    createdAt: new Date('2025-10-15').toISOString()
  },
  {
    email: 'admin@kbridge.io',
    password: 'kbridge-access',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    dob: '1988-07-22',
    role: 'kbridge',
    entity: 'KBridge Protocol Governance',
    title: 'Protocol Administrator',
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
    return JSON.parse(raw);
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
    ...accountData,
    email: clean,
    createdAt: new Date().toISOString()
  };
  accounts.push(newAcc);
  saveAccounts(accounts);
  return newAcc;
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
    <div class="auth-wrap auth-wrap-wide">
      <div class="cobrand" style="margin-bottom:18px">
        ${kLogo(34)}
        <span style="font-size:20px;font-weight:600;letter-spacing:-.02em">kbridge</span>
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
      <div style="text-align:center;margin-top:18px;display:flex;flex-direction:column;gap:8px">
        <div style="font-size:13.5px;color:var(--muted)">
          Already have an authorized partner account?
          <button class="btn btn-quiet btn-sm" data-act="goto-login" data-org="${s.role}" style="font-weight:600;color:var(--ink);text-decoration:underline;text-underline-offset:3px">
            Sign in here
          </button>
        </div>
        <div>
          <button class="btn btn-quiet btn-sm" data-act="back-gate">
            ${ic('back', 'icon-xs')} Return to Partner Gate
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
    <div class="auth-wrap">
      <div class="cobrand" style="margin-bottom:18px">
        ${kLogo(34)}
        <span style="font-size:20px;font-weight:600;letter-spacing:-.02em">kbridge</span>
      </div>

      <div class="card" style="border-radius:var(--r-xl);overflow:hidden">
        <div style="padding:28px 28px 24px">
          ${stepsHtml}
          ${bodyContent}
        </div>
      </div>

      <div style="text-align:center;margin-top:18px">
        <button class="btn btn-quiet btn-sm" data-act="back-gate">
          ${ic('back', 'icon-xs')} Return to Partner Gate
        </button>
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
    <div class="login-card">
      <div class="cobrand" style="margin-bottom:18px">
        ${kLogo(34)}
        <span style="font-size:20px;font-weight:600;letter-spacing:-.02em">kbridge</span>
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

      <div style="text-align:center;margin-top:18px">
        <button class="btn btn-quiet btn-sm" data-act="back-gate">
          ${ic('back', 'icon-xs')} Use a different partner organisation
        </button>
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
      <span class="name" style="font-size:24px">kbridge</span>
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
