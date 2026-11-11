import { openRing } from "@/lib/maps/geometry";
import type { GroundFit, Position, Similarity } from "@/lib/maps/types";

const METRES_PER_DEG_LAT = 110540;

function metresPerDegLng(lat: number): number {
  return 111320 * Math.cos((lat * Math.PI) / 180);
}

/** Sheet metres drawn near 0,0 so a plan can be viewed without claiming a ground position. */
export function metresToDisplay(x: number, y: number): Position {
  return [x / 111320, y / METRES_PER_DEG_LAT];
}

export function displayToMetres(lng: number, lat: number): Position {
  return [lng * 111320, lat * METRES_PER_DEG_LAT];
}

export function toEnu(point: Position, origin: Position): Position {
  const east = (point[0] - origin[0]) * metresPerDegLng(origin[1]);
  const north = (point[1] - origin[1]) * METRES_PER_DEG_LAT;
  return [east, north];
}

export function fromEnu(east: number, north: number, origin: Position): Position {
  return [
    origin[0] + east / metresPerDegLng(origin[1]),
    origin[1] + north / METRES_PER_DEG_LAT,
  ];
}

/**
 * Two control points fix translation, rotation and scale.
 * The first ground point is the origin, so that corner lands exactly.
 */
export function similarityFromControl(
  planA: Position,
  groundA: Position,
  planB: Position,
  groundB: Position
): Similarity {
  const plan = [planB[0] - planA[0], planB[1] - planA[1]] as Position;
  const ground = toEnu(groundB, groundA);
  const planLength = Math.hypot(plan[0], plan[1]);
  const groundLength = Math.hypot(ground[0], ground[1]);
  if (planLength < 1 || groundLength < 1) {
    throw new Error("Choose two corners that are more than a metre apart.");
  }
  const rotationRad = Math.atan2(ground[1], ground[0]) - Math.atan2(plan[1], plan[0]);
  const scale = groundLength / planLength;
  const cos = Math.cos(rotationRad);
  const sin = Math.sin(rotationRad);
  const translateEast = -scale * (cos * planA[0] - sin * planA[1]);
  const translateNorth = -scale * (sin * planA[0] + cos * planA[1]);
  return {
    kind: "similarity",
    originLng: groundA[0],
    originLat: groundA[1],
    scale,
    rotationRad,
    translateEast,
    translateNorth,
  };
}

export function applySimilarity(transform: Similarity, ring: Position[]): Position[] {
  const cos = Math.cos(transform.rotationRad);
  const sin = Math.sin(transform.rotationRad);
  const origin: Position = [transform.originLng, transform.originLat];
  return openRing(ring).map(([x, y]) => {
    const east = transform.scale * (cos * x - sin * y) + transform.translateEast;
    const north = transform.scale * (sin * x + cos * y) + transform.translateNorth;
    return fromEnu(east, north, origin);
  });
}

/** Metres between a transformed sheet corner and the ground point an administrator clicked. */
export function residualMetres(transform: GroundFit, plan: Position, ground: Position): number {
  const [lng, lat] = applyGround(transform, [plan])[0];
  const [east, north] = toEnu([lng, lat], ground);
  return Math.hypot(east, north);
}

type PlacedCorner = { plan: Position; ground: Position };

/**
 * Place every clicked corner on its own point.
 * Two corners keep a uniform scale. Three stretch the sheet. Four or more
 * send each of those corners to the exact satellite point.
 */
