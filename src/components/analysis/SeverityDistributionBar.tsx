import React, { useState } from 'react';
import { useGeoStore } from '../../store/useGeoStore';
import { IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';

export const SeverityDistributionBar: React.FC = () => {
  const { features, activeProject } = useGeoStore();
  const [showMethodology, setShowMethodology] = useState(false);

  const dist = activeProject?.severityDistribution || {
    high: features.filter((f) => f.severity === 'high').length,
    medium: features.filter((f) => f.severity === 'medium').length,
    low: features.filter((f) => f.severity === 'low').length,
    unclassified: features.filter((f) => f.severity === 'unclassified').length,
    total: features.length || 1,
  };

  const total = dist.total || 1;
  const highPct = Math.round((dist.high / total) * 100);
  const medPct = Math.round((dist.medium / total) * 100);
  const lowPct = Math.round((dist.low / total) * 100);
  const unclassPct = Math.max(0, 100 - (highPct + medPct + lowPct));

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] flex items-center justify-center text-[#EF4444]">
            <IconAlertTriangle className="w-3.5 h-3.5 stroke-[2]" />
          </div>
          <h3 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
            Severity Classification
          </h3>
        </div>
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="flex items-center space-x-1 text-[11px] font-mono text-[#0284C7] hover:underline font-semibold"
        >
          <IconInfoCircle className="w-3.5 h-3.5" />
          <span>{showMethodology ? 'Hide Rule' : 'Methodology'}</span>
        </button>
      </div>

      {showMethodology && (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl text-[11px] font-mono text-[#64748B]">
          <span className="font-bold text-[#0F172A]">Severity Calculation Rule:</span>
          <p className="mt-0.5 leading-relaxed">
            Evaluated by spatial proximity to critical infrastructure, estimated water depth exceeding 1.5m, and structural collapse indicators.
          </p>
        </div>
      )}

      {/* Segmented Horizontal Bar */}
      <div className="h-4 w-full bg-[#F1F5F9] rounded-full flex overflow-hidden border border-[#E2E8F0]">
        {dist.high > 0 && (
          <div
            className="h-full bg-[#EF4444] flex items-center justify-center text-[9px] font-mono text-white font-extrabold"
            style={{ width: `${highPct}%` }}
            title={`High Severity: ${dist.high} features (${highPct}%)`}
          >
            {highPct > 8 && `${highPct}%`}
          </div>
        )}
        {dist.medium > 0 && (
          <div
            className="h-full bg-[#F59E0B] flex items-center justify-center text-[9px] font-mono text-white font-extrabold"
            style={{ width: `${medPct}%` }}
            title={`Medium Severity: ${dist.medium} features (${medPct}%)`}
          >
            {medPct > 8 && `${medPct}%`}
          </div>
        )}
        {dist.low > 0 && (
          <div
            className="h-full bg-[#10B981] flex items-center justify-center text-[9px] font-mono text-white font-extrabold"
            style={{ width: `${lowPct}%` }}
            title={`Low Severity: ${dist.low} features (${lowPct}%)`}
          >
            {lowPct > 8 && `${lowPct}%`}
          </div>
        )}
        {unclassPct > 0 && (
          <div
            className="h-full bg-[#64748B] flex items-center justify-center text-[9px] font-mono text-white font-extrabold"
            style={{ width: `${unclassPct}%` }}
            title={`Unclassified: ${dist.unclassified} features (${unclassPct}%)`}
          >
            {unclassPct > 8 && `${unclassPct}%`}
          </div>
        )}
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
        <div className="flex items-center space-x-2 border-b border-[#F1F5F9] pb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="text-[#0F172A] font-semibold">High Risk:</span>
          <span className="text-[#0284C7] ml-auto font-bold">{dist.high} ({highPct}%)</span>
        </div>
        <div className="flex items-center space-x-2 border-b border-[#F1F5F9] pb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="text-[#0F172A] font-semibold">Medium Risk:</span>
          <span className="text-[#0284C7] ml-auto font-bold">{dist.medium} ({medPct}%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          <span className="text-[#0F172A] font-semibold">Low Risk:</span>
          <span className="text-[#0284C7] ml-auto font-bold">{dist.low} ({lowPct}%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]" />
          <span className="text-[#0F172A] font-semibold">Unclassified:</span>
          <span className="text-[#0284C7] ml-auto font-bold">{dist.unclassified} ({unclassPct}%)</span>
        </div>
      </div>
    </div>
  );
};
