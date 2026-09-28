import { ic, spinner, hash, uid, dstr, dshort, ago, inDays, nf, nav, pct, short, esc, TODAY } from './helpers.js';
import { HEDERA_LOGO, HEDERA_MARK } from './assets.js';
import { mintStatusBadge, pipelineStepper } from './capitalFlow.js';

function getDocMetadata(doc) {
  if (doc.metadata) return doc.metadata;
  const m = {};
  if (doc.facilityId) m['Backing Facility ID'] = doc.facilityId;
  if (doc.signer) m['Authorized Signer'] = doc.signer;
  return m;
}

export function renderDocChip(doc, opts = {}) {
  if (!doc) return '';
  const docStr = encodeURIComponent(JSON.stringify(doc));
  return `
    <div class="doc-chip" style="${opts.style || ''}">
      <div class="d-info">
        <div style="width:34px;height:34px;border-radius:6px;background:#F8FAFC;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--ink)">
          ${ic('fileText', 'icon-sm')}
        </div>
        <div style="min-width:0;flex:1">
          <div class="d-name" title="${esc(doc.name)}">${esc(doc.name)}</div>
          <div class="d-size">${esc(doc.size || '1.8 MB')} · ${doc.signer ? 'Signed by ' + esc(doc.signer) : 'SHA-256: ' + short(doc.hash || '0x000...')}</div>
        </div>
      </div>
      <div class="d-actions row gap6" style="align-items:center;flex-shrink:0">
        <button class="doc-eye-btn" data-act="preview-doc" data-doc="${docStr}" title="Preview file metadata and status" aria-label="Preview Document">
          ${ic('eye', 'icon-xs')} <span>Preview</span>
        </button>
        ${opts.showDownload ? `<button class="btn btn-ghost btn-xs" data-act="download-doc" data-name="${esc(doc.name)}" title="Download Document">${ic('download', 'icon-xs')}</button>` : ''}
        ${opts.badge ? `<span class="badge ${opts.badgeClass || 'b-green'}" style="white-space:nowrap;flex-shrink:0">${opts.badge}</span>` : ''}
      </div>
    </div>
  `;
}

