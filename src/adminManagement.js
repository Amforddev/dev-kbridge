import { ic, spinner, TODAY, esc, short, uid, renderPaginationControls } from './helpers.js';

/* ============================================================
   KBridge Admin & Editor Management (RBAC)
   Multi-admin hierarchy:
   - Master Admin: Root sovereignty. Can add/remove admins, provision editors,
     and customize granular permissions for each editor.
   - Admin: Full protocol operational privileges.
   - Editor: Granular operational capabilities defined by Master Admin:
     1. canApproveMint: Approve token mint requests & inspect notes
     2. canApproveOriginators: Review & approve Originator accounts
     3. canApproveCapital: Review & approve Capital Partner accounts
     4. canManageGuides: Author, edit, and publish Guide CMS articles
     5. canManageFees: Inspect & settle Kunda Box administration fees
   ============================================================ */

const STORAGE_KEY = 'kbridge_admin_team_v2';

export const INITIAL_ADMIN_TEAM = [
  {
    id: 'acc-admin-1',
    email: 'admin@kbridge.io',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    title: 'Protocol Administrator & Master Key',
    adminRole: 'master',
    status: 'active',
    createdAt: '2025-08-01',
    permissions: {
      canApproveMint: true,
      canApproveOriginators: true,
      canApproveCapital: true,
      canManageGuides: true,
      canManageFees: true
    }
  },
  {
    id: 'acc-admin-2',
    email: 'alex.rivera@kbridge.io',
    firstName: 'Alex',
    lastName: 'Rivera',
    title: 'Senior Operations Director',
    adminRole: 'admin',
    status: 'active',
    createdAt: '2025-10-12',
    permissions: {
      canApproveMint: true,
      canApproveOriginators: true,
      canApproveCapital: true,
      canManageGuides: true,
      canManageFees: true
    }
  },
  {
    id: 'acc-admin-3',
    email: 'elena.rostova@kbridge.io',
    firstName: 'Elena',
    lastName: 'Rostova',
    title: 'Credit & Promissory Note Editor',
    adminRole: 'editor',
    status: 'active',
    createdAt: '2026-01-15',
    permissions: {
      canApproveMint: true,
      canApproveOriginators: true,
      canApproveCapital: false,
      canManageGuides: false,
      canManageFees: false
    }
  },
  {
    id: 'acc-admin-4',
    email: 'david.kim@kbridge.io',
    firstName: 'David',
    lastName: 'Kim',
    title: 'Investor Relations & Guide Editor',
    adminRole: 'editor',
    status: 'active',
    createdAt: '2026-02-20',
    permissions: {
      canApproveMint: false,
      canApproveOriginators: false,
      canApproveCapital: true,
      canManageGuides: true,
      canManageFees: false
    }
  }
];

export function getAdminTeam() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_TEAM));
      return INITIAL_ADMIN_TEAM;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : INITIAL_ADMIN_TEAM;
  } catch (e) {
    return INITIAL_ADMIN_TEAM;
  }
}

export function saveAdminTeam(team) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
  } catch (e) {
    console.error('Failed to save admin team', e);
  }
}

export function getAdminMemberById(id) {
  const team = getAdminTeam();
  return team.find(m => m.id === id) || team[0];
}

export function getCurrentAdminMember(S) {
  const team = getAdminTeam();
  if (S.activeAdminId) {
    const found = team.find(m => m.id === S.activeAdminId);
    if (found) return found;
  }
  return team.find(m => m.adminRole === 'master') || team[0];
}

export function canPerform(action, S) {
  const current = getCurrentAdminMember(S);
  if (!current) return false;

  // Master admin has unconditional sovereign access
  if (current.adminRole === 'master') return true;

  // Standard admin has operational access to all features except modifying the admin hierarchy
  if (current.adminRole === 'admin') {
    if (action === 'manage_admins') return false;
    return true;
  }

  // Editor role has strict granular permissions
  if (current.adminRole === 'editor') {
    const p = current.permissions || {};
    if (action === 'approve_mint') return !!p.canApproveMint;
    if (action === 'approve_originators') return !!p.canApproveOriginators;
    if (action === 'approve_capital') return !!p.canApproveCapital;
    if (action === 'manage_guides') return !!p.canManageGuides;
    if (action === 'manage_fees') return !!p.canManageFees;
    if (action === 'manage_admins') return false;
  }

  return false;
}

