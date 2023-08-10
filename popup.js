/* global pixelToMeter */

const counter_elem = $('#distance');
const stats_elem = $('#stats');

chrome.storage.local.get(['totalDistance', 'scrollStats'], ({ totalDistance, scrollStats }) => {
  updateDistance(totalDistance);

  // list the scroll distance for each domain
  if (!scrollStats || !stats_elem) return;

  const stats = Object.entries(scrollStats);
  const top3 = stats.sort(([, { distance: a }], [, { distance: b }]) => b - a).slice(0, 3);
  updateScrollDistances(top3);
});

function updateScrollDistances(scrollDistances) {
  scrollDistances.foreach(([domain, { distance }]) => {
    const distanceInMeter = pixelToMeter(distance).toFixed(2);
    const text = `${domain}: ${distanceInMeter} cm`;
    const li = $('<li></li>');
    li.text(text);
    // list.appendChild(li);
    stats_elem.append(li);
  });
}

function updateDistance(distance) {
  if (counter_elem) {
    const distanceMeter = pixelToMeter(distance).toFixed(2);
    counter_elem.text(`Scroll distance: ${distanceMeter} m`);
  }
}
