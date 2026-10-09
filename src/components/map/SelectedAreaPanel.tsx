import React, { useState } from 'react';
import { useGeoStore } from '../../store/useGeoStore';
import { IconPhoto, IconExternalLink, IconX } from '@tabler/icons-react';

export const SelectedAreaPanel: React.FC = () => {
  const { activeProject } = useGeoStore();
  const [isFullImageModalOpen, setIsFullImageModalOpen] = useState(false);

  if (!activeProject) return null;

  const { imagery } = activeProject;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
              <IconPhoto className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
              Selected Survey Imagery
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#0369A1] bg-[#E0F2FE] px-2 py-0.5 rounded-full border border-[#BAE6FD]">
            DEMO DATA
          </span>
        </div>

        {/* Thumbnail Viewport */}
        <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-1.5 rounded-xl mb-3 relative">
          <div className="h-32 w-full overflow-hidden rounded-lg border border-[#E2E8F0] relative">
            <img
              src={imagery.thumbnailUrl}
              alt={imagery.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1.5 right-1.5 bg-[#043D38] text-white text-[9px] font-mono px-2 py-0.5 rounded-md font-bold">
              GSD: {imagery.resolutionMetersPerPx * 100} cm/px
            </div>
          </div>
          <div className="mt-1.5 text-[11px] font-mono font-semibold text-[#0F172A] truncate px-1">
            {imagery.name}
          </div>
        </div>

        {/* Spatial Metadata Grid */}
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">Project Name:</span>
            <span className="text-[#0F172A] font-semibold truncate max-w-[140px]" title={activeProject.name}>
              {activeProject.name}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">Acquisition Date:</span>
            <span className="text-[#0F172A] font-semibold">{imagery.acquisitionDate}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">Spatial Resolution:</span>
            <span className="text-[#0F172A] font-semibold">{imagery.resolutionMetersPerPx} m/px</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">CRS System:</span>
            <span className="text-[#0F172A] font-semibold">{imagery.crs}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">Dimensions:</span>
            <span className="text-[#0F172A] font-semibold">{imagery.dimensionsPx}</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-[#64748B]">File Payload:</span>
            <span className="text-[#0F172A] font-semibold">{imagery.fileSizeMB} MB</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
        <button
          onClick={() => setIsFullImageModalOpen(true)}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-[#F8FAFC] text-[#0284C7] border border-[#CBD5E1] rounded-xl hover:bg-[#F1F5F9] text-xs font-semibold font-mono uppercase tracking-wider transition-colors"
        >
          <IconExternalLink className="w-4 h-4" />
          <span>View Full Resolution Image</span>
        </button>
      </div>

      {/* Full Image Modal */}
      {isFullImageModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-4xl w-full p-4 relative space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <div className="font-mono font-bold text-sm text-[#0284C7]">
                Full Resolution Telemetry View: {imagery.name}
              </div>
              <button
                onClick={() => setIsFullImageModalOpen(false)}
                className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9]"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto border border-[#E2E8F0] rounded-xl bg-black">
              <img
                src={imagery.fullImageUrl || imagery.thumbnailUrl}
                alt={imagery.name}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span>CRS: {imagery.crs}</span>
              <span>Res: {imagery.resolutionMetersPerPx} m/px</span>
              <span>Dimensions: {imagery.dimensionsPx}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
