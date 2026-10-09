export type DetectionCategory =
  | 'flooded_area'
  | 'damaged_building'
  | 'road_affected'
  | 'vehicle'
  | 'other_asset';

export type SeverityLevel = 'high' | 'medium' | 'low' | 'unclassified';

export type AnalysisStatus = 'completed' | 'processing' | 'failed' | 'queued';

export type TileProviderOption = 'satellite' | 'street' | 'terrain';

export interface DetectionFeature {
  id: string;
  category: DetectionCategory;
  name: string;
  confidence: number; // 0.0 - 1.0
  severity: SeverityLevel;
  geometryType: 'Polygon' | 'Point' | 'LineString';
  // Leaflet uses [lat, lng] for points, or array of [lat, lng] for lines/polygons
  coordinates: any;
  areaSqKm?: number;
  lengthKm?: number;
  count?: number;
  projectId: string;
  projectName: string;
  detectedAt: string;
  notes?: string;
  validationStatus?: 'verified' | 'unreviewed' | 'flagged' | 'rejected';
  inspectorNotes?: string;
  attributes?: Record<string, string | number | boolean>;
}

export interface RegionLocation {
  id: string;
  name: string;
  state: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  description: string;
  disasterType: 'Riverine Flood' | 'Flash Flood' | 'Dam Spillway Surge' | 'Urban Waterlogging' | 'Landslide Inundation';
}

export interface DroneTelemetry {
  isConnected: boolean;
  streamUrl: string;
  mode: 'ipwebcam' | 'browsercam' | 'simulated';
  altitudeM: number;
  batteryPct: number;
  speedMps: number;
  headingDeg: number;
  fps: number;
  lat: number;
  lng: number;
  signalQuality: 'Excellent' | 'Good' | 'Fair' | 'Weak';
}

export interface DetectionSummaryRow {
  category: DetectionCategory;
  label: string;
  count: number;
  measurement: number;
  unit: 'sq km' | 'km' | 'items';
  color: string;
}

export interface SeverityDistribution {
  high: number;
  medium: number;
  low: number;
  unclassified: number;
  total: number;
}

export interface ImageryMetadata {
  id: string;
  name: string;
  acquisitionDate: string;
  resolutionMetersPerPx: number;
  crs: string; // e.g. "EPSG:4326 (WGS84)"
  dimensionsPx: string; // e.g. "12400 x 9800 px"
  fileSizeMB: number;
  bbox: [number, number, number, number]; // [minLat, minLng, maxLat, maxLng]
  center: [number, number]; // [lat, lng]
  thumbnailUrl: string;
  fullImageUrl?: string;
  sensorInfo?: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  description: string;
  createdAt: string;
  status: AnalysisStatus;
  imagery: ImageryMetadata;
  featuresCount: number;
  totalAffectedAreaSqKm: number;
  severityDistribution: SeverityDistribution;
  modelUsed: string;
}

export interface AnalysisJob {
  id: string;
  projectId: string;
  projectName: string;
  status: AnalysisStatus;
  progressPercent: number;
  submittedAt: string;
  completedAt?: string;
  modelName: string;
  confidenceThreshold: number;
  errorMessage?: string;
}

export interface LayerConfiguration {
  id: string;
  name: string;
  category: DetectionCategory;
  visible: boolean;
  color: string;
  opacity: number;
  strokeWidth: number;
}

export interface GeoAIModelSpec {
  id: string;
  name: string;
  version: string;
  supportedClasses: DetectionCategory[];
  precision: number;
  recall: number;
  f1Score: number;
  mAP50: number;
  description: string;
  limitations: string[];
}

export type ExportFormat = 'geojson' | 'csv' | 'pdf_summary' | 'geotiff' | 'shapefile';

export interface ClassTableItem {
  category: DetectionCategory;
  label: string;
  count: number;
  areaOrLength: string;
  color: string;
}

export interface HistoricalTrendPoint {
  date: string;
  floodedAreaSqKm: number;
  damagedBuildingsCount: number;
  roadAffectedKm: number;
  totalAssetsCount: number;
}