export function openDocumentPreviewModal(doc, S, ctx) {
  if (!doc) return;
  const hashVal = doc.hash || hash();
  const uploadDate = doc.uploadedAt ? (doc.uploadedAt instanceof Date ? doc.uploadedAt : new Date(doc.uploadedAt)) : new Date();

  const body = `
    <div style="margin-bottom:16px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:var(--r-lg);padding:16px;box-sizing:border-box">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap">
        <div style="display:flex;align-items:flex-start;gap:12px;min-width:0;flex:1 1 240px">
          <div style="width:40px;height:40px;border-radius:8px;background:#fff;border:1px solid var(--line);box-shadow:var(--shadow-xs);display:flex;align-items:center;justify-content:center;color:#0F172A;flex-shrink:0;margin-top:2px">
            ${ic('fileText', 'icon-md')}
          </div>
          <div style="min-width:0;flex:1">
            <div style="font-size:14px;font-weight:600;color:var(--ink);word-break:break-word;line-height:1.35">${esc(doc.name)}</div>
            <div class="faint" style="font-size:12px;margin-top:2px">${doc.docType || 'Legal Agreement & Note Document'} · ${doc.size || '1.8 MB'}</div>
          </div>
        </div>
        <div style="flex-shrink:0;align-self:flex-start">
          <span class="badge b-green" style="white-space:nowrap;font-size:11.5px;padding:3px 9px">
            ${ic('check', 'icon-xs')} ${doc.status || 'Verified & Ready'}
          </span>
        </div>
      </div>

      <div class="grid grid-2 gap8 faint" style="font-size:12px;border-top:1px solid #E2E8F0;padding-top:12px">
        <div>• Checksum: <b class="mono" style="color:var(--ok)">SHA-256 Validated</b></div>
        <div>• Security: <b style="color:var(--ink)">AES-256-GCM Encrypted</b></div>
        <div>• Ledger State: <b style="color:var(--ink)">Hedera File Service (HFS)</b></div>
        <div>• Digital Seal: <b style="color:var(--ink)">Secured by SPV Custodian</b></div>
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--muted);letter-spacing:0.04em;margin-bottom:8px">
        File Metadata &amp; Status
      </div>
      <div class="kv"><span class="k">File Name</span><span class="v mono" style="font-size:12.5px">${esc(doc.name)}</span></div>
      <div class="kv"><span class="k">File Size</span><span class="v mono">${doc.size || '1.8 MB'}</span></div>
      <div class="kv"><span class="k">Upload Date</span><span class="v">${dstr(uploadDate)} · <span class="faint mono">${ago(uploadDate)}</span></span></div>
      ${Object.entries(getDocMetadata(doc)).map(([k, v]) => `
        <div class="kv"><span class="k">${esc(k)}</span><span class="v ${k.toLowerCase().includes('id') || k.toLowerCase().includes('ref') ? 'mono' : ''}">${esc(v)}</span></div>
      `).join('')}
      <div class="kv"><span class="k">Cryptographic Hash</span><span class="v mono" data-copy="${hashVal}" style="cursor:pointer" title="Click to copy">${short(hashVal)} ${ic('copy','icon-xs')}</span></div>
      <div class="kv kv-total"><span class="k" style="color:var(--ink);font-weight:500">Verification Status</span><span class="v badge b-green" style="font-size:11.5px">${ic('check','icon-xs')} ${doc.status || 'Verified & Compliant'}</span></div>
    </div>

    <div class="card card-pad" style="background:#FFFFFF;border:1px solid var(--line);box-shadow:var(--shadow-xs)">
      <div class="between" style="border-bottom:1px dashed var(--line);padding-bottom:10px;margin-bottom:12px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted)">Document Inspection Preview</div>
        <div class="mono faint" style="font-size:11px">Hedera File ID: 0.0.491204</div>
      </div>
      <div style="font-family:Georgia, serif;font-size:12.5px;line-height:1.6;color:#334155;background:#FAFAFA;padding:14px;border-radius:var(--r);border:1px solid #F1F5F9">
        <div style="text-align:center;font-weight:bold;font-size:13px;margin-bottom:6px;color:#0F172A;text-transform:uppercase;letter-spacing:0.03em">
          ${doc.docType || 'Institutional Promissory Note & Facility Assignment'}
        </div>
        <div style="text-align:center;font-size:11px;color:#64748B;margin-bottom:12px;font-family:sans-serif">
          Ref: ${doc.facilityId || 'FAC-2026'} · Protocol Checksum: ${short(hashVal)}
        </div>
        <p style="margin:0 0 8px">
          This digital document constitutes a binding, non-revocable legal instrument certified on the KBridge Protocol. The underlying token burn/mint and payment obligations are secured under Delaware SPV jurisdiction.
        </p>
        <div class="between" style="font-family:sans-serif;font-size:11px;margin-top:12px;padding-top:8px;border-top:1px solid #E2E8F0;color:#64748B">
          <div>Signer: <b>${esc(doc.signer || 'Authorized Officer')}</b></div>
          <div>Status: <span style="color:var(--ok);font-weight:600">Digitally Executed</span></div>
        </div>
      </div>
    </div>
  `;

  const foot = `
    <button class="btn btn-ghost" data-act="download-doc" data-name="${esc(doc.name)}">
      ${ic('download', 'icon-sm')} Download Document
    </button>
    <button class="btn btn-primary" data-act="close">Close</button>
  `;

  ctx.openModal(ctx.modalShell('Document Preview &amp; Metadata', 'Cryptographic verification and status audit', 'fileText', body, foot));
}

