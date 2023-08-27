/* global pixelToMeter, debounce, stats */

const liveCounter = document.createElement('div');
liveCounter.classList.add('scroll-counter');

document.body.appendChild(liveCounter);

const websiteDomain = window.location.hostname;

const initialScrollPosition = window.scrollY;
let lastScrollPosition = initialScrollPosition;
let scrollDistance = 0;

stats.getDomainDistance(websiteDomain).then((distance) => {
  scrollDistance = distance;
  updateLiveCounter(scrollDistance);
});
// Function to update scroll distance and live counter
const updateScrollDistance = () => {
  const scrollPosition = window.scrollY;
  const distance = Math.abs(scrollPosition - lastScrollPosition);
  lastScrollPosition = scrollPosition;
  saveDistance(websiteDomain, distance);

  scrollDistance += distance;
  updateLiveCounter(scrollDistance);
};

// Convert & display distance
const updateLiveCounter = (distance) => {
  const distanceMeter = pixelToMeter(distance);
  liveCounter.innerHTML = `${distanceMeter}m `;
};

window.addEventListener('scroll', updateScrollDistance);

function pauseTracking() {
  liveCounter.textContent += '(Paused)';
  window.removeEventListener('scroll', updateScrollDistance);
}
function resumeTracking() {
  const distanceMeter = pixelToMeter(scrollDistance);
  liveCounter.innerHTML = `${distanceMeter}m `;
  window.addEventListener('scroll', updateScrollDistance);
}

// check if current website is being paused by calling isPaused
stats.isPaused(websiteDomain).then((isPaused) => {
  if (isPaused) {
    pauseTracking();
  }
});
// continue tracking if the current website is unpaused
stats.isResumed(websiteDomain).then((isResumed) => {
  if (isResumed) {
    resumeTracking();
  }
});
// Pause all
stats.pauseAllSites().then(() => {
  pauseTracking();
});
// Resume all
stats.resumeAllSites().then(() => {
  resumeTracking();
});
// Function to save scroll distance to local storage with debounce
const saveDistance = (() => {
  const DEBOUNCE_TIMEOUT = 1000;
  let scrollDistance = 0;

  const save = debounce(function (domain) {
    stats.updateDistance(domain, scrollDistance).then(() => {
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

// Check if the extension is reloaded and context is invalidated
const isContextInvalidated = () => !chrome.runtime?.id;
