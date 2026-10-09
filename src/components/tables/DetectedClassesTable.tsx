import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeoStore } from '../../store/useGeoStore';
import { formatCategoryName, getCategoryColor } from '../../utils/formatters';
import { DetectionCategory, ClassTableItem } from '../../types/geoai';
import { IconTable, IconArrowUp, IconArrowDown, IconExternalLink, IconFilter } from '@tabler/icons-react';

export const DetectedClassesTable: React.FC = () => {
  const navigate = useNavigate();
  const { features, setSelectedFeature } = useGeoStore();

  const [sortField, setSortField] = useState<'category' | 'count' | 'areaOrLength'>('count');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const categories: DetectionCategory[] = [
    'flooded_area',
    'damaged_building',
    'road_affected',
    'vehicle',
    'other_asset',
  ];

  const tableData: ClassTableItem[] = categories.map((cat) => {
    const catFeatures = features.filter((f) => f.category === cat);
    const count = catFeatures.length;

    let areaOrLength = 'Not available';

    if (cat === 'flooded_area') {
      const totalArea = catFeatures.reduce((acc, f) => acc + (f.areaSqKm || 0), 0);
      areaOrLength = totalArea > 0 ? `${totalArea.toFixed(2)} sq km` : 'Not available';
    } else if (cat === 'road_affected') {
      const totalLength = catFeatures.reduce((acc, f) => acc + (f.lengthKm || 0), 0);
      areaOrLength = totalLength > 0 ? `${totalLength.toFixed(2)} km` : 'Not available';
    } else if (cat === 'damaged_building') {
      const totalArea = catFeatures.reduce((acc, f) => acc + (f.areaSqKm || 0), 0);
      areaOrLength = totalArea > 0 ? `${totalArea.toFixed(3)} sq km` : `${count} structures`;
    } else {
      areaOrLength = `${count} units`;
    }

    return {
      category: cat,
      label: formatCategoryName(cat),
      count,
      areaOrLength,
      color: getCategoryColor(cat),
    };
  });

  const filteredData = tableData.filter((item) =>
    item.label.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField === 'count') {
      return sortAsc ? a.count - b.count : b.count - a.count;
    }
    if (sortField === 'category') {
      return sortAsc ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label);
    }
    return sortAsc ? a.areaOrLength.localeCompare(b.areaOrLength) : b.areaOrLength.localeCompare(a.areaOrLength);
  });

  const handleClassClick = (cat: DetectionCategory) => {
    const firstMatch = features.find((f) => f.category === cat);
    if (firstMatch) {
      setSelectedFeature(firstMatch);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between h-full space-y-3 shadow-xs">
      <div>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
              <IconTable className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
              Detected Classes Breakdown
            </h3>
          </div>
          <button
            onClick={() => navigate('/assets')}
            className="flex items-center space-x-1 text-xs font-mono text-[#0284C7] hover:underline font-semibold"
          >
            <span>View All</span>
            <IconExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Input */}
        <div className="my-2.5 relative">
          <IconFilter className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter classes..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0284C7] font-sans"
          />
        </div>

        {/* Compact Table */}
        <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-mono text-[10px] text-[#64748B] uppercase">
              <tr>
                <th
                  onClick={() => {
                    setSortField('category');
                    setSortAsc(!sortAsc);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-[#F1F5F9]"
                >
                  <div className="flex items-center space-x-1">
                    <span>Class</span>
                    {sortField === 'category' && (sortAsc ? <IconArrowUp className="w-3 h-3" /> : <IconArrowDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortField('count');
                    setSortAsc(!sortAsc);
                  }}
                  className="px-3 py-2 text-right cursor-pointer hover:bg-[#F1F5F9]"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Count</span>
                    {sortField === 'count' && (sortAsc ? <IconArrowUp className="w-3 h-3" /> : <IconArrowDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortField('areaOrLength');
                    setSortAsc(!sortAsc);
                  }}
                  className="px-3 py-2 text-right cursor-pointer hover:bg-[#F1F5F9]"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Area / Length</span>
                    {sortField === 'areaOrLength' && (sortAsc ? <IconArrowUp className="w-3 h-3" /> : <IconArrowDown className="w-3 h-3" />)}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {sortedData.map((row) => (
                <tr
                  key={row.category}
                  onClick={() => handleClassClick(row.category)}
                  className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="font-semibold text-[#0F172A]">{row.label}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-extrabold text-[#0284C7]">
                    {row.count}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-[#64748B]">
                    {row.areaOrLength}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-[10px] font-mono text-[#64748B]">
        Click any row to filter the active map layer.
      </div>
    </div>
  );
};
