import React from 'react';
import { DEMO_MODEL_SPECS } from '../data/demoData';
import { formatCategoryName } from '../utils/formatters';
import { IconBrain, IconCpu, IconAlertCircle } from '@tabler/icons-react';

export const ModelInsightsPage: React.FC = () => {
  return (
    <div className="flex-1 p-6 space-y-6 bg-[#F8FAFC] overflow-y-auto max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center space-x-2">
          <IconBrain className="w-5 h-5 text-[#0284C7]" />
          <h1 className="text-xl font-bold text-[#0F172A] font-sans">
            GeoAI Model Insights & Evaluation Benchmarks
          </h1>
        </div>
        <p className="text-xs text-[#64748B] font-mono mt-0.5">
          Model architecture telemetry, evaluation metrics, and operational boundary constraints.
        </p>
      </div>

      {/* Model Cards */}
      <div className="space-y-4">
        {DEMO_MODEL_SPECS.map((model) => (
          <div key={model.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] pb-3 gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                  <IconCpu className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A] font-mono">{model.name}</h2>
                  <span className="text-xs text-[#64748B] font-mono mt-0.5">Version: {model.version}</span>
                </div>
              </div>

              <span className="px-3 py-1 bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded-full text-xs font-mono font-bold uppercase">
                Production Ready
              </span>
            </div>

            <p className="text-xs text-[#0F172A] leading-relaxed">{model.description}</p>

            {/* Performance Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <div className="text-[10px] text-[#64748B] uppercase font-bold">mAP @ 0.50</div>
                <div className="text-lg font-extrabold text-[#0284C7] mt-0.5">{(model.mAP50 * 100).toFixed(1)}%</div>
              </div>
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <div className="text-[10px] text-[#64748B] uppercase font-bold">Precision</div>
                <div className="text-lg font-extrabold text-[#0284C7] mt-0.5">{(model.precision * 100).toFixed(1)}%</div>
              </div>
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <div className="text-[10px] text-[#64748B] uppercase font-bold">Recall</div>
                <div className="text-lg font-extrabold text-[#0284C7] mt-0.5">{(model.recall * 100).toFixed(1)}%</div>
              </div>
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <div className="text-[10px] text-[#64748B] uppercase font-bold">F1 Score</div>
                <div className="text-lg font-extrabold text-[#0284C7] mt-0.5">{(model.f1Score * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Supported Classes */}
            <div className="space-y-2 font-mono text-xs">
              <span className="font-bold text-[#0F172A] uppercase text-[11px]">Supported Target Classes:</span>
              <div className="flex flex-wrap gap-2">
                {model.supportedClasses.map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 bg-[#F0F9FF] border border-[#BAE6FD] text-[#0369A1] rounded-lg text-xs font-semibold"
                  >
                    {formatCategoryName(cat)}
                  </span>
                ))}
              </div>
            </div>

            {/* Known Limitations */}
            <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-3.5 space-y-1.5 font-mono text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-[#DC2626]">
                <IconAlertCircle className="w-4 h-4" />
                <span>Operational Limitations & Constraints</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#991B1B] text-[11px]">
                {model.limitations.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
