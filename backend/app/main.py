import os
import time
import random
import hashlib
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Query, BackgroundTasks
from starlette.background import BackgroundTask
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from dotenv import load_dotenv

from backend.app.models import (
    Project,
    DetectionFeature,
    AnalysisJob,
    LayerConfiguration,
    CreateProjectRequest,
    SubmitAnalysisRequest,
    SeverityDistribution,
    ImageryMetadata,
)
from backend.app.gemini_analyzer import analyze_image_with_gemini

load_dotenv()

app = FastAPI(
    title="GeoResQ Disaster AI Backend Server",
    description="Real-Time Geospatial Drone Vision Analysis powered by Google Gemini 3.8 Flash",
    version="2.5.0",
)

# Enable CORS for Vite frontend (http://localhost:5173 / 5174 / 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory State Store for Live Projects & Telemetry
PROJECTS_DB: Dict[str, Project] = {}
FEATURES_DB: Dict[str, List[DetectionFeature]] = {}
JOBS_DB: Dict[str, AnalysisJob] = {}

# Initialize default active survey project
DEFAULT_PROJECT_ID = "proj-nashik-2026-001"

def init_default_project():
    if DEFAULT_PROJECT_ID not in PROJECTS_DB:
        default_proj = Project(
            id=DEFAULT_PROJECT_ID,
            name="Nashik Godavari Basin Surge Analysis",
            location="Nashik, Maharashtra",
            description="High-resolution drone survey following heavy monsoon discharge along the Godavari river floodplain.",
            createdAt="2026-10-02T08:30:00Z",
            status="completed",
            imagery=ImageryMetadata(
                id="img-nsh-01",
                name="Godavari_Basin_Orthomosaic_HD.tif",
                acquisitionDate="2026-10-01 14:15 UTC",
                resolutionMetersPerPx=0.045,
                crs="EPSG:4326 (WGS84)",
                dimensionsPx="14200 x 9800 px",
                fileSizeMB=842.5,
                bbox=[19.995, 73.770, 20.025, 73.810],
                center=[20.0059, 73.7898],
                thumbnailUrl="https://images.unsplash.com/photo-1508873696983-2df5057d225b?auto=format&fit=crop&w=400&q=80",
                sensorInfo="DJI Matrice 300 RTK + Zenmuse P1"
            ),
            featuresCount=4,
            totalAffectedAreaSqKm=5.27,
            severityDistribution=SeverityDistribution(high=3, medium=1, low=0, unclassified=0, total=4),
            modelUsed="GeoResQ-Gemini-Vision-v3.8"
        )
        PROJECTS_DB[DEFAULT_PROJECT_ID] = default_proj

        # Perform Gemini spatial feature initialization
        raw_feats = analyze_image_with_gemini(
            image_bytes=None,
            project_id=DEFAULT_PROJECT_ID,
            project_name=default_proj.name,
            location=default_proj.location
        )
        FEATURES_DB[DEFAULT_PROJECT_ID] = [DetectionFeature(**f) for f in raw_feats]

init_default_project()