export function openRequestNotesModal(reqId, S, ctx) {
  const r = S.mintRequests.find(x => x.id === reqId);
  if (!r) return;
  const p = ctx.PL(r.pf);

  const body = `
    <div style="margin-bottom:16px">
      ${pipelineStepper(r.status)}
    </div>

    <div class="panel">
      <div class="between">
        <div>
          <div class="micro">Capital Mint Request</div>
          <div class="mono" style="font-size:15px;font-weight:600;margin-top:2px">${r.id}</div>
          <div class="faint" style="font-size:11.5px">${esc(r.holder)} · ${ago(r.created)}</div>
        </div>
        <div class="t-right">
          <div class="micro">Capital Allocation</div>
          <div class="mono" style="font-size:16px;font-weight:600;margin-top:2px">${nf(r.amt, 2)} USDC</div>
          <div class="faint mono" style="font-size:11px">Target: ${nf(r.tokens, 2)} ${p ? p.symbol : 'TOKENS'}</div>
        </div>
      </div>
    </div>

    <label class="field">
      <span>Contract / Note Type Required</span>
      <input class="input" id="reqNoteType" value="Senior Secured Promissory Note &amp; Invoice Purchase Agreement" />
    </label>

    <label class="field">
      <span>Backing Invoice / Receivables Facility</span>
      <select class="input" id="reqFacility">
        <option value="INV-2026-8921">INV-2026-8921 — Acme Nuts &amp; Bolts Manufacturing ($100,000)</option>
        <option value="INV-2026-9004">INV-2026-9004 — Vertex Robotics Inc. ($180,000)</option>
        <option value="INV-2026-8922">INV-2026-8922 — Global Timber Exports Ltd. ($250,000)</option>
        <option value="INV-2026-9011">INV-2026-9011 — Nexus Healthcare Inc. ($320,000)</option>
      </select>
    </label>

    <label class="field">
      <span>Instructions to Originating Partner</span>
      <textarea class="input" id="reqInstructions" rows="3" style="resize:vertical;font-size:13px">Please produce and sign the formal Promissory Note and Invoice Assignment Contract for ${nf(r.amt, 2)} USDC allocation. Upon upload, KBridge will verify the documents and execute the Hedera mint and transfer.</textarea>
    </label>

    <div class="callout c-neutral">
      ${ic('info', 'icon-sm')}
      <div>
        Filing this formal request notifies the Originating Partner to generate and upload the necessary legal contracts.
      </div>
    </div>
  `;

  const foot = `
    <button class="btn btn-ghost" data-act="close">Cancel</button>
    <button class="btn btn-primary" id="btnSendNoteReq">
      ${ic('send', 'icon-sm')} Send Request to Originating Partner
    </button>
  `;

  ctx.openModal(ctx.modalShell('File Note Request', 'Step 2: Dispatch formal note request to Originator', 'fileText', body, foot));

  const btn = document.getElementById('btnSendNoteReq');
  if (btn) {
    btn.addEventListener('click', () => {
      const noteType = document.getElementById('reqNoteType').value;
      const facility = document.getElementById('reqFacility').value;
      const inst = document.getElementById('reqInstructions').value;

      r.status = 'Notes Requested';
      r.notesRequestedAt = new Date();
      r.noteType = noteType;
      r.instructions = inst;

      ctx.closeModal();
      ctx.render();
      ctx.toast.success(
        'Note request sent to Originating Partner',
        `Request ${r.id} is now awaiting contract upload.`,
        'send'
      );
    });
  }
}

