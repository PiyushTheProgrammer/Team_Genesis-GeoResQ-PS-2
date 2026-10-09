import React from 'react';
import { useGeoStore } from '../../store/useGeoStore';
import { IconEye, IconEyeOff, IconAdjustmentsHorizontal } from '@tabler/icons-react';

export const LayerControlPanel: React.FC = () => {
  const { layers, toggleLayerVisibility, updateLayerOpacity } = useGeoStore();

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
            <IconAdjustmentsHorizontal className="w-3.5 h-3.5 stroke-[2]" />
          </div>
          <span className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
            GIS Layer Telemetry Controls
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded-full border border-[#E2E8F0] font-semibold">
          {layers.filter((l) => l.visible).length}/{layers.length} Active
        </span>
      </div>

      <div className="space-y-2">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
              layer.visible
                ? 'bg-[#F8FAFC] border-[#E2E8F0]'
                : 'bg-[#F1F5F9]/50 border-[#E2E8F0] opacity-60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleLayerVisibility(layer.id)}
                className="text-[#0284C7] hover:text-[#0369A1] transition-colors"
                title={layer.visible ? 'Hide layer' : 'Show layer'}
              >
                {layer.visible ? (
                  <IconEye className="w-4 h-4 text-[#0284C7]" />
                ) : (
                  <IconEyeOff className="w-4 h-4 text-[#94A3B8]" />
                )}
              </button>

              {/* Color Swatch */}
              <span
                className="w-3.5 h-3.5 rounded-full border border-white shadow-xs shrink-0"
                style={{ backgroundColor: layer.color }}
              />

              <span className="text-xs font-semibold text-[#0F172A]">
                {layer.name}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={layer.opacity}
                onChange={(e) => updateLayerOpacity(layer.id, parseFloat(e.target.value))}
                className="w-20 h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
                title={`Opacity: ${Math.round(layer.opacity * 100)}%`}
              />
              <span className="text-[10px] font-mono text-[#64748B] w-8 text-right font-semibold">
                {Math.round(layer.opacity * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
