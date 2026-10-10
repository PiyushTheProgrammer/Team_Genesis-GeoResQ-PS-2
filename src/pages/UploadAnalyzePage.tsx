import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useGeoStore } from '../store/useGeoStore';
import { DEMO_MODEL_SPECS } from '../data/demoData';
import { uploadImagery } from '../services/api';
import {
  IconUpload,
  IconFileCheck,
  IconAlertTriangle,
  IconCpu,
  IconAdjustmentsHorizontal,
  IconPlayerPlay,
  IconCheck,
  IconLoader2,
  IconMapPin,
  IconEye,
  IconLayersIntersect,
  IconInfoCircle,
  IconSparkles,
  IconRefresh,
} from '@tabler/icons-react';

interface OverlayFeature {
  id: string;
  name: string;
  type: 'polygon' | 'polyline' | 'bbox';
  category: 'flooded_area' | 'damaged_building' | 'road_affected' | 'vehicle';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  details: string;
  color: string;
  fillColor: string;
  coords: string;
  bbox?: { x: number; y: number; width: number; height: number };
}

const DEMO_OVERLAY_FEATURES: OverlayFeature[] = [
  {
    id: 'ov-1',
    name: 'Main Flood Inundation Zone',
    type: 'polygon',
    category: 'flooded_area',
    severity: 'CRITICAL',
    details: 'Extent: 14,850 m² | Max Depth: 1.8m | Water Velocity: 2.4 m/s',
    color: '#0284C7',
    fillColor: 'rgba(2, 132, 199, 0.35)',
    coords: '80,180 240,120 420,160 580,240 500,380 300,410 120,340',
  },
  {
    id: 'ov-2',
    name: 'Panchavati Damaged Structure Block',
    type: 'polygon',
    category: 'damaged_building',
    severity: 'HIGH',
    details: 'Area: 1,420 m² | Structural Integrity: 35% | Roof Collapse Detected',
    color: '#EF4444',
    fillColor: 'rgba(239, 68, 68, 0.40)',
    coords: '360,80 480,60 520,130 410,150',
  },
  {
    id: 'ov-3',
    name: 'Submerged Highway Access Segment',
    type: 'polyline',
    category: 'road_affected',
    severity: 'HIGH',
    details: 'Linear Length: 890 meters | Inundated Depth: 0.65m | Impassable',
    color: '#D97706',
    fillColor: 'transparent',
    coords: '40,420 220,320 380,260 620,210',
  },
  {
    id: 'ov-4',
    name: 'Stranded Emergency Vehicles Cluster',
    type: 'bbox',
    category: 'vehicle',
    severity: 'MEDIUM',
    details: 'Count: 3 Vehicles | Coordinates: 20.0081°N, 73.7912°E',
    color: '#10B981',
    fillColor: 'rgba(16, 185, 129, 0.25)',
    coords: '',
    bbox: { x: 260, y: 220, width: 90, height: 60 },
  },
];

