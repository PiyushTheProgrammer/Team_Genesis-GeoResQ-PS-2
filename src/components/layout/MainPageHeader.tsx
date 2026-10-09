import React from 'react';
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
  IconDrone,
} from '@tabler/icons-react';
import { useGeoStore } from '../../store/useGeoStore';

interface MainPageHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const MainPageHeader: React.FC<MainPageHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  const navigate = useNavigate();
  const {
    currentJob,
    activeProject,
    triggerMockAnalysis,
    activeDashboardTab,
    setActiveDashboardTab,
    geographicContext,
  } = useGeoStore();

  const currentActiveTab = activeTab || activeDashboardTab;

  const isProcessing = currentJob?.status === 'processing';

  const handleRunAnalysis = () => {
    triggerMockAnalysis(activeProject?.name || 'Rapid Drone Survey', 'genresq_unet_best.pth (PyTorch Custom UNet)');
  };

  const handleTabClick = (tabId: string, path?: string) => {
    setActiveDashboardTab(tabId);
    if (onTabChange) onTabChange(tabId);
    if (path) navigate(path);
  };

  return (
    <div className="bg-white border-b border-[#CBD5E1] px-6 pt-4 pb-0 space-y-4 shadow-xs">
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
            GeoResQ AI Core Active
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center space-x-2 px-3.5 py-1.5 bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD] rounded-lg hover:bg-[#E0F2FE] text-xs font-semibold transition-colors font-mono"
            title="View & Download Statutory Disaster Damage Assessment Report"
          >
            <IconFileCertificate className="w-4 h-4 text-[#0284C7]" />
            <span>Damage Assessment Report</span>
          </button>

          <button
            onClick={() => navigate('/upload')}
            className="flex items-center space-x-2 px-3.5 py-1.5 bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] rounded-lg hover:bg-[#E2E8F0] text-xs font-semibold transition-colors"
          >
            <IconUpload className="w-4 h-4 text-[#475569]" />
            <span>Upload Drone Imagery</span>
          </button>

          {/* Unified Single Action Button for AI Trace */}
          <button
            onClick={handleRunAnalysis}
            disabled={isProcessing}
            className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-semibold rounded-lg shadow-xs text-white transition-all ${
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
                <span>Run Autonomous AI Trace</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Case Details Telemetry Metadata Strip */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
        <div>
          <div className="text-[10px] text-[#64748B] uppercase font-semibold">SURVEY / CASE ID</div>
          <div className="font-extrabold text-[#0F172A] mt-0.5 truncate" title={activeProject?.id}>
            {activeProject?.id || 'proj-nashik-2026-001'}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#64748B] uppercase font-semibold">SURVEY REGION</div>
          <div className="font-bold text-[#0F172A] mt-0.5 truncate" title={geographicContext}>
            {geographicContext}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#64748B] uppercase font-semibold">TOTAL AFFECTED AREA</div>
          <div className="font-extrabold text-[#0284C7] mt-0.5">
            {activeProject?.totalAffectedAreaSqKm || 5.27} sq km
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#64748B] uppercase font-semibold">DISASTER CATEGORY</div>
          <div className="font-bold text-[#0F172A] mt-0.5 truncate">
            Monsoon Riverine Surge
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#64748B] uppercase font-semibold">DISASTER RESPONSE UNITS</div>
          <div className="font-bold text-[#0F172A] mt-0.5 truncate">
            NDRF, SDMA, DDMA
          </div>
        </div>
      </div>

      {/* Tab Navigation Strip */}
      <div className="flex space-x-1 border-b border-[#E2E8F0] text-xs font-semibold text-[#64748B] overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview Dashboard', icon: IconAdjustmentsHorizontal },
          { id: 'timeline', label: 'Timeline Flow & Architecture', icon: IconTimeline },
          { id: 'map', label: 'Interactive GIS Map', icon: IconStack2, path: '/map' },
          { id: 'evidence', label: 'Detection Inventory', icon: IconFileCertificate, path: '/assets' },
          { id: 'reports', label: 'Statutory Reports', icon: IconFileCertificate, path: '/reports' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.path)}
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
