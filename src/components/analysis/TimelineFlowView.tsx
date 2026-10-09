import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconCpu,
  IconScan,
  IconMapPin,
  IconStack2,
  IconArrowRight,
  IconCheck,
  IconShieldCheck,
  IconSparkles,
  IconHistory,
  IconFileExport,
  IconTarget,
  IconUserCheck,
  IconAlertTriangle,
  IconDownload,
} from '@tabler/icons-react';
import { useGeoStore } from '../../store/useGeoStore';
import { downloadGeoJSON, downloadShapefile } from '../../utils/geoUtils';

export const TimelineFlowView: React.FC = () => {
  const navigate = useNavigate();
  const { activeProject, features, triggerMockAnalysis, currentJob } = useGeoStore();

  const isProcessing = currentJob?.status === 'processing';

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner & Overview */}
      <div className="bg-gradient-to-r from-[#043D38] via-[#0B4A43] to-[#0284C7] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border border-white/20">
            <IconSparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>End-to-End GeoAI Pipeline Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Automated Drone Imagery Vectorization & Geospatial Telemetry Flow
          </h2>
          <p className="text-xs sm:text-sm text-[#E0F2FE] leading-relaxed">
            From raw, high-resolution GeoTIFF orthomosaics to multi-class deep learning segmentation, georeferenced GIS vectorization, and instant emergency relief dispatch.
          </p>
        </div>
      </div>

      {/* 4-Step Pipeline Flow Diagram (Exact Match to User Diagram Top Row) */}
      <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#0284C7] animate-pulse" />
            <h3 className="font-mono font-black text-sm uppercase tracking-wider text-[#0F172A]">
              End-to-End Operational Pipeline
            </h3>
          </div>
          <span className="text-xs font-mono text-[#64748B] font-semibold">
            Status: {isProcessing ? 'Processing Drone Payload' : 'Online & Synchronized'}
          </span>
        </div>

        {/* Pipeline Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* STEP 1: INPUT */}
          <div className="bg-[#F8FAFC] border-2 border-[#BAE6FD] rounded-xl p-4 flex flex-col justify-between space-y-3 relative hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-[#0284C7] text-white text-[10px] font-mono font-bold rounded-md uppercase">
                  1. INPUT
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">GeoTIFF / NIR</span>
              </div>
              <h4 className="text-xs font-bold text-[#0F172A]">
                Processed Drone Orthomosaic
              </h4>
              <p className="text-[11px] text-[#64748B]">
                With geospatial metadata & coordinate reference systems.
              </p>

              {/* Sample Mini Ortho Preview Box */}
              <div className="bg-white border border-[#CBD5E1] rounded-lg p-2 space-y-1 font-mono text-[10px]">
                <div className="flex justify-between text-[#0F172A] font-bold">
                  <span>Resolution:</span>
                  <span className="text-[#0284C7]">4.5 cm / pixel</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>CRS:</span>
                  <span>EPSG:4326 (WGS84)</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Affine Transform:</span>
                  <span className="text-[#047857]">Calculated</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Sensor:</span>
                  <span>DJI RTK + Zenmuse</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] font-mono text-[#0284C7] font-bold">
              <span>GeoTIFF Ingested</span>
              <IconCheck className="w-4 h-4 text-[#047857]" />
            </div>
          </div>

          {/* STEP 2: AI INFERENCE */}
          <div className="bg-[#F8FAFC] border-2 border-[#93C5FD] rounded-xl p-4 flex flex-col justify-between space-y-3 relative hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-[#1D4ED8] text-white text-[10px] font-mono font-bold rounded-md uppercase">
                  2. AI INFERENCE
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">YOLOv8 + SegFormer</span>
              </div>
              <h4 className="text-xs font-bold text-[#0F172A]">
                Deep Learning Segmentation
              </h4>
              <p className="text-[11px] text-[#64748B]">
                Detect objects and segment disaster regions simultaneously.
              </p>

              {/* 4 Standard Classes Color Codes */}
              <div className="space-y-1 font-mono text-[10px] bg-white border border-[#CBD5E1] p-2 rounded-lg">
                <div className="flex items-center space-x-1.5 text-[#0F172A]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0284C7]" />
                  <span>Flooded Area (Polygon)</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[#0F172A]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" />
                  <span>Damaged Buildings (Polygon)</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[#0F172A]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#D97706]" />
                  <span>Road Network (Line)</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[#0F172A]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
                  <span>Vehicles (Point)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] font-mono text-[#1D4ED8] font-bold">
              <span>Multi-Scale CNN / U-Net</span>
              <IconCpu className="w-4 h-4 text-[#1D4ED8]" />
            </div>
          </div>

          {/* STEP 3: VECTORIZE & GEOREFERENCE */}
          <div className="bg-[#F8FAFC] border-2 border-[#6EE7B7] rounded-xl p-4 flex flex-col justify-between space-y-3 relative hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-[#047857] text-white text-[10px] font-mono font-bold rounded-md uppercase">
                  3. VECTORIZE
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">Pixel &rarr; GPS</span>
              </div>
              <h4 className="text-xs font-bold text-[#0F172A]">
                Vectorize & Georeference
              </h4>
              <p className="text-[11px] text-[#64748B]">
                Convert pixel masks to GIS vector layers with confidence & severity.
              </p>

              {/* Confidence & Severity Breakdown */}
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                <div className="bg-white border border-[#CBD5E1] p-1.5 rounded">
                  <div className="text-[#64748B]">Flooded Area</div>
                  <div className="font-bold text-[#0284C7]">0.92 • High</div>
                </div>
                <div className="bg-white border border-[#CBD5E1] p-1.5 rounded">
                  <div className="text-[#64748B]">Road Network</div>
                  <div className="font-bold text-[#D97706]">0.87 • High</div>
                </div>
                <div className="bg-white border border-[#CBD5E1] p-1.5 rounded">
                  <div className="text-[#64748B]">Damaged Bldg</div>
                  <div className="font-bold text-[#EF4444]">0.90 • Med</div>
                </div>
                <div className="bg-white border border-[#CBD5E1] p-1.5 rounded">
                  <div className="text-[#64748B]">Vehicle Point</div>
                  <div className="font-bold text-[#10B981]">0.84 • Low</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] font-mono text-[#047857] font-bold">
              <span>Affine Transform Matrix</span>
              <IconMapPin className="w-4 h-4 text-[#047857]" />
            </div>
          </div>

          {/* STEP 4: VISUALIZE & EXPORT */}
          <div className="bg-[#F8FAFC] border-2 border-[#FCD34D] rounded-xl p-4 flex flex-col justify-between space-y-3 relative hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-[#D97706] text-white text-[10px] font-mono font-bold rounded-md uppercase">
                  4. VISUALIZE & EXPORT
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">GIS Layers</span>
              </div>
              <h4 className="text-xs font-bold text-[#0F172A]">
                Interactive Map & GIS Export
              </h4>
              <p className="text-[11px] text-[#64748B]">
                Multi-layer map with analysis summary, popup inspector, and exports.
              </p>

              {/* Export Buttons */}
              <div className="space-y-1.5 font-mono text-xs">
                <button
                  onClick={() => downloadGeoJSON(features)}
                  className="w-full py-1 px-2 bg-white text-[#0F172A] border border-[#CBD5E1] rounded-md hover:bg-[#F1F5F9] flex items-center justify-between text-[11px] font-semibold transition-colors"
                >
                  <span>&bull; Export GeoJSON</span>
                  <IconDownload className="w-3.5 h-3.5 text-[#047857]" />
                </button>
                <button
                  onClick={() => downloadShapefile(features)}
                  className="w-full py-1 px-2 bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D] rounded-md hover:bg-[#FDE68A] flex items-center justify-between text-[11px] font-bold transition-colors"
                >
                  <span>&bull; Export Shapefile (.zip)</span>
                  <IconFileExport className="w-3.5 h-3.5 text-[#D97706]" />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] font-mono text-[#D97706] font-bold">
              <span>QGIS / ArcGIS Ready</span>
              <IconStack2 className="w-4 h-4 text-[#D97706]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: How It Addresses Problem + Real-World Impact + USPs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* HOW IT ADDRESSES THE PROBLEM (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#CBD5E1] rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="bg-[#F0F9FF] border border-[#BAE6FD] text-[#0369A1] p-2.5 rounded-xl font-mono font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2">
            <IconTarget className="w-4 h-4 text-[#0284C7]" />
            <span>HOW IT ADDRESSES THE PROBLEM</span>
          </div>

          <ul className="space-y-2.5 text-xs text-[#0F172A] leading-relaxed">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
              <span>
                <strong>Automates slow and time-consuming manual inspection</strong> of high-resolution drone imagery, cutting hours into seconds.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
              <span>
                <strong>Detects and segments key assets and hazards</strong> such as flooded areas, damaged buildings, roads, and vehicles.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
              <span>
                <strong>Converts model outputs into accurate, georeferenced GIS vector layers</strong> (points, lines, polygons) with confidence and severity scores.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
              <span>
                <strong>Provides an interactive map interface</strong> for quick analysis and decision-making, making the entire disaster workflow scalable.
              </span>
            </li>
          </ul>
        </div>

        {/* REAL-WORLD IMPACT (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#CBD5E1] rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] p-2.5 rounded-xl font-mono font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2">
            <IconShieldCheck className="w-4 h-4 text-[#047857]" />
            <span>REAL-WORLD IMPACT</span>
          </div>

          <ul className="space-y-2.5 text-xs text-[#0F172A] leading-relaxed">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#047857] mt-1.5 shrink-0" />
              <span>
                <strong>Faster Situational Awareness:</strong> Helps disaster management teams quickly identify flooded zones, damaged infrastructure, and stranded vehicles.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#047857] mt-1.5 shrink-0" />
              <span>
                <strong>Better Resource Allocation:</strong> Enables prioritization of high-risk areas for field verification, rescue boat deployment, and relief operations.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#047857] mt-1.5 shrink-0" />
              <span>
                <strong>Reliable, Shareable GIS Layers:</strong> Provides standardized, georeferenced outputs that can be directly opened in existing GIS tools (QGIS, ArcGIS).
              </span>
            </li>
          </ul>
        </div>

        {/* WHY WE STAND OUT (USPs) (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#CBD5E1] rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="bg-[#FEF3C7] border border-[#FCD34D] text-[#D97706] p-2.5 rounded-xl font-mono font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2">
            <IconSparkles className="w-4 h-4 text-[#D97706]" />
            <span>WHY WE STAND OUT (USP'S)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans">
            <div className="p-2.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD]">
              <div className="font-bold text-[#0369A1] flex items-center space-x-1">
                <IconAlertTriangle className="w-3.5 h-3.5" />
                <span>Smart Inspection</span>
              </div>
              <p className="text-[10px] text-[#64748B] mt-0.5">
                Flags uncertain AI results and highlights locations that need human checking.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
              <div className="font-bold text-[#15803D] flex items-center space-x-1">
                <IconUserCheck className="w-3.5 h-3.5" />
                <span>Human Review</span>
              </div>
              <p className="text-[10px] text-[#64748B] mt-0.5">
                Lets users check AI results, correct mistakes, and verify important locations.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
              <div className="font-bold text-[#B91C1C] flex items-center space-x-1">
                <IconShieldCheck className="w-3.5 h-3.5" />
                <span>Risk Prioritization</span>
              </div>
              <p className="text-[10px] text-[#64748B] mt-0.5">
                Highlights areas needing urgent attention using clear, predefined risk rules.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF5FF] border border-[#E9D5FF]">
              <div className="font-bold text-[#7E22CE] flex items-center space-x-1">
                <IconHistory className="w-3.5 h-3.5" />
                <span>Track Changes</span>
              </div>
              <p className="text-[10px] text-[#64748B] mt-0.5">
                Compares new drone images with previous results and keeps change history.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] sm:col-span-2">
              <div className="font-bold text-[#0F172A] flex items-center space-x-1">
                <IconMapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Accurate Image-to-Map Conversion</span>
              </div>
              <p className="text-[10px] text-[#64748B] mt-0.5">
                Places detected features at their real-world locations using exact affine transform GPS coordinates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
