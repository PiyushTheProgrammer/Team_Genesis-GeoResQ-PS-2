import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Popup,
  ScaleControl,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { useGeoStore } from '../../store/useGeoStore';
import { DetectionFeature } from '../../types/geoai';
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
} from '@tabler/icons-react';

const TILE_SERVERS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA',
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; OpenStreetMap, SRTM',
  },
};

const createCustomMarker = (color: string) => {
  return L.divIcon({
    className: 'custom-geoai-marker',
    html: `<div style="
      background-color: ${color};
      width: 16px;
      height: 16px;
      border: 2px solid #FFFFFF;
      border-radius: 9999px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const MapController: React.FC<{ selectedFeature: DetectionFeature | null }> = ({
  selectedFeature,
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedFeature && selectedFeature.coordinates) {
      if (selectedFeature.geometryType === 'Point') {
        const [lat, lng] = selectedFeature.coordinates;
        map.setView([lat, lng], 16, { animate: false });
      } else if (Array.isArray(selectedFeature.coordinates) && selectedFeature.coordinates.length > 0) {
        const coords = selectedFeature.coordinates;
        if (Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
          const bounds = L.latLngBounds(coords as [number, number][]);
          map.fitBounds(bounds, { padding: [40, 40], animate: false });
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
  } = useGeoStore();

  const center: [number, number] = [20.0059, 73.7898];

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
    <div className={`relative border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] overflow-hidden shadow-xs ${className}`}>
      {/* Top Left Map Toolbar */}
      {showToolbar && (
        <div className="absolute top-3 left-3 z-[400] flex flex-col space-y-2">
          {/* Tile Layer Selector */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#E2E8F0] p-1.5 rounded-xl shadow-md flex items-center space-x-1">
            <span className="text-[10px] font-mono font-bold uppercase text-[#64748B] px-2 flex items-center space-x-1">
              <IconStack2 className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="hidden sm:inline">Base Layer:</span>
            </span>
            {(['satellite', 'street', 'terrain'] as const).map((provider) => (
              <button
                key={provider}
                onClick={() => setTileProvider(provider)}
                className={`px-2.5 py-1 text-[11px] font-mono font-semibold uppercase rounded-lg border transition-all ${
                  tileProvider === provider
                    ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                    : 'bg-[#F8FAFC] text-[#0F172A] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                }`}
              >
                {provider}
              </button>
            ))}
          </div>

          {/* Region Label Indicator */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#E2E8F0] px-3 py-1.5 rounded-xl shadow-md flex items-center space-x-2 text-[11px] font-mono">
            <IconMapPin className="w-4 h-4 text-[#10B981]" />
            <span className="text-[#64748B] font-semibold">Location:</span>
            <span className="text-[#0F172A] font-bold">{geographicContext}</span>
          </div>
        </div>
      )}

      {/* Main Leaflet Map */}
      <MapContainer
        center={center}
        zoom={14}
        zoomControl={false}
        className="h-full w-full z-10"
        attributionControl={true}
      >
        <MapController selectedFeature={selectedFeature} />

        <TileLayer
          url={TILE_SERVERS[tileProvider].url}
          attribution={TILE_SERVERS[tileProvider].attribution}
          maxZoom={19}
        />

        <ScaleControl position="bottomleft" imperial={false} />

        {/* Feature Renderers */}
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
                  fillOpacity: isSelected ? opacity + 0.25 : opacity,
                  weight: isSelected ? 4 : 2,
                }}
                eventHandlers={{
                  click: () => setSelectedFeature(feature),
                }}
              >
                <Popup>
                  <PopupContent feature={feature} />
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
                  <PopupContent feature={feature} />
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
                  <PopupContent feature={feature} />
                </Popup>
              </Marker>
            );
          }

          return null;
        })}
      </MapContainer>

      {/* Selected Feature Floating Card Banner */}
      {selectedFeature && (
        <div className="absolute bottom-4 right-4 z-[400] max-w-sm bg-white/95 backdrop-blur-xs border border-[#E2E8F0] p-4 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2 mb-2">
            <div className="flex items-center space-x-2">
              <IconFocus2 className="w-4 h-4 text-[#0284C7]" />
              <span className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
                Active Feature Selected
              </span>
            </div>
            <button
              onClick={() => setSelectedFeature(null)}
              className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9]"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs font-bold text-[#0F172A]">{selectedFeature.name}</div>
          <div className="text-[11px] font-mono text-[#64748B] mt-0.5">
            Category: {formatCategoryName(selectedFeature.category)}
          </div>
          <div className="flex items-center space-x-2 mt-2.5 font-mono text-[11px]">
            <span>Conf: {formatConfidence(selectedFeature.confidence)}</span>
            <span>|</span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border"
              style={{
                backgroundColor: getSeverityBadgeStyle(selectedFeature.severity).bg,
                color: getSeverityBadgeStyle(selectedFeature.severity).text,
                borderColor: getSeverityBadgeStyle(selectedFeature.severity).border,
              }}
            >
              {selectedFeature.severity}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const PopupContent: React.FC<{ feature: DetectionFeature }> = ({ feature }) => {
  const badge = getSeverityBadgeStyle(feature.severity);

  return (
    <div className="space-y-2 min-w-[210px] font-sans">
      <div className="font-bold text-xs text-[#0284C7] border-b border-[#E2E8F0] pb-1">
        {feature.name}
      </div>
      <div className="text-[11px] font-mono text-[#64748B]">
        Type: <span className="text-[#0F172A] font-semibold">{formatCategoryName(feature.category)}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span>Confidence:</span>
        <span className="font-bold text-[#0284C7]">{formatConfidence(feature.confidence)}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span>Severity:</span>
        <span
          className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border"
          style={{ backgroundColor: badge.bg, color: badge.text, borderColor: badge.border }}
        >
          {feature.severity}
        </span>
      </div>
      {feature.areaSqKm && (
        <div className="text-[11px] font-mono text-[#64748B]">
          Area: <span className="text-[#0F172A] font-semibold">{feature.areaSqKm} sq km</span>
        </div>
      )}
      {feature.lengthKm && (
        <div className="text-[11px] font-mono text-[#64748B]">
          Length: <span className="text-[#0F172A] font-semibold">{feature.lengthKm} km</span>
        </div>
      )}
    </div>
  );
};
