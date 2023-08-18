// Initialize button with users' preferred color
const counter = document.getElementById('distance');

chrome.storage.local.get('totalDistance', ({ totalDistance }) => {
  const distanceMeter = pixelToMeter(totalDistance).toFixed(2);
  counter.innerText = `Scroll distance: ${distanceMeter} m`;
});
