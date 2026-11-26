// Shared by background.js (importScripts), popup.html (<script>) and test.js (require).

const SPECIAL_SCHEMES = ['chrome:', 'chrome-extension:', 'edge:', 'about:', 'data:'];

// Returns [baseDomain, subdomain, firstPathSegment] or null for special/invalid URLs.
// e.g. https://docs.google.com/document/d/123 -> ['google.com', 'docs', 'document']
function getSortKey(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (SPECIAL_SCHEMES.includes(parsed.protocol) || !parsed.hostname) return null;

  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const labels = host.split('.');
  let baseLen = 2;
  // ponytail: heuristic for two-part suffixes (co.uk, com.au, co.in); swap for the Public Suffix List if it misgroups
  const n = labels.length;
  if (n > 2 && labels[n - 1].length === 2 && labels[n - 2].length <= 3) baseLen = 3;
  if (/^\d+$/.test(labels[n - 1]) || host.includes(':')) baseLen = n; // IPv4/IPv6: no subdomains

  const base = labels.slice(-baseLen).join('.');
  const sub = labels.slice(0, -baseLen).reverse().join('.');
  const segment = parsed.pathname.split('/')[1] || '';
  return [base, sub, segment.toLowerCase()];
}

function compareTabs(a, b) {
  const ka = getSortKey(a.url);
  const kb = getSortKey(b.url);
  if (ka === null && kb === null) return 0;
  if (ka === null) return 1;
  if (kb === null) return -1;
  for (let i = 0; i < ka.length; i++) {
    const c = ka[i].localeCompare(kb[i]);
    if (c !== 0) return c;
  }
  return 0;
}

if (typeof module !== 'undefined') module.exports = { getSortKey, compareTabs };
