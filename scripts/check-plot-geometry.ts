import { findOverlaps, ringArea, ringSelfIntersects } from "../lib/maps/geometry";
import { applyGround, fitControlPoints, residualMetres, similarityFromControl } from "../lib/maps/georef";
import { projectSheet } from "../lib/maps/publish";
import { rubyHighwayDocument } from "../lib/maps/rubyHighwayLayout";

const doc = rubyHighwayDocument();
const numbers = doc.plots.map((plot) => Number(plot.plotNumber)).sort((a, b) => a - b);
const expected = Array.from({ length: 54 }, (_, index) => index + 1);
const mismatches: string[] = [];

if (numbers.join(",") !== expected.join(",")) mismatches.push(`plot numbers ${numbers.join(",")}`);
if (doc.crs !== "local-metres" || doc.alignmentStatus !== "unverified") mismatches.push("alignment was published without ground corners");
if (doc.plots.some((plot) => plot.status !== "available")) mismatches.push("a plot status was invented");
if (doc.plots.some((plot) => plot.priceKes !== 999000)) mismatches.push("price drifted from the listing");

const standard = doc.plots.filter((plot) => plot.frontageM === 14.2);
const clipped = doc.plots.filter((plot) => plot.frontageM == null);
if (standard.length !== 48) mismatches.push(`expected 48 standard plots, got ${standard.length}`);
if (clipped.length !== 6) mismatches.push(`expected 6 road-front plots, got ${clipped.length}`);
standard.forEach((plot) => {
  if (plot.areaM2 !== 455.82) mismatches.push(`plot ${plot.plotNumber} area ${plot.areaM2}`);
  if (Math.abs(ringArea(plot.ring) - 455.82) > 0.05) mismatches.push(`plot ${plot.plotNumber} ring does not match 14.2 m by 32.1 m`);
});
clipped.forEach((plot) => {
  if (plot.areaM2 !== 451.32) mismatches.push(`plot ${plot.plotNumber} clipped area ${plot.areaM2}`);
  if (Math.abs(ringArea(plot.ring) - 451.32) > 0.05) mismatches.push(`plot ${plot.plotNumber} ring does not match the 11.2 m and 29.1 m corner`);
  if (plot.ring.length !== 5) mismatches.push(`plot ${plot.plotNumber} is not the clipped corner`);
});

const issues = findOverlaps(
  doc.plots.map((plot) => ({ plotNumber: plot.plotNumber, ring: plot.ring })),
  "local-metres"
);
mismatches.push(...issues);
doc.plots.forEach((plot) => {
  if (ringSelfIntersects(plot.ring, 0.05)) mismatches.push(`plot ${plot.plotNumber} crosses itself`);
});

const roads = doc.roads.filter((road) => road.widthSource === "scaled");
const bofa = doc.roads.find((road) => road.widthSource === "printed");
if (roads.length !== 3) mismatches.push(`expected 3 access roads, got ${roads.length}`);
if (!bofa || bofa.widthM !== 15) mismatches.push("the 15 m Bofa Beach road is missing");
if (Math.abs(ringArea(bofa?.ring ?? []) - 15 * (6 * 32.1 + 3 * 9.5)) > 1) mismatches.push("Bofa road area");
const roadFront = ["9", "18", "27", "34", "45", "46"];
roadFront.forEach((number) => {
  const plot = doc.plots.find((item) => item.plotNumber === number);
  if (!plot || plot.ring.length !== 5) mismatches.push(`plot ${number} should front Bofa Beach`);
});
const farEnd = doc.plots.find((plot) => plot.plotNumber === "54");
const plot46 = doc.plots.find((plot) => plot.plotNumber === "46");
if (!farEnd || farEnd.ring.some((point) => point[1] < 100)) mismatches.push("plot 54 is not at the far end");
if (!plot46 || plot46.ring.every((point) => point[1] > 20)) mismatches.push("plot 46 is not on the Bofa road");

const [a, b, c, d] = doc.controlPoints;
const groundA: [number, number] = [39.87, -3.57];
const groundB: [number, number] = [39.871, -3.569];
const transform = similarityFromControl(a.plan, groundA, b.plan, groundB);
const back = applyGround(transform, [a.plan, b.plan]);
if (residualMetres(transform, a.plan, groundA) > 0.05) mismatches.push("first corner did not land");
if (residualMetres(transform, b.plan, groundB) > 0.05) mismatches.push("second corner did not land");
if (Math.hypot(back[0][0] - groundA[0], back[0][1] - groundA[1]) > 0.00001) mismatches.push("round trip");
const extra = residualMetres(transform, c.plan, groundB);
if (!Number.isFinite(extra)) mismatches.push("residual");

const grounds: [number, number][] = [
  [39.874, -3.568],
  [39.8732, -3.5664],
  [39.8764, -3.5661],
  [39.8771, -3.5678],
];
const fitted = fitControlPoints(doc.controlPoints.map((point, index) => ({ plan: point.plan, ground: grounds[index] })));
doc.controlPoints.forEach((point, index) => {
  if (residualMetres(fitted, point.plan, grounds[index]) > 0.05) mismatches.push(`${point.id} missed its placed point`);
});
const projected = projectSheet({
  ...doc,
  controlPoints: doc.controlPoints.map((point, index) => ({ ...point, ground: grounds[index] })),
});
if (!projected?.transform) mismatches.push("the sheet did not project onto the four corners");
doc.controlPoints.forEach((point, index) => {
  if (!projected?.transform || residualMetres(projected.transform, point.plan, grounds[index]) > 0.05) {
    mismatches.push(`${point.id} is off the public coverage`);
  }
});
const plot1 = projected?.plots.find((plot) => plot.plotNumber === "1");
const plot1Corner = plot1?.ring && residualMetres(projected!.transform!, [0, 9 * 14.2], grounds[1]);
if (plot1Corner === undefined || plot1Corner > 0.05) mismatches.push("plot 1 does not reach its corner");
if (!d) mismatches.push("fourth corner missing");

if (mismatches.length) {
  console.error(mismatches.join("\n"));
  process.exit(1);
}
console.log(`Ruby Highway plan: ${doc.plots.length} plots, ${doc.roads.length} roads, unverified.`);
