import { create } from 'zustand';
import {
  Project,
  DetectionFeature,
  LayerConfiguration,
  AnalysisJob,
  TileProviderOption,
} from '../types/geoai';
import { DEMO_PROJECTS, DEMO_FEATURES, DEMO_LAYER_CONFIGS } from '../data/demoData';
import { submitAnalysisJob, getAnalysisFeatures } from '../services/api';

interface GeoState {
  projects: Project[];
  activeProject: Project | null;
  features: DetectionFeature[];
  selectedFeature: DetectionFeature | null;
  layers: LayerConfiguration[];
  tileProvider: TileProviderOption;
  geographicContext: string;
  searchQuery: string;
  isBackendConnected: boolean;
  isDemoMode: boolean;
  currentJob: AnalysisJob | null;

  // Actions
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  setFeatures: (features: DetectionFeature[]) => void;
  setSelectedFeature: (feature: DetectionFeature | null) => void;
  toggleLayerVisibility: (layerId: string) => void;
  updateLayerOpacity: (layerId: string, opacity: number) => void;
  setTileProvider: (provider: TileProviderOption) => void;
  setGeographicContext: (context: string) => void;
  setSearchQuery: (query: string) => void;
  setBackendConnected: (connected: boolean) => void;
  setDemoMode: (demo: boolean) => void;
  setCurrentJob: (job: AnalysisJob | null) => void;
  triggerMockAnalysis: (projectName: string, modelName: string) => void;
}

export const useGeoStore = create<GeoState>((set, get) => ({
  projects: DEMO_PROJECTS,
  activeProject: DEMO_PROJECTS[0],
  features: DEMO_FEATURES,
  selectedFeature: null,
  layers: DEMO_LAYER_CONFIGS,
  tileProvider: 'satellite',
  geographicContext: 'Nashik, Maharashtra',
  searchQuery: '',
  isBackendConnected: false,
  isDemoMode: true,
  currentJob: null,

  setProjects: (projects) => set({ projects }),
  setActiveProject: (project) => {
    set({ activeProject: project, selectedFeature: null });
    if (project) {
      getAnalysisFeatures(project.id).then((feats) => {
        if (feats && feats.length > 0) {
          set({ features: feats });
        }
      });
    }
  },
  setFeatures: (features) => set({ features }),
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),

  toggleLayerVisibility: (layerId) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === layerId ? { ...l, visible: !l.visible } : l
      ),
    })),

  updateLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === layerId ? { ...l, opacity } : l
      ),
    })),

  setTileProvider: (provider) => set({ tileProvider: provider }),
  setGeographicContext: (context) => set({ geographicContext: context }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setBackendConnected: (connected) => set({ isBackendConnected: connected }),
  setDemoMode: (demo) => set({ isDemoMode: demo }),
  setCurrentJob: (job) => set({ currentJob: job }),

  triggerMockAnalysis: (projectName, modelName) => {
    const activeProj = get().activeProject;
    const projId = activeProj?.id || 'proj-nashik-2026-001';

    const newJob: AnalysisJob = {
      id: `job-${Date.now()}`,
      projectId: projId,
      projectName: projectName || 'Uploaded Imagery Survey',
      status: 'processing',
      progressPercent: 15,
      submittedAt: new Date().toISOString(),
      modelName: modelName || 'GeoResQ-Vision-v3.8',
      confidenceThreshold: 0.75,
    };

    set({ currentJob: newJob });

    if (get().isBackendConnected) {
      submitAnalysisJob({
        projectId: projId,
        modelName: modelName || 'GeoResQ-Vision-v3.8',
        confidenceThreshold: 0.75,
      }).then((apiJob) => {
        set({ currentJob: { ...apiJob, progressPercent: 60 } });
        setTimeout(async () => {
          const liveFeats = await getAnalysisFeatures(apiJob.id);
          if (liveFeats && liveFeats.length > 0) {
            set({ features: liveFeats });
            if (activeProj) {
              const floodedSum = liveFeats
                .filter((f) => f.category === 'flooded_area')
                .reduce((acc, f) => acc + (f.areaSqKm || 0), 0);
              set({
                activeProject: {
                  ...activeProj,
                  featuresCount: liveFeats.length,
                  totalAffectedAreaSqKm: Math.round(floodedSum * 100) / 100,
                },
              });
            }
          }
          set({ currentJob: { ...apiJob, status: 'completed', progressPercent: 100 } });
        }, 1500);
      });
    } else {
      setTimeout(() => {
        set((st) => ({
          currentJob: st.currentJob ? { ...st.currentJob, progressPercent: 60 } : null,
        }));
      }, 1000);

      setTimeout(() => {
        set((st) => ({
          currentJob: st.currentJob
            ? {
                ...st.currentJob,
                status: 'completed',
                progressPercent: 100,
                completedAt: new Date().toISOString(),
              }
            : null,
        }));
      }, 2000);
    }
  },
}));