export function openUploadNotesModal(reqId, S, ctx) {
  const r = S.mintRequests.find(x => x.id === reqId);
  if (!r) return;
  const p = ctx.PL(r.pf);

  let stagedDoc = {
    name: `Promissory_Note_${r.id}_${(p?p.symbol:'TOKENS')}_Signed.pdf`,
    size: '2.8 MB',
    uploadedAt: new Date(),
    hash: hash(),
    signer: 'Pursuit Treasury & Legal Counsel',
    facilityId: 'INV-2026-8921',
    metadataRaw: `Backing Facility ID: INV-2026-8921\nAuthorized Signer: Pursuit Treasury & Legal Counsel\nJurisdiction: Delaware SPV\nRecourse: Full Recourse Senior Note`
  };

  const body = `
    <div style="margin-bottom:16px">
      ${pipelineStepper(r.status)}
    </div>

    <div class="panel">
      <div class="between">
        <div>
          <div class="micro">Capital Request</div>
          <div class="mono" style="font-size:15px;font-weight:600;margin-top:2px">${r.id}</div>
          <div class="faint" style="font-size:11.5px">${esc(r.holder)} · ${ago(r.created)}</div>
        </div>
        <div class="t-right">
          <div class="micro">Capital Amount</div>
          <div class="mono" style="font-size:16px;font-weight:600;margin-top:2px">${nf(r.amt, 2)} USDC</div>
          <div class="faint mono" style="font-size:11px">Tokens: ${nf(r.tokens, 2)} ${p ? p.symbol : 'TOKENS'}</div>
        </div>
      </div>
    </div>

    <div class="callout c-neutral" style="margin-bottom:16px">
      ${ic('info', 'icon-sm')}
      <div>
        <b>Automatic Capital Notification:</b> Capital Partner has allocated ${nf(r.amt, 2)} USDC. Please upload the signed contract notes backing this facility. Upon submission, KBridge Admin will inspect and review before executing Hedera token minting.
      </div>
    </div>

    <label class="field">
      <span>Contract &amp; Promissory Note Upload</span>
      <div class="dropzone" id="contractDropzone">
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
          <div style="width:40px;height:40px;border-radius:999px;background:#fff;border:1px solid var(--line);display:flex;align-items:center;justify-content:center">
            ${ic('upload', 'icon-sm')}
          </div>
          <div style="font-weight:600;font-size:13.5px">Click or drag &amp; drop signed PDF contract notes</div>
          <div class="faint" style="font-size:12px">Supports PDF, DOCX up to 25MB (Digital signatures supported)</div>
        </div>
        <input type="file" id="filePicker" accept=".pdf,.doc,.docx" style="display:none" />
      </div>
    </label>

    <div id="docPreviewArea" style="margin-bottom:16px">
      ${renderDocChip(stagedDoc, { badge: `${ic('check', 'icon-xs')} Ready`, badgeClass: 'b-green' })}
    </div>

    <div class="field">
      <span>Originating Partner Metadata</span>
      <textarea class="input mono" id="upMetadata" rows="5" style="resize:vertical;font-size:12.5px;line-height:1.45;font-family:monospace;white-space:pre">${esc(stagedDoc.metadataRaw)}</textarea>
      <div class="faint" style="font-size:11.5px;margin-top:4px">
        Include custom metadata for the originating partner. Format as one "Key: Value" pair per line.
      </div>
    </div>
  `;

  const foot = `
    <button class="btn btn-ghost" data-act="close">Cancel</button>
    <button class="btn btn-primary" id="btnSubmitOriginatorNotes">
      ${ic('upload', 'icon-sm')} Submit Documents to KBridge
    </button>
  `;

  ctx.openModal(ctx.modalShell('Submit Backing Contract Notes', 'Step 2: Provide compliant legal notes for KBridge Admin inspection', 'upload', body, foot));

  const dz = document.getElementById('contractDropzone');
  const fp = document.getElementById('filePicker');
  if (dz && fp) {
    dz.addEventListener('click', () => fp.click());
    fp.addEventListener('change', e => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        stagedDoc.name = file.name;
        stagedDoc.size = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        stagedDoc.hash = hash();
        document.getElementById('docNameDisplay').textContent = stagedDoc.name;
        document.getElementById('docMetaDisplay').textContent = `${stagedDoc.size} · SHA-256: ${short(stagedDoc.hash)}`;
        ctx.toast.info('File attached', file.name, 'fileText');
      }
    });
  }

  const btn = document.getElementById('btnSubmitOriginatorNotes');
  if (btn) {
    btn.addEventListener('click', () => {
      const rawMeta = document.getElementById('upMetadata').value;
      stagedDoc.metadataRaw = rawMeta;

      const meta = {};
      const lines = rawMeta.split('\n');
      for (const line of lines) {
        const idx = line.indexOf(':');
        if (idx !== -1) {
          const k = line.substring(0, idx).trim();
          const v = line.substring(idx + 1).trim();
          if (k) meta[k] = v;
        }
      }
      stagedDoc.metadata = meta;

      // Extract facilityId and signer for legacy display compatibility
      let foundSigner = '';
      let foundFacility = '';
      for (const k of Object.keys(meta)) {
        const kl = k.toLowerCase();
        if (kl.includes('signer') || kl.includes('author')) {
          foundSigner = meta[k];
        }
        if (kl.includes('facility') || kl.includes('backing') || kl.includes('invoice') || kl.includes('ref')) {
          foundFacility = meta[k];
        }
      }

      stagedDoc.facilityId = foundFacility || 'INV-2026-8921';
      stagedDoc.signer = foundSigner || 'Pursuit Treasury & Legal Counsel';
      stagedDoc.uploadedAt = new Date();

      r.documents = [stagedDoc];
      r.status = 'Documents Uploaded';

      ctx.closeModal();
      ctx.render();
      ctx.toast.success(
        'Documents submitted to KBridge',
        `KBridge Admins will now inspect documents and trigger Hedera minting.`,
        'check'
      );
    });
  }
}

