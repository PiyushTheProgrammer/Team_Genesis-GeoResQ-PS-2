import React, { useState, useEffect, useRef } from 'react';
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

export const DemoSimulatePage: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5>(1);
  const [scanPulse, setScanPulse] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const step = SIMULATION_STEPS[currentStepIndex];

  // Playback timer loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      const stepDuration = 5000 / playbackSpeed;
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

  // Pulse animation for simulated scan
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setScanPulse((p) => (p + 1) % 100);
    }, 50);
    return () => clearInterval(pulseInterval);
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
    setTerminalLogs([
      '[SYSTEM INIT] GeoResQ Interactive Simulation Engine initialized.',
      '[PIPELINE READY] Select Play or click step pills to simulate real-time AI execution.',
    ]);
  };

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
                <span>Live Interactive Simulation</span>
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Step-by-step interactive demonstration of GeoResQ GeoAI pipeline from satellite ingest to statutory report dispatch.
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
              const StepIcon = s.icon;
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

        {/* Workspace Grid: Left Visual Canvas Simulator + Right Detail Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Visual Simulator Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Visual Screen Card */}
            <div className="bg-[#0B1528] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg flex flex-col h-[460px] relative">
              {/* Screen Bar */}
              <div className="bg-[#0F172A] border-b border-[#1E293B] px-4 py-2.5 flex items-center justify-between font-mono text-xs text-[#94A3B8]">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-white font-bold ml-2">GEORESQ AI SIMULATOR VIEWPORT</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span>FPS: <strong className="text-[#38BDF8]">58.4</strong></span>
                  <span>LATENCY: <strong className="text-[#10B981]">18ms</strong></span>
                  <span>ZOOM: <strong className="text-white">16x</strong></span>
                </div>
              </div>

              {/* Simulation Stage Canvas Preview */}
              <div className="flex-1 relative bg-[#060D1A] overflow-hidden flex items-center justify-center p-4 select-none">
                {/* Simulated Radar Grid Lines */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px]" />

                {/* Laser Sweep Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#38BDF8] to-transparent shadow-[0_0_15px_#38BDF8] transition-all duration-75"
                  style={{ left: `${scanPulse}%` }}
                />

                {/* Stage 1: Ingestion View */}
                {step.id === 1 && (
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in">
                    <div className="w-20 h-20 rounded-full bg-[#0284C7]/20 border-2 border-[#38BDF8] flex items-center justify-center animate-pulse">
                      <IconDrone className="w-10 h-10 text-[#38BDF8]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Ingesting Orthomosaic GeoTIFF</h3>
                      <p className="text-xs text-[#94A3B8] font-mono mt-1">
                        Godavari Basin (Nashik) • Coordinates: 19.9975° N, 73.7898° E
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 w-full max-w-md font-mono text-xs">
                      <div className="bg-[#0F172A] p-2.5 rounded-lg border border-[#1E293B] text-left">
                        <span className="text-[#64748B] block text-[10px]">RASTER CRS</span>
                        <span className="text-[#38BDF8] font-bold">EPSG:4326 (WGS84)</span>
                      </div>
                      <div className="bg-[#0F172A] p-2.5 rounded-lg border border-[#1E293B] text-left">
                        <span className="text-[#64748B] block text-[10px]">BAND CONFIG</span>
                        <span className="text-[#10B981] font-bold">RGB + NIR (4 Bands)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stage 2: AI Inference View */}
                {step.id === 2 && (
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-4 space-y-3 animate-in fade-in">
                    {/* Simulated Bounding Boxes */}
                    <div className="relative w-full max-w-md h-64 bg-[#0F172A] rounded-xl border border-[#38BDF8]/40 overflow-hidden flex items-center justify-center">
                      <div className="absolute top-4 left-4 border-2 border-[#EF4444] bg-[#EF4444]/20 p-2 rounded text-left text-[10px] font-mono text-white animate-pulse">
                        <strong className="block text-[#EF4444]">Submerged Vehicle</strong>
                        <span>Conf: 94.2%</span>
                      </div>
                      <div className="absolute bottom-6 right-8 border-2 border-[#F59E0B] bg-[#F59E0B]/20 p-2 rounded text-left text-[10px] font-mono text-white">
                        <strong className="block text-[#F59E0B]">Stranded Group (4 People)</strong>
                        <span>Conf: 89.1%</span>
                      </div>
                      <div className="absolute top-12 right-12 border-2 border-[#0284C7] bg-[#0284C7]/20 p-2 rounded text-left text-[10px] font-mono text-white">
                        <strong className="block text-[#38BDF8]">Submerged Causeway Bridge</strong>
                        <span>Conf: 96.8%</span>
                      </div>
                      <div className="text-xs font-mono text-[#94A3B8]">
                        SegFormer-B5 Water Mask Layer (Active)
                      </div>
                    </div>
                  </div>
                )}

                {/* Stage 3: Vectorization View */}
                {step.id === 3 && (
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in">
                    <div className="w-20 h-20 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] flex items-center justify-center">
                      <IconLayersIntersect className="w-10 h-10 text-[#10B981]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">GeoJSON Vector Polygon Generator</h3>
                      <p className="text-xs text-[#94A3B8] font-mono mt-1">
                        Converted 14 contours to EPSG:4326 GeoJSON polygons (Total: 5.27 sq km)
                      </p>
                    </div>
                    <div className="bg-[#0F172A] border border-[#1E293B] p-3 rounded-xl w-full max-w-md text-left font-mono text-[11px] text-[#38BDF8]">
                      <code>{`{"type": "FeatureCollection", "features": [{"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [[[73.789, 19.997], ...]]}}]}`}</code>
                    </div>
                  </div>
                )}

                {/* Stage 4: Risk Scoring View */}
                {step.id === 4 && (
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-4 space-y-3 animate-in fade-in">
                    <div className="w-full max-w-md bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-3 text-left font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white font-bold">DISASTER RISK ASSESSMENT MATRIX</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444] font-bold">
                          CRITICAL STATUS
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between text-[11px] text-[#94A3B8] mb-1">
                            <span>Infrastructure Proximity Score</span>
                            <span className="text-[#EF4444] font-bold">92/100</span>
                          </div>
                          <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#EF4444] h-full w-[92%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-[#94A3B8] mb-1">
                            <span>Flooded Area Submersion Index</span>
                            <span className="text-[#F59E0B] font-bold">78/100</span>
                          </div>
                          <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#F59E0B] h-full w-[78%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-[#94A3B8] mb-1">
                            <span>Population Exposure Level</span>
                            <span className="text-[#38BDF8] font-bold">64/100</span>
                          </div>
                          <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#38BDF8] h-full w-[64%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stage 5: Response Dispatch View */}
                {step.id === 5 && (
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in">
                    <div className="w-20 h-20 rounded-full bg-[#0284C7]/20 border-2 border-[#0284C7] flex items-center justify-center animate-bounce">
                      <IconFileText className="w-10 h-10 text-[#38BDF8]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Statutory Report Compiled & Dispatched</h3>
                      <p className="text-xs text-[#94A3B8] font-mono mt-1">
                        Report ID: GEORESQ-2026-NSK-001 • Sent to NDRF Command Center
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1.5 rounded-lg bg-[#10B981]/20 text-[#10B981] border border-[#10B981] font-mono text-xs font-bold flex items-center space-x-1.5">
                        <IconCheck className="w-4 h-4" />
                        <span>PDF Report Generated (1.2s)</span>
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7] font-mono text-xs font-bold flex items-center space-x-1.5">
                        <IconActivity className="w-4 h-4" />
                        <span>Webhook 200 OK</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated System Terminal Output */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-md flex flex-col h-48">
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
