import { toEnu } from "@/lib/maps/georef";
import type { DroneImageFit, ImagePoint, Position } from "@/lib/maps/types";

type Correspondence = { ground: Position; image: ImagePoint };

/**
 * Estimate how a flat satellite outline lands on one oblique photograph.
 * Four or more matched points are required. The result is approximate.
 */
export function fitDroneRegistration(points: Correspondence[], widthPx: number, heightPx: number): DroneImageFit {
  if (points.length < 4) {
    throw new Error("Mark at least four points on both the satellite map and this photograph.");
  }
  const origin = points[0].ground;
  const samples = points.map((point) => {
    const [east, north] = toEnu(point.ground, origin);
    return { x: east, y: north, u: point.image[0], v: point.image[1] };
  });
  const rows = samples.flatMap((sample) => [
    [sample.x, sample.y, 1, 0, 0, 0, -sample.u * sample.x, -sample.u * sample.y],
    [0, 0, 0, sample.x, sample.y, 1, -sample.v * sample.x, -sample.v * sample.y],
  ]);
  const rhs = samples.flatMap((sample) => [sample.u, sample.v]);
  const h = rows.length === 8 ? solve(rows, rhs) : leastSquares(rows, rhs, 8);
  const fit: DroneImageFit = { kind: "homography", originLng: origin[0], originLat: origin[1], h, rmsPx: 0 };
  return { ...fit, rmsPx: rmsPixels(fit, points, widthPx, heightPx) };
}

export function applyDroneFit(fit: DroneImageFit, ring: Position[]): ImagePoint[] {
  const origin: Position = [fit.originLng, fit.originLat];
  const [h0, h1, h2, h3, h4, h5, h6, h7] = fit.h;
  return ring.map((point) => {
    const [east, north] = toEnu(point, origin);
    const weight = h6 * east + h7 * north + 1;
    if (Math.abs(weight) < 1e-9) throw new Error("These points fold the photograph. Move one of them.");
    return [(h0 * east + h1 * north + h2) / weight, (h3 * east + h4 * north + h5) / weight];
  });
}

/** Miss distance for one correspondence point, in photograph pixels. */
export function dronePointErrorPx(fit: DroneImageFit, point: Correspondence, widthPx: number, heightPx: number): number {
  const [u, v] = applyDroneFit(fit, [point.ground])[0];
  const width = widthPx > 0 ? widthPx : 1;
  const height = heightPx > 0 ? heightPx : 1;
  return Math.hypot((u - point.image[0]) * width, (v - point.image[1]) * height);
}

function rmsPixels(fit: DroneImageFit, points: Correspondence[], widthPx: number, heightPx: number): number {
  const squared = points.reduce((sum, point) => {
    const error = dronePointErrorPx(fit, point, widthPx, heightPx);
    return sum + error * error;
  }, 0);
  return Math.sqrt(squared / points.length);
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
      throw new Error("These points are on one line. Spread them around the photograph and the satellite map.");
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
