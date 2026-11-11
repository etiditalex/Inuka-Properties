import type { Position } from "@/lib/maps/types";

export function openRing(ring: Position[]): Position[] {
  if (ring.length < 2) return ring.slice();
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] === last[0] && first[1] === last[1]) return ring.slice(0, -1);
  return ring.slice();
}

export function closeRing(ring: Position[]): Position[] {
  const open = openRing(ring);
  if (open.length === 0) return open;
  return [...open, open[0]];
}

export function ringArea(ring: Position[]): number {
  const open = openRing(ring);
  if (open.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < open.length; i++) {
    const next = open[(i + 1) % open.length];
    sum += open[i][0] * next[1] - next[0] * open[i][1];
  }
  return Math.abs(sum) / 2;
}

export function ensureCounterClockwise(ring: Position[]): Position[] {
  const open = openRing(ring);
  let sum = 0;
  for (let i = 0; i < open.length; i++) {
    const next = open[(i + 1) % open.length];
    sum += open[i][0] * next[1] - next[0] * open[i][1];
  }
  return sum < 0 ? open.reverse() : open;
}

function sub(a: Position, b: Position): Position {
  return [a[0] - b[0], a[1] - b[1]];
}

function cross(a: Position, b: Position): number {
  return a[0] * b[1] - a[1] * b[0];
}

function nearly(value: number, epsilon: number): boolean {
  return Math.abs(value) <= epsilon;
}

/** True when the point sits on an edge, within epsilon in coordinate units. */
export function onRingBoundary(point: Position, ring: Position[], epsilon: number): boolean {
  const open = openRing(ring);
  for (let i = 0; i < open.length; i++) {
    const start = open[i];
    const end = open[(i + 1) % open.length];
    const edge = sub(end, start);
    const fromStart = sub(point, start);
    const length = Math.hypot(edge[0], edge[1]);
    if (length === 0) continue;
    const area = Math.abs(cross(edge, fromStart));
    if (area / length > epsilon) continue;
    const dot = fromStart[0] * edge[0] + fromStart[1] * edge[1];
    if (dot >= -epsilon * length && dot <= length * length + epsilon * length) return true;
  }
  return false;
}

export function pointStrictlyInside(point: Position, ring: Position[], epsilon: number): boolean {
  if (onRingBoundary(point, ring, epsilon)) return false;
  const open = openRing(ring);
  let inside = false;
  for (let i = 0, j = open.length - 1; i < open.length; j = i++) {
    const yi = open[i][1];
    const yj = open[j][1];
    const xi = open[i][0];
    const xj = open[j][0];
    const crosses = yi > point[1] !== yj > point[1];
    if (!crosses) continue;
    const x = ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
    if (x > point[0]) inside = !inside;
  }
  return inside;
}

/** Crossing in the middle of both segments. Shared corners and colinear edges are boundaries, not overlaps. */
export function segmentsProperlyIntersect(a: Position, b: Position, c: Position, d: Position, epsilon: number): boolean {
  const ab = sub(b, a);
  const ac = sub(c, a);
  const ad = sub(d, a);
  const cd = sub(d, c);
  const ca = sub(a, c);
  const cb = sub(b, c);
  const abLen = Math.hypot(ab[0], ab[1]);
  const cdLen = Math.hypot(cd[0], cd[1]);
  if (abLen === 0 || cdLen === 0) return false;
  const d1 = cross(ab, ac);
  const d2 = cross(ab, ad);
  const d3 = cross(cd, ca);
  const d4 = cross(cd, cb);
  if (nearly(d1, epsilon * abLen) || nearly(d2, epsilon * abLen) || nearly(d3, epsilon * cdLen) || nearly(d4, epsilon * cdLen)) {
    return false;
  }
  return d1 > 0 !== d2 > 0 && d3 > 0 !== d4 > 0;
}

export function ringSelfIntersects(ring: Position[], epsilon: number): boolean {
  const open = openRing(ring);
  const count = open.length;
  if (count < 4) return false;
  for (let i = 0; i < count; i++) {
    const a = open[i];
    const b = open[(i + 1) % count];
    for (let j = i + 1; j < count; j++) {
      const adjacent = Math.abs(i - j) <= 1 || (i === 0 && j === count - 1);
      if (adjacent) continue;
      const sharesVertex = (i + 1) % count === j || (j + 1) % count === i;
      if (sharesVertex) continue;
      const c = open[j];
      const d = open[(j + 1) % count];
      if (segmentsProperlyIntersect(a, b, c, d, epsilon)) return true;
    }
  }
  return false;
}

export function polygonsOverlap(a: Position[], b: Position[], epsilon: number): boolean {
  const left = openRing(a);
  const right = openRing(b);
  for (let i = 0; i < left.length; i++) {
    const a1 = left[i];
    const a2 = left[(i + 1) % left.length];
    for (let j = 0; j < right.length; j++) {
      const b1 = right[j];
      const b2 = right[(j + 1) % right.length];
      if (segmentsProperlyIntersect(a1, a2, b1, b2, epsilon)) return true;
    }
  }
  if (left.some((point) => pointStrictlyInside(point, right, epsilon))) return true;
  if (right.some((point) => pointStrictlyInside(point, left, epsilon))) return true;
  return false;
}

export function ringBounds(rings: Position[][]): [Position, Position] | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let found = false;
  rings.forEach((ring) => {
    openRing(ring).forEach(([x, y]) => {
      found = true;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
  });
  if (!found) return null;
  return [[minX, minY], [maxX, maxY]];
}

export function overlapEpsilon(crs: "local-metres" | "EPSG:4326"): number {
  return crs === "EPSG:4326" ? 0.0000008 : 0.05;
}

export function findOverlaps(
  plots: { plotNumber: string; ring: Position[] }[],
  crs: "local-metres" | "EPSG:4326"
): string[] {
  const epsilon = overlapEpsilon(crs);
  const messages: string[] = [];
  for (let i = 0; i < plots.length; i++) {
    if (ringSelfIntersects(plots[i].ring, epsilon)) {
      messages.push(`Plot ${plots[i].plotNumber} crosses itself.`);
    }
    if (openRing(plots[i].ring).length < 3 || ringArea(plots[i].ring) <= 0) {
      messages.push(`Plot ${plots[i].plotNumber} has no area.`);
    }
    for (let j = i + 1; j < plots.length; j++) {
      if (polygonsOverlap(plots[i].ring, plots[j].ring, epsilon)) {
        messages.push(`Plot ${plots[i].plotNumber} overlaps plot ${plots[j].plotNumber}.`);
      }
    }
  }
  return messages;
}

export function nearestOtherVertex(
  point: Position,
  plots: { plotNumber: string; ring: Position[] }[],
  ignore: { plotNumber: string; index: number },
  maxDistance: number
): Position | null {
  let best: Position | null = null;
  let bestDistance = maxDistance;
  plots.forEach((plot) => {
    openRing(plot.ring).forEach((vertex, index) => {
      if (plot.plotNumber === ignore.plotNumber && index === ignore.index) return;
      const distance = Math.hypot(vertex[0] - point[0], vertex[1] - point[1]);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = vertex;
      }
    });
  });
  return best;
}
