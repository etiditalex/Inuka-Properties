import { openRing } from "@/lib/maps/geometry";
import type { Position, Similarity } from "@/lib/maps/types";

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
export function residualMetres(transform: Similarity, plan: Position, ground: Position): number {
  const [lng, lat] = applySimilarity(transform, [plan])[0];
  const [east, north] = toEnu([lng, lat], ground);
  return Math.hypot(east, north);
}
