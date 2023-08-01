// Initialize button with users' preferred color
const counter = document.getElementById('distance');

chrome.storage.local.get('distance', ({ distance }) => {
	const distanceCM = pixelToCm(distance).toFixed(0);
	counter.innerText = `Scroll distance: ${distanceCM} cm`;
});

/**
 * Estimate length in pixel to centimeter
 */
function pixelToCm(px) {
	const DPI = 96; // Assumed dpi value for desktops, there is no way to correctly determine screen DPI

	const lengthInInch = px / DPI;
	const INCH_TO_CM = 2.54;
	return lengthInInch * INCH_TO_CM;
}
