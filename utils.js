/* eslint-disable no-unused-vars */
function pixelToMeter(px) {
  const DPI = 96; // Assumed dpi value for desktops, there is no way to correctly determine screen DPI
  const INCH_PER_METER = 39.37; // 1 inch = 39.37 cm
  const lengthInInch = px / DPI;
  const lengthInMeter = lengthInInch / INCH_PER_METER;
  return lengthInMeter.toFixed(2);
}

function debounce(func, timeout) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
