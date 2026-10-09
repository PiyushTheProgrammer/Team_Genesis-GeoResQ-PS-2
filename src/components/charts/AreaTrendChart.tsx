import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DEMO_HISTORICAL_TRENDS } from '../../data/demoData';
import { IconTrendingUp, IconCalendar } from '@tabler/icons-react';

type MetricType = 'floodedAreaSqKm' | 'damagedBuildingsCount' | 'roadAffectedKm' | 'totalAssetsCount';

export const AreaTrendChart: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('floodedAreaSqKm');

  const metricLabels: Record<MetricType, { label: string; unit: string }> = {
    floodedAreaSqKm: { label: 'Flooded Area', unit: 'sq km' },
    damagedBuildingsCount: { label: 'Damaged Buildings', unit: 'units' },
    roadAffectedKm: { label: 'Road Affected', unit: 'km' },
    totalAssetsCount: { label: 'Total Assets', unit: 'items' },
  };

  const hasData = DEMO_HISTORICAL_TRENDS.length > 0;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between h-full space-y-3 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
              <IconTrendingUp className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
              Area Trend Analysis
            </h3>
          </div>
          <div className="text-[10px] text-[#64748B] font-mono flex items-center space-x-1 mt-0.5">
            <IconCalendar className="w-3 h-3 text-[#0284C7]" />
            <span>Past 6 Months (May 2026 - Oct 2026)</span>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center space-x-1">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
            className="bg-[#F8FAFC] text-[#0F172A] text-xs font-mono border border-[#E2E8F0] rounded-lg px-2.5 py-1 focus:outline-none"
          >
            <option value="floodedAreaSqKm">Flooded Area (sq km)</option>
            <option value="damagedBuildingsCount">Damaged Buildings (count)</option>
            <option value="roadAffectedKm">Road Affected (km)</option>
            <option value="totalAssetsCount">Total Detected Assets</option>
          </select>
        </div>
      </div>

      {!hasData ? (
        <div className="h-48 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] flex items-center justify-center p-4 text-center font-mono text-xs text-[#64748B]">
          No historical analysis records exist yet. Additional drone surveys are required to compute spatial trends.
        </div>
      ) : (
        <div className="h-52 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DEMO_HISTORICAL_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#64748B"
                tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              />
              <YAxis
                stroke="#64748B"
                tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              />
              <Tooltip content={<CustomTooltip metricUnit={metricLabels[selectedMetric].unit} />} />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#0284C7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#areaColor)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="text-[10px] font-mono text-[#64748B] border-t border-[#E2E8F0] pt-2">
        Showing temporal variation in <span className="font-semibold text-[#0F172A]">{metricLabels[selectedMetric].label}</span> over consecutive drone flights.
      </div>
    </div>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label, metricUnit }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-2.5 text-xs font-mono shadow-md">
        <div className="text-[#64748B] font-bold">{label}</div>
        <div className="text-[#0284C7] font-semibold mt-0.5">
          Metric: {val} {metricUnit}
        </div>
      </div>
    );
  }
  return null;
};
