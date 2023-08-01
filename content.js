const initialScrollPosition = window.scrollY;

console.log('Initial scroll position: ', initialScrollPosition);

let lastScrollPosition = initialScrollPosition;
let scrollDistance = 0;

chrome.storage.local.get('distance', ({ distance }) => {
	scrollDistance = distance;
});

const updateScrollDistance = () => {
	const scrollPosition = window.scrollY;

	scrollDistance += Math.abs(scrollPosition - lastScrollPosition);
	lastScrollPosition = scrollPosition;
	saveDistance(scrollDistance);
};

window.addEventListener('scroll', updateScrollDistance);

let saveTimeout = null;

/**
 * Debounce saving scroll distance to local storage
 */
function saveDistance(distance) {
	clearTimeout(saveTimeout);
	saveTimeout = setTimeout(() => {
		console.log(distance);
		chrome.storage.local.set({ distance });
	}, saveTimeout);
}
