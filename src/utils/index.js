export * from "./getBrowserLanguage";

export function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

export function PL(p, l) {
  return isLandscape() ? l : p;
}

export function fitToSize(object, width, height, min) {
  const body = object.body || object;
  const dw = width / body.width;
  const dh = height / body.height;
  let dlt = 1;

  if (body.height * dw >= height) {
    dlt = min ? dh : dw;
  } else {
    dlt = min ? dw : dh;
  }

  object.width *= dlt;
  object.height *= dlt;
}

export function numToStr(value, codes) {
  if (value >= 1000) {
    const suffixes = codes || ["", "K", "M", "B", "T", "a"];
    const suffixNum = Math.floor(("" + value).length / 3.01);
    return (value / Math.pow(1000, suffixNum)).toPrecision(3) + suffixes[suffixNum];
  } else return "" + value;
}

export function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
export function random(min, max) {
  return min + Math.random() * (max - min);
}

export function is(percentage = 0.5) {
  return Math.random() < percentage;
}

export function randomSign(percentage = 0.5) {
  return Math.random() > percentage ? 1 : -1;
}

export function clamp(min, max, alpha) {
  return Math.max(min, Math.min(alpha, max));
}

export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

export function lerp(x0, x1, y0, y1, x) {
  return (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0);
}

export function getScale(width, height) {
  let mw = 0;
  let mh = 0;

  if (width > height) {
    mw = (width * 640) / height;
    mh = (height * 960) / width;
  } else {
    mw = (width * 960) / height;
    mh = (height * 640) / width;
  }

  return 1 / Math.max(mw / width, mh / height);
}
