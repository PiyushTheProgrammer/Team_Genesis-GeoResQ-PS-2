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
  DEMO_PROJECTS,
  DEMO_FEATURES,
  DEMO_LAYER_CONFIGS,
  REGIONS_REGISTRY,
} from '../data/demoData';
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

  // Active Tab for Header/Dashboard
  activeDashboardTab: string;

  // Drone Live Connect Telemetry
  droneTelemetry: DroneTelemetry;

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
      // Also update geographic context
      set({ geographicContext: project.location });
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

  setGeographicContext: (context: string) => {
    const reg = REGIONS_REGISTRY[context];
    const currentProjects = get().projects;
    const matchingProj = currentProjects.find(
      (p) => p.location.toLowerCase() === context.toLowerCase()
    );

    // Update coordinates in drone telemetry too
    const newLat = reg ? reg.center[0] : 20.0059;
    const newLng = reg ? reg.center[1] : 73.7898;

    set((state) => ({
      geographicContext: context,
      selectedFeature: null,
      activeProject: matchingProj || {
        id: `proj-${context.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: `${context} Rapid Survey`,
        location: context,
        description: reg ? reg.description : 'Disaster inspection sector',
        createdAt: new Date().toISOString(),
        status: 'completed',
        imagery: {
          id: `img-${Date.now()}`,
          name: `${context.replace(/\s+/g, '_')}_Orthomosaic.tif`,
          acquisitionDate: new Date().toISOString().slice(0, 16) + ' UTC',
          resolutionMetersPerPx: 0.045,
          crs: 'EPSG:4326 (WGS84)',
          dimensionsPx: '14200 x 9800 px',
          fileSizeMB: 750,
          bbox: [newLat - 0.015, newLng - 0.015, newLat + 0.015, newLng + 0.015],
          center: [newLat, newLng],
          thumbnailUrl: 'https://images.unsplash.com/photo-1508873696983-2df5057d225b?auto=format&fit=crop&w=400&q=80',
        },
        featuresCount: DEMO_FEATURES.length,
        totalAffectedAreaSqKm: 5.27,
        severityDistribution: { high: 6, medium: 4, low: 2, unclassified: 0, total: 12 },
        modelUsed: 'GeoResQ-Vision-v2.4',
      },
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
