const SPECIAL_SCHEMES = ['chrome:', 'chrome-extension:', 'edge:', 'about:', 'data:'];

function getHostname(url) {
  try {
    const { protocol, hostname } = new URL(url);
    if (SPECIAL_SCHEMES.some(s => protocol.startsWith(s.replace(':', '')))) {
      return null; // sort to end
    }
    return hostname.toLowerCase();
  } catch {
    return null;
  }
}

function setStatus(msg, type = '') {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = type;
}

document.getElementById('sortBtn').addEventListener('click', async () => {
  const btn = document.getElementById('sortBtn');
  btn.disabled = true;
  setStatus('Sorting…');

  try {
    const tabs = await chrome.tabs.query({ currentWindow: true });

    // Separate pinned tabs (leave them in place) from sortable tabs
    const pinned = tabs.filter(t => t.pinned);
    const sortable = tabs.filter(t => !t.pinned);

    // Sort: http/https tabs alphabetically by hostname, then special-scheme tabs
    sortable.sort((a, b) => {
      const ha = getHostname(a.url);
      const hb = getHostname(b.url);
      if (ha === null && hb === null) return 0;
      if (ha === null) return 1;
      if (hb === null) return -1;
      return ha.localeCompare(hb);
    });

    // Move each sortable tab to its new index (after pinned tabs)
    const startIndex = pinned.length;
    for (let i = 0; i < sortable.length; i++) {
      await chrome.tabs.move(sortable[i].id, { index: startIndex + i });
    }

    setStatus(`Sorted ${sortable.length} tab${sortable.length !== 1 ? 's' : ''}.`, 'success');
  } catch (err) {
    setStatus(`Error: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
  }
});
