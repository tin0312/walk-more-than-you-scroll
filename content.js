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
  const distanceMeter = pixelToMeter(distance).toFixed(2);
  liveCounter.innerHTML = `${distanceMeter}m `;
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
