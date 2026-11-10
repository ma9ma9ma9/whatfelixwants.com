// whatfelixwants.com — "I'll get this" claims, stored in this Google Sheet.
// Paste this whole file into Extensions → Apps Script, then Deploy → New deployment → Web app
// (Execute as: Me, Who has access: Anyone). See setup/README.md.

const SHEET_NAME = 'Claims';

function claimsSheet_() {
  const ss = SpreadsheetApp.getActive();
  let s = ss.getSheetByName(SHEET_NAME);
  if (!s) {
    s = ss.insertSheet(SHEET_NAME);
    s.appendRow(['Wish', 'Who', 'When', 'Key (used for undo)']);
    s.setFrozenRows(1);
  }
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Stop text like "=SOMEFORMULA()" from being run as a formula in your sheet.
function clean_(v, max) {
  let s = String(v || '').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function list_(s) {
  const out = {};
  s.getDataRange().getValues().slice(1).forEach(function (r) {
    if (r[0]) out[String(r[0])] = { who: String(r[1] || 'Someone') };
  });
  return out;
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const s = claimsSheet_();
    const rows = s.getDataRange().getValues().slice(1);
    const id = clean_(p.id, 80);
    const idx = rows.findIndex(function (r) { return String(r[0]) === id; });

    if (p.action === 'claim') {
      if (!id) return json_({ ok: false, error: 'missing', claims: list_(s) });
      if (idx >= 0) return json_({ ok: false, error: 'taken', claims: list_(s) });
      s.appendRow([id, clean_(p.who, 60) || 'Someone', new Date(), clean_(p.key, 40)]);
    } else if (p.action === 'unclaim') {
      if (idx < 0 || String(rows[idx][3]) !== String(p.key || '')) {
        return json_({ ok: false, error: 'notyours', claims: list_(s) });
      }
      s.deleteRow(idx + 2);
    }
    return json_({ ok: true, claims: list_(s) });
  } finally {
    lock.releaseLock();
  }
}
