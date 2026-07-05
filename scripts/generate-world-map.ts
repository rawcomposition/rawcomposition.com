import fs from "fs";

// One-time generator for src/data/world-map.json, used by the world map on the
// progress page. Projects Natural Earth country outlines (110m) to SVG paths with an
// equirectangular projection. Countries too small to have a shape at 110m (small
// island nations) get a centroid marker from the more detailed 50m dataset instead.

const WIDTH = 1000;
const MAX_LAT = 84;
const MIN_LAT = -56;
const HEIGHT = Math.round((WIDTH * (MAX_LAT - MIN_LAT)) / 360);

const project = ([lon, lat]: number[]) => [
  Math.round(((lon + 180) / 360) * WIDTH * 10) / 10,
  Math.round(((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * HEIGHT * 10) / 10,
];

const getIso = (props: any): string | null => {
  const iso = props.ISO_A2_EH && props.ISO_A2_EH !== "-99" ? props.ISO_A2_EH : props.ISO_A2;
  return iso && iso !== "-99" ? iso : null;
};

const ringToPath = (ring: number[][]) => {
  const points = ring.map(project);
  return `M${points.map(([x, y]) => `${x},${y}`).join("L")}Z`;
};

const featureToPath = (geometry: any) => {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flatMap((polygon: number[][][]) => polygon.map(ringToPath)).join("");
};

const featureCentroid = (geometry: any) => {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  // Use the outer ring of the largest polygon by vertex count
  const ring: number[][] = polygons.map((p: number[][][]) => p[0]).sort((a: any, b: any) => b.length - a.length)[0];
  const lon = ring.reduce((sum, [x]) => sum + x, 0) / ring.length;
  const lat = ring.reduce((sum, [, y]) => sum + y, 0) / ring.length;
  return project([lon, lat]);
};

(async () => {
  const base = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson";

  console.log("Fetching Natural Earth 110m countries...");
  const lowRes: any = await (await fetch(`${base}/ne_110m_admin_0_countries.geojson`)).json();
  console.log("Fetching Natural Earth 50m countries (for small-country centroids)...");
  const midRes: any = await (await fetch(`${base}/ne_50m_admin_0_countries.geojson`)).json();

  const countries: { code: string; name: string; d: string }[] = [];
  const seen = new Set<string>();

  lowRes.features.forEach((feature: any) => {
    const code = getIso(feature.properties);
    if (!code || code === "AQ" || seen.has(code)) return;
    seen.add(code);
    countries.push({
      code,
      name: feature.properties.NAME_LONG ?? feature.properties.NAME,
      d: featureToPath(feature.geometry),
    });
  });

  const markers: { code: string; name: string; x: number; y: number }[] = [];
  midRes.features.forEach((feature: any) => {
    const code = getIso(feature.properties);
    if (!code || code === "AQ" || seen.has(code)) return;
    seen.add(code);
    const [x, y] = featureCentroid(feature.geometry);
    markers.push({ code, name: feature.properties.NAME_LONG ?? feature.properties.NAME, x, y });
  });

  const output = { width: WIDTH, height: HEIGHT, countries, markers };
  fs.writeFileSync("./src/data/world-map.json", JSON.stringify(output));
  const kb = Math.round(fs.statSync("./src/data/world-map.json").size / 1024);
  console.log(`Done: ${countries.length} country shapes, ${markers.length} markers, ${kb} KB`);
})();
