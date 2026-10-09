import React from 'react';
import { MainPageHeader } from '../components/layout/MainPageHeader';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { LayerControlPanel } from '../components/map/LayerControlPanel';
import { SelectedAreaPanel } from '../components/map/SelectedAreaPanel';
import { DetectionSummaryStack } from '../components/analysis/DetectionSummaryStack';
import { SeverityDistributionBar } from '../components/analysis/SeverityDistributionBar';
import { DetectedClassesTable } from '../components/tables/DetectedClassesTable';
import { AreaTrendChart } from '../components/charts/AreaTrendChart';
import { RecentAnalysesList } from '../components/projects/RecentAnalysesList';

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F3ED]">
      {/* 1. Main Page Header */}
      <MainPageHeader />

      {/* 2. Main Dashboard Body */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Top/Middle Workspace: Map + Side Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Central Map & Layer Controls (7 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            <div className="h-[480px] w-full">
              <InteractiveMap className="h-full w-full" />
            </div>
            <LayerControlPanel />
          </div>

          {/* Right Supporting Information Panels (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col space-y-3">
            <SelectedAreaPanel />
            <DetectionSummaryStack />
            <SeverityDistributionBar />
          </div>
        </div>

        {/* Lower Workspace: 3 Practical Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetectedClassesTable />
          <AreaTrendChart />
          <RecentAnalysesList />
        </div>
      </div>
    </div>
  );
};