export function addAdminMember(data) {
  const team = getAdminTeam();
  const cleanEmail = (data.email || '').trim().toLowerCase();
  
  if (team.some(m => m.email.toLowerCase() === cleanEmail)) {
    throw new Error('An administrator or editor with this email already exists.');
  }

  const newMember = {
    id: 'acc-admin-' + Date.now().toString(36),
    email: cleanEmail,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    title: (data.title || '').trim() || (data.adminRole === 'editor' ? 'Protocol Editor' : 'Administrator'),
    adminRole: data.adminRole || 'editor',
    status: 'active',
    createdAt: new Date().toISOString().slice(0, 10),
    permissions: data.adminRole === 'master' || data.adminRole === 'admin' 
      ? { canApproveMint: true, canApproveOriginators: true, canApproveCapital: true, canManageGuides: true, canManageFees: true }
      : {
          canApproveMint: !!data.permissions?.canApproveMint,
          canApproveOriginators: !!data.permissions?.canApproveOriginators,
          canApproveCapital: !!data.permissions?.canApproveCapital,
          canManageGuides: !!data.permissions?.canManageGuides,
          canManageFees: !!data.permissions?.canManageFees
        }
  };

  team.push(newMember);
  saveAdminTeam(team);
  return newMember;
}

export function updateAdminPermissions(id, permissions) {
  const team = getAdminTeam();
  const idx = team.findIndex(m => m.id === id);
  if (idx !== -1) {
    team[idx].permissions = {
      ...team[idx].permissions,
      ...permissions
    };
    saveAdminTeam(team);
    return team[idx];
  }
  return null;
}

export function updateAdminRole(id, newRole) {
  const team = getAdminTeam();
  const idx = team.findIndex(m => m.id === id);
  if (idx !== -1) {
    if (team[idx].adminRole === 'master') {
      throw new Error('Cannot change the role of the Master Admin.');
    }
    team[idx].adminRole = newRole;
    if (newRole === 'admin') {
      team[idx].permissions = {
        canApproveMint: true,
        canApproveOriginators: true,
        canApproveCapital: true,
        canManageGuides: true,
        canManageFees: true
      };
    }
    saveAdminTeam(team);
    return team[idx];
  }
  return null;
}

export function deleteAdminMember(id) {
  const team = getAdminTeam();
  const target = team.find(m => m.id === id);
  if (!target) return team;
  if (target.adminRole === 'master') {
    throw new Error('Cannot revoke access for the Master Admin.');
  }
  const filtered = team.filter(m => m.id !== id);
  saveAdminTeam(filtered);
  return filtered;
}

/* ============================================================
   Page View: Admin Management & Role-Based Access Control
   ============================================================ */

