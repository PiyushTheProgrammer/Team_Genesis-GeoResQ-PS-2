import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconArrowLeft,
  IconUpload,
  IconPlayerPlay,
  IconLoader2,
  IconStack2,
  IconTimeline,
  IconFileCertificate,
  IconAdjustmentsHorizontal,
} from '@tabler/icons-react';
import { useGeoStore } from '../../store/useGeoStore';

interface MainPageHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const MainPageHeader: React.FC<MainPageHeaderProps> = ({
  activeTab = 'overview',
  onTabChange,
}) => {
  const navigate = useNavigate();
  const { currentJob, activeProject, triggerMockAnalysis } = useGeoStore();

  const isProcessing = currentJob?.status === 'processing';

  const handleRunAnalysis = () => {
    triggerMockAnalysis(activeProject?.name || 'Godavari Survey', 'GeoResQ-Vision-v2.4');
  };

  return (
    <div className="bg-white border-b border-[#E2E8F0] px-6 pt-4 pb-0 space-y-4 shadow-xs">
      {/* Top Action Row & Case Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center space-x-1 text-xs font-semibold text-[#0284C7] hover:underline font-mono"
          >
            <IconArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </button>
          <span className="text-[#CBD5E1]">|</span>
          <span className="px-2.5 py-0.5 bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] rounded-full text-[11px] font-mono font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Survey In Progress</span>
          </span>
          <span className="px-2.5 py-0.5 bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD] rounded-full text-[11px] font-mono font-semibold">
            GeoResQ Engine Integrated
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center space-x-2 px-3.5 py-1.5 bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] rounded-lg hover:bg-[#E2E8F0] text-xs font-semibold transition-colors"
          >
            <IconUpload className="w-4 h-4 text-[#475569]" />
            <span>Upload Drone Imagery</span>
          </button>

          <button
            onClick={handleRunAnalysis}
            disabled={isProcessing}
            className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-semibold rounded-lg shadow-xs text-white transition-colors ${
              isProcessing
                ? 'bg-[#64748B] cursor-not-allowed'
                : 'bg-[#043D38] hover:bg-[#022D29]'
            }`}
          >
            {isProcessing ? (
              <>
                <IconLoader2 className="w-4 h-4 animate-spin text-white" />
                <span>Running Trace ({currentJob?.progressPercent}%)</span>
              </>
            ) : (
              <>
                <IconPlayerPlay className="w-4 h-4 fill-current" />
                <span>Run Autonomous Trace</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Case Details Telemetry Metadata Strip (Matching Reference Image 1) */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
        <div>
          <div className="text-[10px] text-[#64748B] uppercase font-semibold">CASE / PROJECT ID</div>
          <div className="font-extrabold text-[#0F172A] mt-0.5 truncate" title={activeProject?.id}>
            {activeProject?.id || 'proj-nashik-2026-001'}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#64748B] uppercase font-semibold">SURVEY REGION</div>
          <div className="font-bold text-[#0F172A] mt-0.5 truncate" title={activeProject?.location}>
            {activeProject?.location || 'Nashik, Maharashtra'}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#64748B] uppercase font-semibold">AFFECTED SPAN</div>
          <div className="font-extrabold text-[#0284C7] mt-0.5">
            {activeProject?.totalAffectedAreaSqKm || 5.27} sq km
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#64748B] uppercase font-semibold">CATEGORY</div>
          <div className="font-bold text-[#0F172A] mt-0.5 truncate">
            Godavari River Surge
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#64748B] uppercase font-semibold">TARGET ECOSYSTEM</div>
          <div className="font-bold text-[#0F172A] mt-0.5 truncate">
            GeoResQ, NDRF, SDMA
          </div>
        </div>
      </div>

      {/* Tab Navigation Strip (Matching Reference Image 1) */}
      <div className="flex space-x-1 border-b border-[#E2E8F0] text-xs font-semibold text-[#64748B] overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: IconAdjustmentsHorizontal },
          { id: 'map', label: 'Interactive Map', icon: IconStack2, path: '/map' },
          { id: 'timeline', label: 'Timeline Flow', icon: IconTimeline },
          { id: 'evidence', label: 'Detection Evidence', icon: IconFileCertificate, path: '/assets' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (onTabChange) onTabChange(tab.id);
                if (tab.path) navigate(tab.path);
              }}
              className={`flex items-center space-x-2 py-2.5 px-3.5 border-b-2 font-medium transition-all ${
                isActive
                  ? 'border-b-[#0284C7] text-[#0284C7] font-bold bg-[#F0F9FF] rounded-t-md'
                  : 'border-b-transparent hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
