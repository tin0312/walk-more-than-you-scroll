chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.set({ distance: 0 });
	console.log('Extension installed');
});
