const SPECIAL_SCHEMES = ['chrome:', 'chrome-extension:', 'edge:', 'about:', 'data:'];

function getHostname(url) {
  try {
    const { protocol, hostname } = new URL(url);
    if (SPECIAL_SCHEMES.some(s => protocol === s)) return null;
    return hostname.toLowerCase();
  } catch {
    return null;
  }
}

async function sortTabs(windowId) {
  const tabs = await chrome.tabs.query({ windowId });
  const pinned = tabs.filter(t => t.pinned);
  const sortable = tabs.filter(t => !t.pinned);

  sortable.sort((a, b) => {
    const ha = getHostname(a.url);
    const hb = getHostname(b.url);
    if (ha === null && hb === null) return 0;
    if (ha === null) return 1;
    if (hb === null) return -1;
    return ha.localeCompare(hb);
  });

  const start = pinned.length;
  for (let i = 0; i < sortable.length; i++) {
    await chrome.tabs.move(sortable[i].id, { index: start + i });
  }

  return sortable.length;
}

async function showBadge(tabId, text, color) {
  await chrome.action.setBadgeBackgroundColor({ color });
  await chrome.action.setBadgeText({ text, tabId });
  setTimeout(() => chrome.action.setBadgeText({ text: '', tabId }), 2000);
}

chrome.action.onClicked.addListener(async (tab) => {
  try {
    const count = await sortTabs(tab.windowId);
    await showBadge(tab.id, '✓', '#16a34a');
  } catch (err) {
    console.error('TabTidy error:', err);
    await showBadge(tab.id, '!', '#dc2626');
  }
});
