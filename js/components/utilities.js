// Helper functions for radians and degrees.
export function radians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function degrees(radians) {
  return (radians * 180) / Math.PI;
}

// linearly maps value from the range (a..b) to (c..d)
export function mapRange(value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}

export function dist(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
