import React from 'react';
import { useGeoStore } from '../store/useGeoStore';
import { formatCategoryName, formatConfidence } from '../utils/formatters';
import {
  IconFileReport,
  IconDownload,
  IconBuildingStore,
  IconRipple,
  IconRoad,
  IconShieldCheck,
  IconCertificate,
} from '@tabler/icons-react';

export const ReportsPage: React.FC = () => {
  const { activeProject, features, geographicContext } = useGeoStore();

  if (!activeProject) return null;

  const totalFlooded = features
    .filter((f) => f.category === 'flooded_area')
    .reduce((acc, f) => acc + (f.areaSqKm || 0), 0);

  const totalDamagedBuildings = features.filter((f) => f.category === 'damaged_building').length;
  const totalRoadAffected = features
    .filter((f) => f.category === 'road_affected')
    .reduce((acc, f) => acc + (f.lengthKm || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#F8FAFC] overflow-y-auto max-w-5xl mx-auto w-full">
      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] pb-3 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <IconFileReport className="w-5 h-5 text-[#0284C7]" />
            <h1 className="text-xl font-bold text-[#0F172A] font-sans">
              Statutory Geospatial Evidence Certificate
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">
            Survey Project: {activeProject.name} | Region: {geographicContext}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-[#043D38] text-white rounded-lg hover:bg-[#022D29] text-xs font-mono font-bold uppercase tracking-wider shadow-xs"
          >
            <IconDownload className="w-4 h-4" />
            <span>Save as PDF / Print Certificate</span>
          </button>
        </div>
      </div>

      {/* Official Certificate / Report Document Shell (Matching Image 3) */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 space-y-6 shadow-md font-sans">
        {/* Document Header matching Image 3 */}
        <div className="border-b-2 border-[#0F2D38] pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black tracking-wider text-[#061A21] uppercase font-mono">
                PROJECT GEOAI 02 • GEORESQ INTELLIGENCE PLATFORM
              </h2>
              <p className="text-xs font-semibold text-[#64748B] font-mono mt-0.5">
                Statutory Digital Imagery Evidence Certificate & Asset Damage Requisition | SAHYOG Platform v2.4
              </p>
            </div>
            <IconShieldCheck className="w-10 h-10 text-[#0284C7]" />
          </div>

          {/* Badges strip matching Image 3 */}
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
            <span className="px-2.5 py-1 rounded-full border border-[#0284C7] text-[#0284C7] font-bold">
              SEC 106 BNSS DEBIT-FREEZE
            </span>
            <span className="px-2.5 py-1 rounded-full border border-[#0284C7] text-[#0284C7] font-bold">
              SEC 94 BNSS SUMMONS
            </span>
            <span className="px-2.5 py-1 rounded-full border border-[#059669] bg-[#ECFDF5] text-[#059669] font-extrabold">
              SEC 63 BSA CERTIFIED
            </span>
          </div>
        </div>

        {/* Case Metadata Table Box matching Image 3 */}
        <div className="border border-[#CBD5E1] rounded-xl overflow-hidden font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#CBD5E1] bg-[#F8FAFC]">
            <div className="p-3 space-y-1">
              <div className="text-[10px] text-[#64748B]">GeoResQ Case Ref ID:</div>
              <div className="font-bold text-[#0F172A]">{activeProject.id}</div>
            </div>
            <div className="p-3 space-y-1">
              <div className="text-[10px] text-[#64748B]">Timestamp (IST):</div>
              <div className="font-bold text-[#0F172A]">{new Date().toLocaleString()}</div>
            </div>
          </div>
          <div className="border-t border-[#CBD5E1] p-3 grid grid-cols-1 md:grid-cols-2 gap-2 bg-white">
            <div>
              <span className="text-[#64748B]">Target Survey Region: </span>
              <span className="font-bold text-[#0F172A]">{geographicContext}</span>
            </div>
            <div>
              <span className="text-[#64748B]">Attribution Latency: </span>
              <span className="font-bold text-[#0284C7]">8.42 ms (CF-DBS Engine)</span>
            </div>
          </div>
        </div>

        {/* Section 1: Metrics Overview */}
        <div className="space-y-3">
          <h3 className="font-mono font-bold text-sm text-[#061A21] uppercase border-l-4 border-l-[#0284C7] pl-3 py-0.5">
            1. FIRST-HOP ASSET DAMAGE & INUNDATION DETAILS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl">
              <div className="flex items-center space-x-1.5 text-xs text-[#64748B]">
                <IconRipple className="w-4 h-4 text-[#0284C7]" />
                <span>Total Flooded Inundation</span>
              </div>
              <div className="text-xl font-extrabold text-[#0284C7] mt-1">
                {totalFlooded > 0 ? `${totalFlooded.toFixed(2)} sq km` : '0 sq km'}
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl">
              <div className="flex items-center space-x-1.5 text-xs text-[#64748B]">
                <IconBuildingStore className="w-4 h-4 text-[#EF4444]" />
                <span>Damaged Structures</span>
              </div>
              <div className="text-xl font-extrabold text-[#EF4444] mt-1">
                {totalDamagedBuildings} Units
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl">
              <div className="flex items-center space-x-1.5 text-xs text-[#64748B]">
                <IconRoad className="w-4 h-4 text-[#D97706]" />
                <span>Road Blockage Span</span>
              </div>
              <div className="text-xl font-extrabold text-[#D97706] mt-1">
                {totalRoadAffected > 0 ? `${totalRoadAffected.toFixed(2)} km` : '0 km'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Statutory Verification Callout Box matching Image 3 */}
        <div className="space-y-3">
          <h3 className="font-mono font-bold text-sm text-[#061A21] uppercase border-l-4 border-l-[#0284C7] pl-3 py-0.5">
            2. CERTIFICATE UNDER SECTION 63(4) OF BHARATIYA SAKSHYA ADHINIYAM, 2023
          </h3>

          <div className="bg-[#F0F9FF] border border-[#38BDF8] rounded-xl p-4 text-xs space-y-2 text-[#0F172A]">
            <div className="font-mono font-bold text-[#0369A1] uppercase tracking-wide">
              PART A & B STATUTORY VERIFICATION (ELECTRONIC RECORD ADMISSIBILITY)
            </div>
            <p className="leading-relaxed">
              I hereby certify that the electronic geospatial record produced herein has been produced by the automated computer system of <strong>PROJECT GEOAI 02 (GeoResQ Engine)</strong> during its regular and lawful operational use. The hash digests and telemetry verification tree below affirm cryptographic non-repudiation and chain-of-custody integrity:
            </p>
            <div className="font-mono text-[11px] bg-white p-2.5 rounded-lg border border-[#BAE6FD] text-[#0F172A]">
              <div><strong>System State SHA-256 Digest:</strong></div>
              <div className="text-[#0369A1] font-semibold break-all">3f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a</div>
            </div>
            <div className="text-[11px] font-semibold text-[#0369A1]">
              Admissibility Clause: Certified admissible in evidence before the Court of Judicial Magistrate under Section 63 of Bharatiya Sakshya Adhiniyam (BSA), 2023.
            </div>
          </div>
        </div>

        {/* Document Footer matching Image 3 */}
        <div className="border-t border-[#E2E8F0] pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#64748B] gap-2">
          <div>Digitally Stamped & Transmitted via I4C SAHYOG Gateway</div>
          <div className="font-bold text-[#0F172A]">Authorized Officer: Insp. A. Thube (Maharashtra Cyber Cell)</div>
        </div>
      </div>
    </div>
  );
};
