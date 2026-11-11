/** Shared plot-map model. Coordinates are either sheet metres or WGS84. */

export type PlotStatus = "available" | "reserved" | "sold" | "on_hold";

export type MapCrs = "local-metres" | "EPSG:4326";

export type AlignmentStatus = "unverified" | "draft" | "verified";

/** [x, y] in sheet metres, or [lng, lat] when the map CRS is EPSG:4326. */
export type Position = [number, number];

export type MapPlot = {
  plotNumber: string;
  status: PlotStatus;
  areaM2: number;
  frontageM: number | null;
  depthM: number | null;
  priceKes: number | null;
  depositKes: number | null;
  paymentPeriod: string | null;
  /** Geometry in the document CRS. Not closed. */
  ring: Position[];
  /** Sheet geometry in local metres, kept after the map is moved onto the satellite. */
  planRing: Position[] | null;
  dimensionNote: string | null;
};

export type MapRoad = {
  name: string;
  widthM: number | null;
  /** printed = a figure on the sheet. scaled = measured from the sheet against a printed side. */
  widthSource: "printed" | "scaled" | "imported";
  /** Geometry in the document CRS. */
  ring: Position[];
  /** Sheet geometry in local metres, when this road was traced from a plan. */
  planRing: Position[] | null;
};

export type ControlPoint = {
  id: string;
  label: string;
  /** Sheet metres. */
  plan: Position;
  /** [lng, lat] once an administrator has placed this corner on the satellite. */
  ground: Position | null;
};

export type Similarity = {
  kind: "similarity";
  originLng: number;
  originLat: number;
  scale: number;
  rotationRad: number;
  translateEast: number;
  translateNorth: number;
};

/** Affine map from sheet metres to east/north metres at the origin. */
export type AffineFit = {
  kind: "affine";
  originLng: number;
  originLat: number;
  /** east = a*x + b*y + c, north = d*x + e*y + f */
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
};

/**
 * Projective map from sheet metres to east/north metres.
 * Four placed corners each land on the point that was clicked.
 */
export type HomographyFit = {
  kind: "homography";
  originLng: number;
  originLat: number;
  /** h0..h7, with the last matrix entry fixed at 1. */
  h: number[];
};

export type GroundFit = Similarity | AffineFit | HomographyFit;

export type CameraHint = {
  lng: number;
  lat: number;
  label: string;
};

export type PlotMapDocument = {
  slug: string;
  propertyId: number;
  projectName: string;
  location: string;
  surveyRef: string | null;
  alignmentStatus: AlignmentStatus;
  crs: MapCrs;
  published: boolean;
  geometrySource: "survey-sheet" | "imported" | "drawn";
  /** Scanned sheet for reference. It is not a map overlay. */
  sheetImage: string | null;
  notes: string[];
  /** Where to open the satellite while georeferencing. This is not a plot corner. */
  cameraHint: CameraHint | null;
  plots: MapPlot[];
  roads: MapRoad[];
  /** Outer line of the subdivided block, in the document CRS. The highway triangle is not included. */
  boundary: Position[] | null;
  /** The same outline in sheet metres. */
  planBoundary: Position[] | null;
  controlPoints: ControlPoint[];
  transform: GroundFit | null;
  updatedAt: string | null;
};

export type PlotMapSummary = {
  slug: string;
  propertyId: number;
  projectName: string;
  location: string;
  alignmentStatus: AlignmentStatus;
  published: boolean;
  plotCount: number;
  source: "database" | "sheet";
};
