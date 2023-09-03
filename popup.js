/* global pixelToMeter, stats */

const header_elem = $('#header');
const stats_elem = $('#stats');

stats.getTodayStats().then(({ totalDistance, domains }) => {
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
