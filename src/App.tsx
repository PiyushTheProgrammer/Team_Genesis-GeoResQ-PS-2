import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageShell } from './components/layout/PageShell';
import { DashboardPage } from './pages/DashboardPage';
import { MapViewerPage } from './pages/MapViewerPage';
import { DroneLivePage } from './pages/DroneLivePage';
import { UploadAnalyzePage } from './pages/UploadAnalyzePage';
import { DetectedAssetsPage } from './pages/DetectedAssetsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { ModelInsightsPage } from './pages/ModelInsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useGeoStore } from './store/useGeoStore';
import { checkBackendHealth, fetchProjects, getAnalysisFeatures } from './services/api';

export const App: React.FC = () => {
  const { setBackendConnected, setProjects, setActiveProject, setFeatures } = useGeoStore();

  useEffect(() => {
    checkBackendHealth().then(async (isOnline) => {
      setBackendConnected(isOnline);
      if (isOnline) {
        try {
          const projs = await fetchProjects();
          if (projs && projs.length > 0) {
            setProjects(projs);
            setActiveProject(projs[0]);
            const feats = await getAnalysisFeatures(projs[0].id);
            if (feats && feats.length > 0) {
              setFeatures(feats);
            }
          }
        } catch (err) {
          console.warn('Backend sync warning:', err);
        }
      }
    });
  }, [setBackendConnected, setProjects, setActiveProject, setFeatures]);

  return (
    <BrowserRouter>
      <PageShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/map" element={<MapViewerPage />} />
          <Route path="/drone-live" element={<DroneLivePage />} />
          <Route path="/upload" element={<UploadAnalyzePage />} />
          <Route path="/assets" element={<DetectedAssetsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/data-sources" element={<DataSourcesPage />} />
          <Route path="/model-insights" element={<ModelInsightsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </PageShell>
    </BrowserRouter>
  );
};

export default App;
