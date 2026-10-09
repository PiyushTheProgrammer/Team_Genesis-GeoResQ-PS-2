import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Popup,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconRefresh,
  IconChevronRight,
  IconChevronLeft,
  IconCpu,
  IconMap,
  IconLayersIntersect,
  IconFileText,
  IconFlame,
  IconRadar,
  IconSparkles,
  IconTerminal2,
  IconArrowRight,
  IconCheck,
  IconActivity,
  IconAlertTriangle,
  IconDrone,
  IconDatabase,
  IconTarget,
  IconDownload,
  IconSettings,
  IconCrosshair,
  IconNavigation,
  IconAmbulance,
  IconEye,
  IconReportAnalytics,
} from '@tabler/icons-react';

interface SimulationStep {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  techStack: string[];
  keyParameters: { label: string; value: string; detail: string }[];
  codeSnippet: string;
  logs: string[];
}

const SIMULATION_STEPS: SimulationStep[] = [
  {
    id: 1,
    title: '1. Multispectral Data Ingestion',
    subtitle: 'Sentinel-2 L2A Satellite & DJI Matrice 300 Drone Sweep',
    badge: 'STAGE 1: INGESTION',
    icon: IconDrone,
    description:
      'GeoResQ ingests GeoTIFF orthomosaics, drone thermal/RGB streams (Mobile IP Webcam / WebRTC / RTMP), and Sentinel-2 L2A surface reflectance data. Spatial resolution ranges from 4.5 cm/px (drone) to 10 m/px (satellite).',
    techStack: ['GeoTIFF Engine', 'GDAL / Rasterio', 'OpenCV 4.10', 'WebRTC / RTSP Ingest'],
    keyParameters: [
      { label: 'Spatial Resolution (GSD)', value: '0.045 m/px', detail: 'Sub-decimeter precision' },
      { label: 'Coordinate Reference System', value: 'EPSG:4326 (WGS84)', detail: 'Universal GIS Datum' },
      { label: 'Spectral Bands', value: 'B02, B03, B04, B08 (NIR)', detail: 'NDWI index processing' },
      { label: 'File Format', value: 'GeoTIFF / COG (Cloud Optimized)', detail: 'Tiled pyramid loading' },
    ],
    codeSnippet: `import rasterio
from rasterio.warp import transform_bounds

with rasterio.open('godavari_orthomosaic.tif') as dataset:
    bounds = dataset.bounds
    crs = dataset.crs
    transform = dataset.transform
    # Calculate Normalized Difference Water Index (NDWI)
    green = dataset.read(2).astype(float)
    nir = dataset.read(4).astype(float)
    ndwi = (green - nir) / (green + nir + 1e-6)`,
    logs: [
      '[INGESTION] Received TIFF orthomosaic file: godavari_basin_hd.tif (428 MB)',
      '[GDAL] Extracted spatial metadata: CRS EPSG:4326, Bounding Box: [73.78, 19.99, 73.81, 20.02]',
      '[OPENCV] Initialized GPU CUDA video pipeline for live WebRTC stream',
      '[BAND READ] Loaded Bands 2,3,4,8; computed NDWI reflectance matrix successfully.',
    ],
  },
  {
    id: 2,
    title: '2. AI Edge Inference & Semantic Segmentation',
    subtitle: 'YOLOv8 Deep Object Detection + SegFormer-B5 Flood Segmentation',
    badge: 'STAGE 2: AI INFERENCE',
    icon: IconCpu,
    description:
      'Dual AI engine pipeline runs concurrently on PyTorch GPU. YOLOv8 detects discrete critical assets (Submerged Vehicles, Stranded Civilians, Submerged Bridges), while SegFormer-B5 performs pixel-accurate semantic segmentation for flooded land boundaries.',
    techStack: ['PyTorch 2.4', 'YOLOv8 Nano/X', 'HuggingFace SegFormer-B5', 'CUDA 12.1 Acceleration'],
    keyParameters: [
      { label: 'Inference Engine', value: 'PyTorch / TensorRT', detail: 'FP16 Half Precision' },
      { label: 'Model Latency', value: '18.4 ms / frame', detail: 'Real-time 60 FPS processing' },
      { label: 'Detection Threshold', value: '0.45 Confidence', detail: 'IoU Threshold: 0.50' },
      { label: 'SegFormer Backbone', value: 'MiT-B5 Transformer', detail: 'Fine-tuned on FloodNet Dataset' },
    ],
    codeSnippet: `import torch
from ultralytics import YOLO

# Load fine-tuned YOLOv8 and SegFormer models
yolo_model = YOLO('models/georesq_yolov8x.pt')
segformer = torch.hub.load('nvidia/segformer-b5-flood')

def run_inference(image_tensor):
    boxes = yolo_model.predict(image_tensor, conf=0.45)
    seg_mask = segformer(image_tensor)
    return boxes, seg_mask`,
    logs: [
      '[MODEL LOAD] TensorRT engine weights loaded into VRAM (2.4 GB allocated)',
      '[YOLOv8] Detected 4 Submerged Vehicles (Conf: 94.2%), 2 Stranded Groups (Conf: 89.1%)',
      '[SEGFORMER] Segmented water body polygon: total area = 1.42 sq km',
      '[INFERENCE COMPLETE] Frame batch processed in 18.2 ms (55.0 FPS)',
    ],
  },
  {
    id: 3,
    title: '3. Geospatial Vectorization & CRS Mapping',
    subtitle: 'Raster Mask to Vector Geometry Conversion (Shapely & PyProj)',
    badge: 'STAGE 3: VECTORIZATION',
    icon: IconLayersIntersect,
    description:
      'Converts raw pixel masks into geo-referenced vector polygons and point geometries. Uses pixel-to-geographic affine transformations to calculate exact lat/lng coordinates and area in square meters.',
    techStack: ['Shapely 2.0', 'PyProj 3.6', 'GeoPandas', 'PostGIS Geometry'],
    keyParameters: [
      { label: 'Affine Matrix', value: '[0.00001, 0, 73.78, ...]', detail: 'Pixel -> Lat/Lng conversion' },
      { label: 'Vector Simplification', value: 'Douglas-Peucker (0.5m)', detail: 'Optimized vertex topology' },
      { label: 'Area Calculation', value: 'Geodesic Ellipsoid (WGS84)', detail: 'Precision area measurement' },
      { label: 'Feature Output', value: 'GeoJSON FeatureCollection', detail: 'RFC 7946 Standard' },
    ],
    codeSnippet: `from rasterio.features import shapes
import shapely.geometry as sg
from pyproj import Transformer

transformer = Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True)

polygons = []
for geom, val in shapes(ndwi_mask, transform=dataset.transform):
    if val == 1: # Flooded pixel class
        poly = sg.shape(geom)
        simplified_poly = poly.simplify(0.00001)
        polygons.append(simplified_poly)`,
    logs: [
      '[RASTER->VECTOR] Extracted 14 discrete polygon contours from NDWI mask',
      '[SHAPELY] Polygon simplification reduced vertex count by 78% without shape loss',
      '[PROJECTION] Transformed coordinates to WGS84 EPSG:4326',
      '[GEOJSON] Created 14 GeoJSON Feature objects with spatial properties',
    ],
  },
  {
    id: 4,
    title: '4. Dynamic Severity & Risk Engine',
    subtitle: 'Multi-Parameter Risk Assessment Matrix',
    badge: 'STAGE 4: RISK SCORING',
    icon: IconFlame,
    description:
      'GeoResQ computes dynamic severity scores (CRITICAL, HIGH, MODERATE, LOW) using spatial proximity to critical infrastructure, water depth estimates, human density layers, and confidence metrics.',
    techStack: ['Custom Dynamic Risk Matrix', 'NumPy Matrix Math', 'Spatial Proximity Engine'],
    keyParameters: [
      { label: 'Proximity Weight', value: '35% Infrastructure', detail: 'Roads, Bridges, Hospitals' },
      { label: 'Flooded Area Weight', value: '30% Submerged Footprint', detail: 'Calculated in sq km' },
      { label: 'Population Weight', value: '25% Human Density Layer', detail: 'Live mobile density index' },
      { label: 'AI Confidence Score', value: '10% Detection Assurance', detail: 'Weighted mean confidence' },
    ],
    codeSnippet: `def calculate_severity(feature):
    infra_dist = feature['properties']['dist_to_critical_infra_m']
    area_sqm = feature['properties']['area_sqm']
    conf = feature['properties']['confidence']
    
    risk_score = (
        (1.0 / max(infra_dist, 1.0)) * 35.0 +
        (min(area_sqm, 50000) / 50000.0) * 30.0 +
        (conf * 10.0) +
        (feature['properties']['pop_density'] * 25.0)
    )
    if risk_score > 75: return "CRITICAL"
    if risk_score > 50: return "HIGH"
    if risk_score > 25: return "MODERATE"
    return "LOW"`,
    logs: [
      '[RISK ENGINE] Evaluating 14 detected features against critical infrastructure layers',
      '[CALCULATION] Godavari Causeway Bridge: Distance = 12m, Submerged = TRUE -> CRITICAL (89%)',
      '[CALCULATION] Submerged Highway NH-160: Area = 45,200 sq.m -> HIGH (78%)',
      '[SYSTEM ALERT] Triggered 2 Critical & 5 High severity flags for emergency dispatch',
    ],
  },
  {
    id: 5,
    title: '5. Emergency Response & Statutory Report Generation',
    subtitle: 'Automated PDF Disaster Report & Dispatch Command System',
    badge: 'STAGE 5: RESPONSE DISPATCH',
    icon: IconFileText,
    description:
      'Generates statutory disaster damage reports formatted for NDRF, SDMA, and DDMA response commanders. Integrates geospatial maps, confidence breakdowns, action plans, and printable PDF documents.',
    techStack: ['ReportLab Python PDF', 'Chart.js Render Engine', 'Automated Email / SMS Dispatch'],
    keyParameters: [
      { label: 'Report Format', value: 'ISO 216 A4 PDF', detail: 'High Resolution Vector PDF' },
      { label: 'Response Units', value: 'NDRF, SDMA, DDMA', detail: 'Automated webhook dispatch' },
      { label: 'Report Compilation Time', value: '< 1.2 Seconds', detail: 'Instant statutory generation' },
      { label: 'GIS Export Formats', value: 'GeoJSON + Shapefile', detail: 'Compatible with ArcGIS & QGIS' },
    ],
    codeSnippet: `from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table

def generate_statutory_pdf(report_data):
    doc = SimpleDocTemplate("GeoResQ_Damage_Report.pdf", pagesize=letter)
    story = [
        Paragraph("GeoResQ Statutory Damage Assessment Report", title_style),
        Spacer(1, 12),
        Table(report_data.summary_table),
        # Attach GIS map screenshot and vector inventory
    ]
    doc.build(story)`,
    logs: [
      '[REPORT GENERATOR] Building Statutory PDF: GeoResQ_Damage_Assessment_Nashik.pdf',
      '[MAP RENDER] Embedded high-resolution GeoTIFF overlay and bounding box annotations',
      '[DISPATCH WEBHOOK] Sent emergency operational alert to NDRF Control Room (Status 200 OK)',
      '[PIPELINE SUCCESS] Complete GeoResQ end-to-end pipeline execution finished in 4.8 seconds!',
    ],
  },
];

