import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeoStore } from '../store/useGeoStore';
import { formatCategoryName, formatConfidence, getSeverityBadgeStyle } from '../utils/formatters';
import {
  IconTarget,
  IconSearch,
  IconDownload,
  IconFocus2,
} from '@tabler/icons-react';

export const DetectedAssetsPage: React.FC = () => {
  const navigate = useNavigate();
  const { features, setSelectedFeature } = useGeoStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const filteredFeatures = features.filter((feat) => {
    const matchesSearch =
      feat.name.toLowerCase().includes(search.toLowerCase()) ||
      feat.id.toLowerCase().includes(search.toLowerCase()) ||
      feat.projectName.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || feat.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || feat.severity === selectedSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Category', 'Name', 'Confidence', 'Severity', 'Geometry', 'Project', 'DetectedAt'];
    const rows = filteredFeatures.map((f) => [
      f.id,
      f.category,
      `"${f.name}"`,
      f.confidence,
      f.severity,
      f.geometryType,
      `"${f.projectName}"`,
      f.detectedAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'GeoResQ_Detected_Assets_Inventory.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex-1 p-6 space-y-4 bg-[#F8FAFC] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E2E8F0] pb-3 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <IconTarget className="w-5 h-5 text-[#0284C7]" />
            <h1 className="text-xl font-bold text-[#0F172A] font-sans">
              Detected Asset Inventory & Telemetry Evidence
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">
            {filteredFeatures.length} of {features.length} Features Filtered
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-[#043D38] text-white rounded-lg hover:bg-[#022D29] text-xs font-mono font-bold uppercase tracking-wider shadow-xs"
        >
          <IconDownload className="w-4 h-4" />
          <span>Export Asset Inventory (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar Box */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-xs">
        <div className="relative">
          <IconSearch className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search asset ID, name or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] text-xs border border-[#E2E8F0] rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-1.5 px-3 bg-[#F8FAFC] text-[#0F172A] text-xs font-mono border border-[#E2E8F0] rounded-lg focus:outline-none"
          >
            <option value="all">All Detection Categories</option>
            <option value="flooded_area">Flooded Area</option>
            <option value="damaged_building">Damaged Building</option>
            <option value="road_affected">Road Affected</option>
            <option value="vehicle">Vehicle</option>
            <option value="other_asset">Other Asset</option>
          </select>
        </div>

        <div>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full py-1.5 px-3 bg-[#F8FAFC] text-[#0F172A] text-xs font-mono border border-[#E2E8F0] rounded-lg focus:outline-none"
          >
            <option value="all">All Severity Levels</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="low">Low Severity</option>
            <option value="unclassified">Unclassified</option>
          </select>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-mono text-[10px] text-[#64748B] uppercase">
            <tr>
              <th className="px-4 py-3">Asset ID</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Feature Description</th>
              <th className="px-4 py-3 text-center">Geometry</th>
              <th className="px-4 py-3 text-right">Confidence</th>
              <th className="px-4 py-3 text-center">Severity</th>
              <th className="px-4 py-3">Dimensions</th>
              <th className="px-4 py-3">Survey Project</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filteredFeatures.map((feat) => {
              const badge = getSeverityBadgeStyle(feat.severity);

              return (
                <tr key={feat.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] font-bold text-[#0284C7]">
                    {feat.id}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#0F172A]">
                    {formatCategoryName(feat.category)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#0F172A] max-w-[200px] truncate" title={feat.name}>
                    {feat.name}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-[10px] uppercase text-[#64748B]">
                    {feat.geometryType}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-extrabold text-[#0284C7]">
                    {formatConfidence(feat.confidence)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold border"
                      style={{
                        backgroundColor: badge.bg,
                        color: badge.text,
                        borderColor: badge.border,
                      }}
                    >
                      {feat.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#64748B]">
                    {feat.areaSqKm
                      ? `${feat.areaSqKm} sq km`
                      : feat.lengthKm
                      ? `${feat.lengthKm} km`
                      : '1 unit'}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#64748B] max-w-[140px] truncate" title={feat.projectName}>
                    {feat.projectName}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedFeature(feat);
                        navigate('/map');
                      }}
                      className="px-3 py-1 bg-[#F8FAFC] text-[#0284C7] border border-[#CBD5E1] rounded-lg hover:bg-[#F1F5F9] text-[10px] font-mono font-bold uppercase flex items-center space-x-1 ml-auto"
                    >
                      <IconFocus2 className="w-3.5 h-3.5" />
                      <span>Locate</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
