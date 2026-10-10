import { create } from 'zustand';
import {
  Project,
  DetectionFeature,
  LayerConfiguration,
  AnalysisJob,
  TileProviderOption,
  DroneTelemetry,
} from '../types/geoai';
import {
  DEMO_LAYER_CONFIGS,
  REGIONS_REGISTRY,
} from '../data/demoData';
import { submitAnalysisJob, getAnalysisFeatures, deleteProject as apiDeleteProject } from '../services/api';

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

  // Active Tab for Header/Dashboard
  activeDashboardTab: string;

  // Drone Live Connect Telemetry
  droneTelemetry: DroneTelemetry;

  // Features cache by Project ID
  featuresByProjectId: Record<string, DetectionFeature[]>;

  // Actions
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  registerUploadedSurvey: (project: Project, features: DetectionFeature[]) => void;
  deleteProject: (projectId: string) => Promise<void>;
  fetchProjectFeatures: (projectId: string) => Promise<DetectionFeature[]>;
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
  setActiveDashboardTab: (tab: string) => void;
  triggerMockAnalysis: (projectName: string, modelName: string) => void;
  verifyFeature: (
    featureId: string,
    status: 'verified' | 'unreviewed' | 'flagged' | 'rejected',
    notes?: string
  ) => void;
  addCapturedDetection: (feature: DetectionFeature) => void;
  setDroneTelemetry: (telemetry: Partial<DroneTelemetry>) => void;
  setDroneConnected: (connected: boolean) => void;
  setDroneStreamUrl: (url: string) => void;
  setDroneMode: (mode: 'ipwebcam' | 'browsercam' | 'simulated') => void;
}

export const useGeoStore = create<GeoState>((set, get) => ({
  projects: [],
  activeProject: null,
  features: [],
  featuresByProjectId: {},
  selectedFeature: null,
  layers: DEMO_LAYER_CONFIGS,
  tileProvider: 'satellite',
  geographicContext: 'Survey Zone',
  searchQuery: '',
  isBackendConnected: false,
  isDemoMode: false,
  currentJob: null,
  activeDashboardTab: 'overview',

  droneTelemetry: {
    isConnected: false,
    streamUrl: 'http://192.168.1.100:8080/video',
    mode: 'simulated',
    altitudeM: 125,
    batteryPct: 86,
    speedMps: 12.4,
    headingDeg: 42,
    fps: 30,
    lat: 20.0059,
    lng: 73.7898,
    signalQuality: 'Excellent',
  },

  setProjects: (projects) => set({ projects }),
  setActiveProject: (project) => {
    set({ activeProject: project, selectedFeature: null });
    if (project) {
      set({ geographicContext: project.location });
      const cached = get().featuresByProjectId[project.id];
      if (cached && cached.length > 0) {
        set({ features: cached });
      }
      getAnalysisFeatures(project.id).then((feats) => {
        if (feats && feats.length > 0) {
          set((st) => ({
            features: feats,
            featuresByProjectId: { ...st.featuresByProjectId, [project.id]: feats },
          }));
        } else if (!cached || cached.length === 0) {
          set({ features: [] });
        }
      });
    } else {
      set({ features: [] });
    }
  },

  registerUploadedSurvey: (project, features) => {
    const current = get().projects;
    const filtered = current.filter((p) => p.id !== project.id);
    const updated = [project, ...filtered];
    set((st) => ({
      projects: updated,
      activeProject: project,
      features: features,
      featuresByProjectId: {
        ...st.featuresByProjectId,
        [project.id]: features,
      },
      geographicContext: project.location,
      selectedFeature: features.length > 0 ? features[0] : null,
    }));
  },

  fetchProjectFeatures: async (projectId: string) => {
    const cached = get().featuresByProjectId[projectId];
    if (cached && cached.length > 0) {
      return cached;
    }
    const feats = await getAnalysisFeatures(projectId);
    if (feats && feats.length > 0) {
      set((st) => ({
        featuresByProjectId: {
          ...st.featuresByProjectId,
          [projectId]: feats,
        },
      }));
      return feats;
    }
    return cached || [];
  },

  deleteProject: async (projectId: string) => {
    try {
      await apiDeleteProject(projectId);
    } catch (e) {
      console.warn('Backend delete project warning:', e);
    }
    const current = get().projects;
    const remaining = current.filter((p) => p.id !== projectId);
    const wasActive = get().activeProject?.id === projectId;
    const nextActive = wasActive ? (remaining[0] || null) : get().activeProject;
    
    set((st) => {
      const updatedCache = { ...st.featuresByProjectId };
      delete updatedCache[projectId];
      return {
        projects: remaining,
        activeProject: nextActive,
        featuresByProjectId: updatedCache,
      };
    });

    if (nextActive) {
      const cached = get().featuresByProjectId[nextActive.id];
      if (cached && cached.length > 0) {
        set({ features: cached });
      } else {
        const feats = await getAnalysisFeatures(nextActive.id);
        set({ features: feats || [] });
      }
    } else {
      set({ features: [] });
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

  setGeographicContext: (context: string) => {
    const reg = REGIONS_REGISTRY[context];
    const currentProjects = get().projects;
    const matchingProj = currentProjects.find(
      (p) => p.location.toLowerCase() === context.toLowerCase()
    );

    const newLat = reg ? reg.center[0] : 20.0059;
    const newLng = reg ? reg.center[1] : 73.7898;

    set((state) => ({
      geographicContext: context,
      selectedFeature: null,
      activeProject: matchingProj || state.activeProject,
      droneTelemetry: {
        ...state.droneTelemetry,
        lat: newLat,
        lng: newLng,
      },
    }));
  },


  setSearchQuery: (query) => set({ searchQuery: query }),
  setBackendConnected: (connected) => set({ isBackendConnected: connected }),
  setDemoMode: (demo) => set({ isDemoMode: demo }),
  setCurrentJob: (job) => set({ currentJob: job }),
  setActiveDashboardTab: (tab) => set({ activeDashboardTab: tab }),

  verifyFeature: (featureId, status, notes) =>
    set((state) => ({
      features: state.features.map((f) =>
        f.id === featureId
          ? {
              ...f,
              validationStatus: status,
              inspectorNotes: notes !== undefined ? notes : f.inspectorNotes,
            }
          : f
      ),
      selectedFeature:
        state.selectedFeature?.id === featureId
          ? {
              ...state.selectedFeature,
              validationStatus: status,
              inspectorNotes: notes !== undefined ? notes : state.selectedFeature.inspectorNotes,
            }
          : state.selectedFeature,
    })),

  addCapturedDetection: (feature) =>
    set((state) => ({
      features: [feature, ...state.features],
      selectedFeature: feature,
    })),

  setDroneTelemetry: (telemetry) =>
    set((state) => ({
      droneTelemetry: { ...state.droneTelemetry, ...telemetry },
    })),

  setDroneConnected: (connected) =>
    set((state) => ({
      droneTelemetry: { ...state.droneTelemetry, isConnected: connected },
    })),

  setDroneStreamUrl: (url) =>
    set((state) => ({
      droneTelemetry: { ...state.droneTelemetry, streamUrl: url },
    })),

  setDroneMode: (mode) =>
    set((state) => ({
      droneTelemetry: { ...state.droneTelemetry, mode },
    })),

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
      modelName: modelName || 'GeoResQ-Vision-v2.4',
      confidenceThreshold: 0.75,
    };

    set({ currentJob: newJob });

    if (get().isBackendConnected) {
      submitAnalysisJob({
        projectId: projId,
        modelName: modelName || 'GeoResQ-Vision-v2.4',
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
