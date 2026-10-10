import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeoStore } from '../store/useGeoStore';
import { getStatusBadgeStyle } from '../utils/formatters';
import {
  IconFolder,
  IconMapPin,
  IconArrowRight,
  IconPlus,
  IconFileReport,
  IconMap,
  IconTrash,
  IconCpu,
  IconDatabase,
  IconCheck,
  IconLoader2,
} from '@tabler/icons-react';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, activeProject, setActiveProject, deleteProject } = useGeoStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this drone survey and all its detected spatial features from Supabase PostgreSQL?')) {
      setDeletingId(projectId);
      try {
        await deleteProject(projectId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#F8FAFC] overflow-y-auto max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] pb-3 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <IconFolder className="w-5 h-5 text-[#0284C7]" />
            <h1 className="text-xl font-bold text-[#0F172A] font-sans">
              Drone Surveys & Imagery Projects
            </h1>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5 flex items-center space-x-1.5">
            <IconDatabase className="w-3.5 h-3.5 text-[#059669]" />
            <span>Connected to Supabase PostgreSQL &bull; Showing only user-uploaded survey datasets ({projects.length})</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="flex items-center space-x-2 px-4 py-2 bg-[#043D38] text-white rounded-lg hover:bg-[#022D29] text-xs font-mono font-bold uppercase tracking-wider shadow-xs transition-colors"
        >
          <IconPlus className="w-4 h-4" />
          <span>Upload Drone Survey</span>
        </button>
      </div>

      {/* Projects List or Empty State */}
      {projects.length === 0 ? (
        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-10 text-center max-w-lg mx-auto shadow-xs space-y-4 my-12">
          <div className="w-16 h-16 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center mx-auto text-[#0284C7]">
            <IconFolder className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-[#0F172A] font-sans">
              No Drone Surveys in Database
            </h2>
            <p className="text-xs text-[#64748B] font-mono leading-relaxed">
              Only drone surveys that you upload are stored in your Supabase PostgreSQL database and listed here. Upload aerial imagery to extract disaster vectors and generate statutory reports.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/upload')}
              className="w-full py-2.5 px-4 bg-[#043D38] text-white rounded-xl hover:bg-[#022D29] text-xs font-mono font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-2 transition-all"
            >
              <IconPlus className="w-4 h-4" />
              <span>Upload Imagery in Upload & Analyze</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => {
            const isActive = activeProject?.id === proj.id;
            const badge = getStatusBadgeStyle(proj.status);
            const isDeleting = deletingId === proj.id;

            return (
              <div
                key={proj.id}
                className={`bg-white border rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs transition-all ${
                  isActive ? 'border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-md' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold truncate">
                          {proj.id}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded-full text-[9px] font-mono font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <h2 className="text-sm font-bold text-[#0F172A] truncate" title={proj.name}>
                        {proj.name}
                      </h2>
                      <div className="flex items-center space-x-1.5 text-xs text-[#64748B] font-mono">
                        <IconMapPin className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                        <span className="truncate">{proj.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border"
                        style={{ backgroundColor: badge.bg, color: badge.text, borderColor: badge.border }}
                      >
                        {proj.status}
                      </span>
                      <button
                        onClick={(e) => handleDelete(e, proj.id)}
                        disabled={isDeleting}
                        className="p-1 text-[#94A3B8] hover:text-[#DC2626] rounded-lg hover:bg-[#FEF2F2] transition-colors"
                        title="Delete survey from Supabase PostgreSQL"
                      >
                        {isDeleting ? (
                          <IconLoader2 className="w-4 h-4 animate-spin text-[#DC2626]" />
                        ) : (
                          <IconTrash className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed line-clamp-2">
                    {proj.description}
                  </p>

                  {/* Thumbnail Preview */}
                  <div className="mt-3 border border-[#E2E8F0] rounded-xl h-36 bg-[#0F172A] overflow-hidden relative group">
                    <img
                      src={proj.imagery?.thumbnailUrl || 'https://images.unsplash.com/photo-1508873696983-2df5057d225b?auto=format&fit=crop&w=400&q=80'}
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-[#043D38]/90 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-md font-bold truncate max-w-[200px]">
                      {proj.imagery?.name || 'drone_survey.tif'}
                    </div>
                    {proj.modelUsed && (
                      <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-[#38BDF8] text-[9px] font-mono px-2 py-0.5 rounded-md font-bold flex items-center space-x-1">
                        <IconCpu className="w-3 h-3" />
                        <span className="truncate max-w-[160px]">{proj.modelUsed.split(' ')[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E2E8F0] font-mono text-xs">
                    <div>
                      <span className="text-[#64748B] text-[10px]">Acquisition:</span>
                      <div className="font-semibold text-[#0F172A] text-[11px] truncate">
                        {proj.imagery?.acquisitionDate || new Date(proj.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[10px]">Detections:</span>
                      <div className="font-extrabold text-[#0284C7] text-[11px]">
                        {proj.featuresCount} Features
                      </div>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[10px]">Flooded Area:</span>
                      <div className="font-extrabold text-[#EF4444] text-[11px]">
                        {proj.totalAffectedAreaSqKm} sq km
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveProject(proj);
                      navigate('/reports', { state: { caseId: proj.id } });
                    }}
                    className="flex-1 py-1.5 px-2 bg-[#F0FDF4] text-[#047857] border border-[#BBF7D0] hover:bg-[#DCFCE7] text-xs font-mono font-bold uppercase tracking-wider rounded-lg flex items-center justify-center space-x-1 transition-colors"
                  >
                    <IconFileReport className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveProject(proj);
                      navigate('/map');
                    }}
                    className="flex-1 py-1.5 px-2 bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] hover:bg-[#E0F2FE] text-xs font-mono font-bold uppercase tracking-wider rounded-lg flex items-center justify-center space-x-1 transition-colors"
                  >
                    <IconMap className="w-3.5 h-3.5" />
                    <span>View Map</span>
                  </button>

                  {!isActive && (
                    <button
                      onClick={() => setActiveProject(proj)}
                      className="py-1.5 px-2.5 bg-[#F8FAFC] text-[#64748B] border border-[#CBD5E1] hover:bg-[#F1F5F9] text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-colors"
                      title="Set as active survey"
                    >
                      Set Active
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
