import React, { useState } from 'react';
import { IconDatabase, IconSearch } from '@tabler/icons-react';

export const DataSourcesPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filterPills = ['ALL', 'RASTER XYZ', 'SRTM TERRAIN', 'MULTISPECTRAL', 'PHOTOGRAMMETRY'];

  const dataSources = [
    {
      id: 'esri-sat',
      name: 'Esri World Imagery (Satellite)',
      provider: 'Esri ArcGIS Online Services',
      category: 'RASTER XYZ',
      type: 'XYZ Raster Tile Server',
      endpoint: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      status: 'VERIFIED & ACTIVE',
      latency: '42 ms',
      maxZoom: 'Level 19',
      nodalContact: 'GIS Ops Desk (gis-ops@georesq.gov.in)',
    },
    {
      id: 'osm-street',
      name: 'OpenStreetMap Vector Standard',
      provider: 'OpenStreetMap Foundation',
      category: 'RASTER XYZ',
      type: 'XYZ Vector/Raster Server',
      endpoint: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      status: 'VERIFIED & ACTIVE',
      latency: '28 ms',
      maxZoom: 'Level 19',
      nodalContact: 'Map Server Admin (admin@osm.org)',
    },
    {
      id: 'opentopo-terrain',
      name: 'OpenTopoMap Terrain Contours',
      provider: 'SRTM Elevation Telemetry',
      category: 'SRTM TERRAIN',
      type: 'SRTM Elevation Tiles',
      endpoint: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      status: 'VERIFIED & ACTIVE',
      latency: '65 ms',
      maxZoom: 'Level 17',
      nodalContact: 'SRTM Telemetry Liaison (srtm@georesq.gov.in)',
    },
    {
      id: 'dji-p1',
      name: 'DJI Zenmuse P1 Photogrammetry',
      provider: 'DJI Enterprise Matrice 300',
      category: 'PHOTOGRAMMETRY',
      type: 'RGB High-Resolution Sensor',
      endpoint: 'Local Orthomosaic Storage Pipeline',
      status: 'CALIBRATED',
      latency: 'Direct Mount',
      maxZoom: '0.01 m/px',
      nodalContact: 'Drone Unit Lead (drone-unit@georesq.gov.in)',
    },
    {
      id: 'micasense-rededge',
      name: 'MicaSense RedEdge Multispectral',
      provider: 'MicaSense Dual Payload',
      category: 'MULTISPECTRAL',
      type: '5-Band Multispectral',
      endpoint: 'Direct NIR Stream Pipeline',
      status: 'CALIBRATED',
      latency: 'Direct Mount',
      maxZoom: '0.02 m/px',
      nodalContact: 'Remote Sensing Lab (rs-lab@georesq.gov.in)',
    },
  ];

  const filtered = dataSources.filter((ds) => {
    const matchesCategory = selectedFilter === 'ALL' || ds.category === selectedFilter;
    const matchesSearch =
      ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#F8FAFC] overflow-y-auto max-w-6xl mx-auto w-full">
      {/* Directory Header Box matching Image 2 */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
              <IconDatabase className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-[#0F172A] font-sans">
                  GeoResQ Registered Data Sources & Sensor Directory
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] font-mono text-xs font-bold border border-[#BAE6FD]">
                  {dataSources.length} Onboarded Sources
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                Official Law Enforcement Nodal Telemetry & Raster Tile Providers under SAHYOG Gateway
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills Strip matching Image 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search provider, telemetry ID, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] text-xs border border-[#E2E8F0] rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto font-mono text-xs">
            <span className="text-[#64748B] text-[11px] font-semibold mr-1">Supported Category:</span>
            {filterPills.map((pill) => (
              <button
                key={pill}
                onClick={() => setSelectedFilter(pill)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                  selectedFilter === pill
                    ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                    : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Cards matching Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filtered.map((ds) => (
            <div key={ds.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3 shadow-xs hover:border-[#38BDF8] transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{ds.name}</h3>
                  <div className="text-xs text-[#64748B] font-mono mt-0.5">{ds.provider}</div>
                  <div className="text-[11px] text-[#0284C7] font-mono font-bold mt-1">
                    {ds.id.toUpperCase()} • SAHYOG-RE-{ds.id.toUpperCase()}
                  </div>
                </div>

                <span className="px-2.5 py-0.5 bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded-full text-[10px] font-mono font-extrabold">
                  {ds.status}
                </span>
              </div>

              {/* Nodal Officer Contact Box matching Image 2 */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 font-mono text-xs space-y-1">
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span className="font-bold">TELEM CONTACT</span>
                  <span>OFFICIAL NODAL DESK</span>
                </div>
                <div className="font-semibold text-[#0F172A]">{ds.nodalContact}</div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-1 border-t border-[#E2E8F0]">
                <span>Category: <strong className="text-[#0F172A]">{ds.category}</strong></span>
                <span>Latency: <strong className="text-[#0284C7]">{ds.latency}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
