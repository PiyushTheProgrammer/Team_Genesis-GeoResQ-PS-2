import { create } from 'zustand';
import {
  Project,
  DetectionFeature,
  LayerConfiguration,
  AnalysisJob,
  TileProviderOption,
} from '../types/geoai';
import {
  DEMO_PROJECTS,
  DEMO_FEATURES,
  DEMO_LAYER_CONFIGS,
} from '../data/demoData';

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
  setActiveProject: (project) => set({ activeProject: project, selectedFeature: null }),
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
    const newJob: AnalysisJob = {
      id: `job-${Date.now()}`,
      projectId: get().activeProject?.id || 'proj-nashik-2026-001',
      projectName: projectName || 'Uploaded Imagery Survey',
      status: 'processing',
      progressPercent: 10,
      submittedAt: new Date().toISOString(),
      modelName: modelName || 'GeoResQ-Vision-v2.4',
      confidenceThreshold: 0.75,
    };

    set({ currentJob: newJob });

    // Step updates statically without bouncy smooth animation
    setTimeout(() => {
      set((st) => ({
        currentJob: st.currentJob ? { ...st.currentJob, progressPercent: 45 } : null,
      }));
    }, 1200);

    setTimeout(() => {
      set((st) => ({
        currentJob: st.currentJob ? { ...st.currentJob, progressPercent: 85 } : null,
      }));
    }, 2400);

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
    }, 3600);
  },
}));
