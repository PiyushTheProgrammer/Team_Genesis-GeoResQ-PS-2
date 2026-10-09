import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  IconLayoutDashboard,
  IconMap,
  IconUpload,
  IconTarget,
  IconFileReport,
  IconFolder,
  IconDatabase,
  IconBrain,
  IconSettings,
  IconShieldCheck,
  IconLogout,
} from '@tabler/icons-react';

const navItems = [
  { label: 'Dashboard', path: '/', icon: IconLayoutDashboard },
  { label: 'Map Viewer', path: '/map', icon: IconMap },
  { label: 'Upload & Analyze', path: '/upload', icon: IconUpload },
  { label: 'Detected Assets', path: '/assets', icon: IconTarget },
  { label: 'Reports', path: '/reports', icon: IconFileReport },
  { label: 'Projects', path: '/projects', icon: IconFolder },
];

const secondaryNavItems = [
  { label: 'Data Sources', path: '/data-sources', icon: IconDatabase },
  { label: 'Model Insights', path: '/model-insights', icon: IconBrain },
  { label: 'Settings', path: '/settings', icon: IconSettings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-[245px] shrink-0 bg-[#061A21] text-[#E2E8F0] flex flex-col justify-between h-screen sticky top-0 select-none z-30 border-r border-[#0F2D38] print:hidden">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-4 border-b border-[#0F2D38]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#0E3541] border border-[#1A4B5B] flex items-center justify-center text-[#38BDF8]">
              <IconShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-wider text-white leading-none font-sans flex items-center space-x-1.5">
                <span>GEOAI 02</span>
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              </div>
              <div className="text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase mt-1">
                GeoResQ • GeoAI Platform
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5">
          <div className="px-3 py-1 text-[10px] font-mono font-semibold uppercase text-[#64748B] tracking-wider">
            Main Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#122B34] text-[#38BDF8] border-l-2 border-l-[#38BDF8] shadow-sm'
                      : 'text-[#94A3B8] border-l-2 border-l-transparent hover:bg-[#0D242C] hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 stroke-[2]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="my-3 border-t border-[#0F2D38]" />

          <div className="px-3 py-1 text-[10px] font-mono font-semibold uppercase text-[#64748B] tracking-wider">
            System & Data
          </div>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#122B34] text-[#38BDF8] border-l-2 border-l-[#38BDF8] shadow-sm'
                      : 'text-[#94A3B8] border-l-2 border-l-transparent hover:bg-[#0D242C] hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 stroke-[2]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Card Container */}
      <div className="p-3 border-t border-[#0F2D38]">
        <div className="bg-[#0B2129] border border-[#14313C] rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#0EA5E9] text-white flex items-center justify-center text-xs font-bold font-mono shrink-0">
              HV
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white leading-tight truncate">Harsh Vardhan</div>
              <div className="text-[10px] text-[#94A3B8] leading-tight font-mono truncate">Lead GIS Analyst</div>
            </div>
          </div>
          <button
            className="text-[#64748B] hover:text-[#38BDF8] p-1 rounded-md transition-colors"
            title="Session Telemetry"
          >
            <IconLogout className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </aside>
  );
};
