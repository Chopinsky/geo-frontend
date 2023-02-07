const rawGeoData = [
  [-129.436347933385,54.7732837504813], 
  [-141.8914201164901,45.53125106221043],
  [-135.40170726381763, 49.36480731298598],
  [-140.14403453727405, 55.75709117241593],
  [-134.00157945695298, 53.13553555813956],
  [-129.436347933385, 54.7732837504813]
];

const getRanges = (src) => {
  let minX = src[0][0];
  let maxX = minX;
  let minY = src[0][1];
  let maxY = minY;

  src.forEach(([x, y]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });

  return [minX, maxX, minY, maxY];
};

const transform = (src) => {
  const geoData = [];
  const [x0, x1, y0, y1] = getRanges(src);
  const dx = x1 - x0;
  const dy = y1 - y0;

  src.forEach(([x, y]) => {
    const tx = 100 * (x-x0) / dx;
    const ty = 100 * (1 - (y-y0) / dy);
    geoData.push([tx, ty]);
  });

  return geoData;
};

const serializeToPoints = (src) => {
  let points = "";

  src.forEach(([x, y]) => {
    if (points.length > 0) {
      points += " ";
    }

    let xVal = Math.round(x * 100) / 100;
    let yVal = Math.round(y * 100) / 100;

    points += `${xVal},${yVal}`;
  });

  return points
};

const transformed = transform(rawGeoData);
console.log(serializeToPoints(transformed));
