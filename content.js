/* global pixelToMeter, debounce */
const liveCounter = document.createElement('div');
liveCounter.classList.add('scroll-counter');

document.body.appendChild(liveCounter);

const websiteDomain = window.location.hostname;

const initialScrollPosition = window.scrollY;
let lastScrollPosition = initialScrollPosition;
let scrollDistance = 0;

chrome.storage.local.get('scrollStats', ({ scrollStats }) => {
  if (!scrollStats) return;
  scrollDistance = scrollStats[websiteDomain]?.distance || 0;
  updateLiveCounter(scrollDistance);
});

const updateScrollDistance = () => {
  const scrollPosition = window.scrollY;
  const distance = Math.abs(scrollPosition - lastScrollPosition);
  lastScrollPosition = scrollPosition;
  saveDistance(websiteDomain, distance);

  scrollDistance += distance;
  updateLiveCounter(scrollDistance);
};

const updateLiveCounter = (distance) => {
  const distanceMeter = pixelToMeter(distance);
  liveCounter.innerHTML = `${distanceMeter}m`;
};

window.addEventListener('scroll', updateScrollDistance);

/**
 * Debounce saving scroll distance to local storage
 */
const saveDistance = (() => {
  const DEBOUNCE_TIMEOUT = 1000;
  let scrollDistance = 0;

  const save = debounce(function (domain) {
    chrome.storage.local.get(['totalDistance', 'scrollStats'], ({ totalDistance, scrollStats }) => {
      totalDistance = totalDistance || 0;
      scrollStats = scrollStats || {};
      const stats = scrollStats[domain] || {
        distance: 0,
      };
      scrollStats[domain] = stats;
      chrome.storage.local.set({
        totalDistance: totalDistance + scrollDistance,

        scrollStats: {
          ...scrollStats,
          [domain]: {
            distance: scrollStats[domain].distance + scrollDistance,
          },
        },
      });
      scrollDistance = 0;
    });
  }, DEBOUNCE_TIMEOUT);

  return function (domain, distance) {
    // chrome storage is unavailable if the content is invalidated
    if (isContextInvalidated()) return;
    scrollDistance += distance;
    save(domain, distance);
  };
})();

// if the extension is reloaded, the context is invalidated and the page needs to be reloaded
const isContextInvalidated = () => !chrome.runtime?.id;