@app.get("/api/v1/health")
async def get_health():
    api_key_present = bool(os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY"))
    return {
        "status": "ok",
        "service": "GeoResQ Disaster AI Engine",
        "gemini_api_configured": api_key_present,
        "active_model": "Google Gemini 3.8 Flash Vision",
        "timestamp": time.time(),
    }

@app.get("/api/v1/projects", response_model=List[Project])
async def list_projects():
    return list(PROJECTS_DB.values())

@app.get("/api/v1/projects/{projectId}", response_model=Project)
async def get_project(projectId: str):
    if projectId not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    return PROJECTS_DB[projectId]

@app.post("/api/v1/projects", response_model=Project)
async def create_project(req: CreateProjectRequest):
    proj_id = f"proj-{req.name.lower().replace(' ', '-')[:12]}-{int(time.time())}"
    new_proj = Project(
        id=proj_id,
        name=req.name,
        location=req.location or "Nashik, Maharashtra",
        description=req.description or "Aerial survey analysis",
        createdAt=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        status="queued",
        imagery=ImageryMetadata(
            id=f"img-{int(time.time())}",
            name=f"{req.name.replace(' ', '_')}_Orthomosaic.tif",
            acquisitionDate=time.strftime("%Y-%m-%d %H:%M UTC", time.gmtime()),
            resolutionMetersPerPx=0.045,
            crs="EPSG:4326 (WGS84)",
            dimensionsPx="11800 x 8400 px",
            fileSizeMB=620.0,
            bbox=[19.995, 73.770, 20.025, 73.810],
            center=[20.0059, 73.7898],
            thumbnailUrl="https://images.unsplash.com/photo-1508873696983-2df5057d225b?auto=format&fit=crop&w=400&q=80",
        ),
        featuresCount=0,
        totalAffectedAreaSqKm=0.0,
        severityDistribution=SeverityDistribution(),
        modelUsed="GeoResQ-Gemini-Vision-v3.8"
    )
    PROJECTS_DB[proj_id] = new_proj
    FEATURES_DB[proj_id] = []
    return new_proj

@app.post("/api/v1/projects/{projectId}/imagery")
async def upload_imagery(projectId: str, imagery_file: UploadFile = File(...)):
    if projectId not in PROJECTS_DB:
        # Create dynamically if project missing
        PROJECTS_DB[projectId] = Project(
            id=projectId,
            name=f"Survey {projectId}",
            location="Nashik, Maharashtra",
            description="Uploaded drone imagery dataset",
            createdAt=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            status="queued",
            imagery=ImageryMetadata(
                id=f"img-up-{int(time.time())}",
                name=imagery_file.filename or "drone_survey.tif",
                acquisitionDate=time.strftime("%Y-%m-%d %H:%M UTC", time.gmtime()),
                resolutionMetersPerPx=0.045,
                crs="EPSG:4326 (WGS84)",
                dimensionsPx="12800 x 9600 px",
                fileSizeMB= round((imagery_file.size or 500000) / (1024*1024), 2),
                bbox=[19.995, 73.770, 20.025, 73.810],
                center=[20.0059, 73.7898],
                thumbnailUrl="https://images.unsplash.com/photo-1508873696983-2df5057d225b?auto=format&fit=crop&w=400&q=80",
            ),
            featuresCount=0,
            totalAffectedAreaSqKm=0.0,
            severityDistribution=SeverityDistribution(),
            modelUsed="GeoResQ-Gemini-Vision-v3.8"
        )

    proj = PROJECTS_DB[projectId]
    file_bytes = await imagery_file.read()

    # Call Gemini 3.8 Flash Vision to detect real-time disaster features from uploaded file
    raw_feats = analyze_image_with_gemini(
        image_bytes=file_bytes if len(file_bytes) > 0 else None,
        project_id=projectId,
        project_name=proj.name,
        location=proj.location
    )

    detected_features = [DetectionFeature(**f) for f in raw_feats]
    FEATURES_DB[projectId] = detected_features

    # Update project metrics dynamically
    flooded_sum = sum(f.areaSqKm or 0 for f in detected_features if f.category == "flooded_area")
    proj.totalAffectedAreaSqKm = round(flooded_sum, 2)
    proj.featuresCount = len(detected_features)
    proj.status = "completed"
    proj.severityDistribution = SeverityDistribution(
        high=sum(1 for f in detected_features if f.severity == "high"),
        medium=sum(1 for f in detected_features if f.severity == "medium"),
        low=sum(1 for f in detected_features if f.severity == "low"),
        unclassified=sum(1 for f in detected_features if f.severity == "unclassified"),
        total=len(detected_features)
    )

    return {
        "success": True,
        "imageId": proj.imagery.id,
        "filename": imagery_file.filename,
        "detectedFeaturesCount": len(detected_features),
        "totalFloodedAreaSqKm": proj.totalAffectedAreaSqKm,
    }

@app.post("/api/v1/analyses", response_model=AnalysisJob)
async def submit_analysis(req: SubmitAnalysisRequest):
    proj_id = req.projectId
    proj = PROJECTS_DB.get(proj_id)
    proj_name = proj.name if proj else f"Survey {proj_id}"

    job_id = f"job-{int(time.time())}"
    job = AnalysisJob(
        id=job_id,
        projectId=proj_id,
        projectName=proj_name,
        status="completed",
        progressPercent=100,
        submittedAt=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        completedAt=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        modelName=req.modelName or "GeoResQ-Gemini-Vision-v3.8",
        confidenceThreshold=req.confidenceThreshold or 0.75,
        detectedFeaturesCount=len(FEATURES_DB.get(proj_id, []))
    )
    JOBS_DB[job_id] = job
    return job

@app.get("/api/v1/analyses/{jobId}", response_model=AnalysisJob)
async def get_analysis_job(jobId: str):
    if jobId in JOBS_DB:
        return JOBS_DB[jobId]
    return AnalysisJob(
        id=jobId,
        projectId=DEFAULT_PROJECT_ID,
        projectName="Nashik Godavari Basin Surge Analysis",
        status="completed",
        progressPercent=100,
        submittedAt=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        completedAt=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        modelName="GeoResQ-Gemini-Vision-v3.8",
        confidenceThreshold=0.75,
        detectedFeaturesCount=len(FEATURES_DB.get(DEFAULT_PROJECT_ID, []))
    )

@app.get("/api/v1/analyses/{jobId}/features", response_model=List[DetectionFeature])
async def get_analysis_features(jobId: str):
    # Find project associated or default
    job = JOBS_DB.get(jobId)
    proj_id = job.projectId if job else DEFAULT_PROJECT_ID
    return FEATURES_DB.get(proj_id, FEATURES_DB.get(DEFAULT_PROJECT_ID, []))

@app.get("/api/v1/analyses/{jobId}/layers", response_model=List[LayerConfiguration])
async def get_analysis_layers(jobId: str):
    return [
        LayerConfiguration(id="layer-flood", name="Flooded Inundation Areas", category="flooded_area", visible=True, color="#0284C7", opacity=0.45, strokeWidth=2),
        LayerConfiguration(id="layer-building", name="Damaged Building Structures", category="damaged_building", visible=True, color="#EF4444", opacity=0.85, strokeWidth=2),
        LayerConfiguration(id="layer-road", name="Affected Transit Corridors", category="road_affected", visible=True, color="#D97706", opacity=0.85, strokeWidth=3),
        LayerConfiguration(id="layer-vehicle", name="Stranded Transport Assets", category="vehicle", visible=True, color="#10B981", opacity=0.90, strokeWidth=2),
        LayerConfiguration(id="layer-other", name="Other Critical Infrastructure", category="other_asset", visible=True, color="#64748B", opacity=0.70, strokeWidth=2),
    ]

@app.get("/api/v1/analyses/{jobId}/export")
async def export_data(jobId: str, format: str = Query("geojson")):
    filename = f"GeoResQ_Analysis_{jobId}_Export.{ 'pdf' if format == 'pdf_summary' else format }"
    return {
        "downloadUrl": f"/api/v1/analyses/{jobId}/download?format={format}",
        "filename": filename
    }
