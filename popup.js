<<<<<<< HEAD
/* global pixelToMeter */

const counter_elem = $('#distance');
const stats_elem = $('#stats');

chrome.storage.local.get(['totalDistance', 'scrollStats'], ({ totalDistance, scrollStats }) => {
  updateDistance(totalDistance);

  const stats = Object.entries(scrollStats);
  const top3 = stats.sort(([, { distance: a }], [, { distance: b }]) => b - a).slice(0, 3);
  updateScrollDistances(top3);
=======
// Initialize button with users' preferred color
const counter = document.getElementById('distance');

chrome.storage.local.get('totalDistance', ({ totalDistance }) => {
  const distanceMeter = pixelToMeter(totalDistance).toFixed(2);
  counter.innerText = `Scroll distance: ${distanceMeter} m`;
>>>>>>> 6e8dd82 (Formatting rules updated)
});

function updateScrollDistances(scrollDistances) {
  scrollDistances.forEach(([domain, { distance }]) => {
    const distanceInMeter = pixelToMeter(distance);
    const li = $('<li></li>');
    li.text(`${domain}: ${distanceInMeter}m`);
    stats_elem.append(li);
  });
}

function updateDistance(distance) {
  const distanceMeter = pixelToMeter(distance);
  counter_elem.text(`Scroll distance: ${distanceMeter} m`);
}