// Sample Spatial Data Coordinates (Nashik Godavari Basin)
const MAP_CENTER: [number, number] = [19.9975, 73.7898];

const FLOOD_POLYGON: [number, number][] = [
  [19.9950, 73.7820],
  [19.9995, 73.7860],
  [20.0030, 73.7920],
  [20.0010, 73.7980],
  [19.9970, 73.7990],
  [19.9935, 73.7940],
  [19.9925, 73.7870],
];

const DRONE_FLIGHT_PATH: [number, number][] = [
  [19.9910, 73.7800],
  [19.9945, 73.7845],
  [19.9980, 73.7895],
  [20.0015, 73.7940],
  [20.0040, 73.7985],
];

const DISPATCH_ROUTE: [number, number][] = [
  [19.9850, 73.7750], // NDRF Station
  [19.9880, 73.7810],
  [19.9930, 73.7870],
  [19.9995, 73.7925], // Critical Submerged Causeway
];

// Helper to create Leaflet DivIcons
const createDroneIcon = () =>
  L.divIcon({
    className: 'custom-drone-sim-icon',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; border: 2px dashed #38BDF8; animation: spin 4s linear infinite;"></div>
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background: rgba(2, 132, 199, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="background: #0284C7; color: white; padding: 6px; border-radius: 9999px; border: 2px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 20;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 12m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" />
            <path d="M4.5 4.5l3 3" /><path d="M19.5 4.5l-3 3" /><path d="M4.5 19.5l3 -3" /><path d="M19.5 19.5l-3 -3" />
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });

const createVertexIcon = (label: string) =>
  L.divIcon({
    className: 'custom-vertex-icon',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="width: 12px; height: 12px; border-radius: 9999px; background: #00F0FF; border: 2px solid #FFFFFF; box-shadow: 0 0 10px #00F0FF;"></div>
        <div style="position: absolute; top: -20px; background: #0F172A; color: #38BDF8; font-family: monospace; font-size: 9px; font-weight: bold; padding: 1px 5px; border-radius: 4px; border: 1px solid #0284C7; white-space: nowrap;">
          ${label}
        </div>
      </div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

const createRescueIcon = () =>
  L.divIcon({
    className: 'custom-rescue-icon',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: rgba(16, 185, 129, 0.4); animation: ping 1.2s infinite;"></div>
        <div style="background: #10B981; color: white; padding: 6px; border-radius: 9999px; border: 2px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 25;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

// Map Controller to reset view
const MapViewController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14, { animate: true });
  }, [center, map]);
  return null;
};

export const DemoSimulatePage: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5>(1);
  const [scanPulse, setScanPulse] = useState(0);
  const [dronePosIndex, setDronePosIndex] = useState(0);
  const [rescuePosIndex, setRescuePosIndex] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const step = SIMULATION_STEPS[currentStepIndex];

  // Auto-step timer loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      const stepDuration = 5500 / playbackSpeed;
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= SIMULATION_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, stepDuration);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  // Continuous visual movement timers (Drone & Rescue vehicle)
  useEffect(() => {
    const droneTimer = setInterval(() => {
      setDronePosIndex((p) => (p + 1) % DRONE_FLIGHT_PATH.length);
      setRescuePosIndex((p) => (p + 1) % DISPATCH_ROUTE.length);
      setScanPulse((p) => (p + 1) % 100);
    }, 1800);

    return () => clearInterval(droneTimer);
  }, []);

  // Update logs when step changes
  useEffect(() => {
    setTerminalLogs((prev) => [...prev, ...step.logs]);
  }, [currentStepIndex]);

  // Auto scroll terminal logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const handleNext = () => {
    if (currentStepIndex < SIMULATION_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setDronePosIndex(0);
    setRescuePosIndex(0);
    setTerminalLogs([
      '[SYSTEM INIT] GeoResQ Interactive Simulation Engine initialized.',
      '[PIPELINE READY] Select Play or click step pills to simulate real-time AI execution.',
    ]);
  };

  const droneCurrentPos = DRONE_FLIGHT_PATH[dronePosIndex];
  const rescueCurrentPos = DISPATCH_ROUTE[rescuePosIndex];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-y-auto">
      {/* Top Header Banner */}
      <div className="bg-[#0F172A] text-white border-b border-[#1E293B] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] text-white flex items-center justify-center shadow-md">
            <IconRadar className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-extrabold font-sans tracking-wide text-white">
                Demo Simulate & Full System Architecture Walkthrough
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-[#0284C7]/30 text-[#38BDF8] border border-[#0284C7]/50 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
                <span>Live Interactive Visual Simulation</span>
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Step-by-step spatial visual simulation of GeoResQ GeoAI pipeline from satellite ingest to statutory report dispatch.
            </p>
          </div>
        </div>

        {/* Global Controls Deck */}
        <div className="flex items-center space-x-2 bg-[#1E293B] p-1.5 rounded-xl border border-[#334155]">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              isPlaying
                ? 'bg-[#EF4444] text-white shadow-sm hover:bg-[#DC2626]'
                : 'bg-[#0284C7] text-white shadow-sm hover:bg-[#0369A1]'
            }`}
          >
            {isPlaying ? (
              <>
                <IconPlayerPause className="w-4 h-4" />
                <span>Pause Simulation</span>
              </>
            ) : (
              <>
                <IconPlayerPlay className="w-4 h-4" />
                <span>Run Full Simulation</span>
              </>
            )}
          </button>

          <div className="flex items-center bg-[#0F172A] rounded-lg p-0.5 border border-[#334155] font-mono text-xs">
            {([1, 2, 5] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  playbackSpeed === spd ? 'bg-[#0284C7] text-white' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg text-[#94A3B8] hover:bg-[#334155] disabled:opacity-40 disabled:hover:bg-transparent"
            title="Previous Step"
          >
            <IconChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === SIMULATION_STEPS.length - 1}
            className="p-2 rounded-lg text-[#94A3B8] hover:bg-[#334155] disabled:opacity-40 disabled:hover:bg-transparent"
            title="Next Step"
          >
            <IconChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg text-[#94A3B8] hover:bg-[#334155] hover:text-white"
            title="Reset Simulation"
          >
            <IconRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full flex-1">
        {/* Step Progress Stepper Bar */}
        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-4 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {SIMULATION_STEPS.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isCompleted = idx < currentStepIndex;

              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(idx);
                  }}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl text-left transition-all border ${
                    isActive
                      ? 'bg-[#F0F9FF] border-[#0284C7] shadow-xs'
                      : isCompleted
                      ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                      : 'bg-white border-[#F1F5F9] text-[#94A3B8] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono ${
                      isActive
                        ? 'bg-[#0284C7] text-white'
                        : isCompleted
                        ? 'bg-[#10B981] text-white'
                        : 'bg-[#E2E8F0] text-[#64748B]'
                    }`}
                  >
                    {isCompleted ? <IconCheck className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-xs font-bold truncate ${isActive ? 'text-[#0284C7]' : 'text-[#0F172A]'}`}>
                      {s.title.split('. ')[1]}
                    </div>
                    <div className="text-[10px] font-mono text-[#64748B] truncate mt-0.5">
                      {s.badge}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Grid: Left Interactive Visual Map Simulator + Right Detail Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Visual Simulator Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Visual Viewport Container */}
            <div className="bg-[#0B1528] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg flex flex-col h-[520px] relative">
              {/* Screen Bar */}
              <div className="bg-[#0F172A] border-b border-[#1E293B] px-4 py-2.5 flex items-center justify-between font-mono text-xs text-[#94A3B8] z-20">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-white font-bold ml-2">GEORESQ AI SIMULATOR VIEWPORT</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span>FPS: <strong className="text-[#38BDF8]">58.4</strong></span>
                  <span>LATENCY: <strong className="text-[#10B981]">18ms</strong></span>
                  <span>MODE: <strong className="text-[#F59E0B] uppercase">{step.badge.split(': ')[1]}</strong></span>
                </div>
              </div>

              {/* Interactive Visual Map Render Engine */}
              <div className="flex-1 relative overflow-hidden">
                <MapContainer
                  center={MAP_CENTER}
                  zoom={14}
                  className="h-full w-full z-0"
                  zoomControl={false}
                  attributionControl={false}
                >
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                  <MapViewController center={MAP_CENTER} />

                  {/* STAGE 1 VISUAL: MULTISPECTRAL INGESTION */}
                  {step.id === 1 && (
                    <>
                      {/* Flight Path Polyline */}
                      <Polyline
                        positions={DRONE_FLIGHT_PATH}
                        pathOptions={{ color: '#0284C7', weight: 3, dashArray: '6, 8' }}
                      />
                      {/* Animated Drone Marker */}
                      <Marker position={droneCurrentPos} icon={createDroneIcon()}>
                        <Popup>
                          <div className="p-1 font-mono text-xs">
                            <strong className="text-[#0284C7] block">Matrice 300 RTK Sweeping</strong>
                            <span>GSD: 0.045m/px | ALT: 125m</span>
                          </div>
                        </Popup>
                      </Marker>
                      {/* Ingestion Coverage Polygon */}
                      <Polygon
                        positions={FLOOD_POLYGON}
                        pathOptions={{ color: '#0284C7', fillColor: '#0284C7', fillOpacity: 0.15, weight: 2 }}
                      />
                    </>
                  )}

                  {/* STAGE 2 VISUAL: AI INFERENCE & SEMANTIC SEGMENTATION */}
                  {step.id === 2 && (
                    <>
                      {/* SegFormer Flood Mask */}
                      <Polygon
                        positions={FLOOD_POLYGON}
                        pathOptions={{ color: '#00F0FF', fillColor: '#0284C7', fillOpacity: 0.45, weight: 3 }}
                      />

                      {/* YOLOv8 Box 1: Submerged Vehicle */}
                      <Marker position={[19.9995, 73.7925]} icon={L.divIcon({
                        className: 'custom-yolo-box-1',
                        html: `
                          <div style="border: 2px solid #EF4444; background: rgba(239, 68, 68, 0.25); padding: 4px; border-radius: 6px; box-shadow: 0 0 12px #EF4444; width: 140px;">
                            <div style="background: #EF4444; color: white; font-family: monospace; font-size: 9px; font-weight: bold; padding: 2px 4px; border-radius: 3px; display: flex; justify-content: space-between;">
                              <span>SUBMERGED VEHICLE</span>
                              <span>98.4%</span>
                            </div>
                          </div>
                        `,
                        iconSize: [140, 50],
                        iconAnchor: [70, 25],
                      })} />

                      {/* YOLOv8 Box 2: Stranded Civilians */}
                      <Marker position={[19.9950, 73.7870]} icon={L.divIcon({
                        className: 'custom-yolo-box-2',
                        html: `
                          <div style="border: 2px solid #F59E0B; background: rgba(245, 158, 11, 0.25); padding: 4px; border-radius: 6px; box-shadow: 0 0 12px #F59E0B; width: 150px;">
                            <div style="background: #F59E0B; color: white; font-family: monospace; font-size: 9px; font-weight: bold; padding: 2px 4px; border-radius: 3px; display: flex; justify-content: space-between;">
                              <span>STRANDED POPULATION (4)</span>
                              <span>94.1%</span>
                            </div>
                          </div>
                        `,
                        iconSize: [150, 50],
                        iconAnchor: [75, 25],
                      })} />

                      {/* YOLOv8 Box 3: Submerged Causeway Bridge */}
                      <Marker position={[20.0010, 73.7950]} icon={L.divIcon({
                        className: 'custom-yolo-box-3',
                        html: `
                          <div style="border: 2px solid #00F0FF; background: rgba(0, 240, 255, 0.25); padding: 4px; border-radius: 6px; box-shadow: 0 0 12px #00F0FF; width: 160px;">
                            <div style="background: #0284C7; color: white; font-family: monospace; font-size: 9px; font-weight: bold; padding: 2px 4px; border-radius: 3px; display: flex; justify-content: space-between;">
                              <span>CAUSEWAY BRIDGE</span>
                              <span>96.8%</span>
                            </div>
                          </div>
                        `,
                        iconSize: [160, 50],
                        iconAnchor: [80, 25],
                      })} />
                    </>
                  )}

                  {/* STAGE 3 VISUAL: GEOSPATIAL VECTORIZATION */}
                  {step.id === 3 && (
                    <>
                      {/* Crisp Glowing Vector Wireframe */}
                      <Polygon
                        positions={FLOOD_POLYGON}
                        pathOptions={{ color: '#00F0FF', fillColor: '#00F0FF', fillOpacity: 0.2, weight: 3, dashArray: '4, 4' }}
                      />

                      {/* Polygon Vertex Nodes */}
                      {FLOOD_POLYGON.map((v, i) => (
                        <Marker key={i} position={v} icon={createVertexIcon(`V${i + 1}: ${v[0].toFixed(3)}, ${v[1].toFixed(3)}`)} />
                      ))}
                    </>
                  )}

                  {/* STAGE 4 VISUAL: DYNAMIC SEVERITY & RISK ENGINE */}
                  {step.id === 4 && (
                    <>
                      {/* Critical Impact Circles */}
                      <Circle center={[20.0010, 73.7950]} radius={200} pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.35, weight: 2 }} />
                      <Circle center={[20.0010, 73.7950]} radius={450} pathOptions={{ color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.15, weight: 1.5, dashArray: '6,6' }} />
                      <Circle center={[19.9950, 73.7870]} radius={180} pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.3, weight: 2 }} />

                      {/* Threat Proximity Line */}
                      <Polyline positions={[[20.0010, 73.7950], [19.9950, 73.7870]]} pathOptions={{ color: '#EF4444', weight: 2, dashArray: '4,6' }} />
                    </>
                  )}

                  {/* STAGE 5 VISUAL: EMERGENCY RESPONSE DISPATCH */}
                  {step.id === 5 && (
                    <>
                      {/* Neon Dispatch Route Polyline */}
                      <Polyline positions={DISPATCH_ROUTE} pathOptions={{ color: '#10B981', weight: 5, dashArray: '8, 8' }} />

                      {/* Rescue Vehicle Marker */}
                      <Marker position={rescueCurrentPos} icon={createRescueIcon()}>
                        <Popup>
                          <div className="p-1 font-mono text-xs">
                            <strong className="text-[#10B981] block">NDRF Rescue Unit 04</strong>
                            <span>En Route: Nashik Flood Sector 2</span>
                          </div>
                        </Popup>
                      </Marker>

                      {/* Target Disaster Hub Marker */}
                      <Marker position={[19.9995, 73.7925]} icon={L.divIcon({
                        className: 'custom-target-icon',
                        html: `
                          <div style="background: #EF4444; color: white; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 0 15px #EF4444;">
                            DISASTER SECTOR ALPHA
                          </div>
                        `,
                        iconSize: [140, 24],
                        iconAnchor: [70, 12],
                      })} />
                    </>
                  )}
                </MapContainer>

                {/* Laser Scanning Overlay Animation */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#38BDF8] to-transparent shadow-[0_0_15px_#38BDF8] pointer-events-none transition-all duration-75 z-10"
                  style={{ left: `${scanPulse}%` }}
                />

                {/* Dynamic Floating Visual Overlays per Stage */}
                {step.id === 1 && (
                  <div className="absolute top-4 left-4 z-10 bg-[#0F172A]/90 backdrop-blur border border-[#1E293B] p-3 rounded-xl font-mono text-xs text-white shadow-lg space-y-1">
                    <div className="flex items-center space-x-2 text-[#38BDF8] font-bold">
                      <IconDrone className="w-4 h-4 animate-spin-slow" />
                      <span>LIVE DRONE SWEEP ACTIVE</span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8]">Sensor: Matrice 300 RTK • Altitude: 125m AGL</div>
                    <div className="text-[10px] text-[#10B981]">Spectral Reflectance Index: NDWI Active</div>
                  </div>
                )}

                {step.id === 2 && (
                  <div className="absolute top-4 left-4 z-10 bg-[#0F172A]/90 backdrop-blur border border-[#1E293B] p-3 rounded-xl font-mono text-xs text-white shadow-lg space-y-1">
                    <div className="flex items-center space-x-2 text-[#F59E0B] font-bold">
                      <IconCpu className="w-4 h-4" />
                      <span>DUAL AI MODEL INFERENCE</span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8]">YOLOv8x + SegFormer MiT-B5 TensorRT</div>
                    <div className="text-[10px] text-[#38BDF8]">Flooded Polygon: 5.27 sq km • 14 Assets</div>
                  </div>
                )}

                {step.id === 3 && (
                  <div className="absolute top-4 left-4 z-10 bg-[#0F172A]/90 backdrop-blur border border-[#1E293B] p-3 rounded-xl font-mono text-xs text-white shadow-lg space-y-1">
                    <div className="flex items-center space-x-2 text-[#00F0FF] font-bold">
                      <IconLayersIntersect className="w-4 h-4" />
                      <span>EPSG:4326 GEOJSON MESH</span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8]">Raster &rarr; Vector Topology Extraction</div>
                    <div className="text-[10px] text-[#10B981]">Simplified Vertices: 1,420 Nodes</div>
                  </div>
                )}

                {step.id === 4 && (
                  <div className="absolute top-4 left-4 z-10 bg-[#0F172A]/90 backdrop-blur border border-[#EF4444] p-3 rounded-xl font-mono text-xs text-white shadow-lg space-y-1">
                    <div className="flex items-center space-x-2 text-[#EF4444] font-bold">
                      <IconFlame className="w-4 h-4 animate-bounce" />
                      <span>SEVERITY RISK ASSESSMENT MATRIX</span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8]">Proximity Weight: 35% • Infra Exposure: HIGH</div>
                    <div className="text-[10px] text-[#EF4444] font-bold">CALCULATED SCORE: 89/100 (CRITICAL)</div>
                  </div>
                )}

                {step.id === 5 && (
                  <div className="absolute top-4 left-4 z-10 bg-[#0F172A]/90 backdrop-blur border border-[#10B981] p-3.5 rounded-xl font-mono text-xs text-white shadow-lg space-y-1 max-w-xs">
                    <div className="flex items-center space-x-2 text-[#10B981] font-bold">
                      <IconFileText className="w-4 h-4" />
                      <span>STATUTORY PDF REPORT DISPATCHED</span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8]">Document: GeoResQ_Damage_Report.pdf</div>
                    <div className="text-[10px] text-[#10B981] font-bold flex items-center space-x-1 mt-1">
                      <IconCheck className="w-3.5 h-3.5" />
                      <span>NDRF / SDMA Dispatch Webhook (200 OK)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated System Terminal Output */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-md flex flex-col h-44">
              <div className="bg-[#1E293B] px-4 py-2 flex items-center justify-between border-b border-[#334155] font-mono text-xs text-[#94A3B8]">
                <div className="flex items-center space-x-2">
                  <IconTerminal2 className="w-4 h-4 text-[#38BDF8]" />
                  <span className="text-white font-bold">LIVE EXECUTION TERMINAL LOGS</span>
                </div>
                <button
                  onClick={() => setTerminalLogs([])}
                  className="text-[10px] hover:text-white"
                >
                  Clear Console
                </button>
              </div>

              <div
                ref={logContainerRef}
                className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 bg-[#090D16] text-[#38BDF8]"
              >
                {terminalLogs.map((log, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <span className="text-[#64748B] shrink-0">{`>`}</span>
                    <span className={log.includes('CRITICAL') || log.includes('ALERT') ? 'text-[#EF4444]' : log.includes('SUCCESS') ? 'text-[#10B981]' : 'text-[#CBD5E1]'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Stage Inspector & Technical Deep Dive (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Stage Card */}
            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD]">
                  {step.badge}
                </span>
                <span className="text-xs font-mono text-[#64748B]">
                  Step {step.id} of {SIMULATION_STEPS.length}
                </span>
              </div>

              <div>
                <h2 className="text-base font-extrabold text-[#0F172A] font-sans leading-tight">
                  {step.title}
                </h2>
                <p className="text-xs font-mono text-[#0284C7] font-semibold mt-0.5">
                  {step.subtitle}
                </p>
                <p className="text-xs text-[#475569] leading-relaxed mt-2 font-sans">
                  {step.description}
                </p>
              </div>

              {/* Integrated Tech Stack Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-[#64748B] tracking-wider block">
                  Integrated Stack Components
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {step.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] text-[11px] font-mono font-bold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Parameters Table */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#64748B] tracking-wider block">
                  Operational Parameters & Metrics
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {step.keyParameters.map((param) => (
                    <div
                      key={param.label}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#0F172A] block">{param.label}</span>
                        <span className="text-[10px] font-mono text-[#64748B]">{param.detail}</span>
                      </div>
                      <span className="font-mono font-bold text-[#0284C7] bg-white px-2 py-1 rounded-md border border-[#CBD5E1]">
                        {param.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Code Snippet */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-[#64748B] tracking-wider block">
                  Underlying Python Logic
                </span>
                <div className="bg-[#0F172A] text-[#E2E8F0] p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-44">
                  <pre>{step.codeSnippet}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSimulatePage;
