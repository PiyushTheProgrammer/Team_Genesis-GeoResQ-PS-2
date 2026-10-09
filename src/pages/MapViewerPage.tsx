import React, { useState } from 'react';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { LayerControlPanel } from '../components/map/LayerControlPanel';
import { useGeoStore } from '../store/useGeoStore';
import { formatCategoryName, formatConfidence, getSeverityBadgeStyle } from '../utils/formatters';
import {
  IconMap,
  IconAdjustmentsHorizontal,
  IconFocus2,
  IconCrosshair,
  IconDownload,
} from '@tabler/icons-react';

export const MapViewerPage: React.FC = () => {
  const { features, selectedFeature, setSelectedFeature, geographicContext } = useGeoStore();
  const [activeTab, setActiveTab] = useState<'layers' | 'features'>('layers');
  const [featureSearch, setFeatureSearch] = useState('');

  const filteredFeatures = features.filter(
    (f) =>
      f.name.toLowerCase().includes(featureSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(featureSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F5F3ED] overflow-hidden">
      {/* Header Bar */}
      <div className="bg-[#FAF8F5] border-b border-[#D6D5CC] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <IconMap className="w-5 h-5 text-[#173F35]" />
          <div>
            <h1 className="text-base font-bold text-[#173F35] font-sans leading-tight">
              Full-Screen GIS Map Viewer
            </h1>
            <p className="text-[11px] font-mono text-[#65716D]">
              Geographic Region: {geographicContext} | Active Features: {features.length}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(features));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', 'GeoResQ_Features_Nashik.json');
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#ECEAE2] text-[#173F35] border border-[#D6D5CC] hover:bg-[#E4E2D8] text-xs font-mono font-semibold uppercase"
          >
            <IconDownload className="w-4 h-4" />
            <span>Export GeoJSON</span>
          </button>
        </div>
      </div>

      {/* Main Map Workspace with Side Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map Viewport */}
        <div className="flex-1 h-full relative">
          <InteractiveMap className="h-full w-full" />
        </div>

        {/* Side Inspector Drawer (340px) */}
        <div className="w-[340px] shrink-0 bg-[#FAF8F5] border-l border-[#D6D5CC] flex flex-col h-full overflow-hidden">
          {/* Drawer Tabs */}
          <div className="flex border-b border-[#D6D5CC] bg-[#ECEAE2] font-mono text-xs">
            <button
              onClick={() => setActiveTab('layers')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 border-r border-[#D6D5CC] font-semibold ${
                activeTab === 'layers'
                  ? 'bg-[#FAF8F5] text-[#173F35] border-b-2 border-b-[#173F35]'
                  : 'text-[#65716D] hover:bg-[#E4E2D8]'
              }`}
            >
              <IconAdjustmentsHorizontal className="w-4 h-4" />
              <span>Layer Controls</span>
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 font-semibold ${
                activeTab === 'features'
                  ? 'bg-[#FAF8F5] text-[#173F35] border-b-2 border-b-[#173F35]'
                  : 'text-[#65716D] hover:bg-[#E4E2D8]'
              }`}
            >
              <IconCrosshair className="w-4 h-4" />
              <span>Features ({features.length})</span>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {activeTab === 'layers' && <LayerControlPanel />}

            {activeTab === 'features' && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Filter feature list..."
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#ECEAE2] text-[#172522] text-xs font-sans border border-[#D6D5CC] focus:outline-none"
                />

                <div className="divide-y divide-[#D6D5CC] border border-[#D6D5CC]">
                  {filteredFeatures.map((feat) => {
                    const isSelected = selectedFeature?.id === feat.id;
                    const badge = getSeverityBadgeStyle(feat.severity);

                    return (
                      <div
                        key={feat.id}
                        onClick={() => setSelectedFeature(feat)}
                        className={`p-2.5 cursor-pointer font-sans ${
                          isSelected ? 'bg-[#E0EBDC] border-l-2 border-l-[#173F35]' : 'hover:bg-[#ECEAE2]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#172522]">{feat.name}</span>
                          <span
                            className="px-1.5 py-0.2 border text-[9px] font-mono uppercase font-bold"
                            style={{ backgroundColor: badge.bg, color: badge.text, borderColor: badge.border }}
                          >
                            {feat.severity}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-[#65716D] mt-1 flex justify-between">
                          <span>{formatCategoryName(feat.category)}</span>
                          <span className="text-[#173F35] font-semibold">
                            Conf: {formatConfidence(feat.confidence)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Feature Detail Telemetry */}
            {selectedFeature && (
              <div className="border border-[#D6D5CC] bg-[#ECEAE2] p-3 space-y-2 font-mono text-xs">
                <div className="flex items-center space-x-1.5 font-bold text-[#173F35] border-b border-[#D6D5CC] pb-1">
                  <IconFocus2 className="w-4 h-4" />
                  <span>Selected Feature Telemetry</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div><span className="text-[#65716D]">ID:</span> {selectedFeature.id}</div>
                  <div><span className="text-[#65716D]">Name:</span> {selectedFeature.name}</div>
                  <div><span className="text-[#65716D]">Category:</span> {formatCategoryName(selectedFeature.category)}</div>
                  <div><span className="text-[#65716D]">Severity:</span> <span className="font-bold text-[#A64B4B] uppercase">{selectedFeature.severity}</span></div>
                  <div><span className="text-[#65716D]">Confidence:</span> {formatConfidence(selectedFeature.confidence)}</div>
                  {selectedFeature.areaSqKm && (
                    <div><span className="text-[#65716D]">Area:</span> {selectedFeature.areaSqKm} sq km</div>
                  )}
                  {selectedFeature.lengthKm && (
                    <div><span className="text-[#65716D]">Length:</span> {selectedFeature.lengthKm} km</div>
                  )}
                  {selectedFeature.notes && (
                    <div className="text-[10px] text-[#65716D] italic pt-1 border-t border-[#D6D5CC]">
                      "{selectedFeature.notes}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
