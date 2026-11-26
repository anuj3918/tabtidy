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

    // Group by base domain, then subdomain, then first path segment; special-scheme tabs last
    sortable.sort(compareTabs);

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
