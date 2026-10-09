import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeoStore } from '../../store/useGeoStore';
import { getStatusBadgeStyle } from '../../utils/formatters';
import { IconHistory, IconChevronRight, IconFolderPlus } from '@tabler/icons-react';

export const RecentAnalysesList: React.FC = () => {
  const navigate = useNavigate();
  const { projects, activeProject, setActiveProject } = useGeoStore();

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between h-full space-y-3 shadow-xs">
      <div>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
              <IconHistory className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
              Recent Analyses
            </h3>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs font-mono text-[#0284C7] hover:underline font-semibold"
          >
            All Projects
          </button>
        </div>

        <div className="divide-y divide-[#E2E8F0] mt-2">
          {projects.map((proj) => {
            const isActive = activeProject?.id === proj.id;
            const badge = getStatusBadgeStyle(proj.status);

            return (
              <div
                key={proj.id}
                onClick={() => setActiveProject(proj)}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[#F0F9FF] border-l-4 border-l-[#0284C7]'
                    : 'hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] overflow-hidden shrink-0">
                    <img
                      src={proj.imagery.thumbnailUrl}
                      alt={proj.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0F172A] truncate" title={proj.name}>
                      {proj.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                      {proj.imagery.acquisitionDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border"
                    style={{
                      backgroundColor: badge.bg,
                      color: badge.text,
                      borderColor: badge.border,
                    }}
                  >
                    {proj.status}
                  </span>
                  <IconChevronRight className="w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-[#E2E8F0]">
        <button
          onClick={() => navigate('/upload')}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-[#F8FAFC] text-[#0284C7] border border-[#CBD5E1] rounded-xl hover:bg-[#F1F5F9] text-xs font-semibold font-mono uppercase tracking-wider transition-colors"
        >
          <IconFolderPlus className="w-4 h-4" />
          <span>New Survey Upload</span>
        </button>
      </div>
    </div>
  );
};
