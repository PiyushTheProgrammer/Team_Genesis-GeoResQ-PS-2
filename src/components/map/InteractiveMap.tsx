import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Popup,
  ScaleControl,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { useGeoStore } from '../../store/useGeoStore';
import { DetectionFeature } from '../../types/geoai';
import { REGIONS_REGISTRY } from '../../data/demoData';
import {
  formatConfidence,
  getSeverityBadgeStyle,
  formatCategoryName,
} from '../../utils/formatters';
import {
  IconStack2,
  IconFocus2,
  IconMapPin,
  IconX,
  IconDrone,
  IconCheck,
  IconShieldCheck,
  IconAlertTriangle,
} from '@tabler/icons-react';

const TILE_SERVERS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA, GeoResQ',
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors, ODbL 1.0',
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap',
  },
};

const createCustomMarker = (color: string, label?: string) => {
  return L.divIcon({
    className: 'custom-geoai-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute;
          width: 26px;
          height: 26px;
          border-radius: 9999px;
          background-color: ${color};
          opacity: 0.35;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          background-color: ${color};
          width: 14px;
          height: 14px;
          border: 2.5px solid #FFFFFF;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          z-index: 10;
        "></div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

const createDroneMarker = () => {
  return L.divIcon({
    className: 'custom-drone-marker',
    html: `
      <div style="
        background: #0284C7;
        color: white;
        padding: 4px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(2,132,199,0.5);
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 10h4v4h-4z"/>
          <path d="M10 10l-3.5 -3.5"/>
          <path d="M14 10l3.5 -3.5"/>
          <path d="M10 14l-3.5 3.5"/>
          <path d="M14 14l3.5 3.5"/>
          <circle cx="5" cy="5" r="2"/>
          <circle cx="19" cy="5" r="2"/>
          <circle cx="5" cy="19" r="2"/>
          <circle cx="19" cy="19" r="2"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const MapController: React.FC<{
  selectedFeature: DetectionFeature | null;
  geographicContext: string;
}> = ({ selectedFeature, geographicContext }) => {
  const map = useMap();

  // 1. Listen to Geographic Context Changes (Fly to new location dynamically!)
  useEffect(() => {
    const reg = REGIONS_REGISTRY[geographicContext];
    if (reg) {
      map.flyTo(reg.center, reg.zoom, {
        duration: 1.4,
        easeLinearity: 0.25,
      });
    }
  }, [geographicContext, map]);

  // 2. Listen to Feature Selection (Pan/fit bounds)
  useEffect(() => {
    if (selectedFeature && selectedFeature.coordinates) {
      if (selectedFeature.geometryType === 'Point') {
        const [lat, lng] = selectedFeature.coordinates;
        map.setView([lat, lng], 17, { animate: true });
      } else if (Array.isArray(selectedFeature.coordinates) && selectedFeature.coordinates.length > 0) {
        const coords = selectedFeature.coordinates;
        if (Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
          const bounds = L.latLngBounds(coords as [number, number][]);
          map.fitBounds(bounds, { padding: [50, 50], animate: true });
        }
      }
    }
  }, [selectedFeature, map]);

  return null;
};

interface InteractiveMapProps {
  className?: string;
  showToolbar?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  className = 'h-full w-full',
  showToolbar = true,
}) => {
  const {
    features,
    selectedFeature,
    setSelectedFeature,
    layers,
    tileProvider,
    setTileProvider,
    geographicContext,
    droneTelemetry,
    verifyFeature,
  } = useGeoStore();

  const regInfo = REGIONS_REGISTRY[geographicContext];
  const initialCenter: [number, number] = regInfo ? regInfo.center : [20.0059, 73.7898];
  const initialZoom = regInfo ? regInfo.zoom : 14;

  const isLayerVisible = (category: string) => {
    const found = layers.find((l) => l.category === category);
    return found ? found.visible : true;
  };

  const getLayerColor = (category: string, defaultColor: string) => {
    const found = layers.find((l) => l.category === category);
    return found ? found.color : defaultColor;
  };

  const getLayerOpacity = (category: string, defaultOpacity: number) => {
    const found = layers.find((l) => l.category === category);
    return found ? found.opacity : defaultOpacity;
  };

  return (
    <div className={`relative border border-[#CBD5E1] rounded-2xl bg-[#0F172A] overflow-hidden shadow-sm ${className}`}>
      {/* Top Left Map Floating Toolbar */}
      {showToolbar && (
        <div className="absolute top-3 left-3 z-[400] flex flex-col space-y-2 pointer-events-auto">
          {/* Tile Layer Selector */}
          <div className="bg-white/95 backdrop-blur-md border border-[#CBD5E1] p-1.5 rounded-xl shadow-md flex items-center space-x-1">
            <span className="text-[10px] font-mono font-bold uppercase text-[#64748B] px-2 flex items-center space-x-1">
              <IconStack2 className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="hidden sm:inline">Base Layer:</span>
            </span>
            {(['satellite', 'street', 'terrain'] as const).map((provider) => (
              <button
                key={provider}
                onClick={() => setTileProvider(provider)}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-lg border transition-all ${
                  tileProvider === provider
                    ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                    : 'bg-[#F8FAFC] text-[#0F172A] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                }`}
              >
                {provider}
              </button>
            ))}
          </div>

          {/* Active Dynamic Region Banner */}
          <div className="bg-white/95 backdrop-blur-md border border-[#CBD5E1] px-3 py-1.5 rounded-xl shadow-md flex items-center space-x-2 text-[11px] font-mono">
            <IconMapPin className="w-4 h-4 text-[#047857]" />
            <span className="text-[#64748B] font-semibold">Active Region:</span>
            <span className="text-[#0F172A] font-bold">{geographicContext}</span>
            <span className="px-1.5 py-0.5 bg-[#ECFDF5] text-[#047857] rounded text-[10px] font-bold">
              GPS Synchronized
            </span>
          </div>
        </div>
      )}

      {/* Main Leaflet Map Container */}
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        zoomControl={true}
        className="h-full w-full z-10"
        attributionControl={true}
      >
        <MapController
          selectedFeature={selectedFeature}
          geographicContext={geographicContext}
        />

        <TileLayer
          url={TILE_SERVERS[tileProvider].url}
          attribution={TILE_SERVERS[tileProvider].attribution}
          maxZoom={19}
        />

        <ScaleControl position="bottomleft" imperial={false} />

        {/* Live Drone Marker & Sensor Footprint */}
        {droneTelemetry.isConnected && (
          <>
            <Marker
              position={[droneTelemetry.lat, droneTelemetry.lng]}
              icon={createDroneMarker()}
            >
              <Popup>
                <div className="font-mono text-xs space-y-1">
                  <div className="font-bold text-[#0284C7] flex items-center space-x-1">
                    <IconDrone className="w-4 h-4" />
                    <span>Active Drone Recon Unit</span>
                  </div>
                  <div>Altitude: {droneTelemetry.altitudeM}m AGL</div>
                  <div>Battery: {droneTelemetry.batteryPct}%</div>
                  <div>Speed: {droneTelemetry.speedMps} m/s</div>
                  <div>Sensor: 4K RTK Ortho Camera</div>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[droneTelemetry.lat, droneTelemetry.lng]}
              radius={85}
              pathOptions={{
                color: '#0284C7',
                fillColor: '#38BDF8',
                fillOpacity: 0.15,
                dashArray: '4, 6',
              }}
            />
          </>
        )}

        {/* Dynamic Vector Layers & Features */}
        {features.map((feature) => {
          if (!isLayerVisible(feature.category)) return null;

          const color = getLayerColor(feature.category, '#0284C7');
          const opacity = getLayerOpacity(feature.category, 0.5);
          const isSelected = selectedFeature?.id === feature.id;

          if (feature.geometryType === 'Polygon' && Array.isArray(feature.coordinates)) {
            return (
              <Polygon
                key={feature.id}
                positions={feature.coordinates}
                pathOptions={{
                  color: isSelected ? '#0284C7' : color,
                  fillColor: color,
                  fillOpacity: isSelected ? Math.min(opacity + 0.3, 0.85) : opacity,
                  weight: isSelected ? 4 : 2,
                }}
                eventHandlers={{
                  click: () => setSelectedFeature(feature),
                }}
              >
                <Popup>
                  <FeaturePopupCard feature={feature} onVerify={verifyFeature} />
                </Popup>
              </Polygon>
            );
          }

          if (feature.geometryType === 'LineString' && Array.isArray(feature.coordinates)) {
            return (
              <Polyline
                key={feature.id}
                positions={feature.coordinates}
                pathOptions={{
                  color: isSelected ? '#0284C7' : color,
                  weight: isSelected ? 6 : 4,
                  opacity: 0.95,
                }}
                eventHandlers={{
                  click: () => setSelectedFeature(feature),
                }}
              >
                <Popup>
                  <FeaturePopupCard feature={feature} onVerify={verifyFeature} />
                </Popup>
              </Polyline>
            );
          }

          if (feature.geometryType === 'Point' && Array.isArray(feature.coordinates)) {
            const [lat, lng] = feature.coordinates;
            return (
              <Marker
                key={feature.id}
                position={[lat, lng]}
                icon={createCustomMarker(color)}
                eventHandlers={{
                  click: () => setSelectedFeature(feature),
                }}
              >
                <Popup>
                  <FeaturePopupCard feature={feature} onVerify={verifyFeature} />
                </Popup>
              </Marker>
            );
          }

          return null;
        })}
      </MapContainer>

      {/* Selected Feature Bottom Floating Card (Matches Reference Image Format) */}
      {selectedFeature && (
        <div className="absolute bottom-4 right-4 z-[400] max-w-sm bg-white/95 backdrop-blur-md border border-[#CBD5E1] p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2 mb-2">
            <div className="flex items-center space-x-2">
              <IconFocus2 className="w-4 h-4 text-[#0284C7]" />
              <span className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
                Active GIS Vector Feature
              </span>
            </div>
            <button
              onClick={() => setSelectedFeature(null)}
              className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9]"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#0F172A]">{selectedFeature.name}</div>
            <span className="font-mono text-[10px] text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded font-bold">
              ID: {selectedFeature.id}
            </span>
          </div>

          <div className="text-[11px] font-mono text-[#64748B] mt-0.5">
            Category: <strong className="text-[#0F172A]">{formatCategoryName(selectedFeature.category)}</strong>
          </div>

          <div className="flex items-center space-x-2 mt-2 font-mono text-[11px]">
            <span>Confidence: <strong className="text-[#0284C7]">{formatConfidence(selectedFeature.confidence)}</strong></span>
            <span>|</span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border"
              style={{
                backgroundColor: getSeverityBadgeStyle(selectedFeature.severity).bg,
                color: getSeverityBadgeStyle(selectedFeature.severity).text,
                borderColor: getSeverityBadgeStyle(selectedFeature.severity).border,
              }}
            >
              Severity: {selectedFeature.severity}
            </span>
          </div>

          {selectedFeature.areaSqKm && (
            <div className="text-[11px] font-mono text-[#64748B] mt-1">
              Extent: <strong className="text-[#0F172A]">{selectedFeature.areaSqKm} sq km</strong> ({(selectedFeature.areaSqKm * 1000000).toLocaleString()} m²)
            </div>
          )}

          {selectedFeature.lengthKm && (
            <div className="text-[11px] font-mono text-[#64748B] mt-1">
              Length: <strong className="text-[#0F172A]">{selectedFeature.lengthKm} km</strong>
            </div>
          )}

          {/* Quick Verification Strip */}
          <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#64748B] flex items-center space-x-1">
              <IconShieldCheck className="w-3.5 h-3.5 text-[#047857]" />
              <span>Status: {selectedFeature.validationStatus || 'unreviewed'}</span>
            </span>
            <button
              onClick={() =>
                verifyFeature(
                  selectedFeature.id,
                  selectedFeature.validationStatus === 'verified' ? 'unreviewed' : 'verified'
                )
              }
              className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all ${
                selectedFeature.validationStatus === 'verified'
                  ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                  : 'bg-[#043D38] text-white border-[#043D38] hover:bg-[#022D29]'
              }`}
            >
              {selectedFeature.validationStatus === 'verified' ? '✓ Verified' : 'Mark Verified'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Popup Card matching exact layout of reference diagram
const FeaturePopupCard: React.FC<{
  feature: DetectionFeature;
  onVerify: (id: string, status: any) => void;
}> = ({ feature, onVerify }) => {
  const badge = getSeverityBadgeStyle(feature.severity);

  return (
    <div className="space-y-2 min-w-[220px] font-sans p-1">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
        <span className="font-extrabold text-xs text-[#0F172A]">
          {formatCategoryName(feature.category)}
        </span>
        <span className="font-mono text-[10px] font-bold text-[#0284C7] bg-[#F0F9FF] px-1.5 py-0.5 rounded border border-[#BAE6FD]">
          ID: {feature.id}
        </span>
      </div>

      <div className="text-xs font-semibold text-[#0F172A] leading-snug">
        {feature.name}
      </div>

      <div className="space-y-1 font-mono text-[11px] bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <span className="text-[#64748B]">Confidence:</span>
          <span className="font-bold text-[#0284C7]">{formatConfidence(feature.confidence)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#64748B]">Severity:</span>
          <span
            className="px-2 py-0.2 rounded-full text-[9px] uppercase font-bold border"
            style={{ backgroundColor: badge.bg, color: badge.text, borderColor: badge.border }}
          >
            {feature.severity}
          </span>
        </div>

        {feature.areaSqKm && (
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Area:</span>
            <span className="font-bold text-[#0F172A]">
              {feature.attributes?.areaM2 ? `${feature.attributes.areaM2} m²` : `${feature.areaSqKm} sq km`}
            </span>
          </div>
        )}

        {feature.lengthKm && (
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Length:</span>
            <span className="font-bold text-[#0F172A]">{feature.lengthKm} km</span>
          </div>
        )}
      </div>

      {feature.notes && (
        <p className="text-[10px] text-[#64748B] italic leading-tight">
          "{feature.notes}"
        </p>
      )}

      <div className="pt-1 flex items-center justify-between">
        <button
          onClick={() =>
            onVerify(feature.id, feature.validationStatus === 'verified' ? 'unreviewed' : 'verified')
          }
          className="w-full py-1 text-[10px] font-mono font-bold uppercase bg-[#0284C7] text-white rounded-lg hover:bg-[#0369A1] transition-colors"
        >
          {feature.validationStatus === 'verified' ? '✓ Human Verified' : 'Confirm & Verify'}
        </button>
      </div>
    </div>
  );
};
