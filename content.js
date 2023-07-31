const initialScrollPosition = window.scrollY;

console.log('Initial scroll position: ', initialScrollPosition);

let lastScrollPosition = initialScrollPosition;
let scrollDistance = 0;

window.addEventListener('scroll', () => {
	const scrollPosition = window.scrollY;

	scrollDistance += Math.abs(scrollPosition - lastScrollPosition);
	lastScrollPosition = scrollPosition;
	chrome.storage.local.set({ distance: scrollDistance });
});
