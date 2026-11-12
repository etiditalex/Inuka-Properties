import { ensureCounterClockwise, ringArea } from "@/lib/maps/geometry";
import type { ControlPoint, MapPlot, MapRoad, PlotMapDocument, Position } from "@/lib/maps/types";

/**
 * Ruby Highway Gardens, L.R. 4237/77/6, read from the survey sheet.
 * Axes are the sheet's own: x runs from the highway side across a column,
 * y runs from the road to Bofa Beach toward the far end. These are metres on the
 * drawing. They are not longitude and latitude.
 *
 * Six columns of plots and three access roads. Columns 10–18 and 19–27 share a
 * rear boundary, and so do the 28–34 column and the 33–45 column. The other
 * gaps are the access roads. Their width is not printed.
 *
 * Standard plots are the printed 14.2 m by 32.1 m rectangles.
 * The plot in each column that fronts the Bofa Beach road is printed 11.2 m
 * and 29.1 m, the standard rectangle with a 3 m by 3 m corner taken off.
 *
 * Numbering, from the far end down to the Bofa road:
 * 1–9, 10–18, 19–27, then 28, 29, 30, 39–34, then 33, 32, 31, 40–45,
 * then 54 down to 46.
 */

const FRONT_M = 14.2;
const DEPTH_M = 32.1;
const CORNER_CUT_M = 3;
const ACCESS_GAP_M = 9.5;
const BOFA_ROAD_M = 15;
const ROWS = 9;
const PRICE_KES = 999000;

/** Each inner list is one column, far end first and the Bofa Beach plot last. */
const COLUMNS_FROM_FAR = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  ["10", "11", "12", "13", "14", "15", "16", "17", "18"],
  ["19", "20", "21", "22", "23", "24", "25", "26", "27"],
  ["28", "29", "30", "39", "38", "37", "36", "35", "34"],
  ["33", "32", "31", "40", "41", "42", "43", "44", "45"],
  ["54", "53", "52", "51", "50", "49", "48", "47", "46"],
];

/** Columns that share a rear line. A road follows every group except the last. */
const COLUMN_GROUPS = [[0], [1, 2], [3, 4], [5]];

const BLOCK_HEIGHT = ROWS * FRONT_M;

function columnStarts(): number[] {
  const starts: number[] = [];
  let x = 0;
  COLUMN_GROUPS.forEach((group, groupIndex) => {
    group.forEach((column) => {
      starts[column] = x;
      x += DEPTH_M;
    });
    if (groupIndex < COLUMN_GROUPS.length - 1) x += ACCESS_GAP_M;
  });
  return starts;
}

const COLUMN_X = columnStarts();
const BLOCK_WIDTH = COLUMN_X[COLUMN_X.length - 1] + DEPTH_M;

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
  COLUMNS_FROM_FAR.forEach((numbers, column) => {
    const x = COLUMN_X[column];
    numbers.forEach((plotNumber, indexFromFar) => {
      const rowFromRoad = ROWS - 1 - indexFromFar;
      const roadFront = rowFromRoad === 0;
      const ring = roadFront ? roadFrontRing(x) : standardRing(x, rowFromRoad * FRONT_M);
      plots.push({
        plotNumber,
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
    });
  });
  return plots.sort((a, b) => Number(a.plotNumber) - Number(b.plotNumber));
}

function buildRoads(): MapRoad[] {
  const access: MapRoad[] = [];
  let x = 0;
  COLUMN_GROUPS.forEach((group, groupIndex) => {
    x += group.length * DEPTH_M;
    if (groupIndex === COLUMN_GROUPS.length - 1) return;
    const gap: Position[] = [
      [x, 0],
      [x + ACCESS_GAP_M, 0],
      [x + ACCESS_GAP_M, BLOCK_HEIGHT],
      [x, BLOCK_HEIGHT],
    ];
    access.push({
      name: `Access ${groupIndex + 1}`,
      widthM: ACCESS_GAP_M,
      widthSource: "scaled",
      ring: gap,
      planRing: gap,
    });
    x += ACCESS_GAP_M;
  });
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
      id: "p54-far",
      label: "Plot 54, far corner away from the highway",
      plan: [BLOCK_WIDTH, BLOCK_HEIGHT],
      ground: null,
    },
    {
      id: "p46-road",
      label: "Plot 46, road to Bofa Beach",
      plan: [BLOCK_WIDTH, 0],
      ground: null,
    },
  ];
}

/** Keep saved prices, statuses, and clicked corners while replacing the sheet geometry. */
export function refreshRubyHighwaySheet(stored: PlotMapDocument): PlotMapDocument {
  if (stored.slug !== "ruby-highway") return stored;
  const sheet = rubyHighwayDocument();
  const previous = new Map(stored.plots.map((plot) => [plot.plotNumber, plot]));
  const grounds = new Map(stored.controlPoints.filter((point) => point.ground).map((point) => [point.id, point.ground!]));
  return {
    ...sheet,
    published: stored.published,
    alignmentStatus: stored.alignmentStatus,
    updatedAt: stored.updatedAt,
    cameraHint: stored.cameraHint ?? sheet.cameraHint,
    plots: sheet.plots.map((plot) => {
      const saved = previous.get(plot.plotNumber);
      if (!saved) return plot;
      return {
        ...plot,
        status: saved.status,
        priceKes: saved.priceKes,
        depositKes: saved.depositKes,
        paymentPeriod: saved.paymentPeriod,
      };
    }),
    controlPoints: sheet.controlPoints.map((point) => ({
      ...point,
      ground:
        grounds.get(point.id) ??
        (point.id === "p54-far" ? grounds.get("p46-far") : null) ??
        (point.id === "p46-road" ? grounds.get("p54-road") : null) ??
        null,
    })),
  };
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
      "The highway column is plots 1 to 9. The next two columns are 10 to 18 and 19 to 27, back to back. Then 28, 29, 30 and 39 down to 34 sit back to back with 33, 32, 31 and 40 to 45. The last column runs from 54 down to 46.",
      "The sheet shows three access roads, a 15 m road to Bofa Beach, and a 69.7 m Mombasa–Malindi highway reserve. The triangular reserve between the highway and the plots is not dimensioned, so it is not drawn.",
      "The access-road width is not printed.",
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
