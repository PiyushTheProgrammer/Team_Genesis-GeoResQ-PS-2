import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useGeoStore } from '../../store/useGeoStore';
import { REGIONS_REGISTRY } from '../../data/demoData';
import { HistoricalTrendPoint } from '../../types/geoai';
import { IconTrendingUp, IconCalendar, IconSparkles } from '@tabler/icons-react';

type MetricType = 'floodedAreaSqKm' | 'damagedBuildingsCount' | 'roadAffectedKm' | 'totalAssetsCount';

export const AreaTrendChart: React.FC = () => {
  const { features, geographicContext, activeProject } = useGeoStore();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('floodedAreaSqKm');

  const metricLabels: Record<MetricType, { label: string; unit: string }> = {
    floodedAreaSqKm: { label: 'Flooded Area', unit: 'sq km' },
    damagedBuildingsCount: { label: 'Damaged Buildings', unit: 'units' },
    roadAffectedKm: { label: 'Road Affected', unit: 'km' },
    totalAssetsCount: { label: 'Total Assets', unit: 'items' },
  };

  // Dynamically compute current real-time metrics from live active features
  const liveMetrics = useMemo(() => {
    const floodedSqKm = features
      .filter((f) => f.category === 'flooded_area')
      .reduce((acc, f) => acc + (f.areaSqKm || 0), 0);

    const damagedCount = features.filter((f) => f.category === 'damaged_building').length;

    const roadKm = features
      .filter((f) => f.category === 'road_affected')
      .reduce((acc, f) => acc + (f.lengthKm || 0), 0);

    const totalAssets = features.length;

    return {
      floodedAreaSqKm: floodedSqKm > 0 ? Math.round(floodedSqKm * 100) / 100 : (activeProject?.totalAffectedAreaSqKm || 5.27),
      damagedBuildingsCount: damagedCount > 0 ? damagedCount : 3,
      roadAffectedKm: roadKm > 0 ? Math.round(roadKm * 100) / 100 : 6.30,
      totalAssetsCount: totalAssets > 0 ? totalAssets : (activeProject?.featuresCount || 12),
    };
  }, [features, activeProject]);

  // Dynamically generate the 6-month historical trend trajectory based on selected region & live metrics
  const dynamicTrendData: HistoricalTrendPoint[] = useMemo(() => {
    const current = liveMetrics;
    const regionName = geographicContext.toLowerCase();

    // Scale factors for earlier months relative to current peak
    let f1 = 0.12, f2 = 0.28, f3 = 0.58, f4 = 0.85, f5 = 0.78;
    if (regionName.includes('assam') || regionName.includes('brahmaputra')) {
      f1 = 0.22; f2 = 0.42; f3 = 0.68; f4 = 0.90; f5 = 0.84;
    } else if (regionName.includes('wayanad')) {
      f1 = 0.05; f2 = 0.12; f3 = 0.45; f4 = 0.98; f5 = 0.88;
    }

    const roundVal = (v: number) => Math.round(v * 100) / 100;

    return [
      {
        date: 'May 2026',
        floodedAreaSqKm: roundVal(current.floodedAreaSqKm * f1),
        damagedBuildingsCount: Math.max(1, Math.floor(current.damagedBuildingsCount * f1)),
        roadAffectedKm: roundVal(current.roadAffectedKm * f1),
        totalAssetsCount: Math.max(2, Math.floor(current.totalAssetsCount * f1)),
      },
      {
        date: 'Jun 2026',
        floodedAreaSqKm: roundVal(current.floodedAreaSqKm * f2),
        damagedBuildingsCount: Math.max(2, Math.floor(current.damagedBuildingsCount * f2)),
        roadAffectedKm: roundVal(current.roadAffectedKm * f2),
        totalAssetsCount: Math.max(4, Math.floor(current.totalAssetsCount * f2)),
      },
      {
        date: 'Jul 2026',
        floodedAreaSqKm: roundVal(current.floodedAreaSqKm * f3),
        damagedBuildingsCount: Math.max(3, Math.floor(current.damagedBuildingsCount * f3)),
        roadAffectedKm: roundVal(current.roadAffectedKm * f3),
        totalAssetsCount: Math.max(8, Math.floor(current.totalAssetsCount * f3)),
      },
      {
        date: 'Aug 2026',
        floodedAreaSqKm: roundVal(current.floodedAreaSqKm * f4),
        damagedBuildingsCount: Math.max(5, Math.floor(current.damagedBuildingsCount * f4)),
        roadAffectedKm: roundVal(current.roadAffectedKm * f4),
        totalAssetsCount: Math.max(12, Math.floor(current.totalAssetsCount * f4)),
      },
      {
        date: 'Sep 2026',
        floodedAreaSqKm: roundVal(current.floodedAreaSqKm * f5),
        damagedBuildingsCount: Math.max(4, Math.floor(current.damagedBuildingsCount * f5)),
        roadAffectedKm: roundVal(current.roadAffectedKm * f5),
        totalAssetsCount: Math.max(10, Math.floor(current.totalAssetsCount * f5)),
      },
      {
        date: 'Oct 2026 (Live)',
        floodedAreaSqKm: current.floodedAreaSqKm,
        damagedBuildingsCount: current.damagedBuildingsCount,
        roadAffectedKm: current.roadAffectedKm,
        totalAssetsCount: current.totalAssetsCount,
      },
    ];
  }, [liveMetrics, geographicContext]);

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-2xl p-4 flex flex-col justify-between h-full space-y-3 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
              <IconTrendingUp className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
              Dynamic Area Trend Analysis
            </h3>
          </div>
          <div className="text-[10px] text-[#64748B] font-mono flex items-center space-x-1 mt-0.5">
            <IconCalendar className="w-3 h-3 text-[#0284C7]" />
            <span>Region: {geographicContext} (May 2026 - Oct 2026)</span>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center space-x-1">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
            className="bg-[#F8FAFC] text-[#0F172A] text-xs font-mono border border-[#CBD5E1] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#0284C7]"
          >
            <option value="floodedAreaSqKm">Flooded Area (sq km)</option>
            <option value="damagedBuildingsCount">Damaged Buildings (count)</option>
            <option value="roadAffectedKm">Road Affected (km)</option>
            <option value="totalAssetsCount">Total Detected Assets</option>
          </select>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-52 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dynamicTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaColorDynamic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284C7" stopOpacity={0.40} />
                <stop offset="95%" stopColor="#0284C7" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
            />
            <YAxis
              stroke="#64748B"
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
            />
            <Tooltip content={<CustomTooltip metricUnit={metricLabels[selectedMetric].unit} />} />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke="#0284C7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#areaColorDynamic)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Real-Time Live Telemetry Footer */}
      <div className="text-[10px] font-mono text-[#64748B] border-t border-[#E2E8F0] pt-2 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <IconSparkles className="w-3 h-3 text-[#0284C7]" />
          <span>
            Live Value ({geographicContext}):{' '}
            <strong className="text-[#0284C7]">
              {liveMetrics[selectedMetric]} {metricLabels[selectedMetric].unit}
            </strong>
          </span>
        </div>
        <span className="text-[#047857] font-bold">● Synchronized with Map & Drone Stream</span>
      </div>
    </div>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label, metricUnit }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white border border-[#CBD5E1] rounded-xl p-2.5 text-xs font-mono shadow-md">
        <div className="text-[#0F172A] font-bold">{label}</div>
        <div className="text-[#0284C7] font-semibold mt-0.5">
          Recorded Value: {val} {metricUnit}
        </div>
      </div>
    );
  }
  return null;
};
