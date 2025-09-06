

export function kelvinToRGB(kelvin) {
  const temp = kelvin / 100;
  let red = 0,
    green = 0,
    blue = 0;

  if (temp <= 66) {
    red = 255;
    green = 99.4708025861 * Math.log(temp) - 161.1195681661;
    blue = temp <= 19 ? 0 : 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
  } else {
    red = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    green = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
    blue = 255;
  }

  const clamp = (v) => Math.min(255, Math.max(0, v));
  return { r: clamp(red) / 255, g: clamp(green) / 255, b: clamp(blue) / 255 };
}

export function computeGainsFromTempAndTint(tempK, tintValue) {
  const neutral = kelvinToRGB(6500);
  const cur = kelvinToRGB(tempK);

  let rGain = cur.r / neutral.r;
  let gGain = cur.g / neutral.g;
  let bGain = cur.b / neutral.b;

  const tintFactor = tintValue / 300; // gentle effect
  gGain *= 1 - tintFactor;

  return { rGain, gGain, bGain };
}

export function applyGainsToImageData(imgData, gains, blend = 1) {
  const data = imgData.data;
  const { rGain, gGain, bGain } = gains;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let nr = Math.min(255, Math.max(0, r * rGain));
    let ng = Math.min(255, Math.max(0, g * gGain));
    let nb = Math.min(255, Math.max(0, b * bGain));

    if (blend < 1) {
      nr = nr * blend + r * (1 - blend);
      ng = ng * blend + g * (1 - blend);
      nb = nb * blend + b * (1 - blend);
    }

    data[i] = Math.round(nr);
    data[i + 1] = Math.round(ng);
    data[i + 2] = Math.round(nb);
  }

  return imgData;
}

export function drawImageToCanvas(canvas, img, { maxW = 900, maxH = 600 } = {}) {
  if (!canvas || !img) return;
  const ctx = canvas.getContext('2d');

  let w = img.width;
  let h = img.height;
  const ratio = Math.min(maxW / w, maxH / h, 1);
  w = Math.round(w * ratio);
  h = Math.round(h * ratio);

  canvas.width = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
}

export function estimateTempAndTintFromCanvas(canvas) {
  if (!canvas) return { temp: 6500, tint: 0 };
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  let sumR = 0,
    sumG = 0,
    sumB = 0,
    count = 0;
  const step = 4 * Math.max(1, Math.floor((width * height) / 50000));

  for (let i = 0; i < data.length; i += step) {
    sumR += data[i];
    sumG += data[i + 1];
    sumB += data[i + 2];
    count++;
  }

  const avgR = sumR / count;
  const avgG = sumG / count;
  const avgB = sumB / count;

  const redRatio = avgR / avgG;
  const blueRatio = avgB / avgG;

  let suggestedTemp = 6500 * (redRatio / blueRatio + 1) / 2;
  suggestedTemp = Math.min(10000, Math.max(2000, Math.round(suggestedTemp)));

  const suggestedTint = Math.round((avgG - (avgR + avgB) / 2) / 2);

  return { temp: suggestedTemp, tint: Math.max(-100, Math.min(100, suggestedTint)) };
}
