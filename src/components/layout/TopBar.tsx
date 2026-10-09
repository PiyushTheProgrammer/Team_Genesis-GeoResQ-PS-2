import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconSearch,
  IconMapPin,
  IconChevronDown,
  IconCheck,
  IconChevronRight,
  IconDrone,
} from '@tabler/icons-react';
import { useGeoStore } from '../../store/useGeoStore';
import { REGIONS_REGISTRY } from '../../data/demoData';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const {
    geographicContext,
    setGeographicContext,
    searchQuery,
    setSearchQuery,
    isBackendConnected,
    activeProject,
    droneTelemetry,
  } = useGeoStore();

  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const regionKeys = Object.keys(REGIONS_REGISTRY);

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between sticky top-0 z-20 shadow-xs print:hidden min-w-0">
      {/* Breadcrumbs & Search */}
      <div className="flex items-center space-x-3 flex-1 min-w-0 max-w-xl">
        {/* Breadcrumb Trail */}
        <div className="hidden xl:flex items-center space-x-1.5 text-xs font-mono text-[#64748B] shrink-0">
          <span className="font-bold text-[#0F172A]">GeoResQ</span>
          <IconChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>Projects</span>
          <IconChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="font-semibold text-[#0284C7] max-w-[130px] truncate" title={activeProject?.name}>
            {activeProject?.name || 'Godavari Basin'}
          </span>
        </div>

        {/* Search Input with Ctrl K Shortcut */}
        <div className="relative w-full max-w-xs sm:max-w-sm min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch className="w-4 h-4 text-[#64748B] stroke-[2]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations, GIS assets, flood zones..."
            className="w-full pl-9 pr-16 py-1.5 bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0284C7] focus:bg-white font-sans transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] bg-[#E2E8F0] border border-[#CBD5E1] rounded">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Geographic Context Selector (Dynamic Location Switcher) */}
        <div className="relative">
          <button
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] hover:bg-[#F1F5F9] font-medium transition-colors shadow-xs"
            title="Switch Active Survey Region (Pans GIS Map)"
          >
            <IconMapPin className="w-4 h-4 text-[#0284C7] stroke-[2]" />
            <span className="font-mono text-xs font-bold truncate max-w-[140px] sm:max-w-[180px]">
              {geographicContext}
            </span>
            <IconChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {isLocationOpen && (
            <div className="absolute right-0 mt-1.5 w-72 bg-white border border-[#CBD5E1] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-[#64748B] border-b border-[#E2E8F0] flex justify-between items-center">
                <span>Select Survey Region (Map Pans)</span>
                <span className="text-[#0284C7] font-bold">{regionKeys.length} Regions</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#F1F5F9]">
                {regionKeys.map((loc) => {
                  const reg = REGIONS_REGISTRY[loc];
                  const isSelected = geographicContext === loc;
                  return (
                    <button
                      key={loc}
                      onClick={() => {
                        setGeographicContext(loc);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-mono flex flex-col hover:bg-[#F0F9FF] transition-colors ${
                        isSelected ? 'bg-[#F0F9FF] text-[#0284C7] font-bold border-l-2 border-l-[#0284C7]' : 'text-[#0F172A]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{loc}</span>
                        {isSelected && <IconCheck className="w-4 h-4 text-[#0284C7]" />}
                      </div>
                      <span className="text-[10px] text-[#64748B] font-sans font-normal mt-0.5">
                        {reg?.disasterType || 'Flood Inundation Sector'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live Drone Connectivity Quick Badge */}
        <div
          onClick={() => navigate('/map')}
          className={`cursor-pointer hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border transition-colors ${
            droneTelemetry.isConnected
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]'
              : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
          }`}
          title="Drone Live Stream Status"
        >
          <IconDrone className={`w-3.5 h-3.5 ${droneTelemetry.isConnected ? 'text-[#10B981]' : 'text-[#64748B]'}`} />
          <span>{droneTelemetry.isConnected ? 'Drone Connected' : 'Drone Offline'}</span>
        </div>

        {/* Integration Status Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full text-[11px] font-mono font-bold text-[#047857]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{isBackendConnected ? 'Backend API Active' : 'GeoAI Vision v2.4'}</span>
        </div>
      </div>
    </header>
  );
};
