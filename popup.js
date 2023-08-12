// Initialize button with users' preferred color
const counter = document.getElementById("distance");

chrome.storage.local.get("totalDistance", ({ totalDistance }) => {
  const distanceMeter = pixelToMeter(totalDistance).toFixed(0);
  counter.innerText = `Scroll distance: ${distanceMeter} m`;
});
/**
 * Estimate length in pixel to meter
 */
function pixelToMeter(px) {
	const DPI = 96; // Assumed dpi value for desktops, there is no way to correctly determine screen DPI
	const INCH_PER_METTER = 39.37; // 1 inch = 39.37 cm
	const lengthInInch = px / DPI;
	const lenghthInMetter = lengthInInch / INCH_PER_METTER; 
	return lenghthInMetter;
}
