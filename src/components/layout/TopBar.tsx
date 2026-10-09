import React, { useState } from 'react';
import {
  IconSearch,
  IconMapPin,
  IconChevronDown,
  IconCheck,
  IconChevronRight,
  IconPlayerPlay,
} from '@tabler/icons-react';
import { useGeoStore } from '../../store/useGeoStore';

const GEOGRAPHIC_OPTIONS = [
  'Nashik, Maharashtra',
  'Panchavati Sector, Nashik',
  'Gangapur Dam Catchment',
  'Trimbakeshwar Basin',
  'Godavari River Overflow Zone',
];

export const TopBar: React.FC = () => {
  const {
    geographicContext,
    setGeographicContext,
    searchQuery,
    setSearchQuery,
    isBackendConnected,
    activeProject,
    triggerMockAnalysis,
  } = useGeoStore();

  const [isLocationOpen, setIsLocationOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between sticky top-0 z-20 shadow-xs print:hidden">
      {/* Breadcrumbs & Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-2xl">
        {/* Breadcrumb Trail */}
        <div className="hidden lg:flex items-center space-x-1.5 text-xs font-mono text-[#64748B] shrink-0">
          <span className="font-semibold text-[#0F172A]">GeoResQ</span>
          <IconChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>Projects</span>
          <IconChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="font-semibold text-[#0284C7] max-w-[140px] truncate" title={activeProject?.name}>
            {activeProject?.name || 'Godavari Basin'}
          </span>
        </div>

        {/* Search Input with Ctrl K Shortcut */}
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch className="w-4 h-4 text-[#64748B] stroke-[2]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations, assets or projects..."
            className="w-full pl-9 pr-12 py-1.5 bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0284C7] focus:bg-white font-sans transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] bg-[#E2E8F0] border border-[#CBD5E1] rounded">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls & CTA */}
      <div className="flex items-center space-x-3">
        {/* Geographic Context Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] hover:bg-[#F1F5F9] font-medium transition-colors"
          >
            <IconMapPin className="w-4 h-4 text-[#0284C7] stroke-[2]" />
            <span className="font-mono text-xs font-semibold">{geographicContext}</span>
            <IconChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {isLocationOpen && (
            <div className="absolute right-0 mt-1.5 w-60 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1.5 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono font-semibold uppercase text-[#64748B] border-b border-[#E2E8F0]">
                Select Survey Region
              </div>
              {GEOGRAPHIC_OPTIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setGeographicContext(loc);
                    setIsLocationOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-mono flex items-center justify-between hover:bg-[#F1F5F9] transition-colors ${
                    geographicContext === loc ? 'text-[#0284C7] font-semibold bg-[#F0F9FF]' : 'text-[#0F172A]'
                  }`}
                >
                  <span>{loc}</span>
                  {geographicContext === loc && <IconCheck className="w-4 h-4 text-[#0284C7]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Integration Status Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full text-[11px] font-mono font-bold text-[#047857]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{isBackendConnected ? 'API Integrated' : 'GeoAI Integrated'}</span>
        </div>

        {/* Primary CTA Button matching reference Image 1 */}
        <button
          onClick={() =>
            triggerMockAnalysis(activeProject?.name || 'Godavari Survey', 'GeoResQ-Vision-v2.4')
          }
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#043D38] text-white border border-[#043D38] rounded-lg hover:bg-[#022D29] text-xs font-semibold shadow-xs transition-colors"
        >
          <IconPlayerPlay className="w-3.5 h-3.5 fill-current" />
          <span>Run AI Trace</span>
        </button>
      </div>
    </header>
  );
};
