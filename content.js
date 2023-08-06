const initialScrollPosition = window.scrollY;
let lastScrollPosition = initialScrollPosition;

const websiteDomain = window.location.hostname;

const updateScrollDistance = () => {
	const scrollPosition = window.scrollY;
	const distance = Math.abs(scrollPosition - lastScrollPosition);
	lastScrollPosition = scrollPosition;
	saveDistance(websiteDomain, distance);
};

window.addEventListener('scroll', updateScrollDistance);

/**
 * Debounce saving scroll distance to local storage
 */
const saveDistance = (() => {
	const timeout = 1000;
	let saveTimeout = null;
	let scrolledDistance = 0;
	return function (domain, distance) {
		if (isContextInvalidated()) return;
		clearTimeout(saveTimeout);
		scrolledDistance += distance;

		saveTimeout = setTimeout(() => {
			chrome.storage.local.get(
				['totalDistance', 'scrollStats'],
				({ totalDistance, scrollStats }) => {
					console.log(scrollStats);
					totalDistance = totalDistance || 0;
					scrollStats = scrollStats || {};
					const stats = scrollStats[domain] || {
						distance: 0,
					};
					scrollStats[domain] = stats;
					chrome.storage.local.set({
						totalDistance: totalDistance + scrolledDistance,

						scrollStats: {
							...scrollStats,
							[domain]: {
								distance: scrollStats[domain].distance + scrolledDistance,
							},
						},
					});
					scrolledDistance = 0;
				}
			);
		}, timeout);
	};
})();

const isContextInvalidated = () => !chrome.runtime?.id;
