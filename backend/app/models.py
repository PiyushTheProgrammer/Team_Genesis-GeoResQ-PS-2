from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union

class ImageryMetadata(BaseModel):
    id: str
    name: str
    acquisitionDate: str
    resolutionMetersPerPx: float
    crs: str
    dimensionsPx: str
    fileSizeMB: float
    bbox: List[float]
    center: List[float]
    thumbnailUrl: str
    fullImageUrl: Optional[str] = None
    sensorInfo: Optional[str] = "DJI Matrice 300 RTK + Zenmuse P1"

class SeverityDistribution(BaseModel):
    high: int = 0
    medium: int = 0
    low: int = 0
    unclassified: int = 0
    total: int = 0

class Project(BaseModel):
    id: str
    name: str
    location: str
    description: str
    createdAt: str
    status: str
    imagery: ImageryMetadata
    featuresCount: int = 0
    totalAffectedAreaSqKm: float = 0.0
    severityDistribution: SeverityDistribution = Field(default_factory=SeverityDistribution)
    modelUsed: str = "GeoResQ-Gemini-Vision-v2.5"

class DetectionFeature(BaseModel):
    id: str
    category: str  # flooded_area | damaged_building | road_affected | vehicle | other_asset
    name: str
    confidence: float
    severity: str  # high | medium | low | unclassified
    geometryType: str  # Polygon | LineString | Point
    coordinates: List[Any]
    areaSqKm: Optional[float] = None
    lengthKm: Optional[float] = None
    projectId: str
    projectName: str
    detectedAt: str
    notes: Optional[str] = None
    attributes: Optional[Dict[str, Any]] = None

class AnalysisJob(BaseModel):
    id: str
    projectId: str
    projectName: str
    status: str  # queued | processing | completed | failed
    progressPercent: int
    submittedAt: str
    completedAt: Optional[str] = None
    modelName: str = "GeoResQ-Gemini-Vision-v2.5"
    confidenceThreshold: float = 0.75
    detectedFeaturesCount: Optional[int] = 0

class CreateProjectRequest(BaseModel):
    name: str
    location: Optional[str] = "Nashik, Maharashtra"
    description: Optional[str] = "Rapid drone survey analysis"

class SubmitAnalysisRequest(BaseModel):
    projectId: str
    modelName: Optional[str] = "GeoResQ-Gemini-Vision-v2.5"
    confidenceThreshold: Optional[float] = 0.75

class LayerConfiguration(BaseModel):
    id: str
    name: str
    category: str
    visible: bool
    color: str
    opacity: float
    strokeWidth: int
