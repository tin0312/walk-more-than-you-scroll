// Initialize button with users' preferred color
const counter = document.getElementById('distance');

chrome.storage.local.get('distance', ({ distance }) => {
	counter.innerText = `Scroll distance: ${distance}px`;
});
