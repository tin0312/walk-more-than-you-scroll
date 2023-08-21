chrome.runtime.onInstalled.addListener(() => {
  // chrome.storage.local.clear();
  chrome.storage.local.get('days', ({ days }) => {
    if (!days) {
      chrome.storage.local.set({ days: {} });
    }
  });
});
