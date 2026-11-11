import { ic, spinner, dshort, TODAY, esc, short, uid, nf } from './helpers.js';
import {
  getAccounts, saveAccounts, getAdminAccounts, addAdminUser,
  updateAdminPermissions, deleteAdminUser, hasPermission, isMasterAdmin,
  ADMIN_PERMISSIONS
} from './auth.js';

/* ============================================================
   KBridge Multi-Admin & Role-Based Access Control (RBAC) System
   - Master Admin: Full protocol control & team governance
   - Co-Admin: Full operational execution
   - Editors: Custom granular permissions (Approve Mints, Approve
     Originators, Approve Capital Partners, Request Notes, etc.)
   ============================================================ */

export function openAdminTeamModal(S, ctx) {
  const admins = getAdminAccounts();
  const currentAcc = S.currentUser || admins[0];
  const isMaster = isMasterAdmin(currentAcc);

  const teamRows = admins.map(acc => {
    const isCur = currentAcc && (acc.id === currentAcc.id || acc.email === currentAcc.email);
    const isAccMaster = isMasterAdmin(acc);
    const isAccEditor = acc.adminRole === 'editor';

    let roleBadge = '';
    if (isAccMaster) {
      roleBadge = `<span class="badge" style="background:#FEF3C7;color:#92400E;border-color:#FDE68A;font-weight:600;display:inline-flex;align-items:center;gap:5px">${ic('crown', 'icon-xs')} Master Admin</span>`;
    } else if (isAccEditor) {
      roleBadge = `<span class="badge" style="background:#E0F2FE;color:#0369A1;border-color:#BAE6FD;font-weight:600;display:inline-flex;align-items:center;gap:5px">${ic('pencil', 'icon-xs')} Editor</span>`;
    } else {
      roleBadge = `<span class="badge" style="background:#F1F5F9;color:#334155;border-color:#CBD5E1;font-weight:600;display:inline-flex;align-items:center;gap:5px">${ic('shield', 'icon-xs')} Co-Admin</span>`;
    }

    // Render permissions chips
    let permsHtml = '';
    if (isAccMaster || acc.adminRole === 'admin') {
      permsHtml = `<span class="badge b-green" style="font-size:11px;padding:3px 8px;display:inline-flex;align-items:center;gap:5px">${ic('shieldCheck', 'icon-xs')} Full Unrestricted Governance</span>`;
    } else {
      const perms = Array.isArray(acc.permissions) ? acc.permissions : [];
      if (perms.length === 0) {
        permsHtml = `<span class="badge b-red" style="font-size:11px;padding:3px 8px;display:inline-flex;align-items:center;gap:5px">${ic('alert', 'icon-xs')} No permissions assigned (View only)</span>`;
      } else {
        const iconMap = {
          approve_mint_requests: 'coins',
          approve_originators: 'users',
          approve_capital_partners: 'bank',
          request_notes: 'fileText',
          manage_guides: 'book',
          manage_wallets: 'wallet'
        };
        permsHtml = perms.map(pKey => {
          const pDef = ADMIN_PERMISSIONS.find(p => p.key === pKey);
          const icon = iconMap[pKey] || 'check';
          return `<span class="partner-pill" style="font-size:11px;padding:3px 9px;margin:2px;display:inline-flex;align-items:center;gap:4px">${ic(icon, 'icon-xs')} ${esc(pDef ? pDef.label : pKey)}</span>`;
        }).join(' ');
      }
    }

    return `
      <tr class="hover-row ${isCur ? 'selected-row' : ''}" style="${isCur ? 'background:rgba(235,176,63,0.06)' : ''}">
        <td>
          <div class="row gap10" style="align-items:center">
            <div style="width:32px;height:32px;border-radius:999px;font-size:11.5px;font-weight:600;background:${isAccMaster ? '#0F172A' : '#334155'};color:#fff;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;letter-spacing:.02em">
              ${(acc.firstName?.[0] || 'A') + (acc.lastName?.[0] || 'D')}
            </div>
            <div>
              <div style="font-weight:600;font-size:13.5px;color:var(--ink);display:flex;align-items:center">
                ${esc(acc.firstName || '')} ${esc(acc.lastName || '')}
                ${isCur ? `<span class="badge b-amber" style="font-size:10px;padding:1px 6px;margin-left:6px;display:inline-flex;align-items:center;gap:3px">${ic('userCheck', 'icon-xs')} You</span>` : ''}
              </div>
              <div class="faint mono" style="font-size:11px">${esc(acc.email)} · ${esc(acc.title || 'Administrator')}</div>
            </div>
          </div>
        </td>
        <td>${roleBadge}</td>
        <td>
          <div style="max-width:340px;display:flex;flex-wrap:wrap">${permsHtml}</div>
        </td>
        <td class="t-right">
          <div class="row gap6" style="justify-content:flex-end">
            ${isAccEditor && isMaster ? `
              <button class="btn btn-ghost btn-sm" data-act="admin-open-edit-perms" data-id="${acc.id}" title="Edit Editor Permissions" style="gap:4px">
                ${ic('pencil', 'icon-xs')} Edit Permissions
              </button>
            ` : ''}

            ${!isCur ? `
              <button class="btn btn-quiet btn-sm" data-act="admin-switch-identity" data-id="${acc.id}" title="Test portal as this user" style="gap:4px">
                ${ic('refresh', 'icon-xs')} Switch Identity
              </button>
            ` : ''}

            ${!isAccMaster && isMaster ? `
              <button class="btn btn-quiet btn-sm" style="color:var(--bad)" data-act="admin-delete-user" data-id="${acc.id}" title="Remove user">
                ${ic('trash', 'icon-xs')}
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  const modalHtml = `
    <div class="modal modal-wide" style="max-width:960px">
      <div class="modal-head">
        <div>
          <h2>${ic('users', 'icon-sm')} KBridge Admin Team &amp; Editor Permissions</h2>
          <p>Master Administrator console for adding co-admins and configuring granular editor permissions.</p>
        </div>
        <button class="btn btn-quiet btn-sm" data-act="close">${ic('x', 'icon-sm')}</button>
      </div>

      <div class="modal-body" style="gap:20px;max-height:80vh;overflow-y:auto">
        <!-- Active Session Status Banner -->
        <div style="background:#0F172A;color:#fff;padding:16px 20px;border-radius:var(--r-lg);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
          <div class="row gap12" style="align-items:center">
            <div style="width:38px;height:38px;border-radius:8px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);display:flex;align-items:center;justify-content:center;color:#ebb03f">
              ${ic(isMaster ? 'crown' : 'shield', 'icon-sm')}
            </div>
            <div>
              <div style="font-weight:600;font-size:14px;display:flex;align-items:center;gap:8px">
                <span>Active Identity: ${esc(currentAcc.firstName || 'Sarah')} ${esc(currentAcc.lastName || 'Jenkins')}</span>
                <span class="badge" style="background:rgba(235,176,63,0.15);color:#FDE68A;border-color:rgba(235,176,63,0.3);font-size:11px;padding:1px 7px;display:inline-flex;align-items:center;gap:4px">
                  ${ic(isMaster ? 'crown' : (currentAcc.adminRole === 'editor' ? 'pencil' : 'shield'), 'icon-xs')}
                  ${isMaster ? 'Master Administrator' : (currentAcc.adminRole === 'editor' ? 'Editor' : 'Co-Admin')}
                </span>
              </div>
              <div style="font-size:12px;color:#94A3B8;margin-top:2px">
                Governance Scope: <span style="color:#ebb03f;font-weight:500">${isMaster ? 'Full Protocol Governance & Team Management' : (currentAcc.adminRole === 'editor' ? 'Restricted Operational Execution' : 'Full Operational Management')}</span>
                · Email: <span class="mono" style="color:#CBD5E1">${esc(currentAcc.email)}</span>
              </div>
            </div>
          </div>
          <div>
            ${isMaster ? `
              <button class="btn btn-primary btn-sm" data-act="admin-open-add" style="gap:6px">
                ${ic('plus', 'icon-xs')} Add Admin or Editor
              </button>
            ` : `
              <span class="mono faint" style="font-size:11px;color:#94A3B8">Contact Master Admin to edit team</span>
            `}
          </div>
        </div>

        <!-- Permissions Reference Guide -->
        <div class="callout c-neutral" style="align-items:flex-start;gap:12px;padding:14px 16px">
          ${ic('shield', 'icon-sm')}
          <div style="font-size:12.5px;line-height:1.55;flex:1">
            <div style="font-weight:600;color:var(--ink);margin-bottom:6px">Role-Based Access Control (RBAC) Architecture:</div>
            <div style="display:flex;flex-direction:column;gap:6px">
              <div style="display:flex;align-items:center;gap:8px">
                <span class="badge" style="background:#FEF3C7;color:#92400E;border-color:#FDE68A;font-size:11px;padding:1px 7px;display:inline-flex;align-items:center;gap:4px">${ic('crown', 'icon-xs')} Master Admin</span>
                <span>Unrestricted governance authority; provisions administrators, assigns editors, and modifies all permissions.</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span class="badge" style="background:#E0F2FE;color:#0369A1;border-color:#BAE6FD;font-size:11px;padding:1px 7px;display:inline-flex;align-items:center;gap:4px">${ic('pencil', 'icon-xs')} Editors</span>
                <span>Operational personnel restricted to permissions explicitly granted by the Master Admin (approving token mints, onboarding originators/capital, or managing guides).</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Admins & Editors Table -->
        <div class="card" style="overflow:hidden">
          <div class="card-head">
            <div class="row gap8">
              ${ic('users', 'icon-sm')}
              <span style="font-size:14px;font-weight:600">Registered Administrators &amp; Editors (${admins.length})</span>
            </div>
            ${isMaster ? `
              <button class="btn btn-ghost btn-sm" data-act="admin-open-add">
                ${ic('plus', 'icon-xs')} Add Member
              </button>
            ` : ''}
          </div>
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Administrator / Editor</th>
                  <th>Role</th>
                  <th>Permission Scope</th>
                  <th class="t-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${teamRows}
              </tbody>
            </table>
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
   View 2: Add New Admin or Editor Modal
   ============================================================ */

export function openAddAdminModal(S, ctx) {
  const modalHtml = `
    <div class="modal" style="max-width:620px">
      <div class="modal-head">
        <div>
          <h2>${ic('plus', 'icon-sm')} Add New Administrator or Editor</h2>
          <p>Grant protocol governance access or configure an editor with tailored operational permissions.</p>
        </div>
        <button class="btn btn-quiet btn-sm" data-act="close">${ic('x', 'icon-sm')}</button>
      </div>

      <div class="modal-body" style="gap:16px;max-height:80vh;overflow-y:auto">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label class="field">
            <span>First Name</span>
            <input class="input" type="text" id="addAdminFirst" placeholder="e.g. David" />
          </label>
          <label class="field">
            <span>Last Name</span>
            <input class="input" type="text" id="addAdminLast" placeholder="e.g. Ramos" />
          </label>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label class="field">
            <span>Institutional Email</span>
            <input class="input" type="email" id="addAdminEmail" placeholder="e.g. david.ops@kbridge.io" />
          </label>
          <label class="field">
            <span>Initial Password</span>
            <input class="input" type="password" id="addAdminPassword" value="kbridge-access" />
          </label>
        </div>

        <label class="field">
          <span>Job Title / Operational Focus</span>
          <input class="input" type="text" id="addAdminTitle" placeholder="e.g. Credit Operations Editor, Compliance Analyst" />
        </label>

        <!-- Role Selector -->
        <label class="field">
          <span>Administrative Role</span>
          <input type="hidden" id="addAdminRole" value="editor" />
          ${ctx.selectBox('addAdminRoleSel', [
            { v: 'editor', label: 'Editor (Configurable Custom Permissions)', sub: 'Can only execute permissions granted below' },
            { v: 'admin', label: 'Co-Admin (Full Unrestricted Access)', sub: 'Full operational access to all protocol features' }
          ], 'editor', v => {
            const inp = document.getElementById('addAdminRole');
            if (inp) inp.value = v;
            const btn = document.querySelector('[data-sel="addAdminRoleSel"] .sel-btn');
            const opts = [
              { v: 'editor', label: 'Editor (Configurable Custom Permissions)', sub: 'Can only execute permissions granted below' },
              { v: 'admin', label: 'Co-Admin (Full Unrestricted Access)', sub: 'Full operational access to all protocol features' }
            ];
            const opt = opts.find(o => o.v === v);
            if (btn && opt) {
              btn.querySelector('.sel-lab').textContent = opt.label;
              const sub = btn.querySelector('.sel-sub');
              if (sub) sub.textContent = opt.sub || '';
            }
            const permSection = document.getElementById('addAdminPermsSection');
            if (permSection) {
              permSection.style.display = (v === 'editor') ? 'block' : 'none';
            }
          })}
        </label>

        <!-- Granular Permissions Checklist for Editors -->
        <div id="addAdminPermsSection" style="background:#FAFAF8;border:1px solid var(--line);border-radius:var(--r);padding:14px">
          <div style="font-weight:600;font-size:13px;margin-bottom:4px">Assign Editor Permissions:</div>
          <div class="faint" style="font-size:11.5px;margin-bottom:12px">Check the specific operational tasks this editor is authorized to perform:</div>

          <div class="stack gap8">
            ${ADMIN_PERMISSIONS.map(p => {
              const permIconMap = {
                approve_mint_requests: 'coins',
                approve_originators: 'users',
                approve_capital_partners: 'bank',
                request_notes: 'fileText',
                manage_guides: 'book',
                manage_wallets: 'wallet'
              };
              return `
              <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px 12px;background:#fff;border:1px solid var(--line-soft);border-radius:var(--r-sm);transition:all .15s ease">
                <input type="checkbox" name="adminPerms" value="${p.key}" style="margin-top:3px;accent-color:#141413" checked />
                <div style="display:flex;align-items:flex-start;gap:8px;width:100%">
                  <div style="color:var(--muted);flex-shrink:0;margin-top:2px">${ic(permIconMap[p.key] || 'check', 'icon-sm')}</div>
                  <div style="flex:1">
                    <div style="font-weight:600;font-size:13px;color:var(--ink)">${esc(p.label)}</div>
                    <div class="faint" style="font-size:11.5px;margin-top:1px">${esc(p.desc)}</div>
                  </div>
                </div>
              </label>
            `;}).join('')}
          </div>
        </div>
      </div>

      <div class="modal-foot">
        <button class="btn btn-ghost" data-act="close">Cancel</button>
        <button class="btn btn-primary" data-act="admin-create-user-submit" style="gap:6px">
          ${ic('check', 'icon-sm')} Create Account
        </button>
      </div>
    </div>
  `;

  ctx.openModal(modalHtml);
}

/* ============================================================
   View 3: Edit Editor Permissions Modal
   ============================================================ */

export function openEditPermissionsModal(adminId, S, ctx) {
  const admins = getAdminAccounts();
  const acc = admins.find(a => a.id === adminId);
  if (!acc) return;

  const currentPerms = Array.isArray(acc.permissions) ? acc.permissions : [];

  const modalHtml = `
    <div class="modal" style="max-width:580px">
      <div class="modal-head">
        <div>
          <h2>${ic('shield', 'icon-sm')} Edit Editor Permissions</h2>
          <p>Modify granted permissions for <b>${esc(acc.firstName)} ${esc(acc.lastName)}</b> (${esc(acc.email)}).</p>
        </div>
        <button class="btn btn-quiet btn-sm" data-act="close">${ic('x', 'icon-sm')}</button>
      </div>

      <div class="modal-body" style="gap:16px;max-height:80vh;overflow-y:auto">
        <div style="background:#FAFAF8;border:1px solid var(--line);border-radius:var(--r);padding:12px 14px">
          <div style="font-weight:600;font-size:13px">${esc(acc.firstName)} ${esc(acc.lastName)}</div>
          <div class="faint mono" style="font-size:12px">${esc(acc.title || 'Editor')} · ${esc(acc.email)}</div>
        </div>

        <div style="font-weight:600;font-size:13px">Operational Permissions:</div>
        <div class="stack gap8">
          ${ADMIN_PERMISSIONS.map(p => {
            const isChecked = currentPerms.includes(p.key);
            const permIconMap = {
              approve_mint_requests: 'coins',
              approve_originators: 'users',
              approve_capital_partners: 'bank',
              request_notes: 'fileText',
              manage_guides: 'book',
              manage_wallets: 'wallet'
            };
            return `
              <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px 12px;background:#fff;border:1px solid ${isChecked ? 'var(--ink)' : 'var(--line)'};border-radius:var(--r-sm);transition:all .15s ease">
                <input type="checkbox" name="editAdminPerms" value="${p.key}" style="margin-top:3px;accent-color:#141413" ${isChecked ? 'checked' : ''} />
                <div style="display:flex;align-items:flex-start;gap:8px;width:100%">
                  <div style="color:${isChecked ? 'var(--ink)' : 'var(--muted)'};flex-shrink:0;margin-top:2px">${ic(permIconMap[p.key] || 'check', 'icon-sm')}</div>
                  <div style="flex:1">
                    <div style="font-weight:600;font-size:13px;color:var(--ink)">${esc(p.label)}</div>
                    <div class="faint" style="font-size:11.5px;margin-top:1px">${esc(p.desc)}</div>
                  </div>
                </div>
              </label>
            `;
          }).join('')}
        </div>
      </div>

      <div class="modal-foot">
        <button class="btn btn-ghost" data-act="close">Cancel</button>
        <button class="btn btn-primary" data-act="admin-save-perms-submit" data-id="${acc.id}" style="gap:6px">
          ${ic('check', 'icon-sm')} Save Permissions
        </button>
      </div>
    </div>
  `;

  ctx.openModal(modalHtml);
}
