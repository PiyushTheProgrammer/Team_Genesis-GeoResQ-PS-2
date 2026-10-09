import React from 'react';
import { DroneLiveConnect } from '../components/drone/DroneLiveConnect';
import { useGeoStore } from '../store/useGeoStore';
import { IconDrone, IconMapPin, IconSparkles, IconLayersLinked } from '@tabler/icons-react';

export const DroneLivePage: React.FC = () => {
  const { geographicContext, features } = useGeoStore();

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#F8FAFC] overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="border-b border-[#CBD5E1] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shadow-xs">
              <IconDrone className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0F172A] font-sans">
                Drone Live Connect & Edge AI Vision Station
              </h1>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#64748B] mt-0.5">
                <IconMapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Active Disaster Region: <strong className="text-[#0F172A]">{geographicContext}</strong></span>
                <span>&bull;</span>
                <span>Vector Features: <strong className="text-[#0284C7]">{features.length} Items</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1 bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] rounded-full font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Edge AI Model Active</span>
          </span>
        </div>
      </div>

      {/* Embedded Live Drone Connect Station */}
      <DroneLiveConnect />
    </div>
  );
};