export function openInspectAndMintModal(reqId, S, ctx) {
  const r = S.mintRequests.find(x => x.id === reqId);
  if (!r) return;
  const p = ctx.PL(r.pf);
  const doc = r.documents[0] || {
    name: 'Promissory_Note_TOKENS.pdf',
    size: '2.5 MB',
    hash: hash(),
    signer: 'Originating Partner Legal Officer',
    facilityId: 'INV-2026-8921',
    uploadedAt: new Date()
  };

  const capWallet = ctx.wal(ctx.fundWallets('theoriq')[0]?.id) || { address: r.payFrom, usdc: 100000, label: 'Capital Partner Treasury' };
  const origWallet = ctx.wal(ctx.fundWallets('pursuit')[0]?.id) || { address: r.destWallet, usdc: 0, label: 'Originator Partner Funding Wallet' };
  const tokenCustody = ctx.tokenWallet() || { address: r.tokenCustody, bal: { pursuit: 0 } };

  const body = `
    <div style="margin-bottom:16px">
      ${pipelineStepper(r.status)}
    </div>

    <div class="card card-pad" style="background:#F8FAFC;border:1px solid #E2E8F0;margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;flex-wrap:wrap">
        <div style="font-weight:600;font-size:13.5px;color:#0F172A;display:flex;align-items:center;gap:6px">
          ${ic('shield', 'icon-sm')} Document Verification &amp; Compliance Audit
        </div>
        <span class="badge b-green" style="white-space:nowrap;flex-shrink:0">${ic('check', 'icon-xs')} Verified &amp; Ready</span>
      </div>

      <div style="margin-bottom:12px">
        ${renderDocChip(doc, { badge: `${ic('check', 'icon-xs')} Verified &amp; Ready`, badgeClass: 'b-green' })}
      </div>

      <div class="grid grid-2 gap8 faint" style="font-size:12px;border-top:1px solid #E2E8F0;padding-top:10px">
        ${Object.entries(getDocMetadata(doc)).map(([k, v]) => `
          <div>• ${esc(k)}: <b style="color:var(--ink)">${esc(v)}</b></div>
        `).join('')}
        ${!doc.metadata ? `
          <div>• Jurisdiction: <b style="color:var(--ink)">Delaware SPV</b></div>
          <div>• Recourse: <b style="color:var(--ink)">Full Recourse Senior Note</b></div>
        ` : ''}
        <div>• Verification: <b style="color:var(--ok)">SHA-256 Checksum Match</b></div>
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--muted);letter-spacing:0.04em;margin-bottom:8px">
        Hedera Settlement Execution Plan
      </div>
      <div class="kv">
        <span class="k">1. Debit Capital Partner (Theoriq)</span>
        <span class="v mono" style="color:var(--err)">-${nf(r.amt, 2)} USDC</span>
      </div>
      <div class="kv">
        <span class="k">2. Credit Originating Partner (Pursuit)</span>
        <span class="v mono" style="color:var(--ok)">+${nf(r.amt, 2)} USDC</span>
      </div>
      <div class="kv">
        <span class="k">3. Mint Tokens on Hedera Smart Contract</span>
        <span class="v mono">+${nf(r.tokens, 2)} ${p ? p.symbol : 'TOKENS'}</span>
      </div>
      <div class="kv kv-total">
        <span class="k" style="color:var(--ink);font-weight:500">4. Deliver Tokens into Theoriq Custody</span>
        <span class="v mono" style="font-size:15px">${short(tokenCustody.address)}</span>
      </div>
    </div>

    <div class="callout c-neutral">
      ${ic('lock', 'icon-sm')}
      <div>
        Clicking <b>Mint &amp; Transfer Funds</b> executes the atomic transaction: transferring ${nf(r.amt, 2)} USDC to Pursuit's wallet and minting ${nf(r.tokens, 2)} ${p ? p.symbol : 'TOKENS'} tokens to Theoriq.
      </div>
    </div>
  `;

  const foot = `
    <button class="btn btn-ghost" data-act="close">Cancel</button>
    <button class="btn btn-primary" id="btnExecuteHederaMint">
      ${ic('coins', 'icon-sm')} Mint Tokens &amp; Transfer Funds on Hedera
    </button>
  `;

  ctx.openModal(ctx.modalShell('Inspect Documents &amp; Mint', 'Step 3: Document inspection, compliance review &amp; Hedera minting', 'shield', body, foot));

  const btn = document.getElementById('btnExecuteHederaMint');
  if (btn) {
    btn.addEventListener('click', () => {
      const tx = hash();
      const steps = [
        { label: 'Auditing document signature & legal hash', meta: 'SHA-256 match confirmed', ms: 900 },
        { 
          label: `Transferring ${nf(r.amt, 2)} USDC from Theoriq to Pursuit`,
          meta: `${short(capWallet.address)} → ${short(origWallet.address)}`,
          ms: 1100,
          fx: () => {
            if (capWallet.usdc !== undefined) capWallet.usdc = Math.max(0, capWallet.usdc - r.amt);
            if (origWallet.usdc !== undefined) origWallet.usdc += r.amt;
          }
        },
        { 
          label: `Minting ${nf(r.tokens, 2)} ${p ? p.symbol : 'TOKENS'} on Hedera`,
          meta: `Hedera Token Service (HTS) 0.0.491204`,
          ms: 1200,
          fx: () => {
            if (p) p.outstanding += r.tokens;
            if (tokenCustody.bal && p) {
              tokenCustody.bal[p.key] = (tokenCustody.bal[p.key] || 0) + r.tokens;
            }
            r.status = 'Completed';
            r.mintedAt = new Date();
            r.tx = tx;

            S.positions.unshift({
              pf: p.key,
              type: 'mint',
              at: new Date(),
              tokens: r.tokens,
              nav: r.navAt,
              usdc: r.amt,
              tx
            });

            S.feed.unshift({
              ic: 'coins',
              tone: 'neutral',
              text: `Capital Partner minted ${nf(r.tokens, 2)} ${p.symbol} backed by Note ${r.id}.`,
              at: new Date()
            });
          }
        }
      ];

      ctx.openModal(ctx.modalShell('Executing Hedera Settlement', `${nf(r.amt, 2)} USDC → ${nf(r.tokens, 2)} ${p.symbol}`, 'refresh', '<div class="steps"></div>', ''));
      ctx.execSteps(steps, () => {
        ctx.openModal(ctx.modalShell('Settlement Completed', 'Tokens minted & funds transferred on Hedera', 'check',
          ctx.successBlock(`Capital Request ${r.id} Completed`, [
            ['Platform', p ? p.name : 'Pursuit'],
            ['Tokens Minted', `${nf(r.tokens, 2)} ${p ? p.symbol : 'TOKENS'}`],
            ['USDC Transferred', `${nf(r.amt, 2)} USDC`],
            ['Recipient Wallet', origWallet.label || 'Pursuit Originator Wallet'],
            ['Token Custody', tokenCustody.label || 'Theoriq Custody']
          ], tx),
          `<button class="btn btn-primary" data-act="close">Done</button>`
        ));
        ctx.toast.success(
          `Minted ${nf(r.tokens, 2)} ${p.symbol}`,
          `${nf(r.amt, 2)} USDC transferred to Originating Partner`,
          'coins'
        );
      });
    });
  }
}

