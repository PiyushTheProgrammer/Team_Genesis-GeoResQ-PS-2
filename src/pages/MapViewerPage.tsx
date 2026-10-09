import React, { useState } from 'react';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { LayerControlPanel } from '../components/map/LayerControlPanel';
import { DroneLiveConnect } from '../components/drone/DroneLiveConnect';
import { useGeoStore } from '../store/useGeoStore';
import { REGIONS_REGISTRY } from '../data/demoData';
import { formatCategoryName, formatConfidence, getSeverityBadgeStyle } from '../utils/formatters';
import { downloadGeoJSON, downloadShapefile } from '../utils/geoUtils';
import {
  IconMap,
  IconAdjustmentsHorizontal,
  IconFocus2,
  IconCrosshair,
  IconDownload,
  IconMapPin,
  IconDrone,
  IconChevronDown,
  IconShieldCheck,
  IconBinary,
} from '@tabler/icons-react';

export const MapViewerPage: React.FC = () => {
  const {
    features,
    selectedFeature,
    setSelectedFeature,
    geographicContext,
    setGeographicContext,
    activeProject,
    verifyFeature,
  } = useGeoStore();

  const [activeTab, setActiveTab] = useState<'layers' | 'features'>('layers');
  const [featureSearch, setFeatureSearch] = useState('');
  const [showDroneSection, setShowDroneSection] = useState(true);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);

  const regionKeys = Object.keys(REGIONS_REGISTRY);

  const filteredFeatures = features.filter(
    (f) =>
      f.name.toLowerCase().includes(featureSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(featureSearch.toLowerCase()) ||
      f.id.toLowerCase().includes(featureSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-y-auto">
      {/* Header Bar */}
      <div className="bg-white border-b border-[#CBD5E1] px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shadow-xs">
            <IconMap className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0F172A] font-sans leading-tight">
              Interactive Geospatial GIS Map Viewer
            </h1>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#64748B] mt-0.5">
              <span>Region: <strong className="text-[#0F172A]">{geographicContext}</strong></span>
              <span>&bull;</span>
              <span>Active Detections: <strong className="text-[#0284C7]">{features.length}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Controls & Dynamic Region Quick-Fly Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Location Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] rounded-lg text-xs font-mono font-bold hover:bg-[#F1F5F9] shadow-xs"
            >
              <IconMapPin className="w-4 h-4 text-[#0284C7]" />
              <span className="truncate max-w-[120px]">{geographicContext}</span>
              <IconChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
            </button>

            {isLocationMenuOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white border border-[#CBD5E1] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-[#64748B] border-b border-[#E2E8F0]">
                  Fly To Disaster Zone
                </div>
                {regionKeys.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setGeographicContext(loc);
                      setIsLocationMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono flex items-center justify-between hover:bg-[#F0F9FF] ${
                      geographicContext === loc ? 'text-[#0284C7] font-bold bg-[#F0F9FF]' : 'text-[#0F172A]'
                    }`}
                  >
                    <span>{loc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowDroneSection(!showDroneSection)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase border transition-colors shadow-xs ${
              showDroneSection
                ? 'bg-[#0284C7] text-white border-[#0284C7]'
                : 'bg-white text-[#0F172A] border-[#CBD5E1] hover:bg-[#F1F5F9]'
            }`}
          >
            <IconDrone className="w-4 h-4" />
            <span>{showDroneSection ? 'Hide Drone Stream' : 'Show Drone Stream'}</span>
          </button>

          <button
            onClick={() => downloadGeoJSON(features)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white text-[#0F172A] border border-[#CBD5E1] rounded-lg hover:bg-[#F1F5F9] text-xs font-mono font-bold uppercase shadow-xs"
          >
            <IconDownload className="w-4 h-4 text-[#047857]" />
            <span>GeoJSON</span>
          </button>

          <button
            onClick={() => downloadShapefile(features)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D] rounded-lg hover:bg-[#FDE68A] text-xs font-mono font-bold uppercase shadow-xs"
          >
            <IconBinary className="w-4 h-4" />
            <span>Shapefile</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="p-4 space-y-6 max-w-7xl mx-auto w-full flex-1">
        {/* Upper Map Workspace: Map (Left 8 cols) + Side Inspector (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Map Viewport */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            <div className="h-[520px] w-full">
              <InteractiveMap className="h-full w-full" />
            </div>
            <LayerControlPanel />
          </div>

          {/* Right Side Inspector Drawer (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#CBD5E1] rounded-2xl flex flex-col h-[520px] overflow-hidden shadow-xs">
            {/* Drawer Tabs */}
            <div className="flex border-b border-[#CBD5E1] bg-[#F8FAFC] font-mono text-xs shrink-0">
              <button
                onClick={() => setActiveTab('layers')}
                className={`flex-1 py-3 px-3 flex items-center justify-center space-x-1.5 border-r border-[#CBD5E1] font-bold ${
                  activeTab === 'layers'
                    ? 'bg-white text-[#0284C7] border-b-2 border-b-[#0284C7]'
                    : 'text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                <IconAdjustmentsHorizontal className="w-4 h-4" />
                <span>Layer Legend</span>
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`flex-1 py-3 px-3 flex items-center justify-center space-x-1.5 font-bold ${
                  activeTab === 'features'
                    ? 'bg-white text-[#0284C7] border-b-2 border-b-[#0284C7]'
                    : 'text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                <IconCrosshair className="w-4 h-4" />
                <span>Detections ({features.length})</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeTab === 'layers' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-[#F0F9FF] border border-[#BAE6FD] p-3 rounded-xl text-[#0369A1] font-mono text-[11px] leading-relaxed">
                    <strong>Active GeoAI GIS Vector Layers:</strong> Toggle layer visibility or adjust opacity below to analyze specific disaster asset classes.
                  </div>
                  <LayerControlPanel />
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Search feature ID, name or class..."
                    value={featureSearch}
                    onChange={(e) => setFeatureSearch(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#F8FAFC] text-[#0F172A] text-xs font-mono border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0284C7]"
                  />

                  <div className="space-y-2 max-h-[380px] overflow-y-auto divide-y divide-[#F1F5F9]">
                    {filteredFeatures.map((feat) => {
                      const isSelected = selectedFeature?.id === feat.id;
                      const badge = getSeverityBadgeStyle(feat.severity);

                      return (
                        <div
                          key={feat.id}
                          onClick={() => setSelectedFeature(feat)}
                          className={`p-3 rounded-xl cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-[#F0F9FF] border-[#0284C7] shadow-xs'
                              : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0F172A] truncate max-w-[180px]">
                              {feat.name}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold border"
                              style={{ backgroundColor: badge.bg, color: badge.text, borderColor: badge.border }}
                            >
                              {feat.severity}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-[#64748B] mt-1 flex justify-between">
                            <span>{formatCategoryName(feat.category)}</span>
                            <span className="text-[#0284C7] font-bold">
                              Conf: {formatConfidence(feat.confidence)}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-[#64748B] mt-1 flex items-center justify-between">
                            <span>ID: {feat.id}</span>
                            <span className="text-[#047857] font-semibold">
                              {feat.validationStatus === 'verified' ? '✓ Verified' : 'Pending Check'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drone Live Connect Section (Positioned Directly Below Map Viewer as Requested!) */}
        {showDroneSection && <DroneLiveConnect />}
      </div>
    </div>
  );
};
