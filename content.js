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
  const timeout = 1000;
  let scrolledDistance = 0;

  const save = debounce(function (domain) {
    chrome.storage.local.get(['totalDistance', 'scrollStats'], ({ totalDistance, scrollStats }) => {
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
    });
  }, timeout);

  return function (domain, distance) {
    if (isContextInvalidated()) return;
    scrolledDistance += distance;
    save(domain, distance);
  };
})();

const isContextInvalidated = () => !chrome.runtime?.id;