export function fitControlPoints(points: PlacedCorner[]): GroundFit {
  if (points.length < 2) throw new Error("Place at least two sheet corners on the satellite image first.");
  if (points.length === 2) {
    return similarityFromControl(points[0].plan, points[0].ground, points[1].plan, points[1].ground);
  }
  const origin = points[0].ground;
  const samples = points.map((point) => ({
    x: point.plan[0],
    y: point.plan[1],
    enu: toEnu(point.ground, origin),
  }));
  if (points.length === 3) {
    const rows = samples.flatMap((sample) => [
      [sample.x, sample.y, 1, 0, 0, 0],
      [0, 0, 0, sample.x, sample.y, 1],
    ]);
    const rhs = samples.flatMap((sample) => [sample.enu[0], sample.enu[1]]);
    const [a, b, c, d, e, f] = solve(rows, rhs);
    return { kind: "affine", originLng: origin[0], originLat: origin[1], a, b, c, d, e, f };
  }
  const rows = samples.flatMap((sample) => [
    [sample.x, sample.y, 1, 0, 0, 0, -sample.enu[0] * sample.x, -sample.enu[0] * sample.y],
    [0, 0, 0, sample.x, sample.y, 1, -sample.enu[1] * sample.x, -sample.enu[1] * sample.y],
  ]);
  const rhs = samples.flatMap((sample) => [sample.enu[0], sample.enu[1]]);
  const h = rows.length === 8 ? solve(rows, rhs) : leastSquares(rows, rhs, 8);
  return { kind: "homography", originLng: origin[0], originLat: origin[1], h };
}

export function applyGround(transform: GroundFit, ring: Position[]): Position[] {
  if (!transform.kind || transform.kind === "similarity") return applySimilarity(asSimilarity(transform), ring);
  const origin: Position = [transform.originLng, transform.originLat];
  return openRing(ring).map((point) => fromEnu(...sheetToEnu(transform, point), origin));
}

function asSimilarity(transform: GroundFit): Similarity {
  if (transform.kind === "affine" || transform.kind === "homography") {
    throw new Error("This alignment is not a simple scale and rotation.");
  }
  return { ...transform, kind: "similarity" };
}

function sheetToEnu(transform: GroundFit, point: Position): Position {
  const [x, y] = point;
  if (transform.kind === "affine") {
    return [transform.a * x + transform.b * y + transform.c, transform.d * x + transform.e * y + transform.f];
  }
  if (transform.kind === "homography") {
    const [h0, h1, h2, h3, h4, h5, h6, h7] = transform.h;
    const weight = h6 * x + h7 * y + 1;
    if (Math.abs(weight) < 1e-9) throw new Error("These corners fold the drawing over itself. Move one of them.");
    return [(h0 * x + h1 * y + h2) / weight, (h3 * x + h4 * y + h5) / weight];
  }
  const east = transform.scale * (Math.cos(transform.rotationRad) * x - Math.sin(transform.rotationRad) * y) + transform.translateEast;
  const north = transform.scale * (Math.sin(transform.rotationRad) * x + Math.cos(transform.rotationRad) * y) + transform.translateNorth;
  return [east, north];
}

function solve(rows: number[][], rhs: number[]): number[] {
  const n = rhs.length;
  const matrix = rows.map((row, index) => [...row, rhs[index]]);
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(matrix[row][col]) > Math.abs(matrix[pivot][col])) pivot = row;
    }
    [matrix[col], matrix[pivot]] = [matrix[pivot], matrix[col]];
    const divisor = matrix[col][col];
    if (Math.abs(divisor) < 1e-10) {
      throw new Error("These corners are on one line. Place corners around the outside of the block.");
    }
    for (let column = col; column <= n; column += 1) matrix[col][column] /= divisor;
    for (let row = 0; row < n; row += 1) {
      if (row === col) continue;
      const factor = matrix[row][col];
      for (let column = col; column <= n; column += 1) matrix[row][column] -= factor * matrix[col][column];
    }
  }
  return matrix.map((row) => row[n]);
}

function leastSquares(rows: number[][], rhs: number[], columns: number): number[] {
  const normal = Array.from({ length: columns }, () => Array(columns).fill(0));
  const vector = Array(columns).fill(0);
  rows.forEach((row, index) => {
    for (let column = 0; column < columns; column += 1) {
      vector[column] += row[column] * rhs[index];
      for (let other = 0; other < columns; other += 1) normal[column][other] += row[column] * row[other];
    }
  });
  return solve(normal, vector);
}
