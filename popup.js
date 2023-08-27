/* global pixelToMeter, stats */

const header_elem = $('#header');
const stats_elem = $('#stats');
let isPaused = false;
let isResume = false;

stats.getTodayStats().then(({ dayStats: { totalDistance, domains } }) => {
  updateDistance(new Date(), totalDistance);
  updateScrollDistances(domains);
});

function updateScrollDistances(domains) {
  const stats = Object.entries(domains);
  const top3 = stats.sort(([, { distance: a }], [, { distance: b }]) => b - a).slice(0, 3);
  stats_elem.html('');
  top3.forEach(([domain, { distance }]) => {
    const distanceInMeter = pixelToMeter(distance);
    const li = $('<li></li>');
    li.text(`${domain}: ${distanceInMeter}m`);
    stats_elem.append(li);
  });
}

function updateDistance(date, distance) {
  const distanceMeter = pixelToMeter(distance, 0);
  const month = date.toLocaleString('default', { month: 'short' });
  const dateNum = date.getDate();
  const today = new Date();
  // if today then show 'Today', if yesterday then show 'Yesterday', else show the day of week
  const day =
    date.toDateString() === today.toDateString()
      ? 'Today'
      : date.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()
      ? 'Yesterday'
      : date.toLocaleString('default', { weekday: 'long' });

  header_elem.html(`
    <div >
      <span id="day">${day}, ${month} ${dateNum}</span>
      <br>
      <span id="distance">${distanceMeter}m</span>
    </div>
  `);
}
// add current website to list of paused websites
document.getElementById('pause-current-site')?.addEventListener('click', () => {
  const pausedText = $('<span id = "paused-text"> (paused) </span>');
  if (!isPaused) {
    stats.pauseCurrentSite();
    header_elem.find('#distance').after(pausedText);
    isPaused = true;
  }
});
// remove current website from list of paused websites
document.getElementById('resume-current-site')?.addEventListener('click', () => {
  const pausedText = $('#paused-text');
  if (!isResume) {
    stats.unpauseCurrentSite();
    pausedText.remove();
    isResume = true;
  }
});
// add all current sites in list of paused websites
document.getElementById('pause-all-sites')?.addEventListener('click', () => {
  const pausedText = $('<span id = "paused-text"> (paused) </span>');
  if (!isPaused) {
    stats.pauseAllSites();
    header_elem.find('#distance').after(pausedText);
    isPaused = true;
  }
});
// remove all current sites from list of paused websites
document.getElementById('resume-all-sites')?.addEventListener('click', () => {
  const pausedText = $('#paused-text');
  if (!isResume) {
    stats.resumeAllSites();
    pausedText.remove();
    isResume = true;
  }
});