export const UploadAnalyzePage: React.FC = () => {
  const navigate = useNavigate();
  const { activeProject, triggerMockAnalysis, currentJob } = useGeoStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    'https://images.unsplash.com/photo-1508873696983-2df5057d225b?auto=format&fit=crop&w=1200&q=80'
  );
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const [selectedModel, setSelectedModel] = useState<string>('genresq_unet_best.pth (PyTorch Custom UNet)');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.75);
  const [showVectorOverlay, setShowVectorOverlay] = useState<boolean>(true);
  const [selectedFeature, setSelectedFeature] = useState<OverlayFeature | null>(DEMO_OVERLAY_FEATURES[0]);

  const [extractClasses, setExtractClasses] = useState({
    flooded_area: true,
    damaged_building: true,
    road_affected: true,
    vehicle: true,
    other_asset: true,
  });

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    setFileError(null);
    setUploadSuccess(false);

    if (rejectedFiles.length > 0) {
      setFileError('Invalid file format. Please upload a GeoTIFF (.tif, .tiff) or orthomosaic image.');
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 2 * 1024 * 1024 * 1024) {
        setFileError('File size exceeds 2 GB limit.');
        return;
      }
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/tiff': ['.tif', '.tiff'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
  });

  const handleStartUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(0);

    await uploadImagery(activeProject?.id || 'proj-nashik-2026-001', selectedFile, (pct) => {
      setUploadProgress(pct);
    });

    setIsUploading(false);
    setUploadSuccess(true);
  };

  const handleRunJob = async () => {
    triggerMockAnalysis(
      selectedFile ? selectedFile.name : 'Nashik Drone Survey Orthomosaic',
      selectedModel
    );
    setShowVectorOverlay(true);
  };

  const isJobProcessing = currentJob?.status === 'processing';
  const isJobCompleted = currentJob?.status === 'completed';

  const visibleFeatures = DEMO_OVERLAY_FEATURES.filter(
    (f) => extractClasses[f.category as keyof typeof extractClasses]
  );

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#F8FAFC] overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] font-sans">
            Drone Imagery Upload & AI Inference Workflow
          </h1>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Submit high-resolution aerial GeoTIFF imagery to trigger automated geospatial detection models.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] rounded-full text-xs font-mono font-bold">
            Model: {selectedModel.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Main Grid: Upload & Controls + Live Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dropzone & Telemetry & Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Step 1: Select File */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                <IconUpload className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <h2 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
                1. Select Drone Imagery File
              </h2>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-5 text-center cursor-pointer rounded-xl transition-all ${
                isDragActive
                  ? 'border-[#0284C7] bg-[#F0F9FF]'
                  : selectedFile
                  ? 'border-[#10B981] bg-[#ECFDF5]'
                  : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#0284C7]'
              }`}
            >
              <input {...getInputProps()} />
              <IconUpload className="w-7 h-7 text-[#0284C7] mx-auto mb-2 stroke-[1.5]" />
              {selectedFile ? (
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#0F172A] font-mono truncate">{selectedFile.name}</div>
                  <div className="text-[11px] font-mono text-[#64748B]">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#0F172A]">
                    Drag & drop GeoTIFF or Orthomosaic imagery here
                  </p>
                  <p className="text-[10px] text-[#64748B] font-mono">
                    Supported formats: .tif, .tiff, .jpg, .png (Max 2 GB)
                  </p>
                </div>
              )}
            </div>

            {fileError && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-[#DC2626] text-xs font-mono flex items-center space-x-2">
                <IconAlertTriangle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {selectedFile && !uploadSuccess && (
              <button
                onClick={handleStartUpload}
                disabled={isUploading}
                className="w-full py-2 bg-[#043D38] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <IconLoader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Payload ({uploadProgress}%)</span>
                  </>
                ) : (
                  <>
                    <IconUpload className="w-4 h-4" />
                    <span>Upload & Extract Telemetry</span>
                  </>
                )}
              </button>
            )}

            {uploadSuccess && (
              <div className="p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-[#047857] text-xs font-mono flex items-center space-x-2 font-semibold">
                <IconCheck className="w-4 h-4 text-[#047857]" />
                <span>Payload validated & uploaded successfully!</span>
              </div>
            )}
          </div>

          {/* Step 2: GeoAI Model Selector */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                <IconCpu className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <h2 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
                2. Select GeoAI Detection Model
              </h2>
            </div>

            <div className="space-y-2">
              {DEMO_MODEL_SPECS.map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModel(mod.name)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedModel === mod.name
                      ? 'bg-[#F0F9FF] border-[#0284C7] shadow-xs'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A] font-mono">{mod.name}</span>
                    <span className="text-[10px] font-mono font-bold text-[#0284C7]">mAP: {mod.mAP50 * 100}%</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1 font-sans">{mod.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Inference Parameters & Run Button */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                <IconAdjustmentsHorizontal className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <h2 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
                3. Inference Cutoff & Target Classes
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[#64748B]">Confidence Cutoff:</span>
                  <span className="font-bold text-[#0284C7]">
                    {Math.round(confidenceThreshold * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="0.95"
                  step="0.05"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
                />
              </div>

              <div className="pt-2 border-t border-[#E2E8F0]">
                <div className="text-xs font-mono font-semibold text-[#0F172A] mb-1.5">
                  Target Feature Layers to Overlay:
                </div>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                  {Object.entries(extractClasses).map(([key, val]) => (
                    <label key={key} className="flex items-center space-x-2 cursor-pointer bg-[#F8FAFC] p-1.5 rounded-lg border border-[#E2E8F0]">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) =>
                          setExtractClasses({ ...extractClasses, [key]: e.target.checked })
                        }
                        className="rounded accent-[#0284C7]"
                      />
                      <span className="capitalize text-[11px] truncate">{key.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleRunJob}
                  disabled={isJobProcessing}
                  className={`w-full py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs border flex items-center justify-center space-x-2 text-white transition-all ${
                    isJobProcessing
                      ? 'bg-[#64748B] border-[#64748B] cursor-not-allowed'
                      : 'bg-[#043D38] border-[#043D38] hover:bg-[#022D29]'
                  }`}
                >
                  {isJobProcessing ? (
                    <>
                      <IconLoader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Running GeoAI Trace ({currentJob?.progressPercent}%)</span>
                    </>
                  ) : (
                    <>
                      <IconPlayerPlay className="w-4 h-4 fill-current" />
                      <span>Submit GeoAI Trace Job</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Image Viewer & Vector Polygon Overlay (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                  <IconEye className="w-3.5 h-3.5 stroke-[2]" />
                </div>
                <h2 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
                  4. Uploaded Imagery & GeoAI Detection Overlay Screen
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowVectorOverlay(!showVectorOverlay)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 border transition-all ${
                    showVectorOverlay
                      ? 'bg-[#0284C7] text-white border-[#0284C7]'
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#CBD5E1]'
                  }`}
                >
                  <IconLayersIntersect className="w-3.5 h-3.5" />
                  <span>{showVectorOverlay ? 'Overlay Visible' : 'Overlay Hidden'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Image + SVG Vector Overlays */}
            <div className="relative w-full h-[440px] rounded-xl overflow-hidden border border-[#CBD5E1] bg-[#0F172A] shadow-inner flex items-center justify-center">
              {/* Background Aerial Drone Image */}
              <img
                src={previewUrl}
                alt="Uploaded Aerial Orthomosaic"
                className="w-full h-full object-cover"
              />

              {/* Vector SVG Overlays Layer */}
              {showVectorOverlay && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-auto"
                  viewBox="0 0 700 440"
                  preserveAspectRatio="none"
                >
                  {visibleFeatures.map((feat) => {
                    const isSelected = selectedFeature?.id === feat.id;
                    if (feat.type === 'polygon') {
                      return (
                        <polygon
                          key={feat.id}
                          points={feat.coords}
                          fill={feat.fillColor}
                          stroke={feat.color}
                          strokeWidth={isSelected ? 3.5 : 2}
                          strokeDasharray={feat.category === 'flooded_area' ? '4,4' : 'none'}
                          className="cursor-pointer transition-all hover:opacity-90"
                          onClick={() => setSelectedFeature(feat)}
                        >
                          <title>{`${feat.name} (${feat.severity})`}</title>
                        </polygon>
                      );
                    }
                    if (feat.type === 'polyline') {
                      return (
                        <polyline
                          key={feat.id}
                          points={feat.coords}
                          fill="none"
                          stroke={feat.color}
                          strokeWidth={isSelected ? 5 : 3.5}
                          strokeDasharray="6,4"
                          className="cursor-pointer transition-all hover:opacity-90"
                          onClick={() => setSelectedFeature(feat)}
                        >
                          <title>{`${feat.name} (${feat.severity})`}</title>
                        </polyline>
                      );
                    }
                    if (feat.type === 'bbox' && feat.bbox) {
                      return (
                        <g key={feat.id} className="cursor-pointer" onClick={() => setSelectedFeature(feat)}>
                          <rect
                            x={feat.bbox.x}
                            y={feat.bbox.y}
                            width={feat.bbox.width}
                            height={feat.bbox.height}
                            fill={feat.fillColor}
                            stroke={feat.color}
                            strokeWidth={isSelected ? 3 : 2}
                            rx={4}
                          />
                          <circle
                            cx={feat.bbox.x + feat.bbox.width / 2}
                            cy={feat.bbox.y + feat.bbox.height / 2}
                            r={6}
                            fill={feat.color}
                          />
                        </g>
                      );
                    }
                    return null;
                  })}
                </svg>
              )}

              {/* Floating Status Badge */}
              <div className="absolute top-3 left-3 bg-[#0F172A]/85 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-2 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>GeoAI Vision Engine: {selectedModel.split(' ')[0]}</span>
              </div>

              {/* Legend Strip Overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#0F172A]/90 backdrop-blur-md border border-white/15 rounded-lg p-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-white gap-2">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded bg-[#0284C7] inline-block border border-white/40" />
                    <span>Flooded Area</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded bg-[#EF4444] inline-block border border-white/40" />
                    <span>Damaged Building</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-0.5 bg-[#D97706] inline-block" />
                    <span>Submerged Road</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded bg-[#10B981] inline-block border border-white/40" />
                    <span>Vehicles / Assets</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/map')}
                  className="px-2.5 py-1 bg-[#0284C7] text-white rounded font-bold text-[10px] uppercase flex items-center space-x-1 hover:bg-[#0369A1]"
                >
                  <IconMapPin className="w-3 h-3" />
                  <span>Open GIS Map</span>
                </button>
              </div>
            </div>

            {/* Feature Details Inspector Card */}
            {selectedFeature && (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedFeature.color }}
                    />
                    <h3 className="text-xs font-bold text-[#0F172A] font-mono">
                      {selectedFeature.name}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      selectedFeature.severity === 'CRITICAL'
                        ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
                        : selectedFeature.severity === 'HIGH'
                        ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                        : 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                    }`}
                  >
                    {selectedFeature.severity} SEVERITY
                  </span>
                </div>

                <p className="text-xs text-[#475569] font-mono">
                  {selectedFeature.details}
                </p>

                <div className="pt-2 border-t border-[#E2E8F0] flex justify-between items-center text-[11px] font-mono text-[#64748B]">
                  <span>Class: <strong className="text-[#0F172A] uppercase">{selectedFeature.category.replace('_', ' ')}</strong></span>
                  <span>Confidence: <strong className="text-[#0284C7]">{(confidenceThreshold * 100).toFixed(0)}%</strong></span>
                  <span>CRS: <strong className="text-[#0F172A]">EPSG:4326</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