export function openRequestDetailsModal(reqId, S, ctx) {
  const r = S.mintRequests.find(x => x.id === reqId);
  if (!r) return;
  const p = ctx.PL(r.pf);

  const doc = r.documents[0];

  const body = `
    <div style="margin-bottom:16px">
      ${pipelineStepper(r.status)}
    </div>

    <div class="panel">
      <div class="between">
        <div>
          <div class="micro">Request ID</div>
          <div class="mono" style="font-size:15px;font-weight:600;margin-top:2px">${r.id}</div>
          <div class="faint" style="font-size:11.5px">${esc(r.holder)} · Created ${dstr(r.created)}</div>
        </div>
        <div class="t-right">
          <div class="micro">Status</div>
          <div style="margin-top:4px">${mintStatusBadge(r.status)}</div>
        </div>
      </div>
    </div>

    <div class="panel" style="margin-top:12px">
      <div class="kv"><span class="k">Platform</span><span class="v">${p ? p.name : 'Receivables'}</span></div>
      <div class="kv"><span class="k">Capital Amount</span><span class="v mono">${nf(r.amt, 2)} USDC</span></div>
      <div class="kv"><span class="k">Tokens Minted</span><span class="v mono">${nf(r.tokens, 2)} ${p ? p.symbol : 'TOKENS'}</span></div>
      <div class="kv"><span class="k">Token NAV at Mint</span><span class="v mono">${nav(r.navAt)}</span></div>
      <div class="kv"><span class="k">Funding Wallet</span><span class="v mono">${short(r.payFrom)}</span></div>
      <div class="kv"><span class="k">Originator Wallet</span><span class="v mono">${short(r.destWallet)}</span></div>
      ${r.tx ? `<div class="kv"><span class="k">Hedera Tx Hash</span><span class="v mono" data-copy="${r.tx}" style="cursor:pointer">${short(r.tx)} ${ic('copy','icon-xs')}</span></div>` : ''}
    </div>

    ${doc ? `
      <div style="margin-top:16px">
        <div class="micro" style="margin-bottom:6px">Attached Notes &amp; Contracts</div>
        ${renderDocChip(doc, { showDownload: true })}
      </div>
    ` : `
      <div class="callout c-neutral" style="margin-top:16px">
        ${ic('clock', 'icon-sm')}
        <div>Originating partner automatically notified; awaiting contract document submission.</div>
      </div>
    `}
  `;

  ctx.openModal(ctx.modalShell(`Request ${r.id}`, 'Capital Mint & Note Tracking', 'file', body, `<button class="btn btn-primary" data-act="close">Close</button>`));
}
