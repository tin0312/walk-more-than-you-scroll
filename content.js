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

/**
 * Debounce saving scroll distance to local storage
 */
const saveDistance = (() => {
	let saveTimeout = null;
	return function (distance) {
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			console.log(distance);
			chrome.storage.local.set({ distance });
		}, 3000);
	};
})();
