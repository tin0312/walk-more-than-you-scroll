const initialScrollPosition = window.scrollY;

const site = window.location.hostname;
console.log(site);

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

/**
 * Debounce saving scroll distance to local storage
 */
const saveDistance = (() => {
	let saveTimeout = null;
	return function (distance) {
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			if (!isValidContext()) return;
			chrome.storage.local.set({ distance });
		}, 3000);
	};
})();

const isValidContext = () => !!chrome.runtime?.id;
