import { ensureCounterClockwise, ringArea } from "@/lib/maps/geometry";
import type { ControlPoint, MapPlot, MapRoad, PlotMapDocument, Position } from "@/lib/maps/types";

/**
 * Ruby Highway Gardens, L.R. 4237/77/6, read from the survey sheet.
 * Axes are the sheet's own: x runs from the highway side across a column,
 * y runs from the road to Bofa Beach toward plot 1. These are metres on the
 * drawing. They are not longitude and latitude.
 *
 * Standard plots are the printed 14.2 m by 32.1 m rectangles.
 * The plot in each column that fronts the Bofa Beach road is printed 11.2 m
 * and 29.1 m. Both are exactly 3 m shorter than the standard sides, so that
 * plot is the standard rectangle with a 3 m by 3 m corner taken off.
 * Access roads are the gaps between columns. No width is printed; the gap
 * scales to about 9.5 m against the 32.1 m side.
 */

const FRONT_M = 14.2;
const DEPTH_M = 32.1;
const CORNER_CUT_M = 3;
const ACCESS_GAP_M = 9.5;
const BOFA_ROAD_M = 15;
const COLUMNS = 6;
const ROWS = 9;
const PRICE_KES = 999000;

const COLUMN_PITCH = DEPTH_M + ACCESS_GAP_M;
const BLOCK_HEIGHT = ROWS * FRONT_M;
const BLOCK_WIDTH = (COLUMNS - 1) * COLUMN_PITCH + DEPTH_M;

function columnX(column: number): number {
  return column * COLUMN_PITCH;
}

/** Road end of a column is the highest number in that column: 9, 18, … 54. */
function plotNumber(column: number, rowFromRoad: number): string {
  return String((column + 1) * ROWS - rowFromRoad);
}

function standardRing(x: number, y: number): Position[] {
  return ensureCounterClockwise([
    [x, y],
    [x + DEPTH_M, y],
    [x + DEPTH_M, y + FRONT_M],
    [x, y + FRONT_M],
  ]);
}

function roadFrontRing(x: number): Position[] {
  return ensureCounterClockwise([
    [x + CORNER_CUT_M, 0],
    [x + DEPTH_M, 0],
    [x + DEPTH_M, FRONT_M],
    [x, FRONT_M],
    [x, CORNER_CUT_M],
  ]);
}

function buildPlots(): MapPlot[] {
  const plots: MapPlot[] = [];
  for (let column = 0; column < COLUMNS; column++) {
    const x = columnX(column);
    for (let row = 0; row < ROWS; row++) {
      const roadFront = row === 0;
      const ring = roadFront ? roadFrontRing(x) : standardRing(x, row * FRONT_M);
      plots.push({
        plotNumber: plotNumber(column, row),
        status: "available",
        areaM2: Math.round(ringArea(ring) * 10) / 10,
        frontageM: roadFront ? null : FRONT_M,
        depthM: roadFront ? null : DEPTH_M,
        priceKes: PRICE_KES,
        depositKes: null,
        paymentPeriod: null,
        ring,
        planRing: ring,
        dimensionNote: roadFront
          ? "Fronts the road to Bofa Beach. The sheet prints 11.2 m and 29.1 m on that corner, 3 m shorter than the 14.2 m by 32.1 m plots."
          : "Printed sides 14.2 m by 32.1 m. The legend states about 0.0453 ha.",
      });
    }
  }
  return plots.sort((a, b) => Number(a.plotNumber) - Number(b.plotNumber));
}

function buildRoads(): MapRoad[] {
  const access: MapRoad[] = [];
  for (let column = 0; column < COLUMNS - 1; column++) {
    const x = columnX(column) + DEPTH_M;
  const gap: Position[] = [
    [x, 0],
    [x + ACCESS_GAP_M, 0],
    [x + ACCESS_GAP_M, BLOCK_HEIGHT],
    [x, BLOCK_HEIGHT],
  ];
  access.push({
    name: `Access ${column + 1}`,
    widthM: ACCESS_GAP_M,
    widthSource: "scaled",
    ring: gap,
    planRing: gap,
  });
  }
  const bofa: Position[] = [
    [0, -BOFA_ROAD_M],
    [BLOCK_WIDTH, -BOFA_ROAD_M],
    [BLOCK_WIDTH, 0],
    [0, 0],
  ];
  access.push({
    name: "Road to Bofa Beach",
    widthM: BOFA_ROAD_M,
    widthSource: "printed",
    ring: bofa,
    planRing: bofa,
  });
  return access;
}

function buildBoundary(): Position[] {
  return [
    [0, CORNER_CUT_M],
    [0, BLOCK_HEIGHT],
    [BLOCK_WIDTH, BLOCK_HEIGHT],
    [BLOCK_WIDTH, 0],
    [CORNER_CUT_M, 0],
  ];
}

function buildControlPoints(): ControlPoint[] {
  const farX = columnX(COLUMNS - 1) + DEPTH_M;
  return [
    {
      id: "p9-road",
      label: "Plot 9, road to Bofa Beach, highway side",
      plan: [CORNER_CUT_M, 0],
      ground: null,
    },
    {
      id: "p1-far",
      label: "Plot 1, far corner on the highway side",
      plan: [0, BLOCK_HEIGHT],
      ground: null,
    },
    {
      id: "p46-far",
      label: "Plot 46, far corner away from the highway",
      plan: [farX, BLOCK_HEIGHT],
      ground: null,
    },
    {
      id: "p54-road",
      label: "Plot 54, road to Bofa Beach",
      plan: [farX, 0],
      ground: null,
    },
  ];
}

export function rubyHighwayDocument(): PlotMapDocument {
  return {
    slug: "ruby-highway",
    propertyId: 15,
    projectName: "Ruby Highway Gardens",
    location: "Mtondia Highway, Kilifi",
    surveyRef: "L.R. 4237/77/6",
    alignmentStatus: "unverified",
    crs: "local-metres",
    published: true,
    geometrySource: "survey-sheet",
    sheetImage: "/maps/ruby-highway-plan-upright.jpg",
    cameraHint: {
      lng: 39.874656,
      lat: -3.567446,
      label: "Listing pin for Ruby Highway Gardens. It is not a surveyed plot corner.",
    },
    notes: [
      "54 plots. The legend says about 0.0453 ha each. A standard plot is printed 14.2 m by 32.1 m.",
      "Plots 1–9 stand on the highway side. Plot 1 is the far end of that column and plot 9 fronts the road to Bofa Beach. The same pattern repeats through plot 54.",
      "The sheet shows a 15 m road to Bofa Beach and a 69.7 m Mombasa–Malindi highway reserve. The triangular reserve between the highway and the plots is not dimensioned, so it is not drawn.",
      "Access roads are drawn where the sheet leaves a gap. Their width is not printed.",
      "This drawing has no beacon coordinates. It is not placed on the satellite image.",
    ],
    plots: buildPlots(),
    roads: buildRoads(),
    boundary: buildBoundary(),
    planBoundary: buildBoundary(),
    controlPoints: buildControlPoints(),
    transform: null,
    updatedAt: null,
  };
}
