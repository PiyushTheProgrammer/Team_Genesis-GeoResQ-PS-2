import React from 'react';
import { useGeoStore } from '../../store/useGeoStore';
import {
  IconRipple,
  IconBuildingStore,
  IconRoad,
  IconCar,
  IconBox,
  IconReportAnalytics,
} from '@tabler/icons-react';
import { DetectionCategory } from '../../types/geoai';

interface CategoryMetricRow {
  category: DetectionCategory;
  label: string;
  count: number;
  measurementValue: number;
  unit: 'sq km' | 'km' | 'items';
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
}

export const DetectionSummaryStack: React.FC = () => {
  const { features } = useGeoStore();

  const floodedFeatures = features.filter((f) => f.category === 'flooded_area');
  const totalFloodedArea = floodedFeatures.reduce((acc, f) => acc + (f.areaSqKm || 0), 0);

  const damagedFeatures = features.filter((f) => f.category === 'damaged_building');
  const totalDamagedCount = damagedFeatures.length;

  const roadFeatures = features.filter((f) => f.category === 'road_affected');
  const totalRoadLength = roadFeatures.reduce((acc, f) => acc + (f.lengthKm || 0), 0);

  const vehicleFeatures = features.filter((f) => f.category === 'vehicle');
  const totalVehicleCount = vehicleFeatures.length;

  const otherFeatures = features.filter((f) => f.category === 'other_asset');
  const totalOtherCount = otherFeatures.length;

  const rows: CategoryMetricRow[] = [
    {
      category: 'flooded_area',
      label: 'Flooded Area',
      count: floodedFeatures.length,
      measurementValue: totalFloodedArea,
      unit: 'sq km',
      color: '#0284C7',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD',
      icon: IconRipple,
    },
    {
      category: 'damaged_building',
      label: 'Damaged Buildings',
      count: totalDamagedCount,
      measurementValue: totalDamagedCount,
      unit: 'items',
      color: '#EF4444',
      bgColor: '#FEF2F2',
      borderColor: '#FCA5A5',
      icon: IconBuildingStore,
    },
    {
      category: 'road_affected',
      label: 'Road Affected',
      count: roadFeatures.length,
      measurementValue: totalRoadLength,
      unit: 'km',
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FCD34D',
      icon: IconRoad,
    },
    {
      category: 'vehicle',
      label: 'Vehicles Detected',
      count: totalVehicleCount,
      measurementValue: totalVehicleCount,
      unit: 'items',
      color: '#10B981',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      icon: IconCar,
    },
    {
      category: 'other_asset',
      label: 'Other Assets',
      count: totalOtherCount,
      measurementValue: totalOtherCount,
      unit: 'items',
      color: '#64748B',
      bgColor: '#F8FAFC',
      borderColor: '#E2E8F0',
      icon: IconBox,
    },
  ];

  const maxVal = Math.max(...rows.map((r) => r.measurementValue), 1);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
            <IconReportAnalytics className="w-3.5 h-3.5 stroke-[2]" />
          </div>
          <h3 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
            Detection Summary Metrics
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded-full border border-[#E2E8F0] font-semibold">
          {features.length} Features Total
        </span>
      </div>

      <div className="space-y-3">
        {rows.map((row) => {
          const Icon = row.icon;
          const barWidthPercent = Math.min(100, Math.max(10, (row.measurementValue / maxVal) * 100));

          return (
            <div key={row.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-lg border flex items-center justify-center shrink-0"
                    style={{ backgroundColor: row.bgColor, borderColor: row.borderColor }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: row.color }} />
                  </div>
                  <span className="font-semibold text-[#0F172A]">{row.label}</span>
                </div>
                <div className="font-mono text-xs font-extrabold text-[#0284C7]">
                  {row.measurementValue > 0
                    ? `${row.measurementValue.toFixed(2)} ${row.unit}`
                    : 'Not available'}
                </div>
              </div>

              {/* Horizontal Bar */}
              <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${barWidthPercent}%`,
                    backgroundColor: row.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
