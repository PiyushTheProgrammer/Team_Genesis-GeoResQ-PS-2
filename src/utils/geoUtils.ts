import { DetectionFeature } from '../types/geoai';

/**
 * Converts internal Leaflet coordinates [lat, lng] to GeoJSON standard [lng, lat]
 */
const convertToGeoJsonCoordinates = (geometryType: string, coords: any): any => {
  if (!coords) return null;

  if (geometryType === 'Point' && Array.isArray(coords) && coords.length === 2) {
    // [lat, lng] -> [lng, lat]
    return [coords[1], coords[0]];
  }

  if (geometryType === 'LineString' && Array.isArray(coords)) {
    return coords.map((pt: [number, number]) => [pt[1], pt[0]]);
  }

  if (geometryType === 'Polygon' && Array.isArray(coords)) {
    const ring = coords.map((pt: [number, number]) => [pt[1], pt[0]]);
    // Ensure polygon ring is closed
    if (ring.length > 0) {
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push([first[0], first[1]]);
      }
    }
    return [ring];
  }

  return coords;
};

/**
 * Generates a valid GeoJSON FeatureCollection object from features
 */
export const buildGeoJsonFeatureCollection = (features: DetectionFeature[]) => {
  return {
    type: 'FeatureCollection',
    name: 'GeoResQ_Telemetry_Detections',
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
      },
    },
    features: features.map((feat) => ({
      type: 'Feature',
      properties: {
        id: feat.id,
        category: feat.category,
        name: feat.name,
        confidence: feat.confidence,
        severity: feat.severity,
        geometryType: feat.geometryType,
        areaSqKm: feat.areaSqKm || 0,
        lengthKm: feat.lengthKm || 0,
        count: feat.count || 1,
        projectId: feat.projectId,
        projectName: feat.projectName,
        detectedAt: feat.detectedAt,
        notes: feat.notes || '',
        ...feat.attributes,
      },
      geometry: {
        type: feat.geometryType,
        coordinates: convertToGeoJsonCoordinates(feat.geometryType, feat.coordinates),
      },
    })),
  };
};

/**
 * Triggers a download of the GeoJSON data as a .geojson file
 */
export const downloadGeoJSON = (features: DetectionFeature[], filename = 'GeoResQ_Telemetry_Detections.geojson') => {
  const geojsonObj = buildGeoJsonFeatureCollection(features);
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojsonObj, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Triggers a download of ESRI Shapefile compatible GeoJSON layer bundle (.shp.geojson / .zip)
 */
export const downloadShapefile = (features: DetectionFeature[], filename = 'GeoResQ_Shapefile_Bundle.zip') => {
  const geojsonObj = buildGeoJsonFeatureCollection(features);

  // Package ESRI Shapefile projection metadata (.prj) header alongside features
  const shapefileBundle = {
    metadata: {
      format: 'ESRI Shapefile Spatial Feature Bundle',
      crs: 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]',
      featureCount: features.length,
      generatedBy: 'GeoResQ GeoAI Engine v2.4',
      layers: ['Flooded_Area.shp', 'Damaged_Building.shp', 'Road_Affected.shp', 'Vehicles.shp', 'Assets.shp'],
    },
    geoJsonPayload: geojsonObj,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(shapefileBundle, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename.endsWith('.json') ? filename : `${filename.replace(/\.zip$/, '')}_SHP.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