export function viewAdminManagement(S, ctx) {
  const team = getAdminTeam();
  const currentAdmin = getCurrentAdminMember(S);
  const isMaster = currentAdmin.adminRole === 'master';

  const masterCount = team.filter(m => m.adminRole === 'master').length;
  const adminCount = team.filter(m => m.adminRole === 'admin').length;
  const editorCount = team.filter(m => m.adminRole === 'editor').length;

  const operatorOptions = team.map(m => {
    const roleTag = m.adminRole === 'master' ? 'Master Admin' : (m.adminRole === 'admin' ? 'Admin' : 'Editor');
    return {
      v: m.id,
      label: `${m.firstName} ${m.lastName} (${roleTag})`,
      sub: m.title
    };
  });

  const page = (S.pagination && S.pagination.team) || 1;
  const perPage = 5;
  const total = team.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIdx = (safePage - 1) * perPage;
  const pageTeam = team.slice(startIdx, startIdx + perPage);

  const memberRows = pageTeam.map(m => {
    const isThisMaster = m.adminRole === 'master';
    const isCurrentActive = m.id === currentAdmin.id;

    // Role badge
    let roleBadge = '';
    if (m.adminRole === 'master') {
      roleBadge = `<span class="badge b-amber" style="font-weight:600">${ic('crown', 'icon-xs')} Master Admin</span>`;
    } else if (m.adminRole === 'admin') {
      roleBadge = `<span class="badge b-ink" style="font-weight:600">${ic('shield', 'icon-xs')} Administrator</span>`;
    } else {
      const activeCount = Object.values(m.permissions || {}).filter(Boolean).length;
      roleBadge = `<span class="badge b-blue" style="font-weight:600">${ic('pencil', 'icon-xs')} Editor (${activeCount}/5 perms)</span>`;
    }

    // Granular permissions badges
    const p = m.permissions || {};
    const permPills = `
      <div class="row gap4" style="flex-wrap:wrap">
        <span class="micro ${p.canApproveMint ? 'pos' : 'faint'}" style="padding:2px 6px;background:${p.canApproveMint ? '#DCFCE7' : '#F1F5F9'};border-radius:4px" title="Can inspect notes & mint tokens">
          ${p.canApproveMint ? '✓' : '✕'} Mint Requests
        </span>
        <span class="micro ${p.canApproveOriginators ? 'pos' : 'faint'}" style="padding:2px 6px;background:${p.canApproveOriginators ? '#DCFCE7' : '#F1F5F9'};border-radius:4px" title="Can approve Originating Partner signups">
          ${p.canApproveOriginators ? '✓' : '✕'} Originators
        </span>
        <span class="micro ${p.canApproveCapital ? 'pos' : 'faint'}" style="padding:2px 6px;background:${p.canApproveCapital ? '#DCFCE7' : '#F1F5F9'};border-radius:4px" title="Can approve Capital Partner signups">
          ${p.canApproveCapital ? '✓' : '✕'} Capital
        </span>
        <span class="micro ${p.canManageGuides ? 'pos' : 'faint'}" style="padding:2px 6px;background:${p.canManageGuides ? '#DCFCE7' : '#F1F5F9'};border-radius:4px" title="Can manage Guide CMS">
          ${p.canManageGuides ? '✓' : '✕'} Guides
        </span>
        <span class="micro ${p.canManageFees ? 'pos' : 'faint'}" style="padding:2px 6px;background:${p.canManageFees ? '#DCFCE7' : '#F1F5F9'};border-radius:4px" title="Can settle Kunda Box fees">
          ${p.canManageFees ? '✓' : '✕'} Fees
        </span>
      </div>
    `;

    // Action buttons based on master admin privileges
    let actions = '';
    if (isThisMaster) {
      actions = `
        <span class="faint" style="font-size:11.5px">Master Sovereign</span>
      `;
    } else if (isMaster) {
      actions = `
        <div class="row gap6" style="justify-content:flex-end">
          <button class="btn btn-ghost btn-sm" data-act="admin-edit-perms" data-id="${m.id}" title="Edit granular permissions for this operator">
            ${ic('pencil', 'icon-xs')} Permissions
          </button>
          <button class="btn btn-ghost btn-sm" data-act="admin-toggle-role" data-id="${m.id}" title="Toggle between Admin and Editor role">
            ${m.adminRole === 'editor' ? 'Promote' : 'Set as Editor'}
          </button>
          <button class="btn btn-ghost btn-sm" style="color:var(--bad)" data-act="admin-del-confirm" data-id="${m.id}" title="Revoke team access">
            ${ic('trash', 'icon-xs')}
          </button>
        </div>
      `;
    } else {
      actions = `
        <span class="faint" style="font-size:11.5px">Master Admin Protected</span>
      `;
    }

    return `
      <tr class="hover-row ${isCurrentActive ? 'selected-row' : ''}">
        <td>
          <div class="row gap10" style="align-items:center">
            <div style="width:34px;height:34px;border-radius:999px;background:${isThisMaster ? '#FEF3C7' : '#F1F5F9'};color:${isThisMaster ? '#B45309' : 'var(--ink)'};display:flex;align-items:center;justify-content:center;font-weight:600;font-size:12px;border:1px solid ${isThisMaster ? '#FCD34D' : 'var(--line)'}">
              ${m.firstName[0]}${m.lastName[0]}
            </div>
            <div>
              <div style="font-weight:600;font-size:13.5px;color:var(--ink)">
                ${esc(m.firstName)} ${esc(m.lastName)}
                ${isCurrentActive ? '<span class="micro" style="margin-left:6px;background:var(--ink);color:#fff;padding:1px 5px;border-radius:4px">YOU</span>' : ''}
              </div>
              <div class="faint" style="font-size:11.5px">${esc(m.title)} · <span class="mono">${esc(m.email)}</span></div>
            </div>
          </div>
        </td>
        <td>${roleBadge}</td>
        <td>${permPills}</td>
        <td class="mono" style="font-size:12px">${esc(m.createdAt)}</td>
        <td><span class="badge b-green"><span class="dot"></span>Active</span></td>
        <td class="t-right">
          <div class="row gap6" style="justify-content:flex-end">
            ${!isCurrentActive ? `
              <button class="btn btn-quiet btn-xs" data-act="admin-switch-operator" data-id="${m.id}" title="Simulate session as this user to test permissions">
                Simulate As
              </button>
            ` : ''}
            ${actions}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="page-head" style="margin-bottom:20px">
      <div>
        <h1 style="font-size:23px;font-weight:600;letter-spacing:-.02em">Admin &amp; Team Governance</h1>
        <p class="muted" style="font-size:13.5px;margin-top:4px">Multi-admin hierarchy, editor role assignments, and granular operational permissions for protocol governance.</p>
      </div>

      <div class="row gap8">
        <!-- Active Operator Simulator Dropdown -->
        <div style="min-width:240px">
          <div class="micro" style="margin-bottom:4px">Current Active Operator:</div>
          ${ctx.selectBox('activeOperatorSel', operatorOptions, currentAdmin.id, v => {
            S.activeAdminId = v;
            ctx.toast.info('Simulating Operator', `Active session switched to ${getAdminMemberById(v).firstName} ${getAdminMemberById(v).lastName}`, 'userCheck');
            window.render();
          })}
        </div>

        <button class="btn btn-primary" data-act="admin-create-open" style="align-self:flex-end;height:38px" ${!isMaster ? 'disabled title="Only Master Admin can add admins and editors"' : ''}>
          ${ic('userPlus', 'icon-sm')} Add Admin / Editor
        </button>
      </div>
    </div>

    <!-- Governance Overview Stats -->
    <div class="stats" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr))">
      <div class="card card-pad stat">
        <div class="label">${ic('crown', 'icon-sm')} Master Admin</div>
        <div class="value mono">${masterCount}</div>
        <div class="sub">Genesis protocol sovereignty</div>
      </div>
      <div class="card card-pad stat">
        <div class="label">${ic('shield', 'icon-sm')} Administrators</div>
        <div class="value mono">${adminCount}</div>
        <div class="sub">Full protocol operational keys</div>
      </div>
      <div class="card card-pad stat">
        <div class="label">${ic('pencil', 'icon-sm')} Protocol Editors</div>
        <div class="value mono">${editorCount}</div>
        <div class="sub">Granular assigned access</div>
      </div>
      <div class="card card-pad stat">
        <div class="label">${ic('shieldCheck', 'icon-sm')} Access Control</div>
        <div class="value" style="font-size:18px;font-weight:600">Active RBAC</div>
        <div class="sub">5 granular permission tiers</div>
      </div>
    </div>

    <!-- Master Admin Sovereignty Callout -->
    <div class="callout c-neutral" style="margin-bottom:24px;align-items:flex-start">
      ${ic('shieldCheck', 'icon-sm')}
      <div style="font-size:12.5px;line-height:1.6">
        <b>Role-Based Access Control Architecture:</b> 
        The <b>Master Admin</b> possesses root authority to provision team members, assign administrators, and define custom granular permissions for <b>Editors</b>. 
        Editors can be restricted to specific responsibilities (e.g. mint approvals only, originator reviews only, or documentation only).
        ${!isMaster ? '<br><span style="color:var(--warn);font-weight:600">Notice: You are currently simulating a non-master operator profile. Role assignments and permission editing are read-only.</span>' : ''}
      </div>
    </div>

    <!-- Team Members Table -->
    <div class="card" style="margin-bottom:24px">
      <div class="card-head">
        <div>
          <h3>${ic('users', 'icon-sm')} Authorized Governance Personnel</h3>
          <p class="muted" style="font-size:12.5px;margin-top:2px">List of active administrators and editors provisioned across KBridge.</p>
        </div>
        <span class="mono faint" style="font-size:12px">${team.length} total team members</span>
      </div>

      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Signatory Name &amp; Role Title</th>
              <th>Hierarchy Tier</th>
              <th>Granular Permissions Assigned</th>
              <th>Date Appointed</th>
              <th>Status</th>
              <th class="t-right">Governance Actions</th>
            </tr>
          </thead>
          <tbody>
            ${memberRows}
          </tbody>
        </table>
      </div>
      ${renderPaginationControls(safePage, total, perPage, 'paginate-team', 'Team Members')}
    </div>

    <!-- Granular Permission Matrix Reference -->
    <div class="card card-pad">
      <h3 style="font-size:15px;margin-bottom:12px">${ic('layers', 'icon-sm')} Granular Permission Definitions for Editors</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px">
        <div style="padding:14px;background:#FAFAF8;border-radius:var(--r);border:1px solid var(--line-soft)">
          <div style="font-weight:600;font-size:13px;color:var(--ink);margin-bottom:4px">1. Approve Mint Requests</div>
          <div class="muted" style="font-size:12px;line-height:1.5">Grants authority to inspect uploaded promissory notes and execute atomic Hedera token mint transactions in the Admin Pipeline.</div>
        </div>
        <div style="padding:14px;background:#FAFAF8;border-radius:var(--r);border:1px solid var(--line-soft)">
          <div style="font-weight:600;font-size:13px;color:var(--ink);margin-bottom:4px">2. Approve Originating Partners</div>
          <div class="muted" style="font-size:12px;line-height:1.5">Grants authority to review corporate KYC/AML documents and approve new Originating Partner SPV signatory applications.</div>
        </div>
        <div style="padding:14px;background:#FAFAF8;border-radius:var(--r);border:1px solid var(--line-soft)">
          <div style="font-weight:600;font-size:13px;color:var(--ink);margin-bottom:4px">3. Approve Capital Partners</div>
          <div class="muted" style="font-size:12px;line-height:1.5">Grants authority to review institutional investor onboarding dossiers and approve Capital Partner access.</div>
        </div>
        <div style="padding:14px;background:#FAFAF8;border-radius:var(--r);border:1px solid var(--line-soft)">
          <div style="font-weight:600;font-size:13px;color:var(--ink);margin-bottom:4px">4. Manage Documentation (Guide CMS)</div>
          <div class="muted" style="font-size:12px;line-height:1.5">Grants authority to author, edit, publish, and delete operational documentation and manuals in the Guide CMS.</div>
        </div>
        <div style="padding:14px;background:#FAFAF8;border-radius:var(--r);border:1px solid var(--line-soft)">
          <div style="font-weight:600;font-size:13px;color:var(--ink);margin-bottom:4px">5. Kunda Box Administration Fees</div>
          <div class="muted" style="font-size:12px;line-height:1.5">Grants authority to audit and settle daily 2.25% administration fee accruals across active originator facilities.</div>
        </div>
      </div>
    </div>
  `;
}

/* ============================================================
   Modals: Add Member, Edit Permissions, Delete Member
   ============================================================ */

export function openAddAdminModal(S, ctx) {
  const modalHtml = `
    <div class="modal" style="max-width:580px">
      <div class="modal-head">
        <div>
          <h2>${ic('userPlus', 'icon-sm')} Add Administrator or Editor</h2>
          <p>Provision new governance personnel with custom operational capabilities.</p>
        </div>
        <button class="btn btn-quiet btn-sm" data-act="close">${ic('x', 'icon-sm')}</button>
      </div>

      <div class="modal-body" style="gap:16px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label class="field">
            <span>First Name</span>
            <input type="text" id="addAdminFirst" class="input" placeholder="e.g. Rachel" />
          </label>
          <label class="field">
            <span>Last Name</span>
            <input type="text" id="addAdminLast" class="input" placeholder="e.g. Vance" />
          </label>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label class="field">
            <span>Institutional Email</span>
            <input type="email" id="addAdminEmail" class="input" placeholder="colleague@kbridge.io" />
          </label>
          <label class="field">
            <span>Role Title / Designation</span>
            <input type="text" id="addAdminTitle" class="input" placeholder="e.g. Senior Credit Officer" />
          </label>
        </div>

        <label class="field">
          <span>Hierarchy Tier</span>
          <input type="hidden" id="addAdminRoleVal" value="editor" />
          ${ctx.selectBox('addAdminRoleSel', [
            { v: 'editor', label: 'Protocol Editor', sub: 'Granular permissions configured below' },
            { v: 'admin', label: 'Administrator', sub: 'Full operational administrative access' }
          ], 'editor', v => {
            const inp = document.getElementById('addAdminRoleVal');
            if (inp) inp.value = v;
            const editorBox = document.getElementById('addAdminEditorPermsBox');
            if (editorBox) {
              if (v === 'editor') editorBox.classList.remove('hide');
              else editorBox.classList.add('hide');
            }
            const btn = document.querySelector('[data-sel="addAdminRoleSel"] .sel-btn');
            if (btn) {
              btn.querySelector('.sel-lab').textContent = v === 'editor' ? 'Protocol Editor' : 'Administrator';
              const sub = btn.querySelector('.sel-sub');
              if (sub) sub.textContent = v === 'editor' ? 'Granular permissions configured below' : 'Full operational administrative access';
            }
          })}
        </label>

        <!-- Granular Permissions Checklist for Editor -->
        <div id="addAdminEditorPermsBox" style="background:#FAFAF8;border:1px solid var(--line);border-radius:var(--r);padding:14px">
          <div style="font-weight:600;font-size:13px;margin-bottom:8px">Assign Granular Permissions:</div>
          <div class="stack gap8">
            <label class="row gap8" style="font-size:13px;cursor:pointer">
              <input type="checkbox" id="perm_canApproveMint" checked />
              <span><b>Approve Mint Requests:</b> Inspect promissory notes &amp; execute Hedera token mints</span>
            </label>
            <label class="row gap8" style="font-size:13px;cursor:pointer">
              <input type="checkbox" id="perm_canApproveOriginators" checked />
              <span><b>Approve Originating Partners:</b> Review KYC &amp; approve Originator applications</span>
            </label>
            <label class="row gap8" style="font-size:13px;cursor:pointer">
              <input type="checkbox" id="perm_canApproveCapital" checked />
              <span><b>Approve Capital Partners:</b> Review KYC &amp; approve Capital investor accounts</span>
            </label>
            <label class="row gap8" style="font-size:13px;cursor:pointer">
              <input type="checkbox" id="perm_canManageGuides" checked />
              <span><b>Manage Documentation:</b> Author, edit &amp; publish articles in Guide CMS</span>
            </label>
            <label class="row gap8" style="font-size:13px;cursor:pointer">
              <input type="checkbox" id="perm_canManageFees" />
              <span><b>Kunda Box Administration Fees:</b> Settle and audit 2.25% administration fees</span>
            </label>
          </div>
        </div>
      </div>

      <div class="modal-foot">
        <button class="btn btn-ghost" data-act="close">Cancel</button>
        <button class="btn btn-primary" data-act="admin-create-submit">
          ${ic('userPlus', 'icon-sm')} Create Account
        </button>
      </div>
    </div>
  `;

  ctx.openModal(modalHtml);
}

export function openEditPermissionsModal(adminId, S, ctx) {
  const member = getAdminMemberById(adminId);
  if (!member) return;

  const p = member.permissions || {};

  const modalHtml = `
    <div class="modal" style="max-width:540px">
      <div class="modal-head">
        <div>
          <h2>${ic('shieldCheck', 'icon-sm')} Configure Permissions: ${esc(member.firstName)} ${esc(member.lastName)}</h2>
          <p>${esc(member.title)} · <span class="mono">${esc(member.email)}</span></p>
        </div>
        <button class="btn btn-quiet btn-sm" data-act="close">${ic('x', 'icon-sm')}</button>
      </div>

      <div class="modal-body" style="gap:16px">
        <div class="callout c-neutral" style="font-size:12px;line-height:1.5">
          Modify the specific capabilities permitted for this ${member.adminRole === 'editor' ? 'Editor' : 'Administrator'}. Changes take effect immediately.
        </div>

        <div style="background:#FAFAF8;border:1px solid var(--line);border-radius:var(--r);padding:16px">
          <div style="font-weight:600;font-size:13px;margin-bottom:12px">Granular Operational Capabilities:</div>
          <div class="stack gap12">
            <label class="row gap10" style="font-size:13px;cursor:pointer;align-items:flex-start">
              <input type="checkbox" id="editPerm_canApproveMint" ${p.canApproveMint ? 'checked' : ''} style="margin-top:3px" />
              <div>
                <div style="font-weight:600">Approve Token Mint Requests</div>
                <div class="faint" style="font-size:11.5px">Permits inspecting signed notes and signing atomic mint transactions on Hedera.</div>
              </div>
            </label>

            <label class="row gap10" style="font-size:13px;cursor:pointer;align-items:flex-start">
              <input type="checkbox" id="editPerm_canApproveOriginators" ${p.canApproveOriginators ? 'checked' : ''} style="margin-top:3px" />
              <div>
                <div style="font-weight:600">Approve Originating Partners</div>
                <div class="faint" style="font-size:11.5px">Permits approving or rejecting new Originator SPV applications.</div>
              </div>
            </label>

            <label class="row gap10" style="font-size:13px;cursor:pointer;align-items:flex-start">
              <input type="checkbox" id="editPerm_canApproveCapital" ${p.canApproveCapital ? 'checked' : ''} style="margin-top:3px" />
              <div>
                <div style="font-weight:600">Approve Capital Partners</div>
                <div class="faint" style="font-size:11.5px">Permits approving or rejecting institutional Capital Partner investors.</div>
              </div>
            </label>

            <label class="row gap10" style="font-size:13px;cursor:pointer;align-items:flex-start">
              <input type="checkbox" id="editPerm_canManageGuides" ${p.canManageGuides ? 'checked' : ''} style="margin-top:3px" />
              <div>
                <div style="font-weight:600">Manage Documentation (Guide CMS)</div>
                <div class="faint" style="font-size:11.5px">Permits adding, editing, and publishing articles and categories.</div>
              </div>
            </label>

            <label class="row gap10" style="font-size:13px;cursor:pointer;align-items:flex-start">
              <input type="checkbox" id="editPerm_canManageFees" ${p.canManageFees ? 'checked' : ''} style="margin-top:3px" />
              <div>
                <div style="font-weight:600">Kunda Box Administration Fees</div>
                <div class="faint" style="font-size:11.5px">Permits reconciling and executing fee settlements.</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="modal-foot">
        <button class="btn btn-ghost" data-act="close">Cancel</button>
        <button class="btn btn-primary" data-act="admin-save-perms" data-id="${member.id}">
          ${ic('check', 'icon-sm')} Save Permissions
        </button>
      </div>
    </div>
  `;

  ctx.openModal(modalHtml);
}

export function openDeleteAdminModal(adminId, S, ctx) {
  const member = getAdminMemberById(adminId);
  if (!member) return;

  const modalHtml = `
    <div class="modal">
      <div class="modal-head">
        <h2>${ic('alert', 'icon-sm')} Revoke Governance Access</h2>
        <button class="btn btn-quiet btn-sm" data-act="close">${ic('x', 'icon-sm')}</button>
      </div>
      <div class="modal-body">
        <p style="font-size:14px;color:var(--ink-2);line-height:1.55">
          Are you sure you want to revoke governance access for <b>${esc(member.firstName)} ${esc(member.lastName)}</b> (${esc(member.email)})?
        </p>
        <p class="muted" style="font-size:12.5px">
          This user will immediately lose all administrative and editor capabilities across KBridge.
        </p>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" data-act="close">Cancel</button>
        <button class="btn btn-danger" data-act="admin-del-go" data-id="${member.id}">
          ${ic('trash', 'icon-sm')} Revoke Access
        </button>
      </div>
    </div>
  `;

  ctx.openModal(modalHtml);
}
