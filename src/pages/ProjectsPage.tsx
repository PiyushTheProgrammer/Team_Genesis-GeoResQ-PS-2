import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeoStore } from '../store/useGeoStore';
import { getStatusBadgeStyle } from '../utils/formatters';
import { IconFolder, IconMapPin, IconArrowRight, IconPlus } from '@tabler/icons-react';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, activeProject, setActiveProject } = useGeoStore();

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#F8FAFC] overflow-y-auto max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] pb-3 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <IconFolder className="w-5 h-5 text-[#0284C7]" />
            <h1 className="text-xl font-bold text-[#0F172A] font-sans">
              Imagery Projects & Drone Surveys
            </h1>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Manage drone survey datasets, orthomosaics, and execution logs.
          </p>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="flex items-center space-x-2 px-4 py-2 bg-[#043D38] text-white rounded-lg hover:bg-[#022D29] text-xs font-mono font-bold uppercase tracking-wider shadow-xs"
        >
          <IconPlus className="w-4 h-4" />
          <span>New Drone Survey Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => {
          const isActive = activeProject?.id === proj.id;
          const badge = getStatusBadgeStyle(proj.status);

          return (
            <div
              key={proj.id}
              className={`bg-white border rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs ${
                isActive ? 'border-[#0284C7] ring-2 ring-[#0284C7]/20' : 'border-[#E2E8F0]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold">{proj.id}</span>
                    <h2 className="text-sm font-bold text-[#0F172A]">{proj.name}</h2>
                    <div className="flex items-center space-x-1.5 text-xs text-[#64748B] font-mono">
                      <IconMapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{proj.location}</span>
                    </div>
                  </div>

                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border"
                    style={{ backgroundColor: badge.bg, color: badge.text, borderColor: badge.border }}
                  >
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{proj.description}</p>

                {/* Thumbnail Preview */}
                <div className="mt-3 border border-[#E2E8F0] rounded-xl h-28 bg-[#F8FAFC] overflow-hidden relative">
                  <img
                    src={proj.imagery.thumbnailUrl}
                    alt={proj.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#043D38] text-white text-[9px] font-mono px-2 py-0.5 rounded-md font-bold">
                    GSD: {proj.imagery.resolutionMetersPerPx} m/px
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E2E8F0] font-mono text-xs">
                  <div>
                    <span className="text-[#64748B] text-[10px]">Acquisition Date:</span>
                    <div className="font-semibold text-[#0F172A]">{proj.imagery.acquisitionDate}</div>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px]">Detections Count:</span>
                    <div className="font-extrabold text-[#0284C7]">{proj.featuresCount} Features</div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-[#E2E8F0]">
                <button
                  onClick={() => {
                    setActiveProject(proj);
                    navigate('/');
                  }}
                  className={`w-full py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                    isActive
                      ? 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]'
                      : 'bg-[#F8FAFC] text-[#0F172A] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <span>{isActive ? 'Active Survey Selected' : 'Set Active & View Telemetry'}</span>
                  <IconArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
